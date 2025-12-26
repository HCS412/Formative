import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  ShoppingBag, Plus, Package, DollarSign, Eye, TrendingUp,
  Edit2, Trash2, ExternalLink, Copy, Check, X, Image,
  FileText, Download, MoreVertical, Sparkles, Store, 
  BarChart3, Clock, Tag, Link2, Settings, ChevronRight
} from 'lucide-react';

export function Shop() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'settings'

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    compareAtPrice: '',
    type: 'digital',
    coverImage: '',
    tags: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, statsRes, settingsRes] = await Promise.all([
        fetch('/api/shop/products', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/shop/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/shop/settings', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setError('');

    if (!newProduct.name || !newProduct.price) {
      setError('Name and price are required');
      return;
    }

    try {
      const response = await fetch('/api/shop/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          compareAtPrice: newProduct.compareAtPrice ? parseFloat(newProduct.compareAtPrice) : null,
          tags: newProduct.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProducts([data.product, ...products]);
        setShowCreateModal(false);
        setNewProduct({
          name: '', shortDescription: '', description: '', price: '',
          compareAtPrice: '', type: 'digital', coverImage: '', tags: ''
        });
        setSuccess('Product created successfully!');
        setTimeout(() => setSuccess(''), 3000);
        fetchData(); // Refresh stats
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create product');
      }
    } catch (error) {
      setError('Failed to create product');
    }
  };

  const handleUpdateProduct = async (productId, updates) => {
    try {
      const response = await fetch(`/api/shop/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        fetchData();
        setSuccess('Product updated!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/shop/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        setSuccess('Product deleted');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  const getShopUrl = () => {
    const baseUrl = window.location.origin;
    const username = user?.name?.toLowerCase().replace(/\s+/g, '-') || user?.email?.split('@')[0];
    return `${baseUrl}/shop/${username}`;
  };

  const copyShopUrl = () => {
    navigator.clipboard.writeText(getShopUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-3">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3">
          <X className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Store className="w-8 h-8 text-teal-400" />
            Your Shop
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Sell digital products, courses, and more
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={copyShopUrl}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Shop Link'}
          </Button>
          <a href={getShopUrl()} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Shop
            </Button>
          </a>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Active Products</p>
                  <p className="text-3xl font-bold mt-1">{stats.active_products || 0}</p>
                </div>
                <Package className="w-10 h-10 text-teal-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Total Sales</p>
                  <p className="text-3xl font-bold mt-1">{stats.total_sales || 0}</p>
                </div>
                <ShoppingBag className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Total Revenue</p>
                  <p className="text-3xl font-bold mt-1">${formatPrice(stats.total_revenue || 0)}</p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">This Month</p>
                  <p className="text-3xl font-bold mt-1">${formatPrice(stats.monthly_revenue || 0)}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shop URL Card */}
      <Card className="bg-gradient-to-r from-teal-500/5 to-cyan-500/5 border-teal-500/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium">Your Shop URL</p>
                <p className="text-sm text-teal-400 font-mono">{getShopUrl()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copyShopUrl}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <a href={getShopUrl()} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {products.length === 0 ? (
          // Empty State
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                  Start selling by adding your first digital product. E-books, templates, courses, or any downloadable content.
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Product
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Products Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <Card key={product.id} className="group hover:border-teal-500/30 transition-colors overflow-hidden">
                {/* Product Image */}
                <div className="aspect-video bg-[var(--bg-tertiary)] relative overflow-hidden">
                  {product.cover_image ? (
                    <img 
                      src={product.cover_image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-[var(--text-muted)] opacity-30" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleUpdateProduct(product.id, { isActive: !product.is_active })}
                        className="p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors"
                      >
                        {product.is_active ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-50" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded-lg bg-black/50 hover:bg-red-500/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  {/* Product Info */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-[var(--text-muted)] capitalize">{product.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-400">${formatPrice(product.price)}</p>
                      {product.compare_at_price && (
                        <p className="text-xs text-[var(--text-muted)] line-through">
                          ${formatPrice(product.compare_at_price)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {product.short_description && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                      {product.short_description}
                    </p>
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        {product.total_sales || 0} sales
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${formatPrice(product.total_revenue || 0)}
                      </span>
                    </div>
                    <a 
                      href={`${getShopUrl()}/${product.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-2xl border border-[var(--border-color)] my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create New Product</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Add a digital product to your shop</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleCreateProduct} className="p-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Ultimate Design Templates Pack"
                  required
                />
              </div>
              
              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Short Description</label>
                <Input
                  value={newProduct.shortDescription}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                  placeholder="A brief one-liner about your product"
                  maxLength={500}
                />
              </div>
              
              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe what's included, who it's for, and why they should buy it..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] resize-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                />
              </div>
              
              {/* Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="29.99"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Compare at Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.compareAtPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
                      placeholder="49.99"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Shows as crossed out (optional)</p>
                </div>
              </div>
              
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'digital', label: 'Digital File', icon: FileText },
                    { value: 'course', label: 'Course', icon: Sparkles },
                    { value: 'template', label: 'Template', icon: Package }
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, type: type.value })}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        newProduct.type === type.value
                          ? 'border-teal-500 bg-teal-500/10'
                          : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
                      }`}
                    >
                      <type.icon className={`w-5 h-5 ${
                        newProduct.type === type.value ? 'text-teal-400' : 'text-[var(--text-muted)]'
                      }`} />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Cover Image URL */}
              <div>
                <label className="block text-sm font-medium mb-2">Cover Image URL</label>
                <Input
                  value={newProduct.coverImage}
                  onChange={(e) => setNewProduct({ ...newProduct, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Paste a URL to an image. Recommended: 1200x630px
                </p>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <Input
                  value={newProduct.tags}
                  onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                  placeholder="design, templates, figma (comma separated)"
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-[var(--text-muted)]">Loading your shop...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}

