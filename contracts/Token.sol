// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract Token {
    address public owner;

    string public name;
    string public symbol;
    uint public decimals = 18;
    uint public maxSupply;

    mapping (address => uint) public balanceOf;

    constructor(string memory _name, string memory _symbol, uint _maxSupply) {
        owner = msg.sender;

        name = _name;
        symbol = _symbol;
        maxSupply = _maxSupply * 10 ** decimals;

        balanceOf[owner] = maxSupply;
    }

    function transfer(address _to, uint _amount) public returns (bool success) {
        require(balanceOf[msg.sender] >= _amount, 'Insufficient balance.');

        require(_transfer(msg.sender, _to, _amount), 'Transaction failed.');

        return true;
    }

    function _transfer(address _from, address _to, uint _amount) public returns (bool success) {
        require(_to != address(0), "Invalid 'to' address.");

        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;

        return true;
    }
}
