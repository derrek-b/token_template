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
        require(_transfer(msg.sender, _to, _value), 'Transaction failed.');

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0), "Invalid 'spender' address.");

        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(allowance[_from][msg.sender] >= _value, 'Insufficient allowance.');

        require(_transfer(_from, _to, _value), 'Transaction failed');

        allowance[_from][msg.sender] >= _value ? allowance[_from][msg.sender] -= _value : allowance[_from][msg.sender] = 0;

        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, 'Insufficient balance.');
        require(_to != address(0), "Invalid 'to' address.");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
