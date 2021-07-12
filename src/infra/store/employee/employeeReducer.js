/* eslint-disable no-param-reassign */
import { createAction, createReducer } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  addEmployee, deleteEmployee, updateEmployee,
} from '../../../core/employee';

const INSERT = Symbol('employee/add');
const DELETE = Symbol('employee/delete');
const UPDATE = Symbol('employee/update');

export const insert = createAction(INSERT);
export const remove = createAction(DELETE);
export const update = createAction(UPDATE);

const initialState = { employees: [] };

const employeeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(insert, (state, action) => {
      state.employees = addEmployee(state.employees, action.payload);
    })
    .addCase(remove, (state, action) => {
      state.employees = deleteEmployee(state.employees, action.payload);
    })
    .addCase(update, (state, action) => {
      state.employees = updateEmployee(state.employees, action.payload);
    });
});

export const listEmployees = createSelector((state) => state.employees);

export default employeeReducer;
