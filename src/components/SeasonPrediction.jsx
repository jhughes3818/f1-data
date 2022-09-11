import React, { useState } from "react";
import axios from "axios";
import SideBar from "./sidebar";

function SeasonPrediction() {
  let [isLoading, setLoading] = useState(false);
  let [seasonPrediction, setSeasonPrediction] = useState();
  let [hasSeasonPrediction, setHasSeasonPrediction] = useState(false);
  let [hideButton, setHideButton] = useState(false);

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

        races.forEach((race) => {
          if (Date.parse(race.date) < currentDate) {
            seasonRaces.push(race.round);
            console.log("Added Round " + race.round);
          }
        });
      });
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

    console.log(driverSeasonPoints[0].points[0].slice(-5));

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
    setHasSeasonPrediction(true);
    setHideButton(true);
  }

  function CreateStandingsRows(position) {
    return (
      <tr className="tbody">
        <td className="px-2">{position.name}</td>
        <td className="pr-6 pl-2">{position.averagePointsGained}</td>
        <td className="pr-6 pl-2">{position.currentPoints}</td>
        <td className="px-2">{Math.round(position.finishingPoints)}</td>
      </tr>
    );
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="my-10 mx-auto border rounded-lg shadow-lg">
        {isLoading ? (
          <div className="content-center">
            <h1 className="block font-medium text-lg">Loading...</h1>
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
          <table className="table">
            <thead>
              <tr className="uppercase font-medium h-12">
                <td className="px-2">Driver</td>
                <td className="pr-6 pl-2">Average Points Gained</td>
                <td className="px-2">Current Points</td>
                <td className="px-2">Predicted Finishing Points</td>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {seasonPrediction.map(CreateStandingsRows)}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

export default SeasonPrediction;
