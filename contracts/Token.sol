// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

contract Token {
    address public owner;

    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        owner = msg.sender;

        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * 10 ** decimals;

        balanceOf[owner] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, 'Insufficient balance.');

        require(_transfer(msg.sender, _to, _value), 'Transaction failed.');

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {

    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {

    }

    function _transfer(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Invalid 'to' address.");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
