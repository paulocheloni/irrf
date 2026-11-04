/**
 * Monthly IRRF parameters for calendar year 2026.
 *
 * Progressive table: Lei nº 15.191, de 11 de agosto de 2025, art. 2º, which
 * rewrote Lei nº 11.482/2007, art. 1º, XII. Those brackets have applied since
 * May 2025 and are the monthly table Receita Federal publishes for 2026.
 * https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15191.htm
 * https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
 *
 * Dependent deduction: Lei nº 9.250/1995, art. 4º, III, "i"
 * (Lei nº 13.149/2015), still R$ 189.59 on the 2026 Receita table.
 * https://www.planalto.gov.br/ccivil_03/leis/l9250compilado.htm
 *
 * Simplified monthly discount: Lei nº 9.250/1995, art. 4º, § 2º
 * (wording of Lei nº 14.663/2023). It is 25% of the top of the zero-rate
 * monthly bracket and replaces the legal deductions when that is more
 * beneficial. Receita Federal lists the 2026 limit as R$ 607.20.
 *
 * Monthly reduction: Lei nº 15.270, de 26 de novembro de 2025, art. 2º,
 * which added Lei nº 9.250/1995, art. 3º-A, from January 2026.
 * https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm
 * https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/exemplos-de-aplicacao-da-lei-15-270-2025
 *
 * `max` is inclusive, in reais. The last row is "acima de R$ 4.664,68",
 * so its floor is the next centavo (R$ 4,664.69). `tax` is the rate in
 * percent. `discount` is the parcela a deduzir. Cent fields are the integer
 * source used by the calculator.
 */

export const progressiveTable = [
  {
    min: 0,
    max: 2428.80,
    tax: 0,
    discount: 0,
    maxCents: 242880,
    discountCents: 0,
  },
  {
    min: 2428.81,
    max: 2826.65,
    tax: 7.5,
    discount: 182.16,
    maxCents: 282665,
    discountCents: 18216,
  },
  {
    min: 2826.66,
    max: 3751.05,
    tax: 15,
    discount: 394.16,
    maxCents: 375105,
    discountCents: 39416,
  },
  {
    min: 3751.06,
    max: 4664.68,
    tax: 22.5,
    discount: 675.49,
    maxCents: 466468,
    discountCents: 67549,
  },
  {
    min: 4664.69,
    max: Infinity,
    tax: 27.5,
    discount: 908.73,
    maxCents: Infinity,
    discountCents: 90873,
  },
];

/** R$ 189.59 per dependent per month. Lei nº 9.250/1995, art. 4º, III, "i". */
export const discountByDependent = 189.59;

export const discountByDependentCents = 18959;

/**
 * R$ 607.20. 25% of R$ 2,428.80, Lei nº 9.250/1995, art. 4º, § 2º.
 * Replaces pension and dependent deductions when it is larger.
 */
export const simplifiedMonthlyDiscount = 607.20;

export const simplifiedMonthlyDiscountCents = 60720;

/**
 * Lei nº 9.250/1995, art. 3º-A (Lei nº 15.270/2025).
 * Up to R$ 5,000.00 the reduction is at most R$ 312.89 and zeroes the tax.
 * From R$ 5,000.01 through R$ 7,350.00 the reduction is
 * 978.62 - (0.133145 × taxable monthly income). Above R$ 7,350.00 it is zero.
 * The reduction cannot exceed the tax from the progressive table (§ 1º).
 */
export const reduction = {
  fullExemptionLimit: 5000,
  fullExemptionLimitCents: 500000,
  fullExemptionCap: 312.89,
  fullExemptionCapCents: 31289,
  phaseOutLimit: 7350,
  phaseOutLimitCents: 735000,
  phaseOutIntercept: 978.62,
  phaseOutInterceptCents: 97862,
  phaseOutRate: 0.133145,
  phaseOutRateNumerator: 133145,
  phaseOutRateDenominator: 1000000,
};

export function formatCurrency(value) {
  const currencyFormater = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currencyFormater.format(value);
}
