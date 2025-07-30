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
        backgroundColor: ['#40ffbf', '#ff4757'],
        borderColor: ['#29eaa5', '#ff3742'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            family: 'Inter',
            size: 14,
            weight: '500'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(22, 27, 38, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#b5b5b5',
        borderColor: '#40ffbf',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter',
          size: 13
        }
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <h3 style={{ 
        color: '#ffffff', 
        fontSize: '20px', 
        fontWeight: '600',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Income vs Expense
      </h3>
      <Pie data={data} options={options} />
    </div>
  );
}

export default ChartComponent;