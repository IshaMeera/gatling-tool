# Performance Testing with Gatling JS

This project contains Gatling JavaScript simulations for load and performance testing APIs.

## Prerequisites

Install the following:

* Node.js v20+ (LTS recommended)
* npm v10+

Verify installation:

```bash
node -v
npm -v
```

## Project Setup

Install dependencies:

```bash
npm install
```

## Running Simulations

Run a specific simulation:

```bash
npx gatling run --simulation forgotPasswordSimulation
```

Example:

```bash
npx gatling run --simulation loginSimulation
npx gatling run --simulation forgotPasswordSimulation
npx gatling run --simulation registrationSimulation
```

## Project Structure

```text
.
├── simulations/
│   ├── forgotPasswordSimulation.js
│   ├── loginSimulation.js
│   └── registrationSimulation.js
├── resources/
├── package.json
└── README.md
```

## NPM Scripts

Available helper commands:

```bash
npm run clean          # Remove generated reports
npm run build          # Build Gatling bundle
npm run forgotPassword # Run Forgot Password simulation
npm run login          # Run Login simulation
```

Example package.json scripts:

```json
{
  "scripts": {
    "forgotPassword": "gatling run --simulation forgotPasswordSimulation",
    "login": "gatling run --simulation loginSimulation"
  }
}
```

## Reports

After execution, Gatling generates an HTML report containing:

* Total requests
* Successful requests
* Failed requests
* Response times
* Percentiles
* Throughput

Open the generated report in a browser to analyze results.

## Recording User Flows

Launch the Gatling Recorder:

```bash
npx gatling recorder
```

Use the recorder to capture browser interactions and generate simulation templates.

## Help

View available Gatling commands:

```bash
npx gatling --help
npx gatling run --help
```
