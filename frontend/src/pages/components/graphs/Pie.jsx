import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

/*
results: {
  passed: int,
  failed: int,
}
*/
function Pie({ results }) {
  const data = useMemo(() => ({
    labels: ["Passed", "Failed"],
    datasets: [{
      label: "# of tests",
      data: [results?.passed ?? 0, results?.failed ?? 0],
      backgroundColor: [
        "rgba(75, 192, 192, 0.2)",
        "rgba(255, 99, 132, 0.2)",
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(255, 99, 132, 1)",
      ],
      borderWidth: 1,
    }],
  }), [results?.passed, results?.failed]);

  return <Doughnut data={data} />;
}

export default Pie;