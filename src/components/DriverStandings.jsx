import React, { useState } from "react";
import SideBar from "./sidebar";
import axios from "axios";
import YearsOptions from "./YearsOptions";

function DriverStandings() {
  let [Standings, updateStandings] = useState([]);
  let [haveStandings, toggle] = useState(false);
  let [year, setYear] = useState(2022);
  let [title, setTitle] = useState("Results Will Appear Here");

  async function getLatestStandings(event) {
    setYear((year = event.target.value));
    console.log(year);
    let yearString = year.toString();
    let baseURL = "http://ergast.com/api/f1/";
    let endURL = "/driverStandings.json";
    const url = baseURL + yearString + endURL;
    console.log(url);

    setTitle(yearString + " Driver Standings");

    await axios
      .get(url)
      .then(function (response) {
        // handle success
        let newStandings = [];
        var driverStandings =
          response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        driverStandings.forEach((driver) => {
          var newData = {
            position: driver.position,
            firstName: driver.Driver.givenName,
            lastName: driver.Driver.familyName,
            points: driver.points,
          };
          newStandings.push(newData);
          updateStandings(newStandings);
          toggle(true);
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  function CreateStandingsRows(position) {
    return (
      <tr className="tbody">
        <td className="px-2">{position.position}</td>
        <td className="pr-6 pl-2">
          {position.firstName + " " + position.lastName}
        </td>
        <td className="px-2">{position.points}</td>
      </tr>
    );
  }

  function makeOption(item) {
    return <option value={item}>{item}</option>;
  }

  return (
    <div>
      <div className="flex">
        <SideBar />

        <div className="box">
          <form className="px-6 gap-2 py-6" onSubmit={getLatestStandings}>
            <YearsOptions function={getLatestStandings} />
          </form>
          <table className="table">
            <thead>
              <tr className="uppercase font-medium h-12">
                <td className="px-2">Position</td>
                <td className="pr-6 pl-2">Driver</td>
                <td className="px-2">Points</td>
              </tr>
            </thead>
            {haveStandings ? (
              <tbody className="whitespace-nowrap">
                {Standings.map(CreateStandingsRows)}
              </tbody>
            ) : null}
          </table>
        </div>
      </div>
    </div>
  );
}

export default DriverStandings;
