import React from "react";

function Select(props) {
  function makeOption(item) {
    return <option value={item}>{item}</option>;
  }

  return (
    <select
      className="w-full border-black shadow-sm text-black font-roboto"
      name="year"
    >
      {props.array.map(makeOption)}
    </select>
  );
}

export default Select;
