import { useState, useEffect } from 'react'
import { 
  Wallet, 
  CreditCard, 
  Plus, 
  Trash2, 
  Check, 
  Copy,
  ExternalLink,
  Shield,
  AlertCircle,
  DollarSign,
  Bitcoin
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Modal, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const cryptoWallets = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: 'bg-orange-500' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'bg-blue-500' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '$', color: 'bg-blue-400' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '₮', color: 'bg-green-500' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: '◎', color: 'bg-purple-500' },
]

const PLATFORM_FEE_PERCENT = 8 // 8% platform fee

export function Payments() {
  const { user } = useAuth()
  const { addToast } = useToast()

  // State
  const [wallets, setWallets] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Add wallet modal
  const [showAddWallet, setShowAddWallet] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  
  // Stripe state
  const [stripeConnected, setStripeConnected] = useState(false)
  const [stripeAccount, setStripeAccount] = useState(null)

  // Payment history
  const [paymentHistory, setPaymentHistory] = useState([])

  useEffect(() => {
    loadPaymentSettings()
    
    // Check for Stripe Connect callback
    const urlParams = new URLSearchParams(window.location.search)
    const stripeCode = urlParams.get('code')
    const stripeError = urlParams.get('error')
    
    if (stripeCode) {
      // Exchange code for access token (would call backend in production)
      handleStripeCallback(stripeCode)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (stripeError) {
      addToast('Failed to connect Stripe: ' + (urlParams.get('error_description') || stripeError), 'error')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const handleStripeCallback = async (code) => {
    addToast('Connecting your Stripe account...', 'info')
    try {
      // In production, send this code to your backend to exchange for access token
      // const response = await fetch('/api/stripe/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code })
      // })
      // const data = await response.json()
      
      // For now, mark as connected (backend would verify)
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
      // Load from localStorage for now (would be API in production)
      const savedWallets = localStorage.getItem('userWallets')
      if (savedWallets) {
        setWallets(JSON.parse(savedWallets))
      }
      
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

  const handleAddWallet = () => {
    if (!selectedCrypto || !walletAddress.trim()) {
      addToast('Please select a currency and enter a wallet address', 'error')
      return
    }

    // Basic validation
    if (walletAddress.length < 20) {
      addToast('Please enter a valid wallet address', 'error')
      return
    }

    const newWallets = {
      ...wallets,
      [selectedCrypto.id]: {
        address: walletAddress.trim(),
        currency: selectedCrypto.symbol,
        name: selectedCrypto.name,
        addedAt: new Date().toISOString(),
      }
    }

    setWallets(newWallets)
    localStorage.setItem('userWallets', JSON.stringify(newWallets))
    
    addToast(`${selectedCrypto.name} wallet added!`, 'success')
    setShowAddWallet(false)
    setSelectedCrypto(null)
    setWalletAddress('')
  }

  const handleRemoveWallet = (cryptoId) => {
    const newWallets = { ...wallets }
    delete newWallets[cryptoId]
    setWallets(newWallets)
    localStorage.setItem('userWallets', JSON.stringify(newWallets))
    addToast('Wallet removed', 'success')
  }

  // Stripe Connect configuration
  // To enable real Stripe Connect:
  // 1. Go to https://dashboard.stripe.com/settings/connect
  // 2. Get your Client ID (starts with ca_)
  // 3. Add redirect URI: https://formative-production.up.railway.app/dashboard/payments
  // 4. Set STRIPE_CLIENT_ID below or as env variable
  const STRIPE_CLIENT_ID = import.meta.env.VITE_STRIPE_CLIENT_ID || null

  const [showStripeSetup, setShowStripeSetup] = useState(false)

  const handleConnectStripe = () => {
    if (!STRIPE_CLIENT_ID) {
      // Show setup instructions modal
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

          {/* Crypto Wallets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-orange-400" />
                Crypto Wallets
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddWallet(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </CardHeader>
            <CardContent>
              {Object.keys(wallets).length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-[var(--text-secondary)] mb-2">No wallets added yet</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Add your crypto wallet addresses to receive payments in cryptocurrency
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(wallets).map(([cryptoId, wallet]) => {
                    const crypto = cryptoWallets.find(c => c.id === cryptoId)
                    return (
                      <div 
                        key={cryptoId}
                        className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)]"
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold',
                          crypto?.color || 'bg-gray-500'
                        )}>
                          {crypto?.icon || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{wallet.name}</p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">
                              {wallet.address}
                            </code>
                            <button 
                              onClick={() => copyToClipboard(wallet.address)}
                              className="text-[var(--text-muted)] hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <Badge>{wallet.currency}</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleRemoveWallet(cryptoId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
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
                <h3 className="font-semibold mb-2">Security Notice</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Double-check your wallet addresses before saving. Payments sent to 
                  incorrect addresses cannot be recovered.
                </p>
              </div>
            </div>
          </Card>

          {/* Supported Currencies */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Supported Currencies</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-purple-400 font-bold">$</span>
                <span className="text-sm">USD</span>
              </div>
              {cryptoWallets.map(crypto => (
                <div key={crypto.id} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]">
                  <span className={cn('font-bold', 
                    crypto.id === 'btc' ? 'text-orange-400' :
                    crypto.id === 'eth' ? 'text-blue-400' :
                    crypto.id === 'sol' ? 'text-purple-400' : 'text-green-400'
                  )}>
                    {crypto.icon}
                  </span>
                  <span className="text-sm">{crypto.symbol}</span>
                </div>
              ))}
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
              💡 For now, you can receive payments via crypto wallets below, or contact support for fiat payment setup.
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

      {/* Add Wallet Modal */}
      <Modal
        isOpen={showAddWallet}
        onClose={() => {
          setShowAddWallet(false)
          setSelectedCrypto(null)
          setWalletAddress('')
        }}
        title="Add Crypto Wallet"
        subtitle="Enter your wallet address to receive crypto payments"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Select Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {cryptoWallets.map(crypto => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto)}
                  disabled={wallets[crypto.id]}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border transition-all',
                    selectedCrypto?.id === crypto.id
                      ? 'border-teal-500 bg-teal-500/10'
                      : wallets[crypto.id]
                        ? 'border-[var(--border-color)] bg-[var(--bg-secondary)] opacity-50 cursor-not-allowed'
                        : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold', crypto.color)}>
                    {crypto.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{crypto.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{crypto.symbol}</p>
                  </div>
                  {wallets[crypto.id] && (
                    <Check className="w-4 h-4 text-green-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedCrypto && (
            <Input
              label={`${selectedCrypto.name} Wallet Address`}
              placeholder={`Enter your ${selectedCrypto.symbol} address`}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          )}

          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Important</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Make sure you're entering the correct network address. Sending funds to 
              the wrong network will result in permanent loss.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowAddWallet(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleAddWallet}
              disabled={!selectedCrypto || !walletAddress.trim()}
            >
              Add Wallet
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

