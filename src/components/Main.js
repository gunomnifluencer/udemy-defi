import React, {Component} from 'react'
import tether from '../tether.png'

class Main extends Component {
    // code goes here

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
            incentive : '0',
            loading: true,
            error:''
        }
    }

    createMarkup = () => {
        return {
           __html: 'First · Second'    };
     }

    render(){
        return (
            <div id="content" className="mt-3">
                <div className='text-danger'>{this.props.error}</div>
                <table className='table text-muted text-center'>
                    <thead>
                        <tr style={{color:'black'}}>
                            <th scope='col'>Staking Balance</th>
                            <th>Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>{this.props.stakingBalance}</b> GIL</td>
                            <td><b>{this.props.incentive}</b> GIL -- REWARD</td>
                        </tr>
                    </tbody>
                </table>

                <div className='card mb-2' style={{opacity : '.9'}}>
                    <form 
                        onSubmit={(event) =>{
                                event.preventDefault()
                                let amount
                                amount = this.input.value
                                this.props.stakeTokens(amount)
                            }
                        }   
                    className='mb-3'>
                        <div style={{ borderSpacing:'0 lem' }}>
                            <label className='float-left' style={{marginLeft:'15px'}}><b>Stake Tokens</b></label>
                            <span className='float-right' style={{marginRight:'8px'}}>Balance: <b>{window.web3.utils.fromWei(this.props.tetherBalance, "Ether")}</b> GIL</span>
                            <span className='clearfix'></span>

                            <div className='input-group mb-4'>
                                <input ref={(input) => {this.input = input}} maxLength="20" type="text" placeholder="0" required />
                                
                                <div className='input-grouped-open'>
                                    <div className='input-group-text'>
                                        <img height='32' className='mr-3' alt='tether' src={tether} />GIL
                                    </div>
                                </div>
                            </div>
                            <button type='submit' className='btn btn-lg btn-primary btn-block'>Stake</button>
                        </div>
                    </form>
                    <button onClick={(event) =>{
                                event.preventDefault()
                                let amount
                                amount = this.input.value.toString()
                                amount = window.web3.utils.toWei(amount)
                                this.props.unstakeTokens(amount)
                            }
                        }   
 type='button' className='btn btn-lg btn-primary'>UnStake</button>

                    <button onClick={(event) =>{
                                event.preventDefault()
                                this.props.harvestTokens()
                            }
                        }   
 type='button' className='btn btn-lg btn-primary mt-3'>Harvest Token</button>

                    <button onClick={(event) =>{
                                event.preventDefault()
                                let amount
                                amount = this.input.value.toString()
                                amount = window.web3.utils.toWei(amount)
                                this.props.buyTokens(amount)
                            }
                        }   
 type='button' className='btn btn-lg btn-primary mt-3'>BUY 100 Token</button>

                    <div className='text-center text-primary card-body'>AIRDROP</div>
                </div>

            {/* end of content */}
            </div>
        )
    }
}

export default Main;