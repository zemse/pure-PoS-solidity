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
      /// @dev this is first test case of this collection
      it('should change storage value to a new value', async () => {
        await stakingInstance.functions.stake({
          value: ethers.utils.parseEther('1'),
        });

        /// @dev now get the value at storage
        const currentStakes = await stakingInstance.functions.getAllStakes();

        /// @dev then comparing with expectation value
        assert.ok(
          currentStakes[0].amount.eq(ethers.utils.parseEther('1')),
          'staked value should be correct in the contract storage'
        );
      });
    });
  });
