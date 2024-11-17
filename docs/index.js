/** @import {} from "../global.d.ts" */
import CHAINS from './chains.js'
import { chainIdHex } from './utils.js'
import { CCTP } from './cctp/cctp.js'
import { chainIdHexHL } from './hl.js'
    ;
(() => {
    // let IS_MAINNET = false
    const loginMessage = `test login message ${Date.now()}`
    let address = undefined

    async function walletConnect() {
        return await window.ethereum.request({ method: 'eth_requestAccounts' })
    }

    async function switchChain(chainId) {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex(chainId) }],
        })
    }

    const elements = {
        nav: {
            select: {
                isMainnet: {},
            }
        },
        burn: {
            button: {
                sourceConnect: {
                    async click(e) {
                        try {
                            const addresses = await walletConnect()

                            address = addresses[0]
                            elements.burn.input.sourceAddress.element.value = address
                            elements.burn.button.sourceCopy.element.disabled = false
                        } catch (e) {
                            console.log('Wallet Connect Error', e)
                        }
                    },
                },
                sourceCopy: {
                    async click(e) { navigator.clipboard.writeText(elements.burn.input.sourceAddress.element.value) }
                },
                burn: {
                    async click(e) {
                        const IS_MAINNET = elements.nav.select.isMainnet.element.value === 'true'

                        const chain = elements.burn.select.sourceChain.element.value

                        const mintRecipient = elements.mint.input.destinationAddress.element.value
                        if (mintRecipient.length !== 42) {
                            console.log('Destination Address not connected')
                            return // add error
                        }

                        const amount = parseFloat(elements.burn.input.burnAmount.element.value)
                        elements.burn.input.burnAmount.element.value = ''

                        if (isNaN(amount) || amount <= 0) {
                            console.log('Invalid Amount')
                            return // add error
                        }

                        await CCTP.burn(CHAINS[IS_MAINNET][chain], CHAINS[IS_MAINNET].ARBITRUM.cctp.domain, mintRecipient, amount)
                    }
                },
            },
            input: {
                sourceAddress: {},
                burnAmount: {},
            },
            select: {
                sourceChain: {},
            },
            other: {
                burnConfirmations: {},
                burnMeter: {},
            }
        },
        mint: {
            button: {
                destinationConnect: {
                    async click(e) {
                        try {
                            const addresses = await walletConnect()

                            address = addresses[0]
                            elements.mint.input.destinationAddress.element.value = address
                            elements.mint.button.destinationCopy.element.disabled = false
                        } catch (e) {
                            console.log('Wallet Connect Error', e)
                        }
                    },
                },
                destinationCopy: {
                    async click(e) { navigator.clipboard.writeText(elements.mint.input.destinationAddress.element.value) }
                },
                mint: {
                    async click(e) {
                        const IS_MAINNET = elements.nav.select.isMainnet.element.value === 'true'

                        const chain = elements.burn.select.sourceChain.element.value

                        const sender = elements.burn.input.sourceAddress.element.value
                        if (sender.length !== 42) {
                            console.log('Source Address not connected')
                            return // add error
                        }

                        const messageBody = '?????????????????????????????'

                        await CCTP.mint(CHAINS[IS_MAINNET].ARBITRUM, CHAINS[IS_MAINNET][chain], sender, messageBody)
                    }
                },
            },
            input: {
                destinationAddress: {},
            },
        },
        hlBridge: {
            button: {
                hlBridge: {
                    async click(e) {

                    }
                },
            },
            input: {
                hlAmount: {},
            },
        },
    }

    for (let area in elements) {
        for (let tag in elements[area]) {
            for (let id in elements[area][tag]) {
                const o = elements[area][tag][id]
                o.element = document.getElementById(id)
                if (tag === 'button') o.element.addEventListener('click', o.click)
            }
        }
    }
})()