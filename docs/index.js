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
        button: {
            connect: {
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
                        elements.input.address.element.value = address
                        elements.button.copy.element.disabled = false
                    } catch (e) {
                        console.log('Wallet Connect Error', e)
                    }
                },
            },
            copy: {
                async click(e) { navigator.clipboard.writeText(elements.input.address.element.value) }
            }
        },
        input: {
            address: {},
        },
    }

    for (let tag in elements) {
        for (let id in elements[tag]) {
            const o = elements[tag][id]
            o.element = document.getElementById(id)
            if (tag === 'button') o.element.addEventListener('click', o.click)
        }
    }
})()