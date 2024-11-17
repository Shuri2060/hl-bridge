import CHAINS from './chains.js'

import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.4/ethers.min.js' // https://docs.ethers.org/v6/getting-started
import usdcAbi from './cctp/abi/usdc.json' with { type: 'json' }


// export function chainIdHexHL(isMainnet) { return chainIdHex(CHAINS[isMainnet].ARBITRUM.id) }

function chainIdHex(chainId) { return `0x${chainId.toString(16)}` }

async function switchChain(chainId) {
    await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex(chainId) }],
    })
}

async function getContract(chain, address, abi) {
    await switchChain(chain.id)

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    return new ethers.Contract(address, abi, signer)
}

const HL_BRIDGE = {
    false: '0x279c9462FDba349550b49a23DE27dd19d5891baA',
    true: '0x2df1c51e09aecf9cacb7bc98cb1742757f163df7',
}

export const Hyperliquid = {
    // async approveBridge(isMainnet, amount) {
    //     const chain = CHAINS[isMainnet].ARBITRUM
    //     const contract = await getContract(chain, chain.cctp.usdc, usdcAbi)
    //     const result = await contract.approve(chain.cctp.tokenMessenger, amount)
    //     console.log(result)
    // },
    async depositToBridge(isMainnet, amount) {
        const chain = CHAINS[isMainnet].ARBITRUM
        const contract = await getContract(chain, chain.cctp.usdc, usdcAbi)
        const result = await contract.transfer(HL_BRIDGE[isMainnet], amount)
        console.log(result)
    },
}
