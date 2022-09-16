import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJs } from "chart.js/auto";

function LineChart(props) {
  let [chartData, setChartData] = useState({});

  let data = [];

  props.series.forEach((driver) => {
    let newData = {
      label: driver.name,
      data: driver.data,
      borderColor: driver.color,
    };
    data.push(newData);
  });

  setChartData({
    labels: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    ],
    datasets: data,
  });

  return (
    <div className="w-100">
      <Line data={chartData} />
    </div>
  );
}

export default LineChart;
