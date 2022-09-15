import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJs } from "chart.js/auto";

let raceData3 = {
  verstappen: {
    race: 1,
    points: 50,
  },
};

let raceData = [
  {
    name: "Leclerc",
    race: 1,
    points: 50,
    points2: 40,
  },
  {
    name: "Leclerc",
    race: 2,
    points: 25,
    points2: 50,
  },
  {
    name: "Leclerc",
    race: 3,
    points: 0,
    points2: 25,
  },
  {
    name: "Leclerc",
    race: 4,
    points: 15,
    points2: 10,
  },
  {
    name: "Leclerc",
    race: 5,
    points: 9,
    points2: 50,
  },
  {
    name: "Leclerc",
    race: 6,
    points: 50,
    points2: 20,
  },
  {
    name: "Leclerc",
    race: 7,
    points: 50,
  },
];

function LineChart() {
  let [chartData, setChartData] = useState({
    labels: raceData.map((raceData) => raceData.race),
    datasets: [
      {
        label: "Leclerc",
        data: raceData.map((raceData) => raceData.points),
        backgroundColor: ["red"],
        borderColor: "red",
      },
      {
        label: "Verstappen",
        data: raceData.map((raceData) => raceData.points2),
        backgroundColor: "blue",
        borderColor: "blue",
      },
    ],
  });

  return (
    <div className="w-100">
      <Line data={chartData} />
    </div>
  );
}

export default LineChart;
