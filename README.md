# IRRF

Imposto de Renda Retido na Fonte (IRRF) is the income tax Brazilian employers withhold from a paycheck each month and remit to the Receita Federal. The tax is progressive: the calculation base falls into one bracket, that bracket's rate is applied to the whole base, and a fixed amount (the *parcela a deduzir*) is subtracted so the higher rate applies only above the bracket floor. This repository calculates that monthly withholding from a gross salary, a pension discount, and a number of dependents. The calculation is the pure function `calcDiscount` in `src/core/irrfCalc.js`. The surrounding app is a React 17 project created with Create React App: it already mounts a Redux store and a single route, and the page itself is a placeholder header plus a static table. The page does not call `calcDiscount`.

## Tech stack

| Piece | In this repo |
| --- | --- |
| UI | React 17.0.2 and React DOM, mounted with `ReactDOM.render` |
| Build | Create React App 4 (`react-scripts` 4.0.3). The lockfile is `yarn.lock` |
| Routing | React Router 5. The only route is `/`, and it renders `Home` |
| State | Redux Toolkit 1.6 and React Redux 7. The employee reducer imports Reselect 4 |
| Styles | Bootstrap 5, compiled with `node-sass` 6 from `src/presentation/assets/_custom.scss` |
| Tests | Jest and Testing Library, started by `react-scripts test` |
| Lint | ESLint 7 with `eslint-config-airbnb`. `git-commit-msg-linter` checks commit messages after install |
| Types | TypeScript 4 is a dev dependency and `tsconfig.json` sets `allowJs`. Application code is JavaScript (`.js` / `.jsx`) |

## How the calculation works

`calcDiscount(grossSalary, dependentsQty, pensionDiscount)` uses the constants in `src/Data/irrfData.js`.

1. Dependent deduction: `164.56 × dependentsQty` (`discountByDependent`).
2. Calculation base: `grossSalary − pensionDiscount − dependent deduction`. The pension discount is an argument. This function does not derive an INSS contribution.
3. Bracket. `progressiveTable` is scanned in order. The first row with `min <= base <= max` supplies `tax` (a percent) and `discount` (the parcela a deduzir). The scan is `Array.prototype.every`, which stops by returning `false` on the matching row.
4. Withholding: `(base × tax / 100) − discount`.
5. Format. `formatCurrency` uses `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` with two fraction digits. The return value is that string: grouping with `.`, decimals with `,`, and a non-breaking space (U+00A0) between `R$` and the amount.

| Calculation base (R$) | Rate | Parcela a deduzir (R$) |
| --- | ---: | ---: |
| 0.00 – 1,903.98 | 0% | 0.00 |
| 1,903.99 – 2,826.65 | 7.5% | 142.80 |
| 2,826.66 – 3,751.05 | 15% | 354.80 |
| 3,751.06 – 4,664.68 | 22.5% | 636.13 |
| 4,664.68 and above | 27.5% | 869.36 |

The last row's `min` is `4664.68`, the same number as the previous row's `max`. The 22.5% row is tested first, so a base of exactly 4,664.68 uses 22.5% and 636.13. Any larger base uses 27.5% and 869.36.

A base below 0 matches no row. `tax` and `discount` stay undefined, and the formatted result is `R$ NaN`.

### Which table is compiled in

The five brackets and the parcelas `142.80`, `354.80`, `636.13`, and `869.36` are the monthly IRRF table in force from April 2015 through April 2023. The dependent deduction of R$ 164.56 is the amount for calendar year 2012 (Lei nº 12.469/2011). The deduction that accompanied the April 2015 brackets was R$ 189.59. There is no simplified monthly discount and no further reduction of the tax. The monthly table the Receita Federal publishes for 2026 (Lei nº 15.191/2025, from January 2026, together with the reduction in Lei nº 15.270/2025) has a different exempt floor and different parcelas. The figures in `src/Data/irrfData.js` are historical fixtures.

## Usage

Arguments are numbers, in reais. The return value is a `pt-BR` currency string.

```js
import calcDiscount from './src/core/irrfCalc';

calcDiscount(3000, 0, 277.4);    // R$ 61,39
calcDiscount(998, 2, 74.85);     // R$ 0,00
calcDiscount(5500, 0, 628.95);   // R$ 470,18
```

The first call is the case in `src/core/irrfCalc.spec.js`:

- Gross salary `3000`, dependents `0`, pension discount `277.40`.
- Base = 3000 − 277.40 − 0 = **2,722.60**.
- 2,722.60 sits in 1,903.99–2,826.65: rate 7.5%, parcela 142.80.
- 2,722.60 × 0.075 − 142.80 = **61.395**, formatted as **R$ 61,39**.

The second call is the first record in `src/Data/pessoas.json` (salary 998, discount 74.85, 2 dependents):

- Dependent deduction = 164.56 × 2 = 329.12.
- Base = 998 − 74.85 − 329.12 = **594.03**, which is in the 0% bracket.
- Result **R$ 0,00**.

The third call is the record with salary 5500, discount 628.95, and 0 dependents:

- Base = 5500 − 628.95 = **4,871.05**, above 4,664.68.
- 4,871.05 × 0.275 − 869.36 = **470.17875**, formatted as **R$ 470,18**.

`src/Data/pessoas.json` lists five people with `nome`, `cpf`, `salario`, `desconto`, and `dependentes`. `desconto` is the pension-discount input. The application does not import this file.

### Employee list

`src/core/employee.js` exports `addEmployee`, `updateEmployee`, and `deleteEmployee`. Adding concatenates the record. Updating and deleting find an entry with `findIndex` on `employee.name` and splice the copy. The Redux reducer in `src/infra/store/employee/employeeReducer.js` starts at `{ employees: [] }` and handles the actions `insert`, `update`, and `remove` by calling those three functions. The store mounts the reducer as `employee`. No view dispatches the actions. Records in `pessoas.json` use `nome`, so they do not match the `name` comparison those helpers use.

`listEmployees` in `src/core/employee.js` returns `employees.map()` with no callback. The reducer file exports a different `listEmployees`, built with `createSelector`.

## Running locally

Use Node.js 16. `react-scripts` 4.0.3 and `node-sass` 6.0.1 belong to that Node generation. On Node 17 and later, webpack 4 fails with `error:0308010C:digital envelope routines::unsupported`, and `node-sass` 6 has no matching prebuilt binary.

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

`yarn test` is `react-scripts test`, which starts Jest in watch mode. Pass `--watchAll=false`, or set `CI=true`, to run once and exit.

| File | Behavior |
| --- | --- |
| `src/core/irrfCalc.spec.js` | Calls `calcDiscount(3000, 0, 277.40)` and expects `formatCurrency(61.39)`. |
| `src/App.test.js` | Create React App sample. Renders `<App />` and queries for the text "learn react". The rendered page is the header and the static table. |
| `src/core/employee.spec.js` | Calls `fs.readFile('./customer.json', ...)` and returns the empty array before the read finishes. The sample data file in the repo is `src/Data/pessoas.json`. Each case is declared with the comma operator: `const newEmployee = { ... }, newEmployees = addEmployee(...)`. |

`src/setupTests.js` imports `@testing-library/jest-dom`. `.eslintignore` excludes `*.spec*` and `*.test*`.

The calculation test on its own:

```bash
yarn test --watchAll=false src/core/irrfCalc.spec.js
```

## Layout

```
src/core/irrfCalc.js                         monthly withholding
src/core/irrfCalc.spec.js                    calculation test
src/Data/irrfData.js                         brackets, R$ 164.56, currency formatter
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
public/index.html                            document title "React App"
```
