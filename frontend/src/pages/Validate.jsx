import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Title from "./components/text/Title";
import Heading from "./components/text/Heading";
import Bold from "./components/text/Bold";
import Description from "./components/text/Description";
import Card from "./components/Card";
import TextArea from './components/inputs/TextArea';
import Button from './components/inputs/Button';
import Dropdown from './components/inputs/Dropdown';
import Upload from './components/inputs/UploadFile';

function Validate() {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [testNo, setTestNo] = useState(0);
  const [textareaError, setTextareaError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('/api/tests'); 

        if (!response.ok)
          throw new Error(`Server error: ${response.status}`)

        const testData = await response.json();
        setData(testData);
        console.log(testData);
      } catch (error) {
        console.error(error.message);
      }
    }
    getData();
  }, []);

  const sourceOptions = ["", "llm-output", "upload", "text"];
  const displayedSourceOptions = ["", "LLM Output", "Upload File", "Text"];
  const updateSource = (e) => {
    // if llm-output, set that as the exemplar content
    if (e.target.value == sourceOptions[1]) {
      updateContent(data.tests[testNo].content)
    }

    // actually updating source
    setData(prev => ({
      ...prev,
      tests: prev.tests.map((t, idx) =>
        idx === testNo
          ? {
              ...t,
              exemplar: {
                ...t.exemplar,
                source: e.target.value,
              },
            }
          : t
      ),
    }));
  }

  const updateContent = (content) => {
    setData(prev => ({
      ...prev,
      tests: prev.tests.map((t, idx) =>
        idx === testNo
          ? {
              ...t,
              exemplar: {
                ...t.exemplar,
                content: content,
              },
            }
          : t
      ),
    }));
  }

  const validationMethods = ["llm-as-a-judge", 'cosine']
  const displayedValidationMethods = ["LLM-as-a-judge", "Cosine similarity"];
  const updateValidation = (e) => {
    setData(prev => ({
      ...prev,
      tests: prev.tests.map((t, idx) =>
        idx === testNo
          ? {
              ...t,
              validation_method: e.target.value,
            }
          : t
      ),
    }));
  }

  const onProceed = async () => {
    // checking if all the exemplar responses have been filled out 
    for (let i = 0; i < data.tests.length; i++) {
      if (data.tests[i].exemplar.source === "") {
        console.log(`the exemplar response for source ${i} hasn't been filled out`);
        setTestNo(i);
        return;
      } else if (data.tests[i].exemplar.source == sourceOptions[2] && data.tests[i].exemplar.content == "") {
        console.log(`please upload a file`);
        setTestNo(i);
        return;
      } else if (data.tests[i].exemplar.source == sourceOptions[3] && data.tests[i].exemplar.content == "") {
        console.log(`please provide an exemplar response`);
        setTestNo(i);
        return;
      }
    }

    try {
      let response = await fetch('/api/tests/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tests: data.tests })
      }); 

      if (!response.ok)
        throw new Error(response.status);

      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
    
  }

  const prevTest = () => {
    setTestNo(testNo - 1);
  }

  const nextTest = () => {
    setTestNo(testNo + 1);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100 px-8">
      <div className="flex flex-col items-center w-4/5 h-17/20">
        <div className="flex flex-col items-center shrink-0 mb-8">
          <Title>Validate</Title>
          <div>All your tests have compiled! Now, provide each test with an examplar response, and specify the validation method.</div>
        </div>
        <Card className="flex flex-col flex-1 justify-between w-full min-h-0">
            <div className="shrink-0 pb-4">
              navigation bar
              <div className="h-0.25 bg-gray-300 shadow-standard"/>
            </div>
            <div className="flex flex-1 items-stretch min-h-0">
              {data?.tests?.length > 0 && 
                <>
                  <div className="w-2/5 p-4">
                    <Heading>
                      {data.tests[testNo].name}
                    </Heading>
                    <Card className="mt-2">
                      {data.tests[testNo].input}
                    </Card>
                  </div>
                  <div className="w-0.25 h-full bg-gray-300" />
                  <div className="flex-1 w-3/5 h-full p-4">
                    <div className="flex flex-col h-2/5 py-2">
                      <div className="flex flex-col flex-1">
                        <Bold>LLM Output</Bold> 
                        <Card className="flex-1 my-2">
                          {data.tests?.[testNo].output} 
                        </Card>
                      </div>
                    </div>
                    <div>
                      <Bold>Exemplar Response</Bold>
                      <div className="flex justify-between items-center">
                        <Description>Specify the source of your exemplar response: </Description>
                        <Dropdown 
                          options={sourceOptions} 
                          displayedOptions={displayedSourceOptions}
                          value={data?.tests?.[testNo].exemplar.source} 
                          update={updateSource}
                        />
                      </div>
                      <div className="flex justify-end my-1">
                        {data?.tests?.[testNo].exemplar.source == sourceOptions[0] ? 
                          <></>
                          : data?.tests?.[testNo].exemplar.source == sourceOptions[1] ?
                          <Description>Using LLM Output as exemplar response</Description>
                          : data?.tests?.[testNo].exemplar.source == sourceOptions[2] ? 
                          <div className="w-24 h-8">
                            <Upload>Upload</Upload>
                          </div>
                          : 
                          <TextArea 
                            placeholder={"Enter correct answer here"}
                            onChange={e => updateContent(e.target.value)}
                            error={textareaError}
                            setError={setTextareaError}
                            value={data?.tests?.[testNo].exemplar.content}
                          />
                        }
                      </div>
                    </div>
                    <div>
                      <Bold>Validation Method</Bold>
                      <div className="flex justify-between items-center">
                        <Description>Select your response validation method here:</Description>
                        <Dropdown 
                          options={validationMethods} 
                          displayedOptions={displayedValidationMethods}
                          value={data?.tests?.[testNo].validation_method} 
                          update={updateValidation}
                        />
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
        </Card>
        <div className="w-full pt-2">
          <div className="flex justify-between items-center">
            <div>
              {testNo !== 0 &&
                <div className="cursor-pointer" onClick={prevTest}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                  </svg>
                </div>
              }
            </div>
            <div>
              {testNo == data?.tests?.length - 1 ? 
                <div className="w-24 h-8">
                  <Button onClick={onProceed}>Proceed</Button>
                </div>
                :
                <div className="cursor-pointer" onClick={nextTest}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Validate;