// React Imports
import React from "react";

// Additional Imports

const RankingTable = (column1, column2, children) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>{column1}</th>
          <th>{column2}</th>
        </tr>
        {children}
      </tbody>
    </table>
  );
};

export default RankingTable;
