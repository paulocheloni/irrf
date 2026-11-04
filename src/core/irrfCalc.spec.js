import {
  progressiveTable,
  discountByDependent,
  discountByDependentCents,
  simplifiedMonthlyDiscount,
  simplifiedMonthlyDiscountCents,
  reduction,
} from '../Data/irrfData';
import calcDiscount, { calcMonthlyWithholding } from './irrfCalc';

const NBSP = '\u00a0';

describe('2026 monthly table', () => {
  test('stores the Lei 15.191/2025 brackets published by Receita Federal', () => {
    expect(progressiveTable.map((row) => [row.maxCents, row.tax, row.discountCents])).toEqual([
      [242880, 0, 0],
      [282665, 7.5, 18216],
      [375105, 15, 39416],
      [466468, 22.5, 67549],
      [Infinity, 27.5, 90873],
    ]);
    expect(progressiveTable[3].max).toBe(4664.68);
    expect(progressiveTable[4].min).toBe(4664.69);
  });

  test('uses the current dependent deduction, not the 2012 amount of 164.56', () => {
    expect(discountByDependent).toBe(189.59);
    expect(discountByDependentCents).toBe(18959);
  });

  test('simplified discount is 25% of the zero-rate ceiling', () => {
    expect(simplifiedMonthlyDiscount).toBe(607.2);
    expect(simplifiedMonthlyDiscountCents).toBe(60720);
    expect(simplifiedMonthlyDiscountCents).toBe(Math.round(242880 * 0.25));
  });

  test.each([
    [2428.8, 0],
    [2428.81, 0],
    [2600, 12.84],
    [2826.65, 29.84],
    [2826.66, 29.84],
    [3000, 55.84],
    [3751.05, 168.5],
    [3751.06, 168.5],
    [4000, 224.51],
    [4664.68, 374.06],
    [4664.69, 374.06],
    [10000, 1841.27],
  ])('base %s withholds %s when income is above R$ 7,350', (base, expected) => {
    const grossSalary = 20000;
    const pensionDiscount = grossSalary - base;
    expect(calcMonthlyWithholding(grossSalary, 0, pensionDiscount)).toBe(expected);
  });
});

describe('dependents', () => {
  test('one dependent does not beat the simplified discount', () => {
    const withoutDependents = calcMonthlyWithholding(10000, 0, 0);
    expect(withoutDependents).toBe(1674.29);
    expect(calcMonthlyWithholding(10000, 1, 0)).toBe(withoutDependents);
  });

  test('four dependents replace the simplified discount', () => {
    expect(calcMonthlyWithholding(10000, 4, 0)).toBe(1632.72);
  });

  test('dependents are added to the pension discount before the comparison', () => {
    expect(calcMonthlyWithholding(10000, 0, 400)).toBe(1674.29);
    expect(calcMonthlyWithholding(10000, 2, 400)).toBe(1627);
    expect(calcMonthlyWithholding(9000, 2, 300)).toBe(1379.5);
  });
});

describe('pension discount', () => {
  test('a pension discount larger than R$ 607.20 is the deduction that is used', () => {
    expect(calcMonthlyWithholding(8000, 0, 700)).toBe(1098.77);
  });

  test('a pension discount smaller than R$ 607.20 is replaced', () => {
    expect(calcMonthlyWithholding(8000, 0, 400)).toBe(1124.29);
  });

  test('an equal pension discount matches the simplified result', () => {
    expect(calcMonthlyWithholding(10000, 0, 607.2)).toBe(1674.29);
  });

  test('a pension discount above the salary does not produce a negative tax', () => {
    expect(calcMonthlyWithholding(1000, 0, 5000)).toBe(0);
    expect(calcDiscount(1000, 0, 5000)).toBe(`R$${NBSP}0,00`);
  });
});

describe('simplified monthly discount', () => {
  test('uses R$ 607.20 when there is no legal deduction', () => {
    expect(calcMonthlyWithholding(7607.2, 0, 0)).toBe(1016.27);
  });

  test('is not added on top of pension and dependents', () => {
    const stacked = 649.6 + 607.2;
    expect(calcMonthlyWithholding(6000, 0, 649.6)).not.toBe(
      calcMonthlyWithholding(6000, 0, stacked),
    );
    expect(calcMonthlyWithholding(6000, 0, 649.6)).toBe(382.88);
  });
});

describe('Lei 15.270/2025 reduction', () => {
  test('stores the statutory limits and the phase-out formula', () => {
    expect(reduction.fullExemptionLimit).toBe(5000);
    expect(reduction.fullExemptionCap).toBe(312.89);
    expect(reduction.phaseOutLimit).toBe(7350);
    expect(reduction.phaseOutIntercept).toBe(978.62);
    expect(reduction.phaseOutRateNumerator).toBe(133145);
    expect(reduction.phaseOutRateDenominator).toBe(1000000);
  });

  test('zeroes withholding on taxable income up to R$ 5,000.00', () => {
    expect(calcMonthlyWithholding(5000, 0, 0)).toBe(0);
    expect(calcMonthlyWithholding(5000.01, 0, 0)).toBe(0);
  });

  test('caps the reduction at the table tax so withholding is never negative', () => {
    expect(calcMonthlyWithholding(5100, 0, 2000)).toBe(0);
  });

  test('phases the reduction out between R$ 5,000.01 and R$ 7,350.00', () => {
    expect(calcMonthlyWithholding(5001, 0, 0)).toBe(0.36);
    expect(calcMonthlyWithholding(6500, 0, 0)).toBe(598.61);
    expect(calcMonthlyWithholding(7349.99, 0, 0)).toBe(945.53);
  });

  test('applies no reduction from R$ 7,350.00 upward', () => {
    expect(calcMonthlyWithholding(7350, 0, 0)).toBe(945.54);
    expect(calcMonthlyWithholding(7350.01, 0, 0)).toBe(945.54);
  });

  test('multiplies 0.133145 by taxable income, not by the calculation base', () => {
    // Receita Federal, exemplo 4. Using the base (5,350.40) in the formula
    // would withhold R$ 296.38 instead of R$ 382.88.
    expect(calcMonthlyWithholding(6000, 0, 649.6)).toBe(382.88);
  });
});

describe('Receita Federal worked examples for Lei 15.270/2025', () => {
  test.each([
    ['example 1, zero bracket', 3036, 0, 257.73, 0],
    ['example 2, income under 5,000', 4000, 0, 373.41, 0],
    ['example 3, income of exactly 5,000', 5000, 0, 509.6, 0],
    ['example 4, phase-out', 6000, 0, 649.6, 382.88],
    ['example 5, no reduction', 7607.2, 0, 0, 1016.27],
  ])('%s', (_label, grossSalary, dependentsQty, pensionDiscount, expected) => {
    expect(calcMonthlyWithholding(grossSalary, dependentsQty, pensionDiscount)).toBe(expected);
  });
});

describe('calcDiscount formatting', () => {
  test('returns pt-BR currency', () => {
    expect(calcDiscount(6000, 0, 649.6)).toBe(`R$${NBSP}382,88`);
    expect(calcDiscount(7607.2, 0, 0)).toBe(`R$${NBSP}1.016,27`);
  });
});
