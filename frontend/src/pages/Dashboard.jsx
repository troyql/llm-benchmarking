import { useState, useEffect } from 'react';

import Card from "./components/Card";
import Button from './components/inputs/Button';
import Heading from "./components/text/Heading";
import Bold from "./components/text/Bold";

import Pie from "./components/graphs/Pie";
import Times from './components/graphs/Times';
import Load from './components/graphs/Load';
import Spike from './components/graphs/Spike';


function Dashboard() {
  const [results, setResults] = useState({});

    useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('/api/tests'); 

        if (!response.ok)
          throw new Error(`Server error: ${response.status}`)

        const testData = await response.json();
        setResults(testData.results);
        console.log(testData.results);
      } catch (error) {
        console.error(error.message);
      }
    }
    getData();
  }, []); 
 

  const runSuite = async () => {
    console.log(results);
    try {
      const response = await fetch('/api/tests/run_suite', {
        method: 'POST',
      }); 

      if (!response.ok)
        throw new Error(response.status);

      const testResults = await response.json();
      setResults(testResults);
      console.log(results);
      console.log(results.unit_tests.runs);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center w-full h-screen bg-gray-100">
        <div className="flex-1 min-h-0 w-4/5 my-10 grid gap-4 grid-cols-3 grid-rows-3">
          <Card id="benchmarks" className="col-span-3 row-span-3" title="Benchmarks">
            <div className="h-8">
              <Button onClick={runSuite}>Run test suite</Button>
            </div>
            <div className="w-full mt-4 grid gap-2 grid-cols-2 grid-rows-2">
              <Card className="" title="Accuracy">
                <Pie results={results?.unit_tests}/>
              </Card>
              <Card className="col-span-2" title="Capacity">
                <Times runs={results?.unit_tests?.runs} />
              </Card>
              <Card>
                <Heading>Statistics</Heading>
                <div className="flex">
                  <Bold>Average:&nbsp;</Bold>
                  <div>{results?.unit_tests?.stats.average}</div>
                </div>
                <div className="flex">
                  <Bold>Median:&nbsp;</Bold>
                  <div>{results?.unit_tests?.stats.median}</div>
                </div>
                <div className="flex">
                  <Bold>Slowest:&nbsp;</Bold>
                  <div>{results?.unit_tests?.stats.slowest}</div>
                </div>
              </Card>
              <Card className="col-span-2">
                <Spike results ={[
                  {load: 1, accuracy: 97, gen_time: 24, similarity: 95},
                  {load: 27, accuracy: 12, gen_time: 24, similarity: 95},
                  {load: 37, accuracy: 12, gen_time: 24, similarity: 95},
                  {load: 47, accuracy: 12, gen_time: 24, similarity: 95},
                  {load: 57, accuracy: 12, gen_time: 24, similarity: 95},
                  {load: 12, accuracy: 12, gen_time: 24, similarity: 95}
                ]}/>
              </Card>
              <Card>
                compliance results
              </Card>
            </div>
          </Card> 
        </div>
      </div>
      <div className="flex flex-col items-center w-full h-screen bg-gray-100">
        <Card className="col-span-2">
          <Load results ={[
            {load: 1, accuracy: 97, gen_time: 24, similarity: 95},
            {load: 27, accuracy: 12, gen_time: 24, similarity: 95},
            {load: 37, accuracy: 12, gen_time: 24, similarity: 95},
            {load: 47, accuracy: 12, gen_time: 24, similarity: 95},
            {load: 57, accuracy: 12, gen_time: 24, similarity: 95},
            {load: 67, accuracy: 12, gen_time: 24, similarity: 95}
          ]}/>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard;