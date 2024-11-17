/** @import {} from "../global.d.ts" */
import CHAINS from './chains.js'
import { CCTP } from './cctp/cctp.js'
import { Hyperliquid } from './hl.js'

(() => {
    // let IS_MAINNET = false
    const loginMessage = `test login message ${Date.now()}`
    let address = undefined

    async function walletConnect() {
        return await window.ethereum.request({ method: 'eth_requestAccounts' })
    }

    let attestationHash = ''

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
                burnApprove: {
                    async click(e) {
                        const IS_MAINNET = elements.nav.select.isMainnet.element.value === 'true'

                        const chain = elements.burn.select.sourceChain.element.value

                        const amount = parseFloat(elements.burn.input.burnAmount.element.value)

                        if (isNaN(amount) || amount <= 0) {
                            console.log('Invalid Amount')
                            return // add error
                        }

                        await CCTP.approveBurn(CHAINS[IS_MAINNET][chain], amount)
                    }
                },
                burn: {
                    async click(e) {
                        const IS_MAINNET = elements.nav.select.isMainnet.element.value === 'true'

                        const chain_name = elements.burn.select.sourceChain.element.value

                        const mintRecipient = elements.mint.input.destinationAddress.element.value
                        if (mintRecipient.length !== 42) {
                            console.log('Destination Address not connected')
                            return // add error
                        }

                        const amount = parseFloat(elements.burn.input.burnAmount.element.value)

                        if (isNaN(amount) || amount <= 0) {
                            console.log('Invalid Amount')
                            return // add error
                        }
                        const chain = CHAINS[IS_MAINNET][chain_name]
                        const tx = await CCTP.burn(chain, CHAINS[IS_MAINNET].ARBITRUM.cctp.domain, mintRecipient, amount)
                        elements.burn.input.txHash.element.value = tx.hash

                        const i = setInterval(async () => {
                            try {
                                const msgs = await CCTP.messages(IS_MAINNET, chain.cctp.domain, tx.hash)
                                if (msgs.messages[0].attestation !== 'PENDING') {
                                    clearInterval(i)
                                    const messageHash = msgs.messages[0].attestation
                                    attestationHash = await CCTP.attestation(IS_MAINNET, messageHash)
                                }
                            } catch (e) {
                            }
                        }, 1000)
                    }
                },
                refreshConfirmations: {
                    async click(e) {
                    }
                },
            },
            input: {
                sourceAddress: {},
                burnAmount: {},
                txHash: {},
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

                        const messageBody = attestationHash

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
                // hlBridgeApprove: {
                //     async click(e) {
                //         const IS_MAINNET = elements.nav.select.isMainnet.element.value === 'true'

                //         const amount = parseFloat(elements.burn.input.burnAmount.element.value)

                //         if (isNaN(amount) || amount <= 0) {
                //             console.log('Invalid Amount')
                //             return // add error
                //         }

                //         await Hyperliquid.approveBridge(IS_MAINNET, amount)
                //     }
                // },
                hlBridge: {
                    async click(e) {
                        const IS_MAINNET = elements.nav.select.isMainnet.element.value === 'true'

                        const amount = parseFloat(elements.burn.input.burnAmount.element.value)

                        if (isNaN(amount) || amount <= 0) {
                            console.log('Invalid Amount')
                            return // add error
                        }

                        await Hyperliquid.depositToBridge(IS_MAINNET, amount)
                    }
                },
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