import React from "react";
import Select from "./Select";

function SelectTrack(props) {
  return (
    <form>
      <div className="mt-1">
        <Select name="track" array={props.tracks} />
      </div>
    </form>
  );
}

export default SelectTrack;
