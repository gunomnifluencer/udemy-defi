import React, {Component} from 'react'
import "./App.css"
import Navbar from './Navbar'
import Main from './Main'
import ParticleSettings from './ParticleSettings'
import Web3 from 'web3'
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'

class App extends Component {
    // code goes here

    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
        await this.test()
    }

    async test() {
        var that = this
        window.ethereum.on('accountsChanged', function (account) {
            that.setState({account : account[0]})
            that.loadWeb3()
            that.loadBlockchainData()
        })
    }

    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if(window.web3)
        {
            window.web3 = new Web3(window.web3.currentProvider)  
        }
        else
        {
            window.alert('No ethereum detected, please check your metamask!')
        }
    }

    async loadBlockchainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account : account[0]})
        const networkId = await web3.eth.net.getId()
        const tetherData = Tether.networks[networkId]

        // const receipt = await web3.eth.getTransactionReceipt('0x5bafe20ba5e4d825a3454f1f99a1b716d61a043978d00b82e26da8cfd0726f6d')
    
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi,tetherData.address)
            this.setState({tether})
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({tetherBalance:tetherBalance.toString()})
            // console.log(this.state)
            // console.log({balance : tetherBalance})
        }
        else
        {
            window.alert('Error, Tether network id doesn\'t matches with contract')
        }

        const rwdData = RWD.networks[networkId]

        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi,rwdData.address)
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            rwdBalance = await web3.utils.fromWei(rwdBalance,"Ether")
            this.setState({rwdBalance : rwdBalance.toString()})
            // console.log(rwdBalance.toString())
        }
        else
        {
            window.alert('Error, RWD network id doesn\'t matches with contract')
        }

        const decentralBankData = DecentralBank.networks[networkId]

        if(decentralBankData){
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({decentralBank})
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            stakingBalance = await web3.utils.fromWei(stakingBalance,"Ether")
            this.setState({stakingBalance : stakingBalance.toString()}) 

            let incentive = await decentralBank.methods.incentive(this.state.account).call()
            incentive = await web3.utils.fromWei(incentive,"Ether")
            this.setState({incentive : incentive.toString()}) 
            // console.log(stakingBalance.toString())
        }
        else
        {
            window.alert('Error, DecentralBank network id doesn\'t matches with contract')
        }

        this.setState({loading: false})
    }
    
    stakeTokens = (amount) => {
        // validate amount
        if(amount <= 0 || isNaN(amount))
        {
            this.setState({error: 'Invalid number'})
            return false;
        }
        amount = window.web3.utils.toWei(amount)
        var that = this
        this.setState({loading: true})
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from : this.state.account}).on('transactionHash',(hash) => {
            this.state.decentralBank.methods.depositTokens(amount).send({from : this.state.account}).on('transactionHash',(hash) => {
                this.setState({loading: false})
                this.displayValue()
            }).on('error',function(err){
                that.errorMessage(err)
            })
        }).on('error',function(err){
            that.errorMessage(err)
        })
    }

    unstakeTokens = (_amount) => {
        var that = this
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens(_amount).send({from : this.state.account}).on('transactionHash',(hash) => {
            this.setState({loading: false})
            this.displayValue()
        }).on('error',function(err){
            that.errorMessage(err)
        })
    }

    buyTokens = (amount) => {
        this.setState({loading: true})
        this.state.decentralBank.methods.buyToken(amount).send({from : this.state.account}).on('transactionHash',(hash) => {
            this.setState({loading: false})
            this.displayValue()
        })
    }

    harvestTokens = () => {
        this.setState({loading: true})
        this.state.decentralBank.methods.harvestToken().send({from : this.state.account}).on('transactionHash',(hash) => {
            this.setState({loading: false})
            this.displayValue()
        })
    }

    displayValue = async () => {
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        this.setState({account : account[0]})
        const networkId = await web3.eth.net.getId()

        const tetherData = Tether.networks[networkId]
        const tether = new web3.eth.Contract(Tether.abi,tetherData.address)
        let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
        this.setState({tetherBalance:tetherBalance.toString()})

        const decentralBankData = DecentralBank.networks[networkId]
        const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
        let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
        stakingBalance = await web3.utils.fromWei(stakingBalance,"Ether")
        this.setState({stakingBalance : stakingBalance.toString()})

        let incentive = await decentralBank.methods.incentive(this.state.account).call()
        incentive = await web3.utils.fromWei(incentive,"Ether")
        this.setState({incentive : incentive.toString()}) 
    }

    errorMessage = (e) =>
    {
        this.setState({loading: false})
        if(e.code == 4001)
        {
            this.setState({error: 'User reject transaction'})
        }
        else
        {
            // -32603 -- metamask error
            this.setState({error: 'Error on wallet'})
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account : '0x0',
            tether : {},
            rwd : {},
            decentralBank : {},
            tetherBalance : '0',
            rwdBalance:'0',
            stakingBalance : '0',
            incentive:'0',
            loading: true,
            error:''
        }
    }

    render(){
        let content;
        {this.state.loading ? content = <p id="loader" className='text-center' style={{margin : '30px'}}>LOADING...</p> 
        : content=<Main
            tetherBalance = {this.state.tetherBalance}
            rwdBalance = {this.state.rwdBalance}
            stakingBalance = {this.state.stakingBalance}
            incentive = {this.state.incentive}
            stakeTokens = {this.stakeTokens}
            unstakeTokens = {this.unstakeTokens}
            buyTokens = {this.buyTokens}
            harvestTokens = {this.harvestTokens}
            displayValue = {this.displayValue}
            error = {this.state.error}
        />}
        return (
            <div className='App' style={{ position : 'relative' }}>

                <div style={{position : 'absolute'}}>
                    <ParticleSettings />
                </div>

                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5 text-center'>
                    <div className="row">
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', maxHeight:'100vm'}}>
                            <div>{content}</div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;