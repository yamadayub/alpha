import React from "react";
import {
    Chart as ChartJS,
    LinearScale,
    LineElement,
    CategoryScale,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import { Line } from "react-chartjs-2";

ChartJS.register(
    LinearScale,
    LineElement,
    CategoryScale,
    Title,
    Tooltip,
    Legend
  );

const SimpleChart = ({ chartData, uniqueKey }) => {
    const options = {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        },
        elements: {
            point:{
                radius: 0
            }
        }
    };

    if (!chartData) return null;
    return <Line data={chartData} options={options} id={`chart-key-${uniqueKey}`}/>;
};

export default SimpleChart;
