import { lazy, Suspense, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { config } from '@/lib/wagmi'

// Lazy load Payments component
const Payments = lazy(() => import('./Payments').then(module => ({ default: module.Payments })))

export function PaymentsWrapper() {
  return (
    <WagmiProvider config={config}>
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
    </WagmiProvider>
  )
}

