// Wallet configuration for RainbowKit/wagmi
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// Get a free project ID at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Check if wallet features should be fully enabled
export const isWalletEnabled = !!projectId && projectId !== 'demo-project-id'

// Always create a config (use a placeholder if no real project ID)
// This ensures wagmi hooks don't crash, but wallet connect won't work without real ID
export const config = getDefaultConfig({
  appName: 'Formative',
  projectId: projectId || 'placeholder-id-for-build',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
})

