import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// Get a free project ID at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

export const config = getDefaultConfig({
  appName: 'Formative',
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
})

