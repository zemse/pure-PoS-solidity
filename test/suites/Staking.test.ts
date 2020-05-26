/*
  Author: Soham Zemse (https://github.com/zemse)

  In this file you should write tests for your smart contract as you progress in developing your smart contract. For reference of Mocha testing framework, you can check out https://devdocs.io/mocha/.
*/

/// @dev importing packages required
import assert from 'assert';
import { ethers } from 'ethers';

/// @dev importing build file
const stakingJSON = require('../../build/Staking_Staking.json');

/// @dev initialize file level global variables, you can also register it global.ts if needed across files.
let stakingInstance: ethers.Contract;

const stakingAmount: ethers.BigNumber = ethers.utils.parseEther('20');
const NUMBER_OF_STAKINGS = 10;

const TRIALS = 50;
let trialCount = 0;
const chanceCount: { [key: string]: number[] } = {};

/// @dev this is another test case collection
export const StakingContract = () =>
  describe('Staking Contract', () => {
    /// @dev describe under another describe is a sub test case collection
    describe('Staking Setup', async () => {
      /// @dev this is first test case of this collection
      it('deploys Staking contract from first account', async () => {
        /// @dev you create a contract factory for deploying contract. Refer to ethers.js documentation at https://docs.ethers.io/ethers.js/html/
        const stakingContractFactory = new ethers.ContractFactory(
          stakingJSON.abi,
          stakingJSON.evm.bytecode.object,
          global.provider.getSigner(global.accounts[0])
        );
        stakingInstance = await stakingContractFactory.deploy();

        assert.ok(stakingInstance.address, 'conract address should be present');
      });
    });

    describe('Staking Functionality', async () => {
      [...Array(NUMBER_OF_STAKINGS).keys()].forEach((i) => {
        it(`stake ${ethers.utils.formatEther(
          stakingAmount
        )} ETH from Account ${i} in the contract`, async () => {
          const _stakingInstance = stakingInstance.connect(
            global.provider.getSigner(global.accounts[i])
          );
          await _stakingInstance.functions.stake({
            value: stakingAmount,
          });

          /// @dev now get the value at storage
          const currentStakes = await stakingInstance.functions.getAllStakes();

          /// @dev then comparing with expectation value
          assert.ok(
            currentStakes[i].amount.eq(stakingAmount),
            'staked amount should be correct in the contract storage'
          );
        });
      });

      it('number of stakings should be correct', async () => {
        const stakings = await stakingInstance.functions.getAllStakes();
        assert.strictEqual(stakings.length, NUMBER_OF_STAKINGS);
      });
    });

    describe('Pseudo Random Generator', () => {
      it('random number with different seeds should return different values', async () => {
        const rn0: ethers.BigNumber = await stakingInstance.functions.randomNumber(
          0
        );
        const rn1: ethers.BigNumber = await stakingInstance.functions.randomNumber(
          1
        );

        assert.ok(!rn0.eq(rn1), 'should not be equal');
      });

      it(`sample 100 trials on getRandomValidator (same block hash)`, async () => {
        const counts: number[] = new Array(10).fill(0);
        const trials = 100;
        for (let i = 0; i < trials; i++) {
          const index: ethers.BigNumber = await stakingInstance.functions.getRandomValidator(
            i
          );
          counts[index.toNumber()]++;
        }
        console.log(counts);

        counts.forEach((count) =>
          assert.ok(count > 0, 'each one should get a chance')
        );
      });

      [...Array(10).keys()].forEach((testNumber) => {
        it(`calling updateValidators 100 times`, async () => {
          await stakingInstance.functions.updateValidators();
          // Object.values(chanceCount).forEach((val) => {
          //   if (val) val[0] = 0;
          // });

          for (let i = 0; i < TRIALS; i++) {
            await stakingInstance.functions.updateValidators();
            const validatorSet: string[] = await stakingInstance.functions.getAllValidators();
            // console.log(validatorSet);
            validatorSet.forEach((address) => {
              if (!(address in chanceCount)) {
                chanceCount[address] = [];
              }
              while (chanceCount[address].length < testNumber + 1) {
                chanceCount[address].push(0);
              }
              chanceCount[address][testNumber]++;
            });
          }
          trialCount += TRIALS;

          // Printing results
          console.log(`Trials until now: ${trialCount}`);
          Object.entries(chanceCount).forEach((entry) => {
            console.log(
              `${entry[0]}: ${entry[1].join(' ')} = ${entry[1].reduce(
                (total, num) => total + num,
                0
              )}`
            );
          });

          const lastValidatorUpdatedBlock = await stakingInstance.functions.astValidatorUpdatedBlock();
          const currentBlock = await global.provider.getBlockNumber();
          assert.ok(
            lastValidatorUpdatedBlock.eq(currentBlock),
            'lastValidatorUpdatedBlock should be updated'
          );
          Object.entries(chanceCount).forEach((entry) => {
            assert.ok(
              entry[1][testNumber] > 0,
              'should have mined at least one block'
            );
          });
        });
      });
    });
  });
