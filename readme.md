# Generic Cross Chain Auction Application

This is designed to be a generic NFT auctions application for blockchain. It is composed of a React Frontend to be deployed to Vercel, that might also host serverless functions AND smart contracts.

The front end is built generically to adapat to any chain's contract's and front end wallet applications.

# Requirements
Current requirements for running all tests and deploying app are:
1. [Node.js](https://nodejs.org/en/download/)
2. [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
3. [Aptos CLI](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli/) 

Install all packages to proceed with the tutorial.

# Folder structure
Each directory refers to a different component in the app.
1. web -> React app
2. contracts -> Smart contracts (contains one folder for each chain)
3. clients_config -> environment variables to costumize app and continuously deploy it to every client that has purchased it
4. .github -> CI/CD setup

# Run the app

To run the app in dev mode:

## Aptos chain
Go to contracts/aptos and perform: `yarn seed:devnet` 

after that executes you'll have a deployed version of the smart contract on the Aptos devnet chain.

Then go to web. You'll need to set the module and contract address that were printed to the console during `seed:devenet` to the `config/aptosConstants.ts` file.

Then run `yarn dev`, which will start a local development version of the app.