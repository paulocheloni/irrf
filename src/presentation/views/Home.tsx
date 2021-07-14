/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable react/jsx-filename-extension */
import { ReactElement } from 'react';
import Header from '../components/Header/Header';
import Table, { EmployeeCol } from '../components/Table/Table';
import { useAppDispatch, useAppSelector } from '../../infra/hooks/hooks';

function Home(): ReactElement {
  const employees = useAppSelector((state) => state.employee.employees);
  return (
    <div>
      <Header />
      <Table rows={employees} cols={Object.keys(employees) as unknown as EmployeeCol[]} />
    </div>
  );
}

export default Home;
