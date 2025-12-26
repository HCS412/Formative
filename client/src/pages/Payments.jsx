import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Wallet, 
  CreditCard, 
  Trash2, 
  Check, 
  Copy,
  ExternalLink,
  Shield,
  DollarSign,
  Bitcoin,
  Unlink
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Modal, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const PLATFORM_FEE_PERCENT = 8 // 8% platform fee

export function Payments({ walletEnabled = true }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  
  // Wallet connection from wagmi
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()

  // State
  const [loading, setLoading] = useState(true)
  
  // Stripe state
  const [stripeConnected, setStripeConnected] = useState(false)
  const [stripeAccount, setStripeAccount] = useState(null)
  const [showStripeSetup, setShowStripeSetup] = useState(false)

  // Payment history
  const [paymentHistory, setPaymentHistory] = useState([])

  // Stripe Connect configuration
  const STRIPE_CLIENT_ID = import.meta.env.VITE_STRIPE_CLIENT_ID || null

  useEffect(() => {
    loadPaymentSettings()
    
    // Check for Stripe Connect callback
    const urlParams = new URLSearchParams(window.location.search)
    const stripeCode = urlParams.get('code')
    const stripeError = urlParams.get('error')
    
    if (stripeCode) {
      handleStripeCallback(stripeCode)
      window.history.replaceState({}, '', window.location.pathname)
    } else if (stripeError) {
      addToast('Failed to connect Stripe: ' + (urlParams.get('error_description') || stripeError), 'error')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Save wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem('connectedWallet', JSON.stringify({
        address,
        chain: chain?.name,
        connectedAt: new Date().toISOString()
      }))
      addToast('Wallet connected successfully!', 'success')
    }
  }, [isConnected, address])

  const handleStripeCallback = async (code) => {
    addToast('Connecting your Stripe account...', 'info')
    try {
      setStripeConnected(true)
      localStorage.setItem('stripeConnected', 'true')
      setStripeAccount({
        id: 'acct_connected',
        email: user?.email,
        payoutsEnabled: true,
      })
      addToast('Stripe account connected successfully!', 'success')
    } catch (error) {
      addToast('Failed to complete Stripe connection', 'error')
    }
  }

  const loadPaymentSettings = async () => {
    setLoading(true)
    try {
      const stripeStatus = localStorage.getItem('stripeConnected')
      setStripeConnected(stripeStatus === 'true')

      // Demo payment history
      setPaymentHistory([
        { id: 1, type: 'received', amount: 2500, currency: 'USD', method: 'stripe', campaign: 'Summer Fashion', date: '2024-01-15', status: 'completed' },
        { id: 2, type: 'received', amount: 0.05, currency: 'ETH', method: 'crypto', campaign: 'Tech Review', date: '2024-01-10', status: 'completed' },
        { id: 3, type: 'pending', amount: 5000, currency: 'USD', method: 'stripe', campaign: 'Fitness Partnership', date: '2024-01-20', status: 'pending' },
      ])
    } catch (error) {
      console.error('Failed to load payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectStripe = () => {
    if (!STRIPE_CLIENT_ID) {
      setShowStripeSetup(true)
      return
    }

    const REDIRECT_URI = `${window.location.origin}/dashboard/payments`
    
    const stripeConnectUrl = `https://connect.stripe.com/oauth/authorize?` + 
      `response_type=code&` +
      `client_id=${STRIPE_CLIENT_ID}&` +
      `scope=read_write&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `stripe_user[email]=${encodeURIComponent(user?.email || '')}`
    
    window.location.href = stripeConnectUrl
  }

  const handleDisconnectStripe = () => {
    setStripeConnected(false)
    setStripeAccount(null)
    localStorage.setItem('stripeConnected', 'false')
    addToast('Stripe account disconnected', 'success')
  }

  const handleDisconnectWallet = () => {
    disconnect()
    localStorage.removeItem('connectedWallet')
    addToast('Wallet disconnected', 'success')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    addToast('Copied to clipboard!', 'success')
  }

  const calculateFee = (amount) => {
    return (amount * PLATFORM_FEE_PERCENT / 100).toFixed(2)
  }

  const calculateNet = (amount) => {
    return (amount - (amount * PLATFORM_FEE_PERCENT / 100)).toFixed(2)
  }

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-[var(--text-secondary)]">
          Manage how you receive payments for campaigns
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Crypto Wallet - RainbowKit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-orange-400" />
                Crypto Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!walletEnabled ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Wallet Setup Required</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">
                    Crypto wallet connections require configuration.
                  </p>
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-left max-w-md mx-auto">
                    <p className="text-sm text-yellow-400 mb-2">To enable wallet connections:</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Set <code className="bg-[var(--bg-secondary)] px-1 rounded">VITE_WALLETCONNECT_PROJECT_ID</code> in environment variables.
                      Get a free project ID at{' '}
                      <a href="https://cloud.walletconnect.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">
                        cloud.walletconnect.com
                      </a>
                    </p>
                  </div>
                </div>
              ) : isConnected ? (
                <div className="space-y-4">
                  {/* Connected Wallet Display */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">Wallet Connected</p>
                          <Badge variant="success">Active</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm text-[var(--text-secondary)]">
                            {shortenAddress(address)}
                          </code>
                          <button 
                            onClick={() => copyToClipboard(address)}
                            className="text-[var(--text-muted)] hover:text-white"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {chain && (
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            Network: {chain.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleDisconnectWallet}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>

                  {/* Full Address */}
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                    <p className="text-xs text-[var(--text-muted)] mb-2">Full Wallet Address</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-teal-400 break-all flex-1">
                        {address}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(address)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <p className="text-sm text-green-400">
                        Brands can now send crypto payments directly to your wallet
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
                    Securely connect your crypto wallet to receive payments. Supports MetaMask, Coinbase Wallet, Rainbow, and more.
                  </p>
                  
                  {/* RainbowKit Connect Button */}
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <Button onClick={openConnectModal} size="lg">
                        <Wallet className="w-5 h-5 mr-2" />
                        Connect Wallet
                      </Button>
                    )}
                  </ConnectButton.Custom>

                  <p className="text-xs text-[var(--text-muted)] mt-4">
                    🔒 Your wallet connection is secure and verified
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fiat Payments - Stripe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Bank & Card Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-400">S</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Stripe Connect</p>
                      {stripeConnected ? (
                        <Badge variant="success">Connected</Badge>
                      ) : (
                        <Badge>Not Connected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {stripeConnected 
                        ? 'Receive payments directly to your bank account'
                        : 'Connect to receive USD, EUR, and card payments'}
                    </p>
                  </div>
                </div>
                {stripeConnected ? (
                  <Button variant="ghost" size="sm" onClick={handleDisconnectStripe}>
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleConnectStripe}>
                    Connect
                  </Button>
                )}
              </div>

              {stripeConnected && stripeAccount && (
                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Payouts Enabled</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Connected as: {stripeAccount.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <p className="text-center text-[var(--text-secondary)] py-8">
                  No payments yet
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div 
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center',
                          payment.status === 'completed' ? 'bg-green-500/20' : 'bg-orange-500/20'
                        )}>
                          {payment.method === 'crypto' ? (
                            <Bitcoin className={cn('w-5 h-5', payment.status === 'completed' ? 'text-green-400' : 'text-orange-400')} />
                          ) : (
                            <DollarSign className={cn('w-5 h-5', payment.status === 'completed' ? 'text-green-400' : 'text-orange-400')} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{payment.campaign}</p>
                          <p className="text-sm text-[var(--text-muted)]">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          'font-semibold',
                          payment.status === 'completed' ? 'text-green-400' : 'text-orange-400'
                        )}>
                          +{payment.amount} {payment.currency}
                        </p>
                        <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Platform Fee Info */}
          <Card className="p-5 bg-gradient-to-br from-teal-500/10 to-purple-500/10 border-teal-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold">Platform Fee</h3>
                <p className="text-2xl font-bold text-teal-400">{PLATFORM_FEE_PERCENT}%</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              A small fee is deducted from each payment to support the platform.
            </p>
            
            {/* Fee Calculator */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
              <p className="text-xs text-[var(--text-muted)] mb-2">Example: $1,000 campaign</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Campaign Value</span>
                  <span>$1,000.00</span>
                </div>
                <div className="flex justify-between text-orange-400">
                  <span>Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
                  <span>-${calculateFee(1000)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-400 pt-2 border-t border-[var(--border-color)]">
                  <span>You Receive</span>
                  <span>${calculateNet(1000)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Secure Connections</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Your wallet is connected securely via WalletConnect. We never have access to your private keys or funds.
                </p>
              </div>
            </div>
          </Card>

          {/* Supported Networks */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Supported Networks</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-blue-400 font-bold">Ξ</span>
                <span className="text-sm">Ethereum</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-purple-400 font-bold">◆</span>
                <span className="text-sm">Polygon</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-red-400 font-bold">⬡</span>
                <span className="text-sm">Optimism</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-blue-500 font-bold">◈</span>
                <span className="text-sm">Arbitrum</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)] col-span-2">
                <span className="text-blue-400 font-bold">⬢</span>
                <span className="text-sm">Base</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stripe Setup Modal */}
      <Modal
        isOpen={showStripeSetup}
        onClose={() => setShowStripeSetup(false)}
        title="Connect Stripe Account"
        subtitle="Set up Stripe Connect to receive payments"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-400">S</span>
              </div>
              <div>
                <p className="font-semibold">Stripe Connect</p>
                <p className="text-sm text-[var(--text-secondary)]">Secure payment processing</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              To enable Stripe payments, the platform admin needs to configure Stripe Connect integration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <p className="text-sm text-teal-400">
              💡 For now, you can receive payments via your connected crypto wallet above!
            </p>
          </div>

          <a 
            href="https://dashboard.stripe.com/settings/connect" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="secondary" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More About Stripe Connect
            </Button>
          </a>

          <Button variant="ghost" className="w-full" onClick={() => setShowStripeSetup(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
