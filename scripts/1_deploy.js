const hre = require('hardhat')

const NAME = ''
const SYMBOL = ''
const DECIMALS = 0
const TOTALSUPPLY = 0

async function main() {
  if(NAME === '' || SYMBOL === '') {
    console.log('Please enter at least a name and symbol to deploy script')
    return
  }
  const Token = await hre.ethers.getContractFactory(NAME, SYMBOL, DECIMALS, TOTALSUPPLY)
  const token = await Token.deploy()

  console.log(await token.getAddress())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
