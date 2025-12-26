import { lazy, Suspense } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { config, isWalletEnabled } from '@/lib/wagmi'

// Lazy load Payments component
const Payments = lazy(() => import('./Payments').then(module => ({ default: module.Payments })))

// Create a separate QueryClient for wagmi (required by wagmi v2)
const wagmiQueryClient = new QueryClient()

export function PaymentsWrapper() {
  // If wallet is not configured, show message instead
  if (!isWalletEnabled || !config) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--bg-card)] rounded-xl p-8 border border-[var(--border-color)]">
            <h1 className="text-2xl font-bold mb-4">Payments</h1>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 font-medium mb-2">Wallet Integration Not Configured</p>
              <p className="text-sm text-[var(--text-secondary)]">
                To enable crypto wallet connections, set <code className="bg-[var(--bg-secondary)] px-2 py-1 rounded">VITE_WALLETCONNECT_PROJECT_ID</code> in your environment variables.
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Get a free project ID at <a href="https://cloud.walletconnect.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">cloud.walletconnect.com</a>
              </p>
            </div>
            <p className="text-[var(--text-secondary)]">
              You can still use Stripe Connect for fiat payments, or manually add wallet addresses.
            </p>
          </div>
        </div>
      </div>
    )
  }

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
          <Suspense fallback={
            <div className="min-h-screen bg-[var(--bg-primary)] p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="h-8 bg-[var(--bg-card)] rounded-lg w-1/3 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map(i => (
                    <div key={i} className="h-64 bg-[var(--bg-card)] rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          }>
            <Payments />
          </Suspense>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

