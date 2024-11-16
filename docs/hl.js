import CHAINS from './chains.js'
import { chainIdHex } from './utils.js'

export function chainIdHexHL(isMainnet) { return chainIdHex(CHAINS[isMainnet].ARBITRUM.id) }
