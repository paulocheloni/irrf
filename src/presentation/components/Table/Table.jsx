import React from 'react';

function Table({ cols, rows }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col.name}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>

              {cols.map((col) => (
                <th key={row[col.name]}>{row[col.name]}</th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
