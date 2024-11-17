/** @import {} from "../../global" */
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.4/ethers.min.js' // https://docs.ethers.org/v6/getting-started
import tokenMessengerAbi from './abi/TokenMessenger.json' with { type: 'json' }
import usdcAbi from './abi/usdc.json' with { type: 'json' }


function addressToBytes32(address) {
    return '0x000000000000000000000000' + address.slice(2)
}

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

export const CCTP = {
    async approveBurn(chain, amount) {
        const contract = await getContract(chain, chain.cctp.usdc, usdcAbi)
        const result = await contract.approve(chain.cctp.tokenMessenger, amount)
        console.log(result)
    },
    async burn(chain, destinationDomain, mintRecipient, amount) {
        const contract = await getContract(chain, chain.cctp.tokenMessenger, tokenMessengerAbi)
        const result = await contract.depositForBurn(amount, destinationDomain, addressToBytes32(mintRecipient), chain.cctp.usdc)
        console.log(result)
    },
    async mint(chain, remoteChain, sender, messageBody) {
        const contract = await getContract(chain, chain.cctp.tokenMessenger, tokenMessengerAbi)
        const result = await contract.handleReceiveMessage(remoteChain.cctp.domain, addressToBytes32(sender), messageBody)
        console.log(result)
    },
}
