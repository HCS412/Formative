import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { config, isWalletEnabled } from '@/lib/wagmi'
import { Payments } from './Payments'

// Create a separate QueryClient for wagmi (required by wagmi v2)
const wagmiQueryClient = new QueryClient()

export function PaymentsWrapper() {
  // Always provide the wagmi context so hooks don't crash
  // Pass isWalletEnabled to Payments so it knows whether to show wallet features
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={wagmiQueryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#14b8a6',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          <Payments walletEnabled={isWalletEnabled} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

