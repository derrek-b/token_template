# ERC-20+ Token Template

## Basic ERC-20 token with added mint and burn functionality.

_Before running deploy script update hardhat.config.js like [this](https://hardhat.org/hardhat-runner/docs/config#networks-configuration)
to set up the network you would like to deploy to (default uses hardhat dev network locally)_

To create your own token use the deploy script<br/>
`scripts/1_deploy.js`<br/><br/>
using your own token name, symbol, decimals, and totalSupply<br/>
```
const NAME = 'your_name'<br/>
const SYMBOL = 'your_symbol'<br/>
const DECIMALS = your_decimals<br/>
const TOTALSUPPLY = your_totalsupply
```<br/><br/>
and use the displayed address to add the token to your preferred wallet<br/>
    - [Metamask](https://support.metamask.io/managing-my-tokens/custom-tokens/how-to-display-tokens-in-metamask/#how-to-add-a-custom-token)<br/>
    - [Phantom (auto)](https://help.phantom.com/hc/en-us/articles/27309470600851-How-do-I-add-a-token)<br/>
    - [Conbase](https://www.youtube.com/watch?v=JN1t6uyefoc)
