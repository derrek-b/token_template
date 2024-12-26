const hre = require('hardhat')
const { expect } = require('chai')

const tokens = (n) => {
  return hre.ethers.parseEther(n.toString())
}

describe('Token', () => {
  const NAME = 'Dz Token'
  const SYMBOL = 'DZT'
  const DECIMALS = 18
  const TOTALSUPPLY = 1000000
  const VALUE = tokens(100)
  const AMOUNT = tokens(1)

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

    it('gives owner minting rights', async () => {
      expect(await token.allowMint(signer.address)).to.be.true
    })
  })

  describe('Transfer Tokens', () => {
    describe('Success', () => {
      beforeEach(async () => {
        txn = await token.connect(signer).transfer(receiver, VALUE)
      })

      it('increases the receivers balance', async () => {
        expect(await token.balanceOf(receiver.address)).to.equal(VALUE)
      })

      it('decreases the signers balance', async () => {
        expect(await token.balanceOf(signer.address)).to.equal(tokens(999900))
      })

      it('emits a transfer event', async () => {
        expect(txn).to.emit(token, 'Transfer').withArgs(signer.address, receiver.address, VALUE)
      })
    })

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        await expect(token.connect(signer).transfer(receiver, tokens(1000001))).to.be.revertedWith('Insufficient balance.')
      })

      it('rejects invalid \'to\' addresses', async () => {
        await expect(token.connect(signer).transfer('0x0000000000000000000000000000000000000000', VALUE)).to.be.revertedWith('Invalid \'to\' address.')
      })
    })
  })

  describe('Approve Tokens', () => {
    beforeEach(async () => {
      txn = await token.connect(signer).approve(exchange.address, VALUE)
    })

    describe('Success', () => {
      it('sets spender\'s allowance', async () => {
        expect(await token.allowance(signer.address, exchange.address)).to.be.equal(VALUE)
      })

      it('emits an Approval event', async () => {
        await expect(txn).to.emit(token, 'Approval').withArgs(signer.address, exchange.address, VALUE)
      })
    })

    describe('Failure', () => {
      it('rejects invalid \'spender\' addresses', async () => {
        await expect(token.connect(signer).approve('0x0000000000000000000000000000000000000000', VALUE)).to.be.revertedWith('Invalid \'spender\' address.')
      })
    })
  })

  describe('Delegated Transfer', () => {
    beforeEach(async () => {
      await token.connect(signer).approve(exchange.address, VALUE)
    })

    describe('Success', () => {
      beforeEach(async () => {
        txn = await token.connect(exchange).transferFrom(signer.address, receiver.address, VALUE)
      })

      it('updates owner and receiver balances', async () => {
        expect(await token.balanceOf(signer.address)).to.be.equal(tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.be.equal(VALUE)
      })

      it('updates spender\'s new allowance amount', async () => {
        expect(await token.allowance(signer.address, exchange.address)).to.be.equal(0)
      })

      it('emits a Transfer event', async () => {
        await expect(txn).to.emit(token, 'Transfer').withArgs(signer.address, receiver.address, VALUE)
      })
    })

    describe('Failure', () => {
      it('rejects values above allowance amount', async () => {
        await expect(token.connect(exchange).transferFrom(signer.address, receiver.address, tokens(101))).to.be.revertedWith('Insufficient allowance.')
      })

      it('rejects invalid \'to\' addresses', async () => {
        await expect(token.connect(exchange).transferFrom(signer.address, '0x0000000000000000000000000000000000000000', VALUE)).to.be.revertedWith('Invalid \'to\' address.')
      })

      it('rejects insufficient balances', async () => {
        await token.connect(receiver).approve(exchange.address, VALUE)
        await expect(token.connect(exchange).transferFrom(receiver.address, signer.address, VALUE)).to.be.revertedWith('Insufficient balance.')
      })
    })
  })

  describe('Minting Tokens', () => {
    describe('Success', () => {
      beforeEach(async () => {
        txn = await token.connect(signer).mint(signer.address, AMOUNT)
      })

      it('increases address\'s token balance', async () => {
        expect(await token.balanceOf(signer.address)).to.be.equal(tokens(1000001))
      })

      it('increases token\'s total supply', async () => {
        expect(await token.totalSupply()).to.be.equal(tokens(1000001))
      })

      it('emits a Mint event', async () => {
        await expect(txn).to.emit(token, 'Mint').withArgs(signer.address, AMOUNT)
      })
    })

    describe('Failure', () => {
      it('rejects unauthorized minting', async () => {
        await expect(token.connect(receiver).mint(receiver.address, AMOUNT)).to.be.revertedWith('Unauthorized minter.')
      })
    })
  })

  describe('Manage Minting Permission', () => {
    describe('Success', () => {
      beforeEach(async () => {
        await token.connect(signer).setAllowMint(receiver.address, true)
      })

      it('sets new minting permission', async () => {
        expect(await token.allowMint(receiver)).to.be.true
      })
    })

    describe('Failure', () => {
      it('rejects calls from non owner', async () => {
        await expect(token.connect(receiver).setAllowMint(receiver.address, true)).to.be.revertedWith('Unauthorized caller.')
      })

      it('rejects invalid addresses', async () => {
        await expect(token.connect(signer).setAllowMint('0x0000000000000000000000000000000000000000', true)).to.be.revertedWith('Invalid minter address.')
      })
    })
  })

  describe('Burning Tokens', () => {
    describe('Success', () => {
      beforeEach(async () => {
        txn = await token.connect(signer).burn(AMOUNT)
      })

      it('decreases total supply & caller\'s balance', async () => {
        expect(await token.balanceOf(signer.address)).to.be.equal(tokens(999999))
        expect(await token.totalSupply()).to.be.equal(tokens(999999))
      })

      it('emits a Burn event', async () => {
        await expect(txn).to.emit(token, 'Burn').withArgs(signer.address, AMOUNT)
      })
    })

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        await expect(token.connect(receiver).burn(AMOUNT)).to.be.revertedWith('Insufficient balance.')
      })
    })
  })
})
