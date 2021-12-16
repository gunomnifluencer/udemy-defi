// const { assert } = require('console')

const RWD = artifacts.require('RWD')
const Tether = artifacts.require('Tether')
const DecentralBank = artifacts.require('DecentralBank')

require('chai').use(require('chai-as-promised')).should()

contract('DecentralBank', ([owner,customer]) => {
    let tether, rwd, decentralBank

    function tokens(number){
        return web3.utils.toWei(number,"ether")
    }

    before(async() => {
        // load contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address,tether.address)

        // Transfer all token to decentral bank
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer 100 mocks tether to customers
        await tether.transfer(customer, tokens('100'), {from : owner})

        // in case if there is buyerbuy from customer
        // await tether.transfer(buyer, tokens('100'), {from : customer})
    })

    // describe("debug owner and customer", async() => {
    //     it("debug owner", async() => {
    //         let customer_owner = buyer
    //         assert.equal(customer_owner,"aaaaa")
    //     })

    //     it("debug customer", async() => {
    //         let customer_name = customer
    //         assert.equal(customer_name,"aaaaa")
    //     })
    // })

    describe("Mock Deployment", async() => {
        it("Mock successfully deployed", async()=> {
            let mock = await tether.name()
            assert.equal(mock, 'Tether')
        })
    })

    describe("Decentral Bank Deployment", async() => {
        it("Matches name successfully", async() => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it("Contract has token", async()=>{
            let balance =  await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens("1000000"))
        })

        describe("Yield Farming", async() => {
            it("Reward tokens for staking", async() => {
                let result;
    
                //check investor balance
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(),tokens('100'),'Customer balance before staking')

                // check staking customer
                await tether.approve(decentralBank.address, tokens('100'), {from : customer})
                await decentralBank.depositTokens(tokens('100'),{from : customer})

                //check investor balance after staking
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(),tokens('0'),'Customer balance after staking')

                // check decentral bank
                bank = await tether.balanceOf(decentralBank.address)
                // bank = await decentralBank.stakingBalance(customer)
                assert.equal(bank.toString(),tokens('100'),'Decentral bank balance')

                //check is staking
                isstaking = await decentralBank.isStaking(customer)
                assert.equal(isstaking.toString(), 'true', 'Customer is staking')

                //issue token
                await decentralBank.issueTokens({from:owner})

                //ensure that only the owner that can issue token
                await decentralBank.issueTokens({from:customer}).should.be.rejected;

                // unstake token
                await decentralBank.unstakeTokens({from:customer})

                //check unstaking balance
            
                //check investor balance after staking
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(),tokens('100'),'Customer balance after unstaking')

                // check decentral bank
                bank = await tether.balanceOf(decentralBank.address)
                assert.equal(bank.toString(),tokens('0'),'Decentral bank balance after unstaking')

                //check is staking
                isstaking = await decentralBank.isStaking(customer)
                assert.equal(isstaking.toString(), 'false', 'Customer is no longer staking')
            })
        })

    // end decentral bank
    })

    
})