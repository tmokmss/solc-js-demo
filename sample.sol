//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DemoContract is ERC1155, Ownable {
    string public name;

    constructor(string memory _name, string memory _uri) ERC1155(_uri) {
        name = _name;
    }
}
