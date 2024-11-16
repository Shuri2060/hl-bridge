import { MetaMaskProvider } from "@metamask/providers"

declare global {
    interface Window {
        ethereum?: MetaMaskProvider
    }
}
