
import { ReactElement, useEffect } from 'react';
import Header from '../components/Header/Header';
import Table, { EmployeeCol } from '../components/Table/Table';
import { useAppDispatch, useAppSelector } from '../../infra/hooks/hooks';
import {initStore} from '../../infra/store/employee/employeeReducer'

function Home(): ReactElement {
  const employees = useAppSelector((state) => state.employee.employees);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initStore())
  }, []);

  return (
    <div>
      <Header />
      <Table rows={employees} cols={Object.keys(employees) as unknown as EmployeeCol[]} />
    </div>
  );
}

export default Home;
