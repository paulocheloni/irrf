import { progressiveTable, discountByDependent, formatCurrency } from '../Data/irrfData';

function calcBaseSalary(grossSalary, pensionDiscount, dependentsDiscount) {
  return grossSalary - pensionDiscount - dependentsDiscount;
}

function irrfDiscountCalc(baseSalary) {
  let values = [];
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

export default function calcDiscount(grossSalary, dependentsQty, pensionDiscount) {
  const dependentsDiscount = discountByDependent * dependentsQty;
  const baseSalary = calcBaseSalary(grossSalary, pensionDiscount, dependentsDiscount);
  const irrfDiscount = irrfDiscountCalc(baseSalary);

  return formatCurrency(irrfDiscount);
}
