import React from "react";
import {
    Chart as ChartJS,
    TimeScale, //time scale
    LinearScale, // y-axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  import { Line } from "react-chartjs-2";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const Chart = ({ chartData }) => {

    const options = {
        plugins:{
            legend: {
                display: true,
                position: 'bottom'
            }
        },
        scales: {
            x: {
            type: 'time',
            time: {
                unit: 'day'
            }
            }
        }
    };

    if (!chartData) return null;
    return <Line data={chartData} options={options} id="chart-key"/>;
};

export default Chart;
