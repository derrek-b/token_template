const hre = require('hardhat')

async function main() {
  const Token = await hre.ethers.getContractFactory('Token')
  const token = await Token.deploy('D\'z Nuts', 'DZT', 1000000)

  console.log(await token.getAddress())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
