import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions, Role } from '../context/PermissionContext';
import { 
  Users, Plus, Settings, Mail, Trash2, Crown, Shield, 
  UserPlus, ChevronRight, Building2, MoreVertical, Check, X,
  Copy, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Teams() {
  const { token } = useAuth();
  const { hasRole, hasPermission, refreshPermissions } = usePermissions();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-[var(--text-secondary)]">
            Manage your teams and collaborate with others
          </p>
        </div>
        <Role any={['brand', 'agency']}>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </Role>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Teams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {teams.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No teams yet</p>
                  <p className="text-sm">Create a team to collaborate with others</p>
                </div>
              ) : (
                teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => fetchTeamDetails(team.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedTeam?.team?.id === team.id
                        ? 'bg-teal-500/20 border-teal-500/50'
                        : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
                    } border border-[var(--border-color)]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-[var(--text-muted)]">
                            {team.member_count || 1} member{team.member_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-teal-400" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {invitations.map(invite => (
                  <div key={invite.id} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <p className="font-medium">{invite.team_name}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleRespondToInvite(invite.team_id, true)}>
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRespondToInvite(invite.team_id, false)}>
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Team Details */}
        <div className="lg:col-span-2">
          {selectedTeam ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedTeam.team.name}</CardTitle>
                  {selectedTeam.team.description && (
                    <p className="text-[var(--text-secondary)] mt-1">
                      {selectedTeam.team.description}
                    </p>
                  )}
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
              </CardHeader>
              <CardContent>
                {/* Team Info */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-[var(--bg-secondary)]">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Created</p>
                    <p className="font-medium">
                      {new Date(selectedTeam.team.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Type</p>
                    <p className="font-medium capitalize">{selectedTeam.team.team_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Members</p>
                    <p className="font-medium">{selectedTeam.members?.length || 0}</p>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {selectedTeam.members?.map(member => (
                      <div 
                        key={member.user_id}
                        className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
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
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.status === 'active' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {member.status}
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
                  <h3 className="text-lg font-semibold mb-4">Team Roles</h3>
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
            <Card>
              <CardContent className="py-16">
                <div className="text-center text-[var(--text-muted)]">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select a team to view details</p>
                  <p className="text-sm">Or create a new team to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)]">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name *</label>
                <Input
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="My Awesome Team"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="What is this team about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Team Type</label>
                <select
                  value={newTeam.teamType}
                  onChange={(e) => setNewTeam({ ...newTeam, teamType: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                >
                  <option value="brand">Brand</option>
                  <option value="agency">Agency</option>
                  <option value="creator">Creator Collective</option>
                </select>
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Team
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)]">
            <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                />
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  The user must have an existing account on the platform
                </p>
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => {
                  setShowInviteModal(false);
                  setError('');
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

