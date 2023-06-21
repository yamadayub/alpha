import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  import { Doughnut } from "react-chartjs-2";
  import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
  );

const DoughnutChart = ({ chartData }) => {

    const options = {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: true,
          },
          datalabels: {
            formatter: ((context, args) => {
              const index = args.dataIndex;
              return args.chart.data.labels[index]
            }),
            color: chart => {
              return chart.dataset.borderColor[chart.dataIndex]
            }
          }
        }
    };

    if (!chartData) return null;
    return <Doughnut data={chartData} options={options} plugins={[ChartDataLabels]} id="chart-key"/>;
};

export default DoughnutChart;
