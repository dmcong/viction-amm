// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "vrc25/contracts/VRC25.sol";

contract MyToken is VRC25 {
  constructor() VRC25("MyToken", "MTK", 0) {
    _mint(msg.sender, 10000);
  }

  function _estimateFee(uint256 value) internal view virtual override returns (uint256) {
    return value * 0;
  }
}
