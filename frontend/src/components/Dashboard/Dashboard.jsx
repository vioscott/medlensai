import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sessions');
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setError('Failed to load sessions');
      setSessions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await axios.post('/api/sessions', {
        title: `Session ${new Date().toLocaleString()}`,
        patientName: 'New Patient',
        sessionType: 'consultation'
      });
      const newSession = response.data.session;

      // Add to sessions list
      setSessions(prev => [newSession, ...prev]);

      // Navigate to the new session
      navigate(`/session/${newSession.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      setError('Failed to create session');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    { name: 'Total Sessions', value: sessions.length.toString(), icon: '🎤', color: 'primary' },
    { name: 'Notes Created', value: Math.floor(sessions.length * 0.8).toString(), icon: '📄', color: 'success' },
    { name: 'Images Analyzed', value: Math.floor(sessions.length * 0.3).toString(), icon: '📷', color: 'warning' },
    { name: 'Hours Saved', value: (sessions.length * 2).toString(), icon: '⏰', color: 'medical' },
  ];

  const recentSessions = sessions.slice(0, 3).map(session => ({
    id: session.id,
    title: session.patientName || session.title || `Session ${session.id}`,
    date: new Date(session.createdAt || session.created_at).toLocaleDateString(),
    status: session.status || 'completed'
  }));

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {user?.name || user?.email}</p>
            </div>
            <button className="btn btn-primary" onClick={createNewSession}>
              <span className="btn-icon">+</span>
              New Session
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.name} className="stat-card">
                <div className="stat-card-body">
                  <div className="stat-content">
                    <div className={`stat-icon stat-icon-${stat.color}`}>
                      <span className="stat-emoji">{stat.icon}</span>
                    </div>
                    <div className="stat-info">
                      <p className="stat-label">{stat.name}</p>
                      <p className="stat-value">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            {/* Recent Sessions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Recent Sessions</h2>
              </div>
              <div className="card-body">
                {error && (
                  <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                  </div>
                )}

                {recentSessions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No sessions yet</h3>
                    <p>Create your first consultation session to get started</p>
                    <button className="btn btn-primary" onClick={createNewSession}>
                      Create First Session
                    </button>
                  </div>
                ) : (
                  <div className="sessions-list">
                    {recentSessions.map((session) => (
                      <div key={session.id} className="session-item">
                        <div className="session-info">
                          <h3 className="session-title">{session.title}</h3>
                          <p className="session-date">{session.date}</p>
                        </div>
                        <span className={`status-badge status-${session.status}`}>
                          {session.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              <div className="card-body">
                <div className="quick-actions-grid">
                  <button className="quick-action-btn" onClick={createNewSession}>
                    <span className="action-icon">🎤</span>
                    <p className="action-text">Start Recording</p>
                  </button>
                  <button className="quick-action-btn">
                    <span className="action-icon">📷</span>
                    <p className="action-text">Upload Image</p>
                  </button>
                  <button className="quick-action-btn" onClick={() => navigate('/sessions')}>
                    <span className="action-icon">📄</span>
                    <p className="action-text">View Notes</p>
                  </button>
                  <button className="quick-action-btn">
                    <span className="action-icon">📊</span>
                    <p className="action-text">Analytics</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
