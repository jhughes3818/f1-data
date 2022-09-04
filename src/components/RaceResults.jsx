import React, { useState } from "react";
import YearsSelect from "./YearsSelect";
import TrackSelect from "./TrackSelect";
import Sidebar from "./sidebar";
import axios from "axios";

function RaceResults() {
  let [trackSelected, changeState] = useState(false);
  let [submitOpen, openSubmit] = useState(false);
  let [tracks, setTracks] = useState([]);

  //Gets tracks based on user selection & updates tracksSelected state
  async function loadTracks() {
    const baseURL = "http://ergast.com/api/f1/";
    let year = "1984";
    let url = baseURL + year + ".json";

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

  return (
    <div>
      <div className="flex">
        <Sidebar />

        <div className="rounded-lg bg-white mx-auto my-10 text-gray-800 px-8 py-8 shadow-lg border border-gray-300 space-y-6">
          <h1 className="font-bold text-3xl">Race Results</h1>
          <form name="select" className="mb-0 space-y-6">
            <div>
              <label className="block font-medium text-lg">
                Select Grand Prix
              </label>
              <YearsSelect />
              {trackSelected ? <TrackSelect tracks={tracks} /> : null}
            </div>
          </form>
          {trackSelected ? null : (
            <button onClick={loadTracks} className="select-button">
              Select
            </button>
          )}
          {submitOpen ? (
            <button type="submit" className="select-button">
              Submit
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default RaceResults;
