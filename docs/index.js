/** @import {} from "../global.d.ts" */
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.2/ethers.min.js' // https://docs.ethers.org/v6/getting-started
import CHAINS from './chains.js'
import { chainIdHex } from './utils.js'
import { chainIdHexHL } from './hl.js'
    ;
(() => {
    let IS_MAINNET = false
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
        burn: {
            button: {
                sourceConnect: {
                    async click(e) {
                        try {
                            const addresses = await walletConnect()
                            // const signature = await window.ethereum.request({
                            //     method: 'personal_sign',
                            //     params: [
                            //         loginMessage,
                            //         addresses[0],
                            //     ],
                            // })
                            // TODO: Verify signature

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
                        console.log('BURN')
                    }
                },
            },
            input: {
                sourceAddress: {},
                burnAmount: {},
            },
            select: {
                sourceChain: {}
            }
        },
        mint: {
            button: {
                destinationConnect: {
                    async click(e) {
                        try {
                            const addresses = await walletConnect()
                            // const signature = await window.ethereum.request({
                            //     method: 'personal_sign',
                            //     params: [
                            //         loginMessage,
                            //         addresses[0],
                            //     ],
                            // })
                            // TODO: Verify signature

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
                        console.log('MINT')
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