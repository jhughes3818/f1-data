import React from "react";

function Table(props) {
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
        {props.data.map(CreateStandingsRows)}
      </tbody>
    </table>
  );
}

export default Table;
