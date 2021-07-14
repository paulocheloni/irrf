import fs from 'fs-extra';
import { Employee } from '../core/employee';

interface APIData {
  nome: string,
  cpf: string,
  desconto: number,
  salario: number,
  dependentes: number
}

function dataAdapter(ApiData: APIData[]): Employee[] {
  return ApiData.map((person, index): Employee => ({
    name: person.nome,
    cpf: person.cpf,
    pensionDiscount: person.desconto,
    grossSalary: person.salario,
    dependentsQty: person.dependentes,
    id: index,
  }));
}

const employeeAPI = {
  getEmployees(): APIData[] | [] {
    const employees: []| APIData[] = [];
    fs.readFile('./customer.json', (error, data: Buffer) => {
      const parsedData = JSON.parse(data.toString('utf-8'));

      employees.concat(parsedData);
    });

    return employees;
  },
};

export function getEmployeesData(): Employee[] {
  const employees = employeeAPI.getEmployees();
  const formatedEmployees = dataAdapter(employees);
  return formatedEmployees;
}
