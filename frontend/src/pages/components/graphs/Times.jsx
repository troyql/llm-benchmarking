import { useMemo} from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

/*
results.unit_tests.runs should be passed in:
runs: [{
  test_id: int,
  start: float,
  end: float,
  status: Literal["passed", "failed", "error"]
}...]
*/
function Times({ runs = [] }) {
  const options = {
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        title: {
          text: "Test no.",
          display: true,
        },
        type: 'linear',
        position: 'bottom',
        ticks: {
          precision: 0,
          stepSize: 1,
        },
      },
      y: {
        title: {
          text: "Time (s)",
          display: true,
        },
        beginAtZero: true,
      },
    },
  };

  const data = useMemo(() => ({
    datasets: runs.map((r, i) => ({
        label: `Test ${i}`,
        data: [
          {x: i, y: r.start},
          {x: i, y: r.end},
        ],
        // point styling
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 3,

        // line styling 
        showLine: true,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
    })),
  }), [runs]);

  return <Scatter options={options} data={data} />;
}

export default Times;