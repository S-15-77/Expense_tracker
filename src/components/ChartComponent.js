// src/components/ChartComponent.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartComponent({ income, expense }) {
  const data = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount',
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#388e3c', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <h3>Income vs Expense</h3>
      <Pie data={data} />
    </div>
  );
}

export default ChartComponent;