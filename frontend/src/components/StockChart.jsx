import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ chartData, ticker }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: `${ticker} Close Price`,
        data: chartData.prices,
        borderColor: '#fde047', // A yellow color from daisyUI theme
        backgroundColor: 'rgba(253, 224, 71, 0.2)',
        fill: false,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: '50-Day Moving Average',
        data: chartData.sma,
        borderColor: '#60a5fa', // A blue color
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        fill: false,
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { //legend
        position: 'top',
        labels: {
            color: '#a6adbb'
        }
      },
      title: { //title
        display: true,
        text: `${ticker} Price History (1 Year)`,
        color: '#a6adbb'
      },
    },
    scales: {
        x: {
            ticks: { color: '#a6adbb' }
        },
        y: {
            ticks: { color: '#a6adbb' }
        }
    }
  };

  return <Line options={options} data={data} />;
};

export default StockChart;

