import CHAINS from './chains.js'
import { chainIdHex } from './utils.js'

import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.2/ethers.min.js' // https://docs.ethers.org/v6/getting-started


export function chainIdHexHL(isMainnet) { return chainIdHex(CHAINS[isMainnet].ARBITRUM.id) }

export function depositToBridge(isMainnet, amount) {
    // TODO
}
