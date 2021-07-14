/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addEmployee, deleteEmployee, updateEmployee,
  Employee,
} from '../../../core/employee';
import { getEmployeesData } from '../../../Data/employeeAPI';

const REQUEST = 'employee/query';
/* in a real application it would be necessary to have async logic for all operations [insert,
   remove, update]
 to sync redux with database */
export const initStore = createAsyncThunk(REQUEST, () => {
  const employees = getEmployeesData();
  return employees;
});

interface EmployeeState {
  employees: Employee[];
}

const initialState: EmployeeState = { employees: [] };
/* using this method we reduce boilerplate-y code
 and we dont need to remenber what is the default case */
const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {

    insert(state: { employees: Employee[]; }, action: PayloadAction<Employee>) {
      state.employees = addEmployee(state.employees, action.payload);
    },
    remove(state: { employees: Employee[]; }, action: PayloadAction<Employee>) {
      state.employees = deleteEmployee(state.employees, action.payload);
    },
    update(state: { employees: Employee[]; }, action: PayloadAction<Employee>) {
      state.employees = updateEmployee(state.employees, action.payload);
    },

  },

});
/* with selector we avoid  using logic to connect redux with react or any other lib reducing
 dependencies between libraries */

export const { insert, remove, update } = employeeSlice.actions;

export default employeeSlice.reducer;
