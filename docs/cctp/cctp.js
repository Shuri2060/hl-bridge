/** @import {} from "../../global" */
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.4/ethers.min.js' // https://docs.ethers.org/v6/getting-started
import tokenMessengerAbi from './abi/TokenMessenger.json' with { type: 'json' }


function addressToBytes32(address) {
    return ethers.getBytes(address)
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
    async burn(chain, destinationDomain, mintRecipient, amount) {
        const contract = await getContract(chain, chain.cctp.tokenMessenger, tokenMessengerAbi)
        console.log(addressToBytes32(mintRecipient))
        const result = await contract.depositForBurn(amount, destinationDomain, addressToBytes32(mintRecipient), chain.cctp.usdc)
        console.log(result)
    },
    async mint(chain, remoteChain, sender, messageBody) {
        console.log(remoteChain.cctp.usdc, sender, messageBody)
        chain.cctp.tokenMessengerContract.handleReceiveMessage(remoteChain.cctp.domain, addressToBytes32(sender), messageBody)
    },
}
