import {
  progressiveTable,
  discountByDependentCents,
  simplifiedMonthlyDiscountCents,
  reduction,
  formatCurrency,
} from '../Data/irrfData';

/**
 * Reais to centavos, half-up. Two-decimal money literals are not all exact
 * in binary, so this formats to 8 places before reading the centavos.
 */
function toCents(reais) {
  const amount = Number(reais);
  if (!Number.isFinite(amount)) {
    return 0;
  }
  const negative = amount < 0;
  const [whole, fraction = ''] = Math.abs(amount).toFixed(8).split('.');
  let cents = (Number(whole) * 100) + Number(fraction.slice(0, 2));
  if (Number(fraction[2] || '0') >= 5) {
    cents += 1;
  }
  return negative ? -cents : cents;
}

function dependentDeductionCents(dependentsQty) {
  const count = Number(dependentsQty);
  if (!Number.isFinite(count) || count <= 0) {
    return 0;
  }
  return Math.round(count * discountByDependentCents);
}

/**
 * Legal deductions are the caller-supplied pension / social-security
 * discount plus R$ 189.59 per dependent (Lei nº 9.250/1995, art. 4º,
 * III, IV and V). The simplified discount of art. 4º, § 2º replaces that
 * sum when it is more beneficial. The two are not added together.
 * Receita Federal applies the same comparison in its 2026 examples.
 */
function deductionCents(dependentsQty, pensionDiscount) {
  const legalCents = toCents(pensionDiscount) + dependentDeductionCents(dependentsQty);
  return Math.max(legalCents, simplifiedMonthlyDiscountCents);
}

function taxCentsForBase(baseCents) {
  if (baseCents <= 0) {
    return 0;
  }
  const bracket = progressiveTable.find((row) => baseCents <= row.maxCents);
  const grossTax = Math.round((baseCents * bracket.tax) / 100);
  return Math.max(0, grossTax - bracket.discountCents);
}

/**
 * Art. 3º-A reduction. The income compared with R$ 5,000.00 and R$ 7,350.00,
 * and multiplied by 0.133145, is the taxable monthly income, not the base
 * after deductions. Receita Federal, exemplo 5:
 * https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/exemplos-de-aplicacao-da-lei-15-270-2025
 */
function monthlyReductionCents(incomeCents, tableTaxCents) {
  if (tableTaxCents <= 0 || incomeCents <= 0) {
    return 0;
  }
  if (incomeCents <= reduction.fullExemptionLimitCents) {
    return Math.min(tableTaxCents, reduction.fullExemptionCapCents);
  }
  if (incomeCents > reduction.phaseOutLimitCents) {
    return 0;
  }
  const variableCents = Math.round(
    (reduction.phaseOutRateNumerator * incomeCents) / reduction.phaseOutRateDenominator,
  );
  const rawCents = reduction.phaseOutInterceptCents - variableCents;
  return Math.min(tableTaxCents, Math.max(0, rawCents));
}

/**
 * Monthly IRRF withholding for 2026, in reais (two decimal places).
 *
 * @param {number} grossSalary Taxable income subject to monthly assessment.
 * @param {number} dependentsQty Number of dependents.
 * @param {number} pensionDiscount Deductible pension / social-security amount.
 * @returns {number}
 */
export function calcMonthlyWithholding(grossSalary, dependentsQty, pensionDiscount) {
  const incomeCents = Math.max(0, toCents(grossSalary));
  const baseCents = Math.max(0, incomeCents - deductionCents(dependentsQty, pensionDiscount));
  const tableTaxCents = taxCentsForBase(baseCents);
  const reductionCents = monthlyReductionCents(incomeCents, tableTaxCents);
  return Math.max(0, tableTaxCents - reductionCents) / 100;
}

/**
 * @param {number} grossSalary
 * @param {number} dependentsQty
 * @param {number} pensionDiscount
 * @returns {string} pt-BR BRL currency.
 */
export default function calcDiscount(grossSalary, dependentsQty, pensionDiscount) {
  return formatCurrency(calcMonthlyWithholding(grossSalary, dependentsQty, pensionDiscount));
}
