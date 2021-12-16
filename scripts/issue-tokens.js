const Decentralbank = artifacts.require('DecentralBank')

module.exports = async function issueReward(callback){
    let decentralBank = await Decentralbank.deployed()
    await decentralBank.issueTokens()
    console.log("token has been issued successfully")
    callback() //to call itself function
}