const API_BASE = import.meta.env.PROD 
  ? '' 
  : 'http://localhost:3000'

// Storage helper - uses sessionStorage by default, localStorage for "Remember Me"
const storage = {
  get: (key) => sessionStorage.getItem(key) || localStorage.getItem(key),
  set: (key, value, remember = false) => {
    if (remember) {
      localStorage.setItem(key, value)
      sessionStorage.removeItem(key)
    } else {
      sessionStorage.setItem(key, value)
      localStorage.removeItem(key)
    }
  },
  remove: (key) => {
    sessionStorage.removeItem(key)
    localStorage.removeItem(key)
  },
  isRemembered: () => !!localStorage.getItem('authToken')
}

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE
  }

  getToken() {
    return storage.get('authToken')
  }

  setToken(token, remember = false) {
    storage.set('authToken', token, remember)
  }

  clearToken() {
    storage.remove('authToken')
    storage.remove('userData')
    storage.remove('userType')
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
        window.location.href = '/login'
      }
      throw new Error(data.error || 'Request failed')
    }

    return data
  }

  // Auth
  async login(email, password, remember = false) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    if (data.token) {
      this.setToken(data.token, remember)
      storage.set('userData', JSON.stringify(data.user), remember)
      storage.set('userType', data.user.user_type, remember)
    }
    return data
  }

  async register(userData, remember = false) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: userData,
    })
    if (data.token) {
      this.setToken(data.token, remember)
      storage.set('userData', JSON.stringify(data.user), remember)
      storage.set('userType', userData.userType, remember)
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

  // Campaigns
  async getCampaigns(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/campaigns?${params}`)
  }

  async getCampaign(id) {
    return this.request(`/api/campaigns/${id}`)
  }

  async createCampaign(campaignData) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: campaignData,
    })
  }

  async updateCampaign(id, data) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteCampaign(id) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'DELETE',
    })
  }

  async submitDeliverable(campaignId, deliverableId, url) {
    return this.request(`/api/campaigns/${campaignId}/deliverables/${deliverableId}/submit`, {
      method: 'POST',
      body: { url },
    })
  }

  async approveDeliverable(campaignId, deliverableId) {
    return this.request(`/api/campaigns/${campaignId}/deliverables/${deliverableId}/approve`, {
      method: 'PUT',
    })
  }

  async inviteToCompaign(campaignId, userId) {
    return this.request(`/api/campaigns/${campaignId}/invite`, {
      method: 'POST',
      body: { userId },
    })
  }

  // 2FA
  async setup2FA() {
    return this.request('/api/auth/2fa/setup', {
      method: 'POST',
    })
  }

  async verify2FA(code) {
    return this.request('/api/auth/2fa/verify', {
      method: 'POST',
      body: { code },
    })
  }

  async disable2FA(code) {
    return this.request('/api/auth/2fa/disable', {
      method: 'POST',
      body: { code },
    })
  }

  async verify2FALogin(userId, code) {
    return this.request('/api/auth/2fa/login', {
      method: 'POST',
      body: { userId, code },
    })
  }

  // Assets
  async getAssets(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/assets?${params}`)
  }

  async getAsset(id) {
    return this.request(`/api/assets/${id}`)
  }

  async createAsset(assetData) {
    return this.request('/api/assets', {
      method: 'POST',
      body: assetData,
    })
  }

  async updateAsset(id, data) {
    return this.request(`/api/assets/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteAsset(id) {
    return this.request(`/api/assets/${id}`, {
      method: 'DELETE',
    })
  }

  // Asset Versions
  async getAssetVersions(assetId) {
    return this.request(`/api/assets/${assetId}/versions`)
  }

  async createAssetVersion(assetId) {
    return this.request(`/api/assets/${assetId}/versions`, {
      method: 'POST',
    })
  }

  async submitAssetForReview(assetId, versionId) {
    return this.request(`/api/assets/${assetId}/versions/${versionId}/submit`, {
      method: 'POST',
    })
  }

  async reviewAsset(assetId, versionId, outcome, notes) {
    return this.request(`/api/assets/${assetId}/versions/${versionId}/review`, {
      method: 'POST',
      body: { outcome, notes },
    })
  }

  // Asset Feedback
  async getAssetFeedback(assetId, versionId) {
    return this.request(`/api/assets/${assetId}/versions/${versionId}/feedback`)
  }

  async addAssetFeedback(assetId, versionId, feedbackData) {
    return this.request(`/api/assets/${assetId}/versions/${versionId}/feedback`, {
      method: 'POST',
      body: feedbackData,
    })
  }

  async resolveAssetFeedback(feedbackId) {
    return this.request(`/api/assets/feedback/${feedbackId}/resolve`, {
      method: 'PUT',
    })
  }

  // Asset Scheduling
  async getAssetSchedule(assetId) {
    return this.request(`/api/assets/${assetId}/schedule`)
  }

  async scheduleAsset(assetId, scheduleData) {
    return this.request(`/api/assets/${assetId}/schedule`, {
      method: 'POST',
      body: scheduleData,
    })
  }

  async getAllScheduledAssets(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/assets/schedule?${params}`)
  }

  async cancelScheduleSlot(slotId) {
    return this.request(`/api/assets/schedule/${slotId}`, {
      method: 'DELETE',
    })
  }

  // Asset Metrics
  async getAssetMetrics(assetId, filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/assets/${assetId}/metrics?${params}`)
  }

  async getMetricsSummary(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/assets/metrics/summary?${params}`)
  }

  // Asset Files
  async addAssetFile(assetId, versionId, fileData) {
    return this.request(`/api/assets/${assetId}/versions/${versionId}/files`, {
      method: 'POST',
      body: fileData,
    })
  }

  async removeAssetFile(fileId) {
    return this.request(`/api/assets/files/${fileId}`, {
      method: 'DELETE',
    })
  }

  // Asset Captions
  async addAssetCaption(assetId, versionId, captionData) {
    return this.request(`/api/assets/${assetId}/versions/${versionId}/captions`, {
      method: 'POST',
      body: captionData,
    })
  }

  // Asset Tags
  async addAssetTags(assetId, versionId, tags, tagType = 'general') {
    return this.request(`/api/assets/${assetId}/versions/${versionId}/tags`, {
      method: 'POST',
      body: { tags, tagType },
    })
  }

  async removeAssetTag(tagId) {
    return this.request(`/api/assets/tags/${tagId}`, {
      method: 'DELETE',
    })
  }

  // ============================================
  // TASKS (Motion-like scheduling)
  // ============================================

  async getTasks(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/tasks?${params}`)
  }

  async getTasksForCalendar(startDate, endDate, includeUnscheduled = false) {
    const params = new URLSearchParams({
      startDate,
      endDate,
      includeUnscheduled: includeUnscheduled.toString()
    })
    return this.request(`/api/tasks/calendar?${params}`)
  }

  async getTask(id) {
    return this.request(`/api/tasks/${id}`)
  }

  async createTask(taskData) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: taskData,
    })
  }

  async updateTask(id, data) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async updateTaskStatus(id, status, position) {
    return this.request(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: { status, position },
    })
  }

  async scheduleTask(id, scheduledStart, scheduledEnd, dueDate) {
    return this.request(`/api/tasks/${id}/schedule`, {
      method: 'PATCH',
      body: { scheduledStart, scheduledEnd, dueDate },
    })
  }

  async reorderTasks(tasks) {
    return this.request('/api/tasks/reorder', {
      method: 'POST',
      body: { tasks },
    })
  }

  async deleteTask(id) {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  async addTaskComment(taskId, content) {
    return this.request(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      body: { content },
    })
  }

  async getTaskComments(taskId) {
    return this.request(`/api/tasks/${taskId}/comments`)
  }

  async deleteTaskComment(taskId, commentId) {
    return this.request(`/api/tasks/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
    })
  }

  // ============================================
  // PROJECTS
  // ============================================

  async getProjects(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/projects?${params}`)
  }

  async getProject(id) {
    return this.request(`/api/projects/${id}`)
  }

  async getProjectTasks(id, filters = {}) {
    const params = new URLSearchParams(filters)
    return this.request(`/api/projects/${id}/tasks?${params}`)
  }

  async createProject(projectData) {
    return this.request('/api/projects', {
      method: 'POST',
      body: projectData,
    })
  }

  async updateProject(id, data) {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deleteProject(id) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    })
  }

  async archiveProject(id) {
    return this.request(`/api/projects/${id}/archive`, {
      method: 'PATCH',
    })
  }

  async unarchiveProject(id) {
    return this.request(`/api/projects/${id}/unarchive`, {
      method: 'PATCH',
    })
  }
}

export const api = new ApiClient()
export default api
