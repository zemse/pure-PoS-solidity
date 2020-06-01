// SPDX-License-Identifier: MIT

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

contract Staking {
  struct Stake {
    address staker;
    uint256 amount;
    uint256 adjusted;
  }

  Stake[] public stakes;
  uint256 public totalAdjusted;

  uint256 public lastValidatorUpdatedBlock;
  uint256 public blocksInterval = 1;
  address[5] public validatorSet;

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

  function updateValidators() public {
    require(blocksInterval + lastValidatorUpdatedBlock <= block.number, 'cannot update validators too early');

    address[5] memory _newValidatorSet;

    for(uint256 i = 0; i < 5; i++) {
      _newValidatorSet[i] = getLuckyStake(i).staker;
    }

    validatorSet = _newValidatorSet;
    lastValidatorUpdatedBlock = block.number;
  }

  function getLuckyStake(uint256 _seed) public view returns (Stake memory) {
    return stakes[geLuckyStakeIndex(_seed)];
  }

  function geLuckyStakeIndex(uint256 _seed) public view returns (uint256) {
    int256 _luckyStake = int256(randomNumber(_seed) % totalAdjusted);

    uint256 i = 0;
    while(_luckyStake > 0) {
      _luckyStake -= int256(stakes[i].adjusted);
      i++;
    }

    return i - 1;
  }

  function getAllStakes() public view returns(Stake[] memory) {
    return stakes;
  }

  function getAllValidators() public view returns(address[5] memory) {
    return validatorSet;
  }

  function randomNumber(uint256 _seed) public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), _seed)));
  }

  function adjust(uint256 _amount) public pure returns (uint256) {
    return _amount;
  }
}