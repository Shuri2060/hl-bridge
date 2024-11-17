/** @import {} from "../../global" */
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.2/ethers.min.js' // https://docs.ethers.org/v6/getting-started

export const CCTP = {
    async burn(chain, destinationDomain, mintRecipient, amount) {
        console.log(amount, destinationDomain, mintRecipient, chain.cctp.usdc)
        chain.cctp.tokenMessengerContract.burn(amount, destinationDomain, mintRecipient, chain.cctp.usdc)
    },
    async mint(chain, remoteChain, sender, messageBody) {
        console.log(remoteChain.cctp.usdc, sender, messageBody)
        chain.cctp.tokenMessengerContract.mint(remoteChain.cctp.domain, sender, messageBody)
    },
}
