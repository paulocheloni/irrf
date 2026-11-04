# IRRF

Imposto de Renda Retido na Fonte (IRRF) is the income tax Brazilian employers withhold from a paycheck each month and remit to the Receita Federal. The tax is progressive: the calculation base falls into one bracket, that bracket's rate is applied to the whole base, and a fixed amount (the *parcela a deduzir*) is subtracted so the higher rate applies only above the bracket floor. For 2026, a second reduction then lowers that result, down to zero when monthly taxable income is at most R$ 5,000.00, and phases out by R$ 7,350.00. This repository calculates that monthly withholding from a gross salary, a pension discount, and a number of dependents. The calculation is `calcDiscount` in `src/core/irrfCalc.js`, using the table and reduction in `src/Data/irrfData.js` (Lei nº 15.191/2025 and Lei nº 15.270/2025). The surrounding app is a React 17 project created with Create React App: it mounts a Redux store and a single route, and the page is a placeholder header plus a static table. The page does not call `calcDiscount`.

The repository is licensed under the [MIT License](LICENSE). Copyright (c) 2026 Paulo Cheloni.

## Tech stack

| Piece | In this repo |
| --- | --- |
| UI | React 17.0.2 and React DOM, mounted with `ReactDOM.render` |
| Build | Create React App 4 (`react-scripts` 4.0.3). The lockfile is `yarn.lock` |
| Routing | React Router 5. The only route is `/`, and it renders `Home` |
| State | Redux Toolkit 1.6 and React Redux 7. The employee reducer imports Reselect 4 |
| Styles | Bootstrap 5, compiled with the `sass` package 1.69.5 from `src/presentation/assets/_custom.scss` |
| Tests | Jest and Testing Library. `yarn test` is `react-scripts test` |
| CI | GitHub Actions, `.github/workflows/test.yml`, on Node.js 22 |
| Lint | ESLint 7 with `eslint-config-airbnb`. `git-commit-msg-linter` checks commit messages after install |
| Types | TypeScript 4 is a dev dependency and `tsconfig.json` sets `allowJs`. Application code is JavaScript (`.js` / `.jsx`) |
| License | MIT, in `LICENSE` |

## How the calculation works

`calcDiscount(grossSalary, dependentsQty, pensionDiscount)` returns a `pt-BR` currency string. `calcMonthlyWithholding` is the same calculation as a number of reais with two decimal places. Amounts are converted to centavos before the arithmetic. `toCents` rounds half up. A non-finite input becomes 0 centavos. The gross salary is then floored at 0.

1. Legal deductions. R$ 189.59 per dependent (`discountByDependent`, 18,959 centavos), from Lei nº 9.250/1995, art. 4º, III, "i", plus the pension discount passed in. A non-finite or non-positive dependent count contributes nothing. The function does not compute an INSS contribution, and it has no argument for alimony or for the extra exemption on retirement income of a person aged 65 or older.
2. Simplified monthly discount. R$ 607.20 (`simplifiedMonthlyDiscount`), which is 25% of the top of the zero-rate bracket (R$ 2,428.80), Lei nº 9.250/1995, art. 4º, § 2º. The deduction actually subtracted is the greater of that amount and the legal deductions. The two are not added together.
3. Calculation base. `max(0, taxable income − deduction)`, in centavos.
4. Progressive table. The first row whose `maxCents` is greater than or equal to the base supplies the rate and the parcela a deduzir. Tax from the table is `round(base × rate / 100) − parcela`, and it is floored at 0. A base of 0 yields 0.
5. Monthly reduction, Lei nº 15.270/2025, art. 2º, which added Lei nº 9.250/1995, art. 3º-A. The income compared with the limits, and multiplied by 0.133145, is the taxable monthly income (the gross salary argument), not the base after deductions. The reduction cannot exceed the table tax.
6. Withholding is `max(0, table tax − reduction) / 100`.
7. `formatCurrency` uses `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` with two fraction digits. Grouping is `.`, the decimal separator is `,`, and the space after `R$` is a non-breaking space (U+00A0).

### Progressive table

Lei nº 15.191, de 11 de agosto de 2025, art. 2º, rewrote the monthly brackets in Lei nº 11.482/2007, art. 1º, XII. Those brackets have applied since May 2025 and are the monthly table the Receita Federal publishes for 2026. The last row is "acima de R$ 4.664,68", so its floor in this file is the next centavo, R$ 4,664.69. A base of exactly R$ 4,664.68 stays on the 22.5% row.

| Calculation base (R$) | Rate | Parcela a deduzir (R$) |
| --- | ---: | ---: |
| Up to 2,428.80 | 0% | 0.00 |
| 2,428.81 – 2,826.65 | 7.5% | 182.16 |
| 2,826.66 – 3,751.05 | 15% | 394.16 |
| 3,751.06 – 4,664.68 | 22.5% | 675.49 |
| 4,664.69 and above | 27.5% | 908.73 |

### Lei nº 15.270/2025 reduction

In force from January 2026. The cap of R$ 312.89 is the table tax on a base that has already had the R$ 607.20 simplified discount removed from R$ 5,000.00, which is why income up to R$ 5,000.00 withholds nothing.

| Taxable monthly income (R$) | Reduction |
| --- | --- |
| Up to 5,000.00 | Up to 312.89, so the tax due is zero |
| 5,000.01 – 7,350.00 | 978.62 − (0.133145 × taxable monthly income) |
| Above 7,350.00 | None |

The phase-out uses the integer ratio 133,145 / 1,000,000. `Math.round` is applied to `(133145 × income in centavos) / 1_000_000`, and that result is subtracted from 97,862 centavos.

A pension discount larger than the salary produces a base of 0 and withholding of R$ 0,00.

## Usage

Arguments are numbers, in reais.

```js
import calcDiscount, { calcMonthlyWithholding } from './src/core/irrfCalc';

calcDiscount(3000, 0, 277.4);     // R$ 0,00
calcDiscount(998, 2, 74.85);      // R$ 0,00
calcDiscount(5500, 0, 628.95);    // R$ 184,49
calcMonthlyWithholding(6000, 0, 649.6); // 382.88
calcDiscount(7607.2, 0, 0);       // R$ 1.016,27
```

`calcDiscount(3000, 0, 277.4)` withholds nothing. The pension discount of R$ 277.40 is below R$ 607.20, so the simplified discount is the one subtracted. The base is 3,000.00 − 607.20 = 2,392.80, inside the 0% bracket, and the income is below R$ 5,000.00.

`calcDiscount(998, 2, 74.85)` is the first record in `src/Data/pessoas.json`. Two dependents are 189.59 × 2 = 379.18. Added to the pension discount of 74.85 that is 454.03, still below 607.20, so the simplified discount is used. The base is 998.00 − 607.20 = 390.80, in the 0% bracket. The result is R$ 0,00.

`calcDiscount(5500, 0, 628.95)` is the record with salary 5,500 and discount 628.95. The pension discount is larger than R$ 607.20, so it is the deduction. The base is 4,871.05, on the 27.5% row: 4,871.05 × 0.275 − 908.73 = 430.81. Income of R$ 5,500.00 is inside the phase-out: 978.62 − 0.133145 × 5,500 = 246.32. Withholding is 430.81 − 246.32 = R$ 184.49.

Receita Federal's fourth worked example for Lei nº 15.270/2025 is `calcMonthlyWithholding(6000, 0, 649.6)`, which returns 382.88. The pension discount of 649.60 wins over the simplified discount. The base is 5,350.40 and the table tax is 562.63. The reduction multiplies 0.133145 by the gross income of 6,000, not by that base: 978.62 − 798.87 = 179.75, and 562.63 − 179.75 = 382.88. Using the base in the phase-out formula would produce 296.38 instead. The fifth example, income of 7,607.20 with no pension discount and no dependents, is above R$ 7,350.00, so there is no reduction. The simplified discount leaves a base of 7,000.00, and the table tax is R$ 1,016.27.

`src/Data/pessoas.json` lists five people with `nome`, `cpf`, `salario`, `desconto`, and `dependentes`. `desconto` is the pension-discount input. The application does not import this file.

### Employee list

`src/core/employee.js` exports `addEmployee`, `updateEmployee`, and `deleteEmployee`. Adding concatenates the record. Updating and deleting find an entry with `findIndex` on `employee.name` and splice the copy. The Redux reducer in `src/infra/store/employee/employeeReducer.js` starts at `{ employees: [] }` and handles the actions `insert`, `update`, and `remove` by calling those three functions. The store mounts the reducer as `employee`. No view dispatches the actions. Records in `pessoas.json` use `nome`, so they do not match the `name` comparison those helpers use.

`listEmployees` in `src/core/employee.js` returns `employees.map()` with no callback. The reducer file exports a different `listEmployees`, built with `createSelector`.

## Running locally

`yarn start` and `yarn build` go through `scripts/react-scripts.js`. That wrapper turns on Node's OpenSSL legacy provider, because Create React App 4 (webpack 4) hashes with MD4 and Node.js 17 and later ship OpenSSL 3. It also preloads `scripts/sass-loader-expanded.js`, which asks Dart Sass for expanded CSS. Bootstrap's compressed `calc()` has no spaces around `*`, and the PostCSS 7 bundled with this Create React App version cannot parse it. cssnano still minifies the finished CSS. `quietDeps` hides Bootstrap's Sass deprecation warnings.

`yarn test` calls `react-scripts test` directly and does not go through that wrapper.

Continuous integration runs on Node.js 22. The same major version is what the scripts were written for.

```bash
yarn install
yarn start
```

`yarn start` serves the app at [http://localhost:3000](http://localhost:3000) and reloads when files change. The page shows the placeholder header and a static three-column table. The same script names work with npm (`npm install`, `npm start`); the lockfile in the repo is Yarn's.

```bash
yarn build
```

`yarn build` writes the production bundle to `build/`.

## Tests

```bash
yarn test --watchAll=false
```

`yarn test` starts Jest in watch mode. Pass `--watchAll=false`, or set `CI=true`, to run once and exit. That is the command in CI.

| File | What it covers |
| --- | --- |
| `src/core/irrfCalc.spec.js` | The 2026 brackets, including R$ 4,664.68 on the 22.5% row and R$ 4,664.69 on the 27.5% row; the R$ 189.59 dependent deduction; the R$ 607.20 simplified discount, including that it replaces the legal deductions instead of stacking on them; pension discounts above, below, and equal to that discount; the reduction at R$ 5,000.00, through the phase-out, and from R$ 7,350.00 upward; the five Receita Federal worked examples; and `calcDiscount` formatting (`R$ 382,88` and `R$ 1.016,27`). |
| `src/App.test.js` | Renders `<App />` and expects the level-1 heading named `header`. |
| `src/core/employee.spec.js` | Add, update, and delete. `getEmployees` calls `fs.readFile('./customer.json', ...)` and returns before that read finishes, so the cases run against an empty list. The sample file in the repo is `src/Data/pessoas.json`. Each case is declared with the comma operator: `const newEmployee = { ... }, newEmployees = addEmployee(...)`. |

`src/setupTests.js` imports `@testing-library/jest-dom`. `.eslintignore` excludes `*.spec*` and `*.test*`.

The calculation file on its own:

```bash
yarn test --watchAll=false src/core/irrfCalc.spec.js
```

## Continuous integration

`.github/workflows/test.yml` is the `Tests` workflow. It runs on every `push` and `pull_request`, with `contents: read`. The `test` job uses `ubuntu-latest`:

1. `actions/checkout@v4`
2. `actions/setup-node@v4` with Node.js 22 and the Yarn cache
3. `yarn install --frozen-lockfile`
4. `yarn test --watchAll=false`

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Paulo Cheloni.

## Layout

```
src/core/irrfCalc.js                         2026 monthly withholding
src/core/irrfCalc.spec.js                    table, deductions, reduction, Receita examples
src/Data/irrfData.js                         2026 brackets, R$ 189.59, R$ 607.20, reduction
src/Data/pessoas.json                        five sample people; the UI does not load them
src/core/employee.js                         add, update, and delete by name
src/core/employee.spec.js                    employee-list test
src/infra/store/store.js                     Redux Toolkit store
src/infra/store/employee/employeeReducer.js  insert, update, and remove
src/infra/Router/Router.jsx                  BrowserRouter and the `/` route
src/infra/views/Home.jsx                     header and table
src/presentation/components/Header           renders the text "header"
src/presentation/components/Table            static columns "um", "dois", "tres"
src/presentation/assets/_custom.scss         Bootstrap entry
scripts/react-scripts.js                     OpenSSL legacy provider and Sass preload
scripts/sass-loader-expanded.js              expanded Sass output for Bootstrap
.github/workflows/test.yml                   Node 22 unit tests on push and pull request
LICENSE                                      MIT, copyright (c) 2026 Paulo Cheloni
public/index.html                            document title "React App"
```
