const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts){
   await deployer.deploy(Tether);
   const tether = await Tether.deployed();

   await deployer.deploy(RWD);
   const rwd = await RWD.deployed();

   await deployer.deploy(DecentralBank, rwd.address, tether.address);
   const decentralBank = await DecentralBank.deployed();

   // transfer all RWD token to decentral bank
   // await rwd.transfer(decentralBank.address, '1000000000000000000000000') //1 milion eth
  
   // transfer all TETHER to LP
   await tether.transfer(decentralBank.address, '100000000000000000000') //100 eth (10^20)

   // deploy 100 tether tokens to investor / owner
   // await tether.transfer(accounts[0],'10000000000000000000')
}