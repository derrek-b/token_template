const hre = require('hardhat')
const { expect } = require('chai')

const tokens = (n) => {
  return hre.ethers.parseUnits(n.toString())
}

describe('Token', () => {
  let token, txn, result

  let signer, receiver, exchange

  beforeEach(async () => {
    token = await hre.ethers.deployContract('Token', ['D\'z Nuts', 'DzNuts', 1000000])

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
      expect(await token.name()).to.be.equal('D\'z Nuts')
    })

    it('sets the correct symbol', async () => {
      expect(await token.symbol()).to.be.equal('DzNuts')
    })

    it('sets the correct decimals', async () => {
      expect(await token.decimals()).to.be.equal('18')
    })

    it('sets the correct max supply', async () => {
      expect(await token.maxSupply()).to.be.equal(tokens(1000000))
    })

    it('transfers all tokens to owner', async () => {
      expect(await token.balanceOf(signer.address)).to.be.equal(tokens(1000000))
    })
  })

  describe('Transfer Tokens', () => {
    const amount = tokens(100)

    describe('Success', () => {
      beforeEach(async () => {
        txn = await token.connect(signer).transfer(receiver, amount)
        result = txn.wait()
      })

      it('increases the receivers balance', async () => {
        expect(await token.balanceOf(receiver.address)).to.equal(amount)
      })

      it('decreases the signers balance', async () => {
        expect(await token.balanceOf(signer.address)).to.equal(tokens(999900))
      })

      it('emits a transfer event', async () => {
        const args = result.args

      })
    })

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        await expect(token.connect(signer).transfer(receiver, tokens(1000000000000))).to.be.revertedWith('Insufficient balance.')
      })

      it('rejects invalid \'to\' addresses', async () => {
        await expect(token.connect(signer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.revertedWith('Invalid \'to\' address.')
      })
    })
  })

  describe('Approve Tokens', () => {
    describe('Success', () => {

    })

    describe('Failure', () => {

    })
  })

  describe('Delegated Transfer', () => {
    describe('Success', () => {

    })

    describe('Failure', () => {

    })
  })
})
