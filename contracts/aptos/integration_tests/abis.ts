// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable max-len */

/*
Follow these steps to get the ABI strings:
Go to the package directory of the relevant Move module, e.g. if you're trying
to get the ABI for the `transfer` function of `aptos_account.move`, go to
the directory `aptos-move/framework/aptos-framework`.
Compile the Move packages with the Aptos CLI:
```
aptos move compile --included-artifacts all
```
This `--included-artifacts all` argument is necessary to generate ABIs.
Find the ABI files under the `build` directory and convert the ABI files to hex strings.
On Mac and Linux, this can be done with this command:
```
cat <ABI_FILE_PATH> | od -v -t x1 -A n | tr -d ' \n'
```
For example:
```
cat build/AptosFramework/abis/aptos_account/transfer.abi | od -v -t x1 -A n | tr -d ' \n'
```
*/
export const AUCTIONHOUSE_ABIS = [];