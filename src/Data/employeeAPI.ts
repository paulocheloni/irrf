import data from './pessoas.json';
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



export function getEmployeesData(): Employee[] {
  const formatedEmployees = dataAdapter(data);
  console.log(formatedEmployees);
  return formatedEmployees;
}
