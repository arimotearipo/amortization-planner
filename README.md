# Things to Build
- [x] Form for user to enter principal, interest rate, term
- [x] Table to display monthly repayment rates
- [x] Input to adjust the montly repayment rate
- [x] Input to set investment rate (should user want to split extra payments to other investments)

# Amortization Planner

Amortization Planner is a web-based tool that helps users plan and visualize their loan amortization schedules. Whether you're considering a mortgage, car loan, or any other type of installment loan, this app allows you to input your loan details and see a detailed breakdown of payments over time.

## Features

- **Interactive Loan Calculator:** Enter principal, interest rate, term, and start date to generate a custom amortization schedule.
- **Amortization Table:** View a month-by-month breakdown of principal, interest, and remaining balance.
- **Visual Charts:** Graphical representation of payment breakdown and loan payoff progress (planned feature).
- **Modern UI:** Built with Next.js and styled for a clean, user-friendly experience.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher recommended)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/arimotearipo/amortization-planner.git
cd amortization-planner
bun install
```

### Running the App

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## Usage

1. Enter your loan amount, interest rate, term (in years or months), and start date.
2. Click "Calculate" to generate your amortization schedule.
3. Review the table and charts to understand your payment breakdown and payoff timeline.

## Project Structure

- `src/app/` - Main application code (pages, components, styles)
- `public/` - Static assets (SVGs, icons)
- `package.json` - Project dependencies and scripts

*Created by [arimotearipo](https://github.com/arimotearipo)*
