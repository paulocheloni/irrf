import fs from 'fs';

/**
 *  @typedef {Object} employee
 *  @property {string} name
 *  @property {string} cpf
 *  @property {string} gross_salary
 *  @property {string} pension_discount
 *  @property {number} dependents_qty
*/

/**
 * @param {employee} employee
 * @param {employee[]} employees
 * @returns {employee[]} new employees list
 * */

function addEmployee(employees, employee) {
  return employees.concat(employee);
}

/**
 * @param {employee} employee
 * @param {employee[]} employees
 * @returns {employee[]} new employees list
 *
 * */

function updateEmployee(employees, employee) {
  const empIndex = employees.findIndex((e) => e.name === employee.name);
  const newEmployees = [...employees];
  newEmployees.splice(empIndex, 1, employee);
  return newEmployees;
}

/**
 * @param {employee} employee
 * @param {employee[]} employees.
 * @returns {employee[]} new employees list
 *
 * */

function deleteEmployee(employees, employee) {
  const empIndex = employees.findIndex((e) => e.name === employee.name);
  const newEmployees = [...employees];
  newEmployees.splice(empIndex, 1);
  return newEmployees;
}

/**
 * @param {employee[]} employees is a list of Employees
 * @returns {employee[]} returns a of list employees
 *
 * */

function listEmployees(employees) {
  return employees.map();
}

function getEmployees() {
  let employees = [];

  fs.readFile('./customer.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log('File read failed:', err);
      return;
    }
    employees = JSON.parse(jsonString);
  });
  return employees;
}

export {
  listEmployees, deleteEmployee, addEmployee, updateEmployee, getEmployees,
};
