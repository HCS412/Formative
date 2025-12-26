import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, Package, Star, ExternalLink, Twitter, Instagram, 
  Youtube, Globe, ArrowLeft, Check, Sparkles, Tag, Clock,
  Download, CreditCard, Shield, Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function PublicShop() {
  const { username, productSlug } = useParams();
  const [shop, setShop] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (productSlug) {
      fetchProduct();
    } else {
      fetchShop();
    }
  }, [username, productSlug]);

  const fetchShop = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/public/${username}`);
      
      if (!response.ok) {
        setError('Shop not found');
        return;
      }
      
      const data = await response.json();
      setShop(data.shop);
    } catch (err) {
      setError('Failed to load shop');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/public/${username}/products/${productSlug}`);
      
      if (!response.ok) {
        setError('Product not found');
        return;
      }
      
      const data = await response.json();
      setProduct(data.product);
      
      // Also fetch shop info for context
      const shopResponse = await fetch(`/api/shop/public/${username}`);
      if (shopResponse.ok) {
        const shopData = await shopResponse.json();
        setShop(shopData.shop);
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  const handleCheckout = async (productId) => {
    if (!checkoutEmail) {
      alert('Please enter your email address');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch(`/api/shop/checkout/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: checkoutEmail,
          successUrl: window.location.href,
          cancelUrl: window.location.href
        })
      });

      if (response.ok) {
        const data = await response.json();
        // In production, redirect to Stripe Checkout
        // For now, show success message
        alert(`Order created! Order #${data.order.orderNumber}\n\nIn production, this would redirect to Stripe Checkout.`);
      } else {
        alert('Failed to create checkout');
      }
    } catch (err) {
      alert('Checkout error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
          <h1 className="text-2xl font-bold mb-2">Shop Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Product Detail View
  if (product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Back Link */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            to={`/shop/${username}`}
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {shop?.creator?.name}'s Shop
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-[var(--bg-secondary)]">
                {product.cover_image ? (
                  <img 
                    src={product.cover_image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-20 h-20 text-[var(--text-muted)] opacity-30" />
                  </div>
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                  <Download className="w-6 h-6 mx-auto mb-2 text-teal-400" />
                  <p className="text-sm text-[var(--text-secondary)]">Instant Download</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-green-400" />
                  <p className="text-sm text-[var(--text-secondary)]">Secure Payment</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <p className="text-sm text-[var(--text-secondary)]">Lifetime Access</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Type Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-400 text-sm mb-4">
                <Package className="w-4 h-4" />
                {product.type}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              
              {product.short_description && (
                <p className="text-xl text-[var(--text-secondary)] mb-6">
                  {product.short_description}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-teal-400">
                  ${formatPrice(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="text-xl text-[var(--text-muted)] line-through">
                    ${formatPrice(product.compare_at_price)}
                  </span>
                )}
                {product.compare_at_price && (
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-sm">
                    Save {Math.round((1 - product.price / product.compare_at_price) * 100)}%
                  </span>
                )}
              </div>

              {/* Checkout Form */}
              <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-6">
                <label className="block text-sm font-medium mb-2">Your Email</label>
                <Input
                  type="email"
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mb-4"
                />
                <Button 
                  className="w-full py-4 text-lg"
                  onClick={() => handleCheckout(product.id)}
                  loading={checkoutLoading}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy Now - ${formatPrice(product.price)}
                </Button>
                <p className="text-center text-xs text-[var(--text-muted)] mt-3">
                  Secure checkout powered by Stripe
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-3">About This Product</h3>
                  <div className="prose prose-invert max-w-none text-[var(--text-secondary)]">
                    {product.description.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Creator Info */}
              {shop?.creator && (
                <div className="mt-8 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                      {shop.creator.avatar ? (
                        <img src={shop.creator.avatar} alt={shop.creator.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {shop.creator.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{shop.creator.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">Creator</p>
                    </div>
                    <Link to={`/shop/${username}`}>
                      <Button variant="ghost" size="sm">
                        View Shop
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Shop Listing View
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero/Banner */}
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-purple-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/20 overflow-hidden">
              {shop.creator.avatar ? (
                <img src={shop.creator.avatar} alt={shop.creator.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl">
                  {shop.creator.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Shop Name */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {shop.settings.name}
            </h1>
            
            {shop.settings.description && (
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
                {shop.settings.description}
              </p>
            )}

            {/* Creator Info */}
            <p className="text-[var(--text-muted)] mb-6">
              by <span className="text-white font-medium">{shop.creator.name}</span>
            </p>

            {/* Social Links */}
            {shop.creator.website && (
              <a 
                href={shop.creator.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {shop.creator.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-[var(--text-muted)]">{shop.products.length} items</p>
        </div>

        {shop.products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
            <p className="text-xl font-medium mb-2">No Products Yet</p>
            <p className="text-[var(--text-secondary)]">Check back soon for new products!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shop.products.map(product => (
              <Link 
                key={product.id}
                to={`/shop/${username}/${product.slug}`}
                className="group"
              >
                <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border-color)] hover:border-teal-500/50 transition-all hover:shadow-xl hover:shadow-teal-500/10">
                  {/* Image */}
                  <div className="aspect-video bg-[var(--bg-tertiary)] relative overflow-hidden">
                    {product.cover_image ? (
                      <img 
                        src={product.cover_image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-[var(--text-muted)] opacity-30" />
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {product.is_featured && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      </div>
                    )}
                    
                    {/* Sale Badge */}
                    {product.compare_at_price && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                          {Math.round((1 - product.price / product.compare_at_price) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-teal-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    
                    {product.short_description && (
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                        {product.short_description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-teal-400">
                          ${formatPrice(product.price)}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-sm text-[var(--text-muted)] line-through">
                            ${formatPrice(product.compare_at_price)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--text-muted)] capitalize px-2 py-1 rounded-full bg-[var(--bg-tertiary)]">
                        {product.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border-color)] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[var(--text-muted)]">
          <p>Powered by <Link to="/" className="text-teal-400 hover:underline">Formative</Link></p>
        </div>
      </div>
    </div>
  );
}

