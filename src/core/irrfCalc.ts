import { progressiveTable, discountByDependent, formatCurrency } from '../Data/irrfData';

export type progressiveDiscountValues = [number, number];


function calcBaseSalary(grossSalary: number, pensionDiscount: number, dependentsDiscount: number): number {
  return grossSalary - pensionDiscount - dependentsDiscount;
}

function irrfDiscountCalc(baseSalary: number) {

  let values: Array<number> = [];
  /* the reason to use Array.prototype.every here is due to breaking
  the loop when the condition inside the "if" is found */
  progressiveTable.every((line) => {
    if (line.max >= baseSalary && line.min <= baseSalary) {
      values = [line.tax, line.discount];

      return false;
    }

    return true;
  });
  const [tax, discount] = values;
  return (baseSalary * (tax / 100)) - discount;
}

export default function calcDiscount(grossSalary: number,
  dependentsQty: number, pensionDiscount: number): string {
  const dependentsDiscount = discountByDependent * dependentsQty;
  const baseSalary = calcBaseSalary(grossSalary, pensionDiscount, dependentsDiscount);
  const irrfDiscount = irrfDiscountCalc(baseSalary);

  return formatCurrency(irrfDiscount);
}
