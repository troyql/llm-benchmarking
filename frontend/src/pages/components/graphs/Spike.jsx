import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



/*
results: array of accuracy, time, and similarity values:
[
  {
    load: int,
    accuracy: int,
    gen_time: int, // time it takes to answer a query (end - start) 
    similarity: int,
  },
  ...
]

load is the number of virtual users at that point in time  
accuracy, time, and similarity are represented as percentages. Input a value from 0-100
*/
function Spike({ results = [] }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Spike Test',
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          text: "Time (s)",
          display: true,
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
        title: {
          text: "Percentage (%)",
          display: true,
        }
      },
      y1: {
        min: 0,
        position: 'right',
        title: {
          text: "Generation Time (s)",
          display: true,
        }
      },
    }
  };

  const data = useMemo(() => ({
    datasets: [
      {
        label: 'Accuracy',
        data: results.map(t => ({
          x: t.load, 
          y: t.accuracy, 
        })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Time',
        yAxisID: 'y1',
        data: results.map(t => ({
          x: t.load, 
          y: t.gen_time, 
        })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Similarity',
        data: results.map(t => ({
          x: t.load, 
          y: t.similarity, 
        })),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3,
      },
    ],
  }), [results]);

  return <Line options={options} data={data} />;
}

export default Spike;