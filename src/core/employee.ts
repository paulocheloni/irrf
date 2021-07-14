export interface Employee {
  name: string;
  cpf: string;
  grossSalary: number;
  pensionDiscount: number;
  dependentsQty: number;
  id: number;

}

export type EmployeeKey = 'name' | 'cpf' | 'grossSalary' | 'pensionDiscount' | 'dependentsQty';

const addEmployee = (employees: Employee[], employee: Employee):Employee[] => (
  employees.concat(employee));

function updateEmployee(employees: Employee[], employee: Employee): Employee[] {
  const empIndex = employees.findIndex((e) => e.name === employee.name);
  const newEmployees = [...employees];
  newEmployees.splice(empIndex, 1, employee);
  return newEmployees;
}

function deleteEmployee(employees: Employee[], employee: Employee): Employee[] {
  const empIndex = employees.findIndex((e) => e.name === employee.name);
  const newEmployees = [...employees];
  newEmployees.splice(empIndex, 1);
  return newEmployees;
}

function listEmployees(employees: Employee[]): Employee[] {
  return employees;
}

export {
  listEmployees, deleteEmployee, addEmployee, updateEmployee,
};
