// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;

contract Staking {
  struct Stake {
    address staker;
    uint256 amount;
    uint256 adjusted;
  }

  Stake[] public stakes;
  uint256 public totalAdjusted;

  event StakeAdded(uint256 _id);

  function stake() public payable {
    require(msg.value > 0, 'stake should be more than 0');

    // TODO: revert if less gas is sent

    uint256 _adjusted = adjust(msg.value);
    uint256 _stakeId = stakes.length;

    stakes.push(Stake({
      staker: msg.sender,
      amount: msg.value,
      adjusted: _adjusted
    }));

    totalAdjusted += _adjusted;

    emit StakeAdded(_stakeId);
  }

  function adjust(uint256 _amount) public pure returns (uint256) {
    return _amount;
  }
}