const hre = require('hardhat')
const { expect } = require('chai')

const tokens = (n) => {
  return hre.ethers.parseUnits(n.toString())
}

describe('Token', () => {
  const NAME = 'Dz Token'
  const SYMBOL = 'DZT'
  const DECIMALS = 18
  const TOTALSUPPLY = 1000000

  let token, txn, result
  let signer, receiver, exchange

  beforeEach(async () => {
    token = await hre.ethers.deployContract('Token', [NAME, SYMBOL, TOTALSUPPLY])

    const accounts = await hre.ethers.getSigners()
    signer = accounts[0]
    receiver = accounts[1]
    exchange = accounts[2]
  })

  describe('Deployment', () => {
    it('sets the correct owner', async () => {
      expect(await token.owner()).to.be.equal(signer.address)
    })

    it('sets the correct name', async () => {
      expect(await token.name()).to.be.equal(NAME)
    })

    it('sets the correct symbol', async () => {
      expect(await token.symbol()).to.be.equal(SYMBOL)
    })

    it('sets the correct decimals', async () => {
      expect(await token.decimals()).to.be.equal(DECIMALS)
    })

    it('sets the correct total supply', async () => {
      expect(await token.totalSupply()).to.be.equal(tokens(TOTALSUPPLY))
    })

    it('transfers all tokens to owner', async () => {
      expect(await token.balanceOf(signer.address)).to.be.equal(tokens(1000000))
    })
  })

  describe('Transfer Tokens', () => {
    const value = tokens(100)

    describe('Success', () => {
      beforeEach(async () => {
        txn = await token.connect(signer).transfer(receiver, value)
      })

      it('increases the receivers balance', async () => {
        expect(await token.balanceOf(receiver.address)).to.equal(value)
      })

      it('decreases the signers balance', async () => {
        expect(await token.balanceOf(signer.address)).to.equal(tokens(999900))
      })

      it('emits a transfer event', async () => {
        expect(txn).to.emit(token, 'Transfer').withArgs(signer.address, receiver.address, value)
      })
    })

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        await expect(token.connect(signer).transfer(receiver, tokens(1000000000000))).to.be.revertedWith('Insufficient balance.')
      })

      it('rejects invalid \'to\' addresses', async () => {
        await expect(token.connect(signer).transfer('0x0000000000000000000000000000000000000000', value)).to.be.revertedWith('Invalid \'to\' address.')
      })
    })
  })

  describe('Approve Tokens', () => {
    const value = tokens(100)

    beforeEach(async () => {
      txn = await token.connect(signer).approve(exchange.address, value)

    })

    describe('Success', () => {
      it('sets spender\'s allowance', async () => {
        expect(await token.allowance(signer.address, exchange.address)).to.be.equal(value)
      })

      it('emits an Approval event', async () => {
        await expect(txn).to.emit(token, 'Approval').withArgs(signer.address, exchange.address, value)
      })
    })

    describe('Failure', () => {
      it('rejects invalid \'spender\' addresses', async () => {
        await expect(token.connect(signer).approve('0x0000000000000000000000000000000000000000', value)).to.be.revertedWith('Invalid \'spender\' address.')
      })
    })
  })

  describe('Delegated Transfer', () => {
    describe('Success', () => {

    })

    describe('Failure', () => {

    })
  })
})
