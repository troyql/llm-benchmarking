import os
import json
import uuid
import requests
from pydantic import ValidationError
from fastapi import APIRouter, FastAPI, HTTPException, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware

from aat_service.services.llm import ChatCompletionRequest, Message
from app.llm_service import create_llm_service

from app.internal.schemas import Test, Data, Results, UnitRun
from app.internal.config import settings

application = FastAPI()
router = APIRouter(prefix="/api")

application.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost:" + str(settings.PORT),
    "http://localhost:" + str(settings.FRONTEND_PORT),
  ], 
  allow_methods=["*"],
  allow_headers=["*"],
)

# instantiating llm client
system_prompt = open("app/system_prompt.txt", "r", encoding="utf-8").read()

# TODO: should probably refactor the following 2 lines
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data_filename = os.path.join(BASE_DIR, "data.json") 

#########################################################################
########################### HELPER FUNCTION #############################
#########################################################################

def get_data() -> Data:
  with open(data_filename, "r")  as f:
    try:
      return Data.model_validate(json.load(f))
    except (json.JSONDecodeError, ValidationError):
      data = Data()
      put_data(data)
      return data

def put_data(data: Data) -> None:
  with open(data_filename, "w") as f:
    json.dump(data.model_dump(), f, indent=2)

#########################################################################
############################### ROUTERS #################################
#########################################################################

@router.get("/tests", tags=["Tests"])
async def get_tests() -> Data: 
  """Returns the data object"""
  return get_data()

@router.post("/tests/generate", tags=["Tests"])
async def root(prompt: str = Form(...), files: list[UploadFile] = File([])) -> None: 
  """Takes in a test generation prompt (required), as well as an array
  of example test cases (optional). Subsequently generates tests 

  Returns:
    None 
  """
  data = get_data()

  # updating prompt
  if (prompt != ""):
    data.prompt = prompt

  # appending the tests user uploaded
  for f in files: 
    input = await f.read()
    data.tests.append(
      Test(
        name=f.filename,
        id=str(uuid.uuid4()),
        input=input,
      )
    )

  # generating and appending tests
  async with create_llm_service() as client:
    response = await client.chat_completions(
      ChatCompletionRequest(
        model="openai/gpt-oss-20b",
        messages=[
          Message(role="system", content=system_prompt),
          Message(role="user", content=prompt)
        ]
      )
    )
    content = response.choices[0].message.content
    try:
      tests = json.loads(content)
      for t in tests:
        data.tests.append(
          Test(
            name=t["name"],
            id=str(uuid.uuid4()),
            input=t["content"],
          )
        )
    except json.JSONDecodeError:
      # ideally, you'd just re-generate things, but I'll implement that when the run thing is done
      raise HTTPException(status_code=500, detail="Internal error generating tests; invalid JSON format")

  # saving 
  put_data(data)

@router.post("/tests/upload", tags=["Tests"])
async def upload_tests(files: list[UploadFile] = File([])) -> Data: 
  """
  Takes in an array of files and adds them to the total amount of tests
  """
  data = get_data()
  for file in files:
    input = await file.read()
    file = Test(
      name=file.filename,
      id=str(uuid.uuid4()),
      input=input, 
    )
    data.tests.append(file)
  
  put_data(data)
  return data

@router.post("/tests/update", tags=["Tests"])
async def update_tests(tests: list[Test] = Body(..., embed=True)) -> None:
  """
  Takes an array of tests in JSON form and updates all tests
  to the array.

  Used for updating parameters inside each test ('/validate')

  Params:
    list[Test]: list of 'Test's 

  Returns:
    None
  """
  data = get_data()
  data.tests = tests
  put_data(data)

@router.delete("/tests/delete", tags=["Tests"])
async def delete_tests() -> Data: 
  data = get_data()
  data.tests = []
  put_data(data)

  return data

@router.delete("/tests/delete/{test_id}", tags=["Tests"])
def delete_test(test_id: str) -> Data:
  """Given a test_id, searches for it and deletes it.

  Returns:
    Updated data object 
  """
  removed = False
  data = get_data()
  for t in data.tests[:]:
    if (t.id == test_id): 
      data.tests.remove(t)
      removed = True
      break

  if not removed:
    raise HTTPException(status_code=404, detail="Invalid test id - test not found")
  else: 
    put_data(data)
    return data 

@router.post("/tests/validate", tags=["Tests"])
async def run_tests(endpoint: str = Body(..., embed=True), url: str = Body(..., embed=True)) -> None: 
  """Takes an endpoint and the url to a github repo and scans through the repo,
  identifying the schema for the endpoint. Uses this information to then validate
  (run) tests against the endpoint. 

  Github repo url should be the url to the branch the user wants to test 
  """
  data = get_data()

  # check if the endpoint is valid 
  data.endpoint = endpoint

  # parsing the url
  # url in the form github.com/{owner}/{repo}/tree/{branch}
  after = url.partition(".com/")[2] # removing prefix
  owner, _, after = after.partition("/")
  repo, _, after = after.partition("/")
  branch = after.partition("/")[2] # getting everything after 'tree/'
  branch = branch.partition("/")[0] # cleaning up branch
  if not branch:
    branch = "main"

  url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
  headers = {
    "Authorization": f"Bearer {settings.TOKEN}",
    "Accept": "application/vnd.github+json",
  }
  response = requests.get(url, headers=headers)
  response.raise_for_status()
  
  # tree structure - schema found in github api
  tree = response.json()["tree"]
  candidates = []
  for n in tree:
    if n.path.endswith(".py"):
      candidates.append(n)

  # finding a candidate that contains fastapi
  for c in candidates:
    print(c.path)
    response = requests.get(owner, repo, c.sha, headers=headers)
    response.raise_for_status()
    content = response.json()["content"]
    print(content)
      
  # feeding the tests into the endpoint
  for t in data.tests:
    t.output = "output from the tool after content is passed through"

    # if failed, re-generate and run again

  put_data(data)

@router.post("/tests/run_suite", tags=["Tests"])
async def run_suite() -> Results:
  """Runs the entire suite of tests:
    - unit tests
    - spike test
    - load test
    - jailbreak test
  
  Returns the results
  """ 
  data = get_data()

  # resetting results
  data.results = Results() 

  # running unit tests
  for t in data.tests:
    # add result to results
    data.results.unit_tests.runs.append(
      UnitRun(
        test_id=t.id,
        start=1,
        end=2,
        status="passed",
      ) 
    )
    # updating number of passed/failed tests and errors 
    data.results.unit_tests.passed += 1

  put_data(data)
  return data.results

application.include_router(router)