# Pure PoS Solidity

This is an experimental smart contract logic that governs the selection of new validators based on Proof of Stake (PoS) for OpenEthereum's AuRa. Also, to discourage pools with extremely high stake and encourage split into more nodes, a quadratic power adjustment is to be used ([#7](https://github.com/zemse/pure-PoS-solidity/issues/7)).

> Note: This experiment is a work in progress and it is advised to not use these logics in production without a reliable audit.

Ongoing research work on this experiment is carried out in this repository's [issues](https://github.com/zemse/pure-PoS-solidity/issues). Suggestions, contributions and importantly, critics are greatly welcomed.

## Test Results in Brief

These tests can be used to better judge the PoS performance of the smart contract logic.

Situations in this test case:

- `10` ganache wallets are used
- Validator set of length `5`
- `500` validator sets are generated (`500 x 5 = 2500`)
- Entropy is dependent on previous block hash (for improvement [#10](https://github.com/zemse/pure-PoS-solidity/issues/10)).

| Wallet     | Staked (`ETH`) | % Stake | Blocks Mined | % Result |
| ---------- | -------------- | ------- | ------------ | -------- |
| `0xc5..7D` | 50.0           | 21.7%   | 557          | 22.28%   |
| `0x45..84` | 50.0           | 21.7%   | 518          | 20.72%   |
| `0x34..5d` | 25.0           | 10.8%   | 289          | 11.56%   |
| `0x0F..8d` | 25.0           | 10.8%   | 270          | 10.80%   |
| `0x02..09` | 20.0           | 8.6%    | 220          | 8.88%    |
| `0xB5..75` | 20.0           | 8.6%    | 205          | 8.20%    |
| `0x89..F7` | 10.0           | 4.3%    | 124          | 4.96%    |
| `0xB5..75` | 10.0           | 4.3%    | 111          | 4.44%    |
| `0xCa..a9` | 10.0           | 4.3%    | 107          | 4.28%    |
| `0x13..EB` | 10.0           | 4.3%    | 99           | 3.96%    |
| `Total`    | `230.0`        | `100%`  | `2500`       | `100%`   |

This is the result for 2500 blocks. It was observed that when performed smaller tests, it resulted in inaccurate values of `%Result`. Higher the number of blocks, the `%Result` approaches `%Stake`.

## Custom Tests

1. `git clone https://github.com/zemse/pure-PoS-solidity.git`
2. `cd pure-PoS-solidity`
3. `npm i`
4. If you want to flip staking amount values, just flip the numbers in `test/suites/Staking.test.ts` [Line #19](https://github.com/zemse/pure-PoS-solidity/blob/master/test/suites/Staking.test.ts#L17-L28)
5. `npm test`
