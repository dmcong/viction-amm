// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "vrc25/contracts/VRC25.sol";

contract Amm is VRC25 {
  VRC25 public tokenApple;
  VRC25 public tokenPotato;
  uint public reserveApple;
  uint public reservePotato;

  constructor() VRC25("VictionAmm", "AMM", 9) {}

  function initialLiquiditySetup(
    address _tokenApple,
    address _tokenPotato,
    uint _amountApple,
    uint _amountPotato
  ) public {
    tokenApple = VRC25(_tokenApple);
    tokenPotato = VRC25(_tokenPotato);

    tokenApple.transferFrom(msg.sender, address(this), _amountApple);
    tokenPotato.transferFrom(msg.sender, address(this), _amountPotato);

    reserveApple = _amountApple;
    reservePotato = _amountPotato;
  }

  function swapPotatoToApple(uint amountPotato) public {
    tokenPotato.transferFrom(msg.sender, address(this), amountPotato);
    uint amountApple = getAmountOut(amountPotato, reservePotato, reserveApple);
    reservePotato -= amountPotato;
    reserveApple += amountApple;
    tokenApple.transfer(msg.sender, amountApple);
  }

  function getAmountOut(
    uint amountIn,
    uint reserveIn,
    uint reserveOut
  ) public pure returns (uint) {
    uint k = reserveIn * reserveOut;
    uint amountOut = k / (reserveIn + amountIn);
    return amountOut;
  }

  function _estimateFee(
    uint256 value
  ) internal view virtual override returns (uint256) {
    return value * 0;
  }
}
