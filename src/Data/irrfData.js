export const progressiveTable = ([
  {
    min: 0, max: 1903.98, tax: 0, discount: 0,
  },
  {
    min: 1903.99, max: 2826.65, tax: 7.5, discount: 142.8,
  },
  {
    min: 2826.66, max: 3751.05, tax: 15, discount: 354.8,
  },
  {
    min: 3751.06, max: 4664.68, tax: 22.5, discount: 636.13,
  },
  {
    min: 4664.68, max: Infinity, tax: 27.5, discount: 869.36,
  },

]);

export const discountByDependent = 164.56;

export function formatCurrency(value) {
  const currencyFormater = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currencyFormater.format(value);
}
