import React from 'react';

function Select(props) {

  function makeOption(item) {
    return (<option value="item">{item}</option>)
  }

  return(
    <select className="w-full border-gray-300 rounded-lg shadow-sm" name="year">
      {props.array.reverse().map(makeOption)}
    </select>
  )

}

export default Select
