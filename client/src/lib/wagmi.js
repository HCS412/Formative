// Wallet configuration - lazy loaded to avoid bundling if not needed
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// Get a free project ID at https://cloud.walletconnect.com
// If not set, wallet features will be disabled
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Only create config if project ID is set, otherwise return null
export const config = projectId && projectId !== 'demo-project-id' 
  ? getDefaultConfig({
      appName: 'Formative',
      projectId,
      chains: [mainnet, polygon, optimism, arbitrum, base],
      ssr: false,
    })
  : null

export const isWalletEnabled = !!config

