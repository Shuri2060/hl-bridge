/** @import {} from "../global.d.ts" */
// import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.2/ethers.min.js' // https://docs.ethers.org/v6/getting-started
;
(() => {
    let IS_MAINNET = false

    const CHAIN_IDS = {
        false: 421614,
        true: 42161,
    }

    const loginMessage = `test login message ${Date.now()}`

    let address = undefined

    function chainIdHex(chainId) { return `0x${chainId.toString(16)}` }
    function chainIdHexHL(isMainnet) { return chainIdHex(CHAIN_IDS[IS_MAINNET]) }

    async function walletConnect(chainId) {
        const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (window.ethereum.networkVersion !== chainId) await switchChain(chainId)
        return addresses
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
                        const addresses = await walletConnect(CHAIN_IDS[IS_MAINNET])
                        const signature = await window.ethereum.request({
                            method: 'personal_sign',
                            params: [
                                loginMessage,
                                addresses[0],
                            ],
                        })
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