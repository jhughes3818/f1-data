import React, { useState } from "react";
import Sidebar from "./sidebar";
import axios from "axios";
import yearsSupported from "../data/years";
import YearsOptions from "./YearsOptions";

function RaceResults() {
  let [trackSelected, changeState] = useState(false);
  let [submitOpen, openSubmit] = useState(false);
  let [tracks, setTracks] = useState([]);
  let [year, setYear] = useState(2022);
  let [results, setResults] = useState([]);
  let [GP, setGP] = useState("");
  let [haveResults, setHaveResults] = useState(false);

  //Gets tracks based on user selection & updates tracksSelected state
  async function loadTracks(event) {
    setYear((year = event.target.value));
    const baseURL = "http://ergast.com/api/f1/";
    let yearString = year.toString();
    let url = baseURL + yearString + ".json";

    await axios.get(url).then(function (response) {
      let grandPrix = [];
      let races = response.data.MRData.RaceTable.Races;
      races.forEach((race) => {
        let newGP = race.raceName;
        grandPrix.push(newGP);
      });
      setTracks(grandPrix);
      changeState((trackSelected = true));
      openSubmit((submitOpen = true));
    });
  }

  function makeOptionTracks(item) {
    return <option value={item}>{item}</option>;
  }

  function getGPRound(event) {
    let selection = event.target.value;
    let round = tracks.indexOf(selection) + 1;
    setGP(round);
  }

  async function getRaceResults() {
    let raceBaseURL = "http://ergast.com/api/f1/";
    let raceYearString = year.toString();
    let round = GP.toString();
    let raceURLEnd = "/results.json";
    const raceURL = raceBaseURL + raceYearString + "/" + round + raceURLEnd;

    console.log(raceURL);

    await axios.get(raceURL).then(function (response) {
      // handle success
      let raceResults = [];
      let resultsList = response.data.MRData.RaceTable.Races[0].Results;
      //console.log(resultsList[2].Time.time);
      resultsList.forEach((result) => {
        try {
          let newData = {
            position: result.position,
            fName: result.Driver.givenName,
            lName: result.Driver.familyName,
            team: result.Constructor.name,
            grid: result.grid,
            time: result.Time.time,
          };
          raceResults.push(newData);
        } catch {
          let newData = {
            position: result.position,
            fName: result.Driver.givenName,
            lName: result.Driver.familyName,
            team: result.Constructor.name,
            grid: result.grid,
            time: result.status,
          };
          raceResults.push(newData);
        }
      });
      setResults((results = raceResults));
      setHaveResults(true);
    });
  }

  function CreateResultsRows(position) {
    return (
      <tr className="tbody">
        <td className="px-2">{position.position}</td>
        <td className="pr-6 pl-2">{position.fName + " " + position.lName}</td>
        <td className="px-2">{position.team}</td>
        <td className="px-2">{position.grid}</td>
        <td className="px-2">{position.time}</td>
      </tr>
    );
  }

  return (
    <div>
      <div className="flex">
        <Sidebar />

        <div className="box">
          <h1 className="font-bold text-4xl text-black font-roboto">
            Race Results
          </h1>
          <form name="select" className="mb-0 space-y-1">
            <div>
              <label className="block font-bold text-lg text-black font-roboto mt-3">
                Select Grand Prix
              </label>
              <YearsOptions function={loadTracks} />
            </div>
          </form>
          <form onSubmit={getRaceResults}>
            {trackSelected ? (
              <select
                className="w-full text-black font-roboto border-2 border-black mt-3"
                name="year"
                onChange={getGPRound}
              >
                <option>Select Grand Prix</option>
                {tracks.map(makeOptionTracks)}
              </select>
            ) : null}
          </form>
          {submitOpen ? (
            <button
              onClick={getRaceResults}
              type="submit"
              className="select-button my-3"
            >
              Submit
            </button>
          ) : null}
          {haveResults ? (
            <table className="table">
              <thead>
                <tr className="uppercase font-medium h-12">
                  <td>Position</td>
                  <td>Name</td>
                  <td>Team</td>
                  <td>Grid Position</td>
                  <td>Time</td>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap">
                {results.map(CreateResultsRows)}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default RaceResults;
