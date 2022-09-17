import React from "react";

function Select(props) {
  function makeOption(item) {
    return <option value={item}>{item}</option>;
  }

  return (
    <select
      className="w-full border-gray-300 rounded-lg shadow-sm text-black"
      name="year"
    >
      {props.array.map(makeOption)}
    </select>
  );
}

export default Select;
