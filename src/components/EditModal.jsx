import React, { useState, useEffect } from 'react';
import { ALL_ROLES } from '../mockData';

export default function EditModal({ isOpen, onClose, onSave, onDelete, user, isNew }) {
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
      setIsEditing(isNew);
    } else {
      setFormData({
        id: "usr-" + Date.now(),
        firstName: "",
        lastName: "",
        position: "",
        category: "water",
        organization: "Extreme Endeavors",
        department: "Municipal Water Treatment",
        facility: "Central Water Plant",
        stationZone: "High Tank #2 & Booster Station #4",
        email: "",
        phoneNumber: "",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        specialty: "",
        role: "Operator",
        activeNow: true,
        lastActive: "Active just now",
        tenure: "1 yr ops",
        rating: "5.0",
        notifications: {
          nodeScreen: true,
          nodeText: false,
          nodeEmail: false,
          eemacsScreen: true,
          eemacsText: false,
          eemacsEmail: false,
          alarmScreen: true,
          alarmText: true,
          alarmEmail: true
        }
      });
      setIsEditing(true);
    }
  }, [user, isOpen, isNew]);

  if (!isOpen || !formData) return null;

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Please provide First and Last names.");
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${formData.firstName} ${formData.lastName}?`)) {
      if (onDelete) onDelete(formData.id);
      onClose();
    }
  };

  const isWater = formData.category === 'water';
  const currentRoleObj = ALL_ROLES.find(r => r.id === formData.role) || ALL_ROLES[1];

  return (
    <div className="sketch-modal-overlay" onClick={onClose}>
      <div className="sketch-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Top Header Banner */}
        <div className={`modal-header-strip ${isWater ? 'header-water-tint' : 'header-tech-tint'}`}>
          <div className="header-meta">
            <div className="header-top-badges">
              <span className="specialty-badge">
                {isWater ? '🚰 Water Operations' : '⚡ Technology & Leadership'}
              </span>
              <span className="role-tag-badge" style={{ backgroundColor: currentRoleObj.color, color: '#FFF' }}>
                Role: {formData.role}
              </span>
            </div>
            <h2 className="modal-title">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="modal-subtitle">
              {formData.position} • {formData.organization}
            </p>
          </div>
          
          <div className="header-actions-right">
            {!isNew && (
              <button
                type="button"
                className={`btn-toggle-edit ${isEditing ? 'btn-active-edit' : ''}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'View Mode' : 'Edit Profile ⚙️'}
              </button>
            )}
            <button className="btn-modal-close" onClick={onClose} title="Close window">✕</button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="modal-form-content">
          {/* Quick Stats Strip */}
          <div className="modal-quick-stats">
            <div className="stat-unit">
              <span className="stat-label">Facility / Plant</span>
              <span className="stat-val">{formData.facility || 'Central Water Works'}</span>
            </div>
            <div className="stat-unit">
              <span className="stat-label">Assigned Hardware Zone</span>
              <span className="stat-val">{formData.stationZone || 'Booster & Tank Cluster'}</span>
            </div>
            <div className="stat-unit">
              <span className="stat-label">Reliability Rating</span>
              <span className="stat-val">★ {formData.rating || '5.0'}</span>
            </div>
          </div>

          {/* Category Switcher (when editing) */}
          {isEditing && (
            <div className="form-group-block">
              <label className="block-label">Specialty Card Theme</label>
              <div className="category-choice-grid">
                <button
                  type="button"
                  className={`choice-card ${formData.category === 'water' ? 'active-water-choice' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, category: 'water' }))}
                >
                  <span className="choice-icon">🚰</span>
                  <div className="choice-text">
                    <strong>Water Operator Theme</strong>
                    <span>Soft Blue • Water Tap Icon</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`choice-card ${formData.category === 'tech' ? 'active-tech-choice' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, category: 'tech' }))}
                >
                  <span className="choice-icon">⚡</span>
                  <div className="choice-text">
                    <strong>Tech & Executive Theme</strong>
                    <span>Warm Peach • Cloud & Nodes Icon</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form Fields: Name, Title, Role */}
          <div className="form-row-2">
            <div className="form-field">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleTextChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="form-field">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleTextChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label>Position / Duty Title</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleTextChange}
                disabled={!isEditing}
                placeholder="e.g. Chief Operator"
              />
            </div>
            <div className="form-field">
              <label>Assigned SCADA Role (6 System Roles)</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleTextChange}
                disabled={!isEditing}
              >
                {ALL_ROLES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label>Emergency Email (MailKit)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="form-field">
              <label>Mobile Number (SMS Twilio)</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleTextChange}
                disabled={!isEditing}
                placeholder="304-555-1818"
              />
            </div>
          </div>

          {/* SCADA Notification Routing Matrix */}
          <div className="notif-routing-card">
            <div className="routing-card-header">
              <span className="routing-title">SCADA Real-Time Alert Dispatch Routing</span>
              <span className="routing-desc">
                {isEditing ? 'Toggle automated alert channels for this user' : 'Active channels currently receiving automated dispatches'}
              </span>
            </div>

            <div className="routing-table">
              <div className="routing-table-header">
                <span>Alert Category</span>
                <span className="align-center">Screen GUI</span>
                <span className="align-center">SMS Carrier</span>
                <span className="align-center">Email SMTP</span>
              </div>

              {/* Smart Node */}
              <div className="routing-table-row">
                <div>
                  <strong>Smart Node Telemetry</strong>
                  <p>RTU station field modems & heartbeats</p>
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.nodeScreen}
                    onChange={() => handleNotifToggle('nodeScreen')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.nodeText}
                    onChange={() => handleNotifToggle('nodeText')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.nodeEmail}
                    onChange={() => handleNotifToggle('nodeEmail')}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* EEMACS Core */}
              <div className="routing-table-row">
                <div>
                  <strong>EEMACS System Events</strong>
                  <p>Logins, configuration changes & audit triggers</p>
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.eemacsScreen}
                    onChange={() => handleNotifToggle('eemacsScreen')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.eemacsText}
                    onChange={() => handleNotifToggle('eemacsText')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.eemacsEmail}
                    onChange={() => handleNotifToggle('eemacsEmail')}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Critical Alarms */}
              <div className="routing-table-row critical-alarm-row">
                <div>
                  <strong style={{ color: '#E11D48' }}>Critical Tank & Pump Alarms</strong>
                  <p>Low water, pump trip, pressure anomaly</p>
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.alarmScreen}
                    onChange={() => handleNotifToggle('alarmScreen')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.alarmText}
                    onChange={() => handleNotifToggle('alarmText')}
                    disabled={!isEditing}
                  />
                </div>
                <div className="align-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.alarmEmail}
                    onChange={() => handleNotifToggle('alarmEmail')}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-bar">
            {!isNew && (
              <button type="button" className="btn-modal-delete" onClick={handleDelete}>
                Delete Operator
              </button>
            )}
            <div className="actions-right">
              <button type="button" className="btn-modal-cancel" onClick={onClose}>
                {isEditing ? 'Cancel' : 'Close'}
              </button>
              {isEditing && (
                <button type="submit" className={`btn-modal-save ${isWater ? 'btn-save-water' : 'btn-save-tech'}`}>
                  {isNew ? 'Create Operator Card' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
