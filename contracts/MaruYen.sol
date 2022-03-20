// contracts/MaruYen.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "..\node_modules\@openzeppelin\contracts\token\ERC20\ERC20.sol";

contract MaruYen is ERC20 {
    constructor() ERC20("MaruYen", "丸円") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function decimals() public view override returns (uint8) {
        return 0;
    }
}
