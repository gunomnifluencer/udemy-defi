pragma solidity >=0.4.21 <0.6.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    // for staking investor's fund
    function depositTokens(uint _amount) public {
        require(_amount > 0, "amount need to greater than 0"); 
       
        // transfer tether token to contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);
        // updating staking
        stakingBalance[msg.sender] += _amount;

        // if investor / user doesn't staking
        if(!hasStaked[msg.sender])
        {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstake token
    function unstakeTokens() public {
        // get balance from investor
        uint balance = stakingBalance[msg.sender];

        require(balance > 0, "staking balance cannot be less than 0");

        // transfer balance to investor
        tether.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // reset status staking
        isStaking[msg.sender] = false;
    }

    function issueTokens() public {
        require(msg.sender == owner,'Caller must be owner');
        for(uint i=0; i < stakers.length; i++)
        {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; // for incentive
            if(balance > 0)
            {
                rwd.transfer(recipient,balance);
            }
        }
    }

}