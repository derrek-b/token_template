// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Token {
    address public owner;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public allowMint;

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

    event Mint(
        address indexed minter,
        uint256 value
    );

    event Burn(
        address indexed burner,
        uint256 value
    );

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        owner = msg.sender;

        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply * (10 ** decimals);

        balanceOf[owner] = totalSupply;
        allowMint[owner] = true;
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

        allowance[_from][msg.sender] -= _value;

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

    function mint(address _to, uint256 _value) public returns (bool success) {
        require(allowMint[msg.sender] == true, 'Unauthorized minter.');

        balanceOf[_to] += _value;
        totalSupply += _value;

        emit Mint(_to, _value);

        return true;
    }

    function setAllowMint(address _minter, bool _allowMint) public returns (bool success) {
        require(msg.sender == owner, 'Unauthorized caller.');
        require(_minter != address(0), 'Invalid minter address.');

        allowMint[_minter] = _allowMint;

        return true;
    }

    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, 'Insufficient balance.');

        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;

        emit Burn(msg.sender, _value);

        return true;
    }
}
