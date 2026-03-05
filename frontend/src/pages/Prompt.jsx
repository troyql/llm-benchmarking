import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

import Title from "./components/text/Title";
import PromptBar from "./components/PromptBar";
  

function Prompt() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateTests = async () => {
    // checking that the prompt isn't empty
    if (prompt === "") {
      setPromptError(true);
      return;
    }

    // setting the load bar
    setLoading(true);

    // formatting everything into a formData object because we're dealing with files
    const formData = new FormData();
    formData.append('prompt', prompt);

    Array.from(files).forEach((file) => {
      formData.append('files', file)
    })
    console.log(formData);

    // sending it to the backend
    try {
      const response = await fetch('/api/tests/generate', {
        method: 'POST',
        body: formData,
      }); 

      if (!response.ok)
        throw new Error(response.status);
      navigate('/tests');
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-100">
      <Title>LLM Benchmarking</Title>
      <PromptBar 
        onChange={(e) => setPrompt(e.target.value)} 
        onUpload={(e) => setFiles(e.target.files)} 
        onSubmit={generateTests} 
        error={promptError}
        setError={setPromptError}
        loading={loading}
      />
    </div>
  )
}

export default Prompt;