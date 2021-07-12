import {addEmployee, updateEmployee, deleteEmployee} from "./employee"
import fs from "fs"



function getEmployees () {
  const employees = []

  fs.readFile('./customer.json', 'utf8', (err, jsonString) => {
      if (err) {
          console.log("File read failed:", err)
          return
      }
      employees = JSON.parse(jsonString)
      
  })
  return employees
}

test("it should be able to add employee", () => {
  const employees = getEmployees()
  const newEmployee = {
    nome: "Letícia Aurora Ruenia",
    cpf: "936.938.039-60",
    salario: 998,
    desconto: 74.85,
    dependentes: 2
  },

  newEmployees = addEmployee(employees, newEmployee)
  expect(newEmployees).toStrictEqual([...employees, newEmployee])
})

test("it should be able to update employee", () => {
  const employees = getEmployees()
  const newEmployee = {
    nome: "Letícia Aurora Farias",
    cpf: "936.938.039-62",
    salario: 998,
    desconto: 74.85,
    dependentes: 2
  },

  newEmployees = updateEmployee(employees, newEmployee)
  const updatedEmployee = newEmployees.find(employee => employee.nome === newEmployee.nome)
  expect(updatedEmployee.cpf).toStrictEqual(newEmployee.cpf)
})

test("it should be able to remove employee", () => {
  const employees = getEmployees()
  const oldEmployee = {
    nome: "Letícia Aurora Farias",
    cpf: "936.938.039-60",
    salario: 998,
    desconto: 74.85,
    dependentes: 2
  },

  newEmployees = deleteEmployee(employees, oldEmployee)
  const includeOld = newEmployees.some(employee => employee.name === oldEmployee.nome)

  expect(includeOld).toBe(false)
})

