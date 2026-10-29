import React, { useState } from 'react';
import { initialScadaUsers, ORIGINAL_ROLES, isActiveLast20Mins } from './mockData';
import ScadaTopBar from './components/ScadaTopBar';
import ScadaDashboard from './components/ScadaDashboard';
import SketchCard from './components/SketchCard';
import SketchListView from './components/SketchListView';
import SketchModal from './components/SketchModal';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('users'); // 'dashboard' | 'users'
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'list' (default card)
  const [users, setUsers] = useState(initialScadaUsers);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState('');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleOpenDetail = (user) => {
    setSelectedUser(user);
    setIsNew(false);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsNew(true);
    setIsModalOpen(true);
  };

  const handleSave = (userData) => {
    if (isNew) {
      setUsers([userData, ...users]);
      triggerToast(`SUCCESS: Registered new user ${userData.firstName} ${userData.lastName}.`);
    } else {
      setUsers(users.map(u => u.userId === userData.userId ? userData : u));
      triggerToast(`SUCCESS: Updated user configuration for ${userData.firstName} ${userData.lastName}.`);
    }
  };

  const handleDelete = (userId) => {
    const target = users.find(u => u.userId === userId);
    setUsers(users.filter(u => u.userId !== userId));
    triggerToast(`REMOVED: User ${target?.firstName || ''} ${target?.lastName || ''} deleted from SCADA.`);
  };

  const handleSendLink = (user) => {
    triggerToast(`LINK DISPATCHED: Magic authentication link sent to ${user.email}.`);
  };

  const handleResetPassword = (user) => {
    triggerToast(`PASSWORD RESET: Password reset token dispatched to ${user.email}.`);
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const query = search.toLowerCase();
    const queryMatch =
      `${u.firstName} ${u.lastName} ${u.organization} ${u.email} ${u.phoneNumber} ${u.selectedRole}`
        .toLowerCase()
        .includes(query);

    if (!queryMatch) return false;
    if (selectedRole !== 'all' && u.selectedRole !== selectedRole) return false;

    return true;
  });

  const onDutyCount = users.filter(u => isActiveLast20Mins(u.lastActivity)).length;

  return (
    <div className="sketch-app-root">
      {/* Toast Notification */}
      {toast && (
        <div className="scada-toast-banner">
          <i className="fas fa-info-circle toast-check"></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Original SCADA Navigation Topbar */}
      <ScadaTopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser="Pete"
      />

      {/* Main View Router: Dashboard or Users */}
      {activeTab === 'dashboard' ? (
        <main className="sketch-main-container">
          <ScadaDashboard />
        </main>
      ) : (
        <main className="sketch-main-container">
          {/* Active in the last 20 minutes section (exact original SCADA feature) */}
          <div className="active-users-banner">
            <div className="active-banner-left">
              <span className="live-ping-dot"></span>
              <strong>Users Active in the last 20 Minutes:</strong>
              <div className="active-names-list">
                {users.filter(u => isActiveLast20Mins(u.lastActivity)).map(u => (
                  <span key={u.userId} className="active-user-badge">
                    {u.firstName} {u.lastName}
                  </span>
                ))}
              </div>
            </div>
            <span className="active-count-tag">{onDutyCount} Online Now</span>
          </div>

          {/* Controls Row: Role Filter + Search + Add User */}
          <section className="sketch-subnav-row">
            {/* Role Dropdown */}
            <div className="role-filter-box">
              <label>Role:</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="scada-role-dropdown"
              >
                <option value="all">All Roles</option>
                {ORIGINAL_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="sketch-search-capsule">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search by name, organization, phone, role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-btn" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            {/* View Mode Toggle: Cards vs List */}
            <div className="sketch-view-toggle">
              <button
                type="button"
                className={`sketch-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                title="Card Grid View (Default)"
              >
                <i className="fas fa-th-large"></i> Cards
              </button>
              <button
                type="button"
                className={`sketch-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Table List View"
              >
                <i className="fas fa-bars"></i> List
              </button>
            </div>

            {/* Add User Button */}
            <button className="sketch-add-user-btn" onClick={handleAddNew}>
              <i className="fas fa-user-plus"></i>
              <span>Add User</span>
            </button>
          </section>

          {/* Conditional Display: Full-width 4-Column Card Grid vs List Table */}
          {viewMode === 'card' ? (
            <div className="sketch-fullwidth-grid">
              {filteredUsers.map(user => (
                <SketchCard
                  key={user.userId}
                  user={user}
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </div>
          ) : (
            <SketchListView
              users={filteredUsers}
              onOpenDetail={handleOpenDetail}
              onSendLink={handleSendLink}
              onResetPassword={handleResetPassword}
              onDelete={handleDelete}
            />
          )}

          {filteredUsers.length === 0 && (
            <div className="sketch-empty-notice">
              <p>No SCADA users match your current search.</p>
              <button
                className="btn-reset"
                onClick={() => {
                  setSearch('');
                  setSelectedRole('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      )}

      {/* Modal for Details and Editing */}
      <SketchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSave}
        onDelete={handleDelete}
        onSendLink={handleSendLink}
        onResetPassword={handleResetPassword}
        isNew={isNew}
      />
    </div>
  );
}
