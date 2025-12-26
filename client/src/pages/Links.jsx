import { useState, useEffect } from 'react'
import { 
  Link2, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ExternalLink,
  BarChart3,
  MousePointer,
  Calendar,
  Tag,
  Globe,
  Share2
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge, Modal } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

// UTM Parameters explanation
const utmParams = [
  { key: 'source', label: 'Source', placeholder: 'instagram, twitter, newsletter', description: 'Where the traffic comes from' },
  { key: 'medium', label: 'Medium', placeholder: 'social, email, cpc', description: 'Marketing medium' },
  { key: 'campaign', label: 'Campaign', placeholder: 'summer_sale, product_launch', description: 'Campaign name' },
  { key: 'term', label: 'Term', placeholder: 'keyword (optional)', description: 'Paid search keyword', optional: true },
  { key: 'content', label: 'Content', placeholder: 'header_link, button (optional)', description: 'Differentiate similar links', optional: true },
]

// Quick presets for common platforms
const platformPresets = [
  { name: 'Instagram Bio', source: 'instagram', medium: 'social', icon: '📸' },
  { name: 'Instagram Story', source: 'instagram', medium: 'story', icon: '📱' },
  { name: 'Twitter/X', source: 'twitter', medium: 'social', icon: '𝕏' },
  { name: 'TikTok Bio', source: 'tiktok', medium: 'social', icon: '🎵' },
  { name: 'YouTube Description', source: 'youtube', medium: 'video', icon: '▶️' },
  { name: 'Newsletter', source: 'newsletter', medium: 'email', icon: '✉️' },
  { name: 'Podcast', source: 'podcast', medium: 'audio', icon: '🎙️' },
  { name: 'LinkedIn', source: 'linkedin', medium: 'social', icon: '💼' },
]

export function Links() {
  const { addToast } = useToast()
  
  // UTM Builder State
  const [destinationUrl, setDestinationUrl] = useState('')
  const [utmValues, setUtmValues] = useState({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  })
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [copied, setCopied] = useState(false)
  
  // Saved Links State
  const [savedLinks, setSavedLinks] = useState([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [linkName, setLinkName] = useState('')

  // Load saved links from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('formative_utm_links')
    if (saved) {
      setSavedLinks(JSON.parse(saved))
    }
  }, [])

  // Generate UTM URL
  useEffect(() => {
    if (!destinationUrl) {
      setGeneratedUrl('')
      return
    }

    try {
      let url = destinationUrl
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      const urlObj = new URL(url)
      
      // Add UTM parameters
      Object.entries(utmValues).forEach(([key, value]) => {
        if (value.trim()) {
          urlObj.searchParams.set(`utm_${key}`, value.trim().toLowerCase().replace(/\s+/g, '_'))
        }
      })

      setGeneratedUrl(urlObj.toString())
    } catch (e) {
      setGeneratedUrl('')
    }
  }, [destinationUrl, utmValues])

  const handleCopy = () => {
    if (!generatedUrl) return
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    addToast('Link copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePreset = (preset) => {
    setUtmValues(prev => ({
      ...prev,
      source: preset.source,
      medium: preset.medium
    }))
  }

  const handleSaveLink = () => {
    if (!generatedUrl || !linkName.trim()) {
      addToast('Please enter a name for this link', 'error')
      return
    }

    const newLink = {
      id: Date.now(),
      name: linkName.trim(),
      url: generatedUrl,
      destination: destinationUrl,
      utmParams: { ...utmValues },
      createdAt: new Date().toISOString(),
      clicks: 0 // Placeholder for future analytics
    }

    const updated = [newLink, ...savedLinks]
    setSavedLinks(updated)
    localStorage.setItem('formative_utm_links', JSON.stringify(updated))
    
    setShowSaveModal(false)
    setLinkName('')
    addToast('Link saved!', 'success')
  }

  const handleDeleteLink = (id) => {
    const updated = savedLinks.filter(link => link.id !== id)
    setSavedLinks(updated)
    localStorage.setItem('formative_utm_links', JSON.stringify(updated))
    addToast('Link deleted', 'success')
  }

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url)
    addToast('Link copied!', 'success')
  }

  const handleClear = () => {
    setDestinationUrl('')
    setUtmValues({
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: ''
    })
    setGeneratedUrl('')
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          Tracking Links
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Create UTM-tagged links to track where your traffic comes from
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* UTM Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Destination URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-400" />
                Link Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Destination URL Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Destination URL
                </label>
                <Input
                  placeholder="https://yourwebsite.com/landing-page"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {platformPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePreset(preset)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                        "bg-[var(--bg-secondary)] border border-[var(--border-color)]",
                        "hover:border-teal-500/50 hover:bg-teal-500/10"
                      )}
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* UTM Parameters */}
              <div className="grid md:grid-cols-2 gap-4">
                {utmParams.map((param) => (
                  <div key={param.key}>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {param.label}
                      {param.optional && <span className="text-[var(--text-muted)] ml-1">(optional)</span>}
                    </label>
                    <Input
                      placeholder={param.placeholder}
                      value={utmValues[param.key]}
                      onChange={(e) => setUtmValues(prev => ({ ...prev, [param.key]: e.target.value }))}
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">{param.description}</p>
                  </div>
                ))}
              </div>

              {/* Generated URL */}
              {generatedUrl && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
                  <label className="block text-sm font-medium text-teal-400 mb-2">
                    Generated Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generatedUrl}
                      readOnly
                      className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm font-mono text-white"
                    />
                    <Button onClick={handleCopy} variant={copied ? "ghost" : "primary"}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setShowSaveModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Save Link
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                    <a 
                      href={generatedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Test Link
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-400" />
                Saved Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedLinks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center">
                    <Link2 className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-secondary)]">No saved links yet</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Create a link above and save it for quick access
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedLinks.map((link) => (
                    <div 
                      key={link.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{link.name}</p>
                        <p className="text-sm text-[var(--text-muted)] truncate font-mono">
                          {link.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyLink(link.url)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
          {/* What are UTM Links */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              What are UTM Links?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              UTM parameters are tags added to URLs that help you track where your website traffic comes from. 
              They work with Google Analytics and other analytics tools.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                <span className="text-[var(--text-secondary)]"><strong>Source:</strong> Which platform (Instagram, Twitter)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                <span className="text-[var(--text-secondary)]"><strong>Medium:</strong> How they found you (social, email)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                <span className="text-[var(--text-secondary)]"><strong>Campaign:</strong> Which campaign or promo</span>
              </div>
            </div>
          </Card>

          {/* Best Practices */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Best Practices</h3>
            <div className="space-y-3 text-sm text-[var(--text-secondary)]">
              <p>✓ Use lowercase for consistency</p>
              <p>✓ Replace spaces with underscores</p>
              <p>✓ Be consistent with naming</p>
              <p>✓ Create unique campaign names</p>
              <p>✓ Test links before sharing</p>
            </div>
          </Card>

          {/* Pro Tip */}
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <h3 className="font-semibold mb-2 text-purple-400">Pro Tip</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Use different UTM links for each placement (bio, story, post) to see exactly 
              which content drives the most traffic!
            </p>
          </Card>
        </div>
      </div>

      {/* Save Link Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Link"
        subtitle="Give this link a name for easy reference"
      >
        <div className="space-y-4">
          <Input
            label="Link Name"
            placeholder="e.g., Instagram Bio - Summer Campaign"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
          />
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)] font-mono text-xs text-[var(--text-muted)] break-all">
            {generatedUrl}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowSaveModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSaveLink}>
              Save Link
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

