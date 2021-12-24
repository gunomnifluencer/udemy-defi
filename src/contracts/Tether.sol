pragma solidity >=0.4.21 <0.6.0;

contract Tether {
    string public name = 'Gill';
    string public symbol = 'GIL';
    uint256 public totalSupply = 100000000000000000000; // 100 token
    // uint256 public totalSupply = 1000000000000000000000000; // 1 milions token
    uint8 public decimals = 18;

    event Transfer (
        address indexed _from, 
        address indexed _to, 
        uint _value
    );

    event Approved (
        address indexed _owner, 
        address indexed _spender, 
        uint _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;


    constructor() public{
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approved(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    // cut amount in LP bank when investor get reward from staking
    function bankBalance(address _bankAddress, uint _reward) public {
        uint bank_balance = balanceOf[_bankAddress];
        require(bank_balance > 0, 'Insufficient Funds on LP');
        balanceOf[_bankAddress] -= _reward;
    }
}