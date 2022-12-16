# Contracts

This folder contains all contracts for the application. Each subfolder is for a specific blockchain and should contain the entire contract code with unit and integration tests for that chain.

All contracts must follow a similar structure across chains and implement the same interface through a ts_client.

All contracts must implement a seed deploy script to deploy instances to a testnet and a test script to perform all contract tests. Those will be used by CI to check code.