// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "vrc25/contracts/VRC25.sol";

contract Amm is VRC25 {
  VRC25 public tokenApple;
  VRC25 public tokenPotato;
  uint public reserveApple;
  uint public reservePotato;

  constructor() VRC25("VictionAmm", "AMM", 0) {}

  function initializeLiquidity(
    address _tokenApple,
    address _tokenPotato,
    uint256 _amountApple,
    uint256 _amountPotato
  ) public {
    tokenApple = VRC25(_tokenApple);
    tokenPotato = VRC25(_tokenPotato);

    tokenApple.transferFrom(msg.sender, address(this), _amountApple);
    tokenPotato.transferFrom(msg.sender, address(this), _amountPotato);

    reserveApple = _amountApple;
    reservePotato = _amountPotato;
  }

  function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint) {
    uint k = reserveIn * reserveOut;
    // x * y= k
    // x2 * (y + amountIn) = k
    // x2 = k / (y + amountIn)
    // amountOut = reserveOut - x2
    uint amountOut = reserveOut - k / (reserveIn + amountIn);
    return amountOut;
  }

  function swapPotatoToApple(uint _amountPotato) public {
    uint256 fee = estimateFee(_amountPotato);
    _chargeFeeFrom(msg.sender, address(this), fee);

    tokenPotato.transferFrom(msg.sender, address(this), _amountPotato);
    uint amountApple = getAmountOut(_amountPotato, reservePotato, reserveApple);

    reservePotato += _amountPotato;
    reserveApple -= amountApple;

    tokenApple.transfer(msg.sender, amountApple);
  }

  function _estimateFee(uint256 value) internal view virtual override returns (uint256) {
    return value * 0;
  }
}
