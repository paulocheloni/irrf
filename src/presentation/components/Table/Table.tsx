import { ReactElement } from 'react';
import { Employee, EmployeeKey } from '../../../core/employee';

type colName = EmployeeKey

export interface EmployeeCol {
  name: colName
  width: number
  layoutName: string
}

interface EmployeeRow extends Employee {
  id: number
}

interface EmployeeTable {
  cols: EmployeeCol[],
  rows: EmployeeRow[]
}

function Table({ cols, rows }: EmployeeTable): ReactElement {
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
          {cols.map((col) => (
            <tr key={col.name}>

              {rows.map((row) => (
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
