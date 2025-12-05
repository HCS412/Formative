import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, Building2, Palette, Camera, MapPin, Globe, 
  Instagram, Youtube, Twitter, Music2, Pin, Twitch,
  ChevronRight, ChevronLeft, Check, Sparkles, Target,
  DollarSign, Users, TrendingUp, Briefcase, Clock,
  Video, Image, PenTool, Code, Megaphone, BarChart3,
  Heart, Zap, Award, Star
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Modal } from '@/components/ui'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

// Step configurations for each user type
const INFLUENCER_STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'profile', title: 'Profile', icon: User },
  { id: 'socials', title: 'Socials', icon: Instagram },
  { id: 'niche', title: 'Niche', icon: Target },
  { id: 'audience', title: 'Audience', icon: Users },
  { id: 'complete', title: 'Complete', icon: Check },
]

const BRAND_STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'company', title: 'Company', icon: Building2 },
  { id: 'industry', title: 'Industry', icon: Briefcase },
  { id: 'goals', title: 'Goals', icon: Target },
  { id: 'budget', title: 'Budget', icon: DollarSign },
  { id: 'complete', title: 'Complete', icon: Check },
]

const FREELANCER_STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'profile', title: 'Profile', icon: User },
  { id: 'skills', title: 'Skills', icon: Palette },
  { id: 'experience', title: 'Experience', icon: Award },
  { id: 'rates', title: 'Rates', icon: DollarSign },
  { id: 'complete', title: 'Complete', icon: Check },
]

// Platform options for influencers
const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', icon: Music2, color: '#000000' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: '#1DA1F2' },
  { id: 'pinterest', name: 'Pinterest', icon: Pin, color: '#BD081C' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, color: '#9146FF' },
]

// Niche categories
const NICHES = [
  { id: 'fashion', name: 'Fashion', emoji: '👗' },
  { id: 'beauty', name: 'Beauty', emoji: '💄' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '✨' },
  { id: 'tech', name: 'Tech', emoji: '💻' },
  { id: 'gaming', name: 'Gaming', emoji: '🎮' },
  { id: 'food', name: 'Food', emoji: '🍕' },
  { id: 'fitness', name: 'Fitness', emoji: '💪' },
  { id: 'travel', name: 'Travel', emoji: '✈️' },
  { id: 'finance', name: 'Finance', emoji: '💰' },
  { id: 'education', name: 'Education', emoji: '📚' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'music', name: 'Music', emoji: '🎵' },
  { id: 'art', name: 'Art & Design', emoji: '🎨' },
  { id: 'parenting', name: 'Parenting', emoji: '👶' },
  { id: 'pets', name: 'Pets', emoji: '🐕' },
  { id: 'diy', name: 'DIY & Crafts', emoji: '🔨' },
]

// Industries for brands
const INDUSTRIES = [
  { id: 'retail', name: 'Retail & E-commerce', emoji: '🛍️' },
  { id: 'tech', name: 'Technology', emoji: '💻' },
  { id: 'fashion', name: 'Fashion & Apparel', emoji: '👔' },
  { id: 'beauty', name: 'Beauty & Cosmetics', emoji: '💄' },
  { id: 'food', name: 'Food & Beverage', emoji: '🍔' },
  { id: 'health', name: 'Health & Wellness', emoji: '💊' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'finance', name: 'Finance & Banking', emoji: '🏦' },
  { id: 'travel', name: 'Travel & Hospitality', emoji: '🏨' },
  { id: 'sports', name: 'Sports & Recreation', emoji: '⚽' },
  { id: 'automotive', name: 'Automotive', emoji: '🚗' },
  { id: 'education', name: 'Education', emoji: '📚' },
]

// Marketing goals
const MARKETING_GOALS = [
  { id: 'awareness', name: 'Brand Awareness', icon: Megaphone, desc: 'Get more eyes on your brand' },
  { id: 'sales', name: 'Drive Sales', icon: TrendingUp, desc: 'Convert followers to customers' },
  { id: 'content', name: 'Content Creation', icon: Image, desc: 'High-quality branded content' },
  { id: 'launch', name: 'Product Launch', icon: Zap, desc: 'Launch with a splash' },
  { id: 'community', name: 'Build Community', icon: Users, desc: 'Engaged loyal followers' },
  { id: 'leads', name: 'Lead Generation', icon: Target, desc: 'Quality leads & signups' },
]

// Freelancer services
const SERVICES = [
  { id: 'video', name: 'Video Editing', icon: Video, desc: 'Professional video production' },
  { id: 'photo', name: 'Photography', icon: Camera, desc: 'Product & lifestyle shots' },
  { id: 'design', name: 'Graphic Design', icon: PenTool, desc: 'Logos, banners, social media' },
  { id: 'writing', name: 'Copywriting', icon: PenTool, desc: 'Captions, blogs, scripts' },
  { id: 'web', name: 'Web Development', icon: Code, desc: 'Websites & landing pages' },
  { id: 'social', name: 'Social Media', icon: Instagram, desc: 'Management & strategy' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, desc: 'Data & insights' },
  { id: 'strategy', name: 'Strategy', icon: Target, desc: 'Marketing & growth strategy' },
]

export function Onboarding() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  
  // Determine user type from localStorage or default
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || sessionStorage.getItem('userType') || 'influencer'
  })
  
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  
  // Form data state
  const [formData, setFormData] = useState({
    // Profile basics
    avatar: null,
    avatarPreview: null,
    location: '',
    bio: '',
    website: '',
    phone: '',
    
    // Influencer specific
    platforms: [],
    socialHandles: {},
    niches: [],
    audienceSize: '',
    demographics: { ageRange: '', gender: '', location: '' },
    
    // Brand specific
    companyName: '',
    companyLogo: null,
    companyLogoPreview: null,
    industry: '',
    companySize: '',
    marketingGoals: [],
    monthlyBudget: 5000,
    targetAudience: '',
    
    // Freelancer specific
    services: [],
    experienceLevel: '',
    hourlyRate: 50,
    availability: 'full-time',
    portfolio: '',
  })
  
  // Get steps based on user type
  const steps = userType === 'brand' 
    ? BRAND_STEPS 
    : userType === 'freelancer' 
      ? FREELANCER_STEPS 
      : INFLUENCER_STEPS
  
  const currentStepConfig = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0
  
  // Progress calculation
  const progress = ((currentStep) / (steps.length - 1)) * 100
  
  // Navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  // Handle form changes
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Toggle array items (platforms, niches, etc.)
  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }
  
  // Handle social handle change
  const updateSocialHandle = (platform, handle) => {
    setFormData(prev => ({
      ...prev,
      socialHandles: { ...prev.socialHandles, [platform]: handle }
    }))
  }
  
  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      updateFormData('avatar', file)
      const reader = new FileReader()
      reader.onload = (e) => updateFormData('avatarPreview', e.target.result)
      reader.readAsDataURL(file)
    }
  }
  
  // Complete onboarding
  const completeOnboarding = async () => {
    setSaving(true)
    try {
      // Prepare data based on user type
      const onboardingData = {
        userType,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        phone: formData.phone,
        onboardingCompleted: true,
      }
      
      if (userType === 'influencer') {
        onboardingData.platforms = formData.platforms
        onboardingData.socialAccounts = formData.socialHandles
        onboardingData.niches = formData.niches
        onboardingData.audienceSize = formData.audienceSize
        onboardingData.demographics = formData.demographics
      } else if (userType === 'brand') {
        onboardingData.companyName = formData.companyName
        onboardingData.industry = formData.industry
        onboardingData.companySize = formData.companySize
        onboardingData.marketingGoals = formData.marketingGoals
        onboardingData.monthlyBudget = formData.monthlyBudget
        onboardingData.targetAudience = formData.targetAudience
      } else if (userType === 'freelancer') {
        onboardingData.services = formData.services
        onboardingData.experienceLevel = formData.experienceLevel
        onboardingData.hourlyRate = formData.hourlyRate
        onboardingData.availability = formData.availability
        onboardingData.portfolio = formData.portfolio
      }
      
      // Save to backend
      const response = await api.updateProfile(onboardingData)
      
      if (response.success) {
        addToast('Profile setup complete! Welcome to Formative 🎉', 'success')
        navigate('/dashboard')
      } else {
        throw new Error(response.error || 'Failed to save profile')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      addToast('Failed to save profile. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }
  
  // Render step content
  const renderStepContent = () => {
    const stepId = currentStepConfig.id
    
    // Welcome step (same for all)
    if (stepId === 'welcome') {
      return <WelcomeStep userType={userType} setUserType={setUserType} user={user} />
    }
    
    // Complete step (same for all)
    if (stepId === 'complete') {
      return <CompleteStep userType={userType} formData={formData} onComplete={completeOnboarding} saving={saving} />
    }
    
    // User type specific steps
    if (userType === 'influencer') {
      switch (stepId) {
        case 'profile':
          return <ProfileStep formData={formData} updateFormData={updateFormData} handleAvatarUpload={handleAvatarUpload} />
        case 'socials':
          return <SocialsStep formData={formData} toggleArrayItem={toggleArrayItem} updateSocialHandle={updateSocialHandle} />
        case 'niche':
          return <NicheStep formData={formData} toggleArrayItem={toggleArrayItem} />
        case 'audience':
          return <AudienceStep formData={formData} updateFormData={updateFormData} />
      }
    }
    
    if (userType === 'brand') {
      switch (stepId) {
        case 'company':
          return <CompanyStep formData={formData} updateFormData={updateFormData} />
        case 'industry':
          return <IndustryStep formData={formData} updateFormData={updateFormData} />
        case 'goals':
          return <GoalsStep formData={formData} toggleArrayItem={toggleArrayItem} />
        case 'budget':
          return <BudgetStep formData={formData} updateFormData={updateFormData} />
      }
    }
    
    if (userType === 'freelancer') {
      switch (stepId) {
        case 'profile':
          return <ProfileStep formData={formData} updateFormData={updateFormData} handleAvatarUpload={handleAvatarUpload} />
        case 'skills':
          return <SkillsStep formData={formData} toggleArrayItem={toggleArrayItem} />
        case 'experience':
          return <ExperienceStep formData={formData} updateFormData={updateFormData} />
        case 'rates':
          return <RatesStep formData={formData} updateFormData={updateFormData} />
      }
    }
    
    return null
  }
  
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="w-full max-w-3xl">
        {/* Main Card */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header with Progress */}
          <div className="bg-[var(--bg-card)] p-6 border-b border-[var(--border-color)]">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10">
                <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="20" fill="url(#onb-gradient)" />
                  <circle cx="18" cy="25" r="12" fill="#1e2936" />
                  <defs>
                    <linearGradient id="onb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#14b8a6'}} />
                      <stop offset="100%" style={{stopColor:'#f97316'}} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-xl font-bold">Formative</span>
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isComplete = index < currentStep
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "flex flex-col items-center transition-all duration-300",
                      isActive && "scale-110"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        isComplete && "bg-green-500 border-green-500",
                        isActive && "bg-gradient-to-br from-teal-500 to-cyan-500 border-teal-500",
                        !isComplete && !isActive && "bg-[var(--bg-secondary)] border-[var(--border-color)]"
                      )}>
                        {isComplete ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className={cn(
                            "w-5 h-5",
                            isActive ? "text-white" : "text-[var(--text-secondary)]"
                          )} />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs mt-1 hidden sm:block",
                        isActive ? "text-teal-400 font-medium" : "text-[var(--text-secondary)]"
                      )}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-all duration-500",
                        index < currentStep ? "bg-green-500" : "bg-[var(--border-color)]"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 sm:p-8 min-h-[400px]">
            <div className="animate-in fade-in slide-in-from-right-4 duration-300" key={currentStep}>
              {renderStepContent()}
            </div>
          </div>
          
          {/* Footer Navigation */}
          {currentStepConfig.id !== 'complete' && (
            <div className="p-6 bg-[var(--bg-card)] border-t border-[var(--border-color)] flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={isFirstStep}
                className={cn(isFirstStep && "invisible")}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-sm text-[var(--text-secondary)] hover:text-teal-400 transition-colors"
              >
                Skip for now
              </button>
              
              <Button onClick={nextStep}>
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// STEP COMPONENTS
// ============================================

// Welcome Step
function WelcomeStep({ userType, setUserType, user }) {
  const types = [
    { id: 'influencer', name: 'Influencer', icon: User, desc: 'Grow your audience and land brand deals', color: 'teal' },
    { id: 'brand', name: 'Brand', icon: Building2, desc: 'Find perfect creators for your campaigns', color: 'orange' },
    { id: 'freelancer', name: 'Freelancer', icon: Palette, desc: 'Showcase your skills and find clients', color: 'purple' },
  ]
  
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mb-6">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold mb-2">
        Welcome to Formative{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
      </h2>
      <p className="text-[var(--text-secondary)] text-lg mb-8">
        Let's set up your profile so you can start connecting
      </p>
      
      <div className="text-left mb-6">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
          I'm joining as a...
        </label>
        <div className="grid gap-3">
          {types.map(type => {
            const Icon = type.icon
            const isSelected = userType === type.id
            
            return (
              <button
                key={type.id}
                onClick={() => {
                  setUserType(type.id)
                  localStorage.setItem('userType', type.id)
                  sessionStorage.setItem('userType', type.id)
                }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  isSelected 
                    ? "border-teal-500 bg-teal-500/10" 
                    : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  isSelected ? "bg-teal-500" : "bg-[var(--bg-card)]"
                )}>
                  <Icon className={cn("w-6 h-6", isSelected ? "text-white" : "text-[var(--text-secondary)]")} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{type.name}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{type.desc}</div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Profile Step (shared by Influencer & Freelancer)
function ProfileStep({ formData, updateFormData, handleAvatarUpload }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Let's build your profile</h2>
      <p className="text-[var(--text-secondary)] mb-6">Tell us a bit about yourself</p>
      
      <div className="space-y-5">
        {/* Avatar Upload */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Profile Photo</label>
          <div 
            onClick={() => document.getElementById('avatar-upload').click()}
            className={cn(
              "w-32 h-32 mx-auto rounded-full border-2 border-dashed cursor-pointer transition-all overflow-hidden",
              "hover:border-teal-500 flex items-center justify-center",
              formData.avatarPreview ? "border-solid border-green-500" : "border-[var(--border-color)]"
            )}
          >
            {formData.avatarPreview ? (
              <img src={formData.avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto text-[var(--text-secondary)] mb-1" />
                <span className="text-xs text-[var(--text-secondary)]">Upload</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="avatar-upload" 
            accept="image/*" 
            onChange={handleAvatarUpload}
            className="hidden" 
          />
        </div>
        
        {/* Location */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              value={formData.location}
              onChange={(e) => updateFormData('location', e.target.value)}
              placeholder="City, Country"
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Bio */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => updateFormData('bio', e.target.value)}
            placeholder="Tell the world about yourself..."
            maxLength={280}
            rows={3}
            className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-teal-500 resize-none"
          />
          <div className="text-xs text-[var(--text-secondary)] text-right mt-1">
            {formData.bio.length}/280
          </div>
        </div>
        
        {/* Website */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Website (optional)</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Socials Step (Influencer)
function SocialsStep({ formData, toggleArrayItem, updateSocialHandle }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Connect your socials</h2>
      <p className="text-[var(--text-secondary)] mb-6">Select your platforms and add your handles</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {PLATFORMS.map(platform => {
          const Icon = platform.icon
          const isSelected = formData.platforms.includes(platform.id)
          
          return (
            <button
              key={platform.id}
              onClick={() => toggleArrayItem('platforms', platform.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                isSelected 
                  ? "border-teal-500 bg-teal-500/10" 
                  : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
              )}
            >
              <Icon className={cn("w-8 h-8 mx-auto mb-2", isSelected && "text-teal-400")} />
              <div className="text-sm font-medium">{platform.name}</div>
            </button>
          )
        })}
      </div>
      
      {/* Handle inputs for selected platforms */}
      {formData.platforms.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Your handles</label>
          {formData.platforms.map(platformId => {
            const platform = PLATFORMS.find(p => p.id === platformId)
            const Icon = platform.icon
            
            return (
              <div key={platformId} className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <Input
                  value={formData.socialHandles[platformId] || ''}
                  onChange={(e) => updateSocialHandle(platformId, e.target.value)}
                  placeholder={`@your${platform.name.toLowerCase().replace(/\s/g, '')}handle`}
                  className="pl-10"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Niche Step (Influencer)
function NicheStep({ formData, toggleArrayItem }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What's your niche?</h2>
      <p className="text-[var(--text-secondary)] mb-6">Select all categories that apply to your content</p>
      
      <div className="flex flex-wrap gap-2">
        {NICHES.map(niche => {
          const isSelected = formData.niches.includes(niche.id)
          
          return (
            <button
              key={niche.id}
              onClick={() => toggleArrayItem('niches', niche.id)}
              className={cn(
                "px-4 py-2 rounded-full border-2 transition-all duration-200 flex items-center gap-2",
                isSelected 
                  ? "border-teal-500 bg-teal-500/10 text-teal-400" 
                  : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
              )}
            >
              <span>{niche.emoji}</span>
              <span className="text-sm font-medium">{niche.name}</span>
            </button>
          )
        })}
      </div>
      
      {formData.niches.length > 0 && (
        <p className="text-sm text-teal-400 mt-4">
          {formData.niches.length} categor{formData.niches.length === 1 ? 'y' : 'ies'} selected
        </p>
      )}
    </div>
  )
}

// Audience Step (Influencer)
function AudienceStep({ formData, updateFormData }) {
  const sizes = [
    { id: 'nano', label: 'Nano', range: '1K - 10K', icon: '🌱' },
    { id: 'micro', label: 'Micro', range: '10K - 100K', icon: '🌿' },
    { id: 'macro', label: 'Macro', range: '100K - 1M', icon: '🌳' },
    { id: 'mega', label: 'Mega', range: '1M+', icon: '🌲' },
  ]
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Tell us about your audience</h2>
      <p className="text-[var(--text-secondary)] mb-6">This helps brands find the right fit</p>
      
      <div className="space-y-6">
        {/* Audience Size */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">Total followers</label>
          <div className="grid grid-cols-2 gap-3">
            {sizes.map(size => (
              <button
                key={size.id}
                onClick={() => updateFormData('audienceSize', size.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  formData.audienceSize === size.id 
                    ? "border-teal-500 bg-teal-500/10" 
                    : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                )}
              >
                <span className="text-2xl">{size.icon}</span>
                <div className="font-semibold mt-2">{size.label}</div>
                <div className="text-sm text-[var(--text-secondary)]">{size.range}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Demographics */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">Audience demographics (optional)</label>
          <div className="grid gap-3">
            <select
              value={formData.demographics.ageRange}
              onChange={(e) => updateFormData('demographics', { ...formData.demographics, ageRange: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-teal-500"
            >
              <option value="">Primary age range</option>
              <option value="13-17">13-17</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45+">45+</option>
            </select>
            
            <select
              value={formData.demographics.gender}
              onChange={(e) => updateFormData('demographics', { ...formData.demographics, gender: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-teal-500"
            >
              <option value="">Primary gender</option>
              <option value="mostly-female">Mostly Female (60%+)</option>
              <option value="mostly-male">Mostly Male (60%+)</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// Company Step (Brand)
function CompanyStep({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Tell us about your company</h2>
      <p className="text-[var(--text-secondary)] mb-6">Help creators understand your brand</p>
      
      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Company Name</label>
          <Input
            value={formData.companyName}
            onChange={(e) => updateFormData('companyName', e.target.value)}
            placeholder="Acme Inc."
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Website</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              placeholder="https://yourcompany.com"
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Company Size</label>
          <select
            value={formData.companySize}
            onChange={(e) => updateFormData('companySize', e.target.value)}
            className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-teal-500"
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">About your brand</label>
          <textarea
            value={formData.bio}
            onChange={(e) => updateFormData('bio', e.target.value)}
            placeholder="What does your company do? What's your mission?"
            rows={3}
            className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-teal-500 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

// Industry Step (Brand)
function IndustryStep({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What industry are you in?</h2>
      <p className="text-[var(--text-secondary)] mb-6">This helps us match you with relevant creators</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {INDUSTRIES.map(industry => (
          <button
            key={industry.id}
            onClick={() => updateFormData('industry', industry.id)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200 text-center",
              formData.industry === industry.id 
                ? "border-orange-500 bg-orange-500/10" 
                : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
            )}
          >
            <span className="text-2xl mb-2 block">{industry.emoji}</span>
            <div className="text-sm font-medium">{industry.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Goals Step (Brand)
function GoalsStep({ formData, toggleArrayItem }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What are your marketing goals?</h2>
      <p className="text-[var(--text-secondary)] mb-6">Select all that apply</p>
      
      <div className="grid gap-3">
        {MARKETING_GOALS.map(goal => {
          const Icon = goal.icon
          const isSelected = formData.marketingGoals.includes(goal.id)
          
          return (
            <button
              key={goal.id}
              onClick={() => toggleArrayItem('marketingGoals', goal.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                isSelected 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isSelected ? "bg-orange-500" : "bg-[var(--bg-card)]"
              )}>
                <Icon className={cn("w-6 h-6", isSelected ? "text-white" : "text-[var(--text-secondary)]")} />
              </div>
              <div>
                <div className="font-semibold">{goal.name}</div>
                <div className="text-sm text-[var(--text-secondary)]">{goal.desc}</div>
              </div>
              {isSelected && (
                <Check className="w-5 h-5 text-orange-500 ml-auto" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Budget Step (Brand)
function BudgetStep({ formData, updateFormData }) {
  const formatBudget = (value) => {
    if (value >= 50000) return '$50K+'
    return '$' + (value / 1000).toFixed(0) + 'K'
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What's your monthly budget?</h2>
      <p className="text-[var(--text-secondary)] mb-6">This helps creators understand your campaign scope</p>
      
      <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)]">
        <div className="flex justify-between mb-4">
          <span className="text-[var(--text-secondary)]">Monthly influencer budget</span>
          <span className="text-2xl font-bold text-orange-400">{formatBudget(formData.monthlyBudget)}</span>
        </div>
        
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={formData.monthlyBudget}
          onChange={(e) => updateFormData('monthlyBudget', parseInt(e.target.value))}
          className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        
        <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
          <span>$1K</span>
          <span>$10K</span>
          <span>$25K</span>
          <span>$50K+</span>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Target audience description (optional)</label>
        <textarea
          value={formData.targetAudience}
          onChange={(e) => updateFormData('targetAudience', e.target.value)}
          placeholder="Who are you trying to reach? (e.g., Young professionals interested in fitness)"
          rows={3}
          className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-orange-500 resize-none"
        />
      </div>
    </div>
  )
}

// Skills Step (Freelancer)
function SkillsStep({ formData, toggleArrayItem }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What services do you offer?</h2>
      <p className="text-[var(--text-secondary)] mb-6">Select all that apply</p>
      
      <div className="grid grid-cols-2 gap-3">
        {SERVICES.map(service => {
          const Icon = service.icon
          const isSelected = formData.services.includes(service.id)
          
          return (
            <button
              key={service.id}
              onClick={() => toggleArrayItem('services', service.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                isSelected 
                  ? "border-purple-500 bg-purple-500/10" 
                  : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
              )}
            >
              <Icon className={cn("w-8 h-8 mb-2", isSelected ? "text-purple-400" : "text-[var(--text-secondary)]")} />
              <div className="font-semibold text-sm">{service.name}</div>
              <div className="text-xs text-[var(--text-secondary)]">{service.desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Experience Step (Freelancer)
function ExperienceStep({ formData, updateFormData }) {
  const levels = [
    { id: 'beginner', label: 'Beginner', range: '0-2 years', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', range: '2-5 years', icon: '🌿' },
    { id: 'expert', label: 'Expert', range: '5+ years', icon: '🌳' },
  ]
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">What's your experience level?</h2>
      <p className="text-[var(--text-secondary)] mb-6">Be honest - clients appreciate authenticity</p>
      
      <div className="space-y-6">
        <div className="grid gap-3">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => updateFormData('experienceLevel', level.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                formData.experienceLevel === level.id 
                  ? "border-purple-500 bg-purple-500/10" 
                  : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
              )}
            >
              <span className="text-3xl">{level.icon}</span>
              <div>
                <div className="font-semibold">{level.label}</div>
                <div className="text-sm text-[var(--text-secondary)]">{level.range}</div>
              </div>
            </button>
          ))}
        </div>
        
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Portfolio link (optional)</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              value={formData.portfolio}
              onChange={(e) => updateFormData('portfolio', e.target.value)}
              placeholder="Behance, Dribbble, GitHub, etc."
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Rates Step (Freelancer)
function RatesStep({ formData, updateFormData }) {
  const availabilities = [
    { id: 'full-time', label: 'Full-time', desc: '40+ hrs/week' },
    { id: 'part-time', label: 'Part-time', desc: '20-40 hrs/week' },
    { id: 'freelance', label: 'Freelance', desc: 'Per project' },
  ]
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Set your rates</h2>
      <p className="text-[var(--text-secondary)] mb-6">You can always adjust this later</p>
      
      <div className="space-y-6">
        <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex justify-between mb-4">
            <span className="text-[var(--text-secondary)]">Hourly rate</span>
            <span className="text-2xl font-bold text-purple-400">${formData.hourlyRate}/hr</span>
          </div>
          
          <input
            type="range"
            min="25"
            max="500"
            step="25"
            value={formData.hourlyRate}
            onChange={(e) => updateFormData('hourlyRate', parseInt(e.target.value))}
            className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
            <span>$25</span>
            <span>$100</span>
            <span>$250</span>
            <span>$500</span>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">Availability</label>
          <div className="grid gap-3">
            {availabilities.map(avail => (
              <button
                key={avail.id}
                onClick={() => updateFormData('availability', avail.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                  formData.availability === avail.id 
                    ? "border-purple-500 bg-purple-500/10" 
                    : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                )}
              >
                <div>
                  <div className="font-semibold">{avail.label}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{avail.desc}</div>
                </div>
                {formData.availability === avail.id && (
                  <Check className="w-5 h-5 text-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Complete Step
function CompleteStep({ userType, formData, onComplete, saving }) {
  const getEmoji = () => {
    switch (userType) {
      case 'brand': return '🏢'
      case 'freelancer': return '🎨'
      default: return '🌟'
    }
  }
  
  const getMessage = () => {
    switch (userType) {
      case 'brand': return 'Your brand profile is ready. Start discovering amazing creators!'
      case 'freelancer': return 'Your portfolio is set up. Time to land some great clients!'
      default: return 'Your creator profile is complete. Let\'s grow your audience!'
    }
  }
  
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 animate-in zoom-in duration-500">
        <span className="text-5xl">{getEmoji()}</span>
      </div>
      
      <h2 className="text-3xl font-bold mb-3">You're all set!</h2>
      <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-md mx-auto">
        {getMessage()}
      </p>
      
      <div className="bg-[var(--bg-card)] rounded-xl p-6 mb-8 text-left max-w-md mx-auto border border-[var(--border-color)]">
        <h3 className="font-semibold mb-4">What's next?</h3>
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-teal-400" />
            </div>
            <span>Explore your personalized dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-orange-400" />
            </div>
            <span>Browse opportunities that match your profile</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <span>Connect with {userType === 'brand' ? 'creators' : 'brands'} and collaborators</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 justify-center">
        <Button onClick={onComplete} loading={saving} className="px-8">
          Go to Dashboard
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export default Onboarding

