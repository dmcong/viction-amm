// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "vrc25/contracts/VRC25.sol";

contract Amm is VRC25 {
  constructor() VRC25("VictionAmm", "AMM", 9) {}

  function _estimateFee(uint256 value) internal view virtual override returns (uint256) {
    return value * 0;
  }
}
