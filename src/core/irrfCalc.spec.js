import {progressiveTable, discountByDependent, formatCurrency} from "../Data/irrfData"
import calcDiscount from "../core/irrfCalc"



test('should return valid irrf discount', () => {
  const pensionDiscount = 277.40
  const grossSalary = 3000
  const dependentsCount = 0

  const expectedDiscount = formatCurrency(61.39)
  
  const calculatedDiscount = calcDiscount(grossSalary, dependentsCount, pensionDiscount)

  expect(calculatedDiscount).toBe(expectedDiscount)



})


