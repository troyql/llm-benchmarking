import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Title from './components/text/Title';
import Card from './components/Card';
import List from './components/List';
import TextInput from './components/inputs/TextInput';
import Button from './components/inputs/Button';
import UploadFiles from './components/inputs/UploadFiles';

/* 
Displays the generated tests for the user 
*/
function Tests() {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [url, setUrl] = useState("");

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
  }, []); // TODO: update dependency array
  
  const addTests = async (e) => {
    try {
      const files = e.target.files; 
      if (!files || files.length === 0) return;

      // making a new FormData
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append("files", file);
      }

      // the actual request
      const response = await fetch('/api/tests/upload', {
        method: 'POST',
        body: formData,
      }); 

      if (!response.ok)
        throw new Error(response.status);

      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  // deleting all tests
  const deleteTests = async () => {
    try {
      const response = await fetch('/api/tests/delete', {
        method: 'DELETE',
      }) 

      if (!response.ok)
        throw new Error(response.status);

      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  
  const compileRun = async () => {
    // making sure that there's more than one test
    const tests = data?.tests;
    if (!Array.isArray(tests) || tests.length === 0) {
      setError(true);
      return
    }

    try {
      const response = await fetch('/api/tests/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          endpoint: endpoint,
          url: url
         })
      }); 

      console.log("tests validated")
      navigate('/validate');
    } catch (error) {
      console.log(error);
    }
  }

  const enterCompileRun = (e) => {
    if (e.key === 'Enter') {
      compileRun();
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100 px-8">
      <div>
        <Title>Tests</Title>
        <div>View and edit the list of generated tests here. Once you're happy, enter the endpoint and click 'Compile & Run' to compile and run the tests against your endpoint</div>
      </div>
      <Card className="flex flex-col w-240 h-9/10">
        <List data={data} setData={setData} />
        <div className="flex justify-between items-center shrink-0 h-8">
          <div>
            <UploadFiles onChange={addTests}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover: cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </UploadFiles>
          </div>
          <div className="flex">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div className="hover:text-fail duration-100 ease-out hover:cursor-pointer" onClick={deleteTests}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:[stroke-width:2]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
          </div>
        </div>
        <div className="shrink-0 h-8 my-2 flex justify-between -center gap-x-2">
          <TextInput 
            placeholder="Enter endpoint" 
            error={error}
            setError={setError}
            onKeyDown={enterCompileRun} 
            onChange={(e) => setEndpoint(e.target.value)} 
          />
          <TextInput 
            placeholder="Enter GitHub Repository" 
            error={error}
            setError={setError}
            onKeyDown={enterCompileRun} 
            onChange={(e) => setUrl(e.target.value)} 
          />
          <div className="w-40">
            <Button onClick={compileRun}>
              Compile & Run 
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Tests;