import {addEmployee, updateEmployee, deleteEmployee} from "./employee"
import {getEmployeesData} from "../Data/employeeAPI"





test("it should be able to add an employee", () => {
  const employees = getEmployeesData()
  
  const newEmployee = {
    id: 2,
    name: "Letícia Aurora Ruenia",
    cpf: "936.938.039-60",
    grossSalary: 998,
    pensionDiscount: 74.85,
    dependentsQty: 2
  },

  newEmployees = addEmployee(employees, newEmployee)
  expect(newEmployees).toStrictEqual([...employees, newEmployee])
})

test("it should be able to update an employee", () => {
  const employees =  getEmployeesData()
  
  const newEmployee = {
    id: 2,
    name: "Letícia Aurora Ruenia",
    cpf: "936.938.039-60",
    grossSalary: 998,
    pensionDiscount: 74.85,
    dependentsQty: 2
  },

  newEmployees = updateEmployee(employees, newEmployee)
  const updatedEmployee = newEmployees.find(employee => employee.name === newEmployee.name)
  expect(updatedEmployee?.cpf).toStrictEqual(newEmployee.cpf)
})

test("it should be able to remove an employee", () => {
  const employees = getEmployeesData()
  
  const oldEmployee = {
    id: 2,
    name: "Letícia Aurora Ruenia",
    cpf: "936.938.039-60",
    grossSalary: 998,
    pensionDiscount: 74.85,
    dependentsQty: 2
  },

  newEmployees = deleteEmployee(employees, oldEmployee)
  const includeOld = newEmployees.some(employee => employee.name === oldEmployee.name)

  expect(includeOld).toBe(false)
})

