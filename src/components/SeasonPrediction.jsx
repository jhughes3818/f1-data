import React, { useState } from "react";
import axios from "axios";
import SideBar from "./sidebar";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import Table from "./Table";

function SeasonPrediction() {
  let [isLoading, setLoading] = useState(false);
  let [seasonPrediction, setSeasonPrediction] = useState();
  let [hasSeasonPrediction, setHasSeasonPrediction] = useState(false);
  let [hideButton, setHideButton] = useState(false);
  let [status, setStatus] = useState("");
  let [finishingPredictionByRace, setFinishingPredictionByRace] = useState();

  let [chartData, setChartData] = useState({
    series: finishingPredictionByRace,
    options: {
      chart: {
        height: 350,
        type: "line",
      },
    },
  });

  let seasonRaces = [];
  let seasonStandings = [];

  async function getRaces() {
    await axios
      .get("http://ergast.com/api/f1/current.json")
      .then((response) => {
        setLoading(true);

        let races = response.data.MRData.RaceTable.Races;

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDateString = `${year}-${month}-${day}`;
        let currentDate = Date.parse(currentDateString);

        let comparisonDate = currentDate;

        races.forEach((race) => {
          if (Date.parse(race.date) < comparisonDate) {
            seasonRaces.push(race.round);
            setStatus("Added Round " + race.round);
            console.log("Added Round " + race.round);
          }
        });
      });
    setStatus("Downloading Race Data");
    console.log("Finished Getting Races");
    console.log(seasonRaces);
    await getStandings();
    await getLeader();
    setLoading(false);
  }

  async function getStandings() {
    for (const race of seasonRaces) {
      let raceStandings = [];
      let url =
        "https://ergast.com/api/f1/2022/" + race + "/driverStandings.json";
      await axios.get(url).then((response) => {
        let standings =
          response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        standings.forEach((driver) => {
          let newData = {
            position: driver.position,
            points: driver.points,
            fName: driver.Driver.givenName,
            lName: driver.Driver.familyName,
          };
          raceStandings.push(newData);
        });
      });
      seasonStandings.push(raceStandings);
      console.log("Added Standings");
      setStatus("Adding Standings for Round " + race);
    }
  }

  function getLeader() {
    let driverSeasonPoints = [];
    let driverPointsGained = [];
    let drivers = [];

    seasonStandings.slice(-1)[0].forEach((driver) => {
      drivers.push(driver.lName);
    });

    drivers.forEach((driver) => {
      let driverPoints = [];
      let newRaceData = [];
      seasonStandings.forEach((race) => {
        race.forEach((entrant) => {
          if (entrant.lName === driver) {
            newRaceData.push(entrant.points);
          }
        });
      });
      driverPoints.push(newRaceData);
      let driverRaceData = {
        name: driver,
        points: driverPoints,
      };
      driverSeasonPoints.push(driverRaceData);
    });

    driverSeasonPoints.forEach((driver) => {
      let recentPoints = driver.points[0].slice(-6);
      let recentPointsGained = [];
      let total = 0;
      let count = 0;
      for (let i = 1; i < recentPoints.length; i++) {
        let pointsGained = recentPoints[i] - recentPoints[i - 1];
        recentPointsGained.push(pointsGained);
      }
      recentPointsGained.forEach((entry) => {
        total += entry;
        count++;
      });
      let averagePointsGained = total / count;
      let currentPoints = Number(driver.points[0].slice(-1)[0]);
      let driverAveragePointsGained = {
        name: driver.name,
        averagePointsGained: averagePointsGained,
        currentPoints: currentPoints,
        finishingPoints: currentPoints + averagePointsGained * 7,
      };
      driverPointsGained.push(driverAveragePointsGained);
    });

    console.log(driverPointsGained);

    let driverPointsSorted = driverPointsGained.sort((a, b) => {
      return b.finishingPoints - a.finishingPoints;
    });
    setSeasonPrediction((seasonPrediction = driverPointsSorted));

    console.log(seasonPrediction);
    let driverAveragePointsByRace = [];

    driverSeasonPoints.forEach((driver) => {
      let pointsGainedArray = [];
      let pointsAverage = [];
      let finishingPointsPrediction = [];
      for (let i = 1; i < driver.points[0].length; i++) {
        let count = 0;
        let total = 0;
        let pointsGained = driver.points[0][i] - driver.points[0][i - 1];
        pointsGainedArray.push(pointsGained);
        if (i < 6) {
          pointsGainedArray.forEach((entry) => {
            total += entry;
            count++;
          });
          pointsAverage.push(total / count);
          let racesRemaining = 22 - i;
          let prediction =
            Number(driver.points[0][i]) + (total / count) * racesRemaining;
          if (prediction > 0) {
            finishingPointsPrediction.push(Math.round(prediction));
          } else {
            finishingPointsPrediction.push(
              Math.round(Number(driver.points[0][i]))
            );
          }
        } else {
          pointsGainedArray.slice(-5).forEach((entry) => {
            total += entry;
            count++;
          });
          pointsAverage.push(total / count);
          let racesRemaining = 22 - i;
          let prediction =
            Number(driver.points[0][i]) + (total / count) * racesRemaining;
          if (prediction > 0) {
            finishingPointsPrediction.push(Math.floor(prediction));
          } else {
            finishingPointsPrediction.push(Number(driver.points[0][i]));
          }
        }
      }
      let color = "";
      if (driver.name === "Leclerc" || driver.name === "Sainz") {
        color = "#DC0000";
      } else if (driver.name === "Pérez" || driver.name === "Verstappen") {
        color = "#0600EF";
      } else if (driver.name === "Russell" || driver.name === "Hamilton") {
        color = "#00D2BE";
      } else if (driver.name === "Norris" || driver.name === "Ricciardo") {
        color = "#FF8700";
      } else if (driver.name === "Ocon" || driver.name === "Alonso") {
        color = "#0090FF";
      } else if (driver.name === "Bottas" || driver.name === "Zhou") {
        color = "#900000";
      } else if (driver.name === "Gasly" || driver.name === "Tsunoda") {
        color = "#2B4562";
      } else if (driver.name === "Magnussen" || driver.name === "Schumacher") {
        color = "#FFFFFF";
      } else if (driver.name === "Vettel" || driver.name === "Stroll") {
        color = "#006F62";
      } else if (driver.name === "Albon" || driver.name === "Latifi") {
        color = "#005AFF";
      } else {
        color = "#999999";
      }

      let newData = {
        name: driver.name,
        //pointsGainedAverage: pointsAverage,
        data: finishingPointsPrediction,
        color: color,
      };
      driverAveragePointsByRace.push(newData);
    });

    console.log(driverAveragePointsByRace);
    setFinishingPredictionByRace(driverAveragePointsByRace);
    setHasSeasonPrediction(true);
    setHideButton(true);
    setChartData({
      series: driverAveragePointsByRace,
      options: {
        chart: {
          height: 750,
          type: "line",
          toolbar: {
            show: false,
          },
        },
        stroke: {
          width: 2,
          curve: "smooth",
        },
        title: {
          text: "2022 Season Prediction",
          style: {
            fontSize: "50px",
            fontFamily: "Inter",
          },
        },
      },
    });
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="my-10 mx-auto border rounded-lg shadow-lg">
        {isLoading ? (
          <div className="content-center">
            <h1 className="block font-bold text-3xl">{status}</h1>
          </div>
        ) : (
          <div>
            {hideButton ? null : (
              <button className="select-button" onClick={getRaces}>
                Predict 2022 Season
              </button>
            )}
          </div>
        )}
        {hasSeasonPrediction ? (
          <div>
            <Chart
              series={chartData.series}
              options={chartData.options}
              type="line"
              width="1000"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SeasonPrediction;
