import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionContext';
import { 
  Users, Plus, Settings, Mail, Trash2, Crown, Shield, 
  UserPlus, ChevronRight, Building2, MoreVertical, Check, X,
  Copy, ExternalLink, Sparkles, ArrowRight, UserCheck, Clock,
  Zap, Target, BarChart3, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function Teams() {
  const { token, user } = useAuth();
  const { refreshPermissions } = usePermissions();
  const navigate = useNavigate();
  
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newTeam, setNewTeam] = useState({ name: '', description: '', teamType: 'brand' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'invitations'

  useEffect(() => {
    fetchTeams();
    fetchInvitations();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams || []);
        
        // Auto-select first team if none selected
        if (data.teams?.length > 0 && !selectedTeam) {
          fetchTeamDetails(data.teams[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      // This would be a separate endpoint for pending invitations
      // For now, we'll get invitations from the teams endpoint
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    }
  };

  const fetchTeamDetails = async (teamId) => {
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedTeam(data);
      }
    } catch (error) {
      console.error('Failed to fetch team details:', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newTeam.name.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTeam)
      });

      if (response.ok) {
        const data = await response.json();
        setTeams([...teams, data.team]);
        setShowCreateModal(false);
        setNewTeam({ name: '', description: '', teamType: 'brand' });
        fetchTeamDetails(data.team.id);
        refreshPermissions();
        setSuccess('Team created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create team');
      }
    } catch (error) {
      setError('Failed to create team');
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setError('');

    if (!inviteEmail.trim()) {
      setError('Email is required');
      return;
    }

    try {
      const response = await fetch(`/api/teams/${selectedTeam.team.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail })
      });

      if (response.ok) {
        setShowInviteModal(false);
        setInviteEmail('');
        fetchTeamDetails(selectedTeam.team.id);
        setSuccess('Invitation sent!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      setError('Failed to send invitation');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`/api/teams/${selectedTeam.team.id}/members/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchTeamDetails(selectedTeam.team.id);
        setSuccess('Member removed');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to remove member');
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/teams/${selectedTeam.team.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setTeams(teams.filter(t => t.id !== selectedTeam.team.id));
        setSelectedTeam(null);
        refreshPermissions();
        setSuccess('Team deleted');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to delete team');
    }
  };

  const handleRespondToInvite = async (teamId, accept) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accept })
      });

      if (response.ok) {
        fetchTeams();
        refreshPermissions();
        setSuccess(accept ? 'Joined team!' : 'Invitation declined');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to respond to invitation');
    }
  };

  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'admin': return <Shield className="w-4 h-4 text-purple-400" />;
      default: return <Users className="w-4 h-4 text-gray-400" />;
    }
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

      {/* Show empty state or team content */}
      {teams.length === 0 && !loading ? (
        // Beautiful Empty State
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative text-center py-12">
            {/* Hero Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Collaboration Made Easy
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                Build Your Dream Team
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8">
                Create teams, invite collaborators, and work together seamlessly on campaigns, projects, and more.
              </p>
              <Button 
                size="lg" 
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Invite Members</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Add team members by email and assign roles with specific permissions
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Shared Campaigns</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Collaborate on campaigns with your team in real-time
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Team Analytics</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Track team performance and campaign metrics together
                </p>
              </div>
            </div>

            {/* Team Types */}
            <div className="mt-12 max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold mb-6 text-[var(--text-secondary)]">Choose Your Team Type</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button 
                  onClick={() => {
                    setNewTeam({ ...newTeam, teamType: 'brand' });
                    setShowCreateModal(true);
                  }}
                  className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-teal-500/50 transition-all text-left group"
                >
                  <Building2 className="w-8 h-8 text-teal-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold mb-1">Brand Team</h4>
                  <p className="text-xs text-[var(--text-muted)]">For companies managing marketing campaigns</p>
                </button>
                
                <button 
                  onClick={() => {
                    setNewTeam({ ...newTeam, teamType: 'agency' });
                    setShowCreateModal(true);
                  }}
                  className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-500/50 transition-all text-left group"
                >
                  <Zap className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold mb-1">Agency</h4>
                  <p className="text-xs text-[var(--text-muted)]">For agencies managing multiple clients</p>
                </button>
                
                <button 
                  onClick={() => {
                    setNewTeam({ ...newTeam, teamType: 'creator' });
                    setShowCreateModal(true);
                  }}
                  className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-orange-500/50 transition-all text-left group"
                >
                  <Sparkles className="w-8 h-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold mb-1">Creator Collective</h4>
                  <p className="text-xs text-[var(--text-muted)]">For creators collaborating together</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Teams Content
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Teams</h1>
              <p className="text-[var(--text-secondary)]">
                Manage your teams and collaborate with others
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--border-color)]">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-3 font-medium transition-colors relative ${
                activeTab === 'teams' 
                  ? 'text-teal-400' 
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              My Teams ({teams.length})
              {activeTab === 'teams' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-4 py-3 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'invitations' 
                  ? 'text-teal-400' 
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Invitations
              {invitations.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                  {invitations.length}
                </span>
              )}
              {activeTab === 'invitations' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
              )}
            </button>
          </div>

          {activeTab === 'teams' ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Teams List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="space-y-3">
                  {teams.map(team => (
                    <button
                      key={team.id}
                      onClick={() => fetchTeamDetails(team.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedTeam?.team?.id === team.id
                          ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/50 shadow-lg shadow-teal-500/10'
                          : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
                      } border border-[var(--border-color)]`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            team.team_type === 'brand' 
                              ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                              : team.team_type === 'agency'
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                              : 'bg-gradient-to-br from-orange-500 to-red-500'
                          }`}>
                            {team.team_type === 'brand' ? (
                              <Building2 className="w-6 h-6 text-white" />
                            ) : team.team_type === 'agency' ? (
                              <Zap className="w-6 h-6 text-white" />
                            ) : (
                              <Sparkles className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{team.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">
                              {team.member_count || 1} member{team.member_count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${
                          selectedTeam?.team?.id === team.id ? 'text-teal-400 rotate-90' : 'text-[var(--text-muted)]'
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quick Actions Card */}
                <Card className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-400" />
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left text-sm flex items-center gap-3"
                      >
                        <Plus className="w-4 h-4 text-teal-400" />
                        Create New Team
                      </button>
                      {selectedTeam && selectedTeam.isOwner && (
                        <button 
                          onClick={() => setShowInviteModal(true)}
                          className="w-full p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left text-sm flex items-center gap-3"
                        >
                          <UserPlus className="w-4 h-4 text-teal-400" />
                          Invite Team Member
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Details */}
              <div className="lg:col-span-2">
                {selectedTeam ? (
                  <Card>
                    <CardHeader className="border-b border-[var(--border-color)]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            selectedTeam.team.team_type === 'brand' 
                              ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                              : selectedTeam.team.team_type === 'agency'
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                              : 'bg-gradient-to-br from-orange-500 to-red-500'
                          }`}>
                            {selectedTeam.team.team_type === 'brand' ? (
                              <Building2 className="w-7 h-7 text-white" />
                            ) : selectedTeam.team.team_type === 'agency' ? (
                              <Zap className="w-7 h-7 text-white" />
                            ) : (
                              <Sparkles className="w-7 h-7 text-white" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{selectedTeam.team.name}</CardTitle>
                            {selectedTeam.team.description && (
                              <p className="text-[var(--text-secondary)] mt-1">
                                {selectedTeam.team.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-xs capitalize">
                                {selectedTeam.team.team_type}
                              </span>
                              {selectedTeam.isOwner && (
                                <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1">
                                  <Crown className="w-3 h-3" />
                                  Owner
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedTeam.isOwner && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowInviteModal(true)}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Invite
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDeleteTeam}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Team Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                          <p className="text-2xl font-bold text-teal-400">{selectedTeam.members?.length || 0}</p>
                          <p className="text-sm text-[var(--text-muted)]">Members</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                          <p className="text-2xl font-bold text-purple-400">{selectedTeam.roles?.length || 0}</p>
                          <p className="text-sm text-[var(--text-muted)]">Roles</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                          <p className="text-2xl font-bold text-orange-400">
                            {new Date(selectedTeam.team.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-[var(--text-muted)]">Created</p>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Team Members</h3>
                          {selectedTeam.isOwner && (
                            <Button variant="ghost" size="sm" onClick={() => setShowInviteModal(true)}>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {selectedTeam.members?.map(member => (
                            <div 
                              key={member.user_id}
                              className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                                  {member.avatar_url ? (
                                    <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-white font-semibold">
                                      {member.name?.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{member.name}</p>
                                    {getRoleIcon(member.role_name)}
                                  </div>
                                  <p className="text-sm text-[var(--text-muted)]">{member.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  member.status === 'active' 
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {member.status === 'active' ? (
                                    <span className="flex items-center gap-1">
                                      <UserCheck className="w-3 h-3" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Pending
                                    </span>
                                  )}
                                </span>
                                {selectedTeam.isOwner && member.user_id !== selectedTeam.team.owner_id && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveMember(member.user_id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Team Roles */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Available Roles</h3>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {selectedTeam.roles?.map(role => (
                            <div 
                              key={role.id}
                              className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {getRoleIcon(role.name)}
                                <p className="font-medium">{role.display_name}</p>
                              </div>
                              <p className="text-xs text-[var(--text-muted)]">
                                {role.permissions?.length === 1 && role.permissions[0] === '*'
                                  ? 'Full access'
                                  : `${role.permissions?.length || 0} permissions`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full">
                    <CardContent className="py-16 h-full flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-[var(--text-muted)]" />
                      </div>
                      <p className="text-xl font-semibold mb-2">Select a Team</p>
                      <p className="text-[var(--text-muted)] text-center max-w-sm">
                        Choose a team from the list to view details, manage members, and collaborate
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            // Invitations Tab
            <div className="max-w-2xl mx-auto">
              {invitations.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Mail className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
                    <p className="text-xl font-semibold mb-2">No Pending Invitations</p>
                    <p className="text-[var(--text-muted)]">
                      When someone invites you to join their team, it will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {invitations.map(invite => (
                    <Card key={invite.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">{invite.team_name}</p>
                              <p className="text-sm text-[var(--text-muted)]">
                                Invited by {invite.invited_by_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleRespondToInvite(invite.team_id, true)}>
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button variant="ghost" onClick={() => handleRespondToInvite(invite.team_id, false)}>
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-lg border border-[var(--border-color)] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create New Team</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Build something great together</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleCreateTeam} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name *</label>
                <Input
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="My Awesome Team"
                  required
                  className="text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="What is this team about?"
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] resize-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Team Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'brand', label: 'Brand', icon: Building2, color: 'teal' },
                    { value: 'agency', label: 'Agency', icon: Zap, color: 'purple' },
                    { value: 'creator', label: 'Creator', icon: Sparkles, color: 'orange' }
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewTeam({ ...newTeam, teamType: type.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        newTeam.teamType === type.value
                          ? `border-${type.color}-500 bg-${type.color}-500/10`
                          : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                        newTeam.teamType === type.value ? `text-${type.color}-400` : 'text-[var(--text-muted)]'
                      }`} />
                      <p className={`text-sm font-medium ${
                        newTeam.teamType === type.value ? 'text-white' : 'text-[var(--text-secondary)]'
                      }`}>{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
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
                  Create Team
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-lg border border-[var(--border-color)] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Invite Team Member</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Add a collaborator to {selectedTeam?.team?.name}</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleInviteMember} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                  className="text-lg"
                />
                <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" />
                  The user must have an existing account on the platform
                </p>
              </div>
              
              {/* Role Selection (future feature) */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-sm">Default Role: Member</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      You can change their role after they accept the invitation
                    </p>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1" 
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setError('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
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
            <p className="text-[var(--text-muted)]">Loading teams...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}

