const API_BASE = import.meta.env.PROD 
  ? '' 
  : 'http://localhost:3000'

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE
  }

  getToken() {
    return localStorage.getItem('authToken')
  }

  setToken(token) {
    localStorage.setItem('authToken', token)
  }

  clearToken() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('userType')
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getToken()

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body)
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        this.clearToken()
        window.location.href = '/'
      }
      throw new Error(data.error || 'Request failed')
    }

    return data
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    if (data.token) {
      this.setToken(data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      localStorage.setItem('userType', data.user.user_type)
    }
    return data
  }

  async register(userData) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: userData,
    })
    if (data.token) {
      this.setToken(data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      localStorage.setItem('userType', userData.userType)
    }
    return data
  }

  logout() {
    this.clearToken()
  }

  // User
  async getProfile() {
    return this.request('/api/user/profile')
  }

  async updateProfile(data) {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: data,
    })
  }

  async getUsername() {
    return this.request('/api/user/username')
  }

  async setUsername(username) {
    return this.request('/api/user/username', {
      method: 'PUT',
      body: { username },
    })
  }

  // Social Accounts
  async getSocialAccounts() {
    return this.request('/api/user/social-accounts')
  }

  // Messages
  async getConversations() {
    return this.request('/api/messages/conversations')
  }

  async getMessages(conversationId) {
    return this.request(`/api/messages/conversation/${conversationId}`)
  }

  async sendMessage(receiverId, content) {
    return this.request('/api/messages', {
      method: 'POST',
      body: { receiverId, content },
    })
  }

  async startConversation(userId, initialMessage) {
    return this.request('/api/messages/start-conversation', {
      method: 'POST',
      body: { userId, initialMessage },
    })
  }

  async searchUsers(query) {
    return this.request(`/api/users/search?q=${encodeURIComponent(query)}`)
  }

  async getUnreadCount() {
    return this.request('/api/messages/unread-count')
  }

  // Opportunities
  async getOpportunities(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/opportunities?${params}`)
  }

  async getOpportunity(id) {
    return this.request(`/api/opportunities/${id}`)
  }

  async applyToOpportunity(id, message) {
    return this.request(`/api/opportunities/${id}/apply`, {
      method: 'POST',
      body: { message },
    })
  }

  // Notifications
  async getNotifications() {
    return this.request('/api/notifications')
  }

  async markNotificationRead(id) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    })
  }
}

export const api = new ApiClient()
export default api

