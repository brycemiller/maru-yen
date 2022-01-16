// contracts/MaruYen.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "..\node_modules\@openzeppelin\contracts\token\ERC20\ERC20.sol";

contract MaruYen is ERC20 {
    constructor(uint256 initialSupply) ERC20("MaruYen", "MARY") {
        _mint(msg.sender, initialSupply);
    }
}
