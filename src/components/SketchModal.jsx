import React, { useState, useEffect } from 'react';
import { ORIGINAL_ROLES, isWaterRole, isActiveLast20Mins } from '../mockData';

export default function SketchModal({
  isOpen,
  onClose,
  user,
  onSave,
  onDelete,
  onSendLink,
  onResetPassword,
  isNew = false
}) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organization: 'Extreme Endeavors',
    phoneNumber: '',
    selectedRole: 'Operator',
    lastActivity: new Date().toISOString(),
    nodeMessagesScreen: true,
    nodeMessagesText: true,
    nodeMessagesEmail: false,
    eemacsMessagesScreen: true,
    eemacsMessagesText: true,
    eemacsMessagesEmail: false,
    alarmMessagesScreen: true,
    alarmMessagesText: true,
    alarmMessagesEmail: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '',
        confirmPassword: ''
      });
      setIsEditing(isNew);
    } else if (isNew) {
      setFormData({
        userId: `usr-${Math.random().toString(36).substr(2, 9)}`,
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        organization: 'Extreme Endeavors',
        phoneNumber: '',
        selectedRole: 'Operator',
        lastActivity: new Date().toISOString(),
        nodeMessagesScreen: true,
        nodeMessagesText: true,
        nodeMessagesEmail: false,
        eemacsMessagesScreen: true,
        eemacsMessagesText: true,
        eemacsMessagesEmail: false,
        alarmMessagesScreen: true,
        alarmMessagesText: true,
        alarmMessagesEmail: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
      });
      setIsEditing(true);
    }
  }, [user, isNew]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.organization) {
      alert('Please fill out all required fields (First Name, Last Name, Organization, Email).');
      return;
    }
    if (isNew && formData.password && formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }
    onSave(formData);
    setIsEditing(false);
    onClose();
  };

  const isWater = isWaterRole(formData.selectedRole);
  const activeNow = isActiveLast20Mins(formData.lastActivity);

  return (
    <div className="sketch-modal-overlay" onClick={onClose}>
      <div className="sketch-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-top-accent">
          <div className="modal-header-titles">
            <span className="modal-category-tag">
              {isWater ? '🚰 Water Operations Personnel' : '⚡ Technology & Leadership'}
            </span>
            <h2 className="modal-operator-title">
              {isNew ? 'Create New User' : `${formData.firstName} ${formData.lastName}`}
            </h2>
            <p className="modal-sub-id">
              User ID: <code>{formData.userId}</code> • Organization: <strong>{formData.organization}</strong>
            </p>
          </div>

          <button
            type="button"
            className="modal-close-glyph"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="view-mode-layout">
              {/* Profile Card Summary */}
              <div className="view-summary-box">
                <div className="summary-avatar-wrap">
                  <img
                    src={formData.avatar}
                    alt={formData.firstName}
                    className="summary-avatar-img"
                  />
                  {activeNow && (
                    <span className="summary-active-beacon" title="Active on SCADA within last 20 mins"></span>
                  )}
                </div>

                <div className="summary-text-info">
                  <h3>{formData.firstName} {formData.lastName}</h3>
                  <p className="summary-org">{formData.organization}</p>
                  <span className="summary-role-pill">{formData.selectedRole}</span>
                </div>

                <div className="summary-contact-row">
                  <div>
                    <span className="contact-label">Mobile Number</span>
                    <strong className="contact-value">{formData.phoneNumber || 'None'}</strong>
                  </div>
                  <div>
                    <span className="contact-label">Email</span>
                    <strong className="contact-value">{formData.email}</strong>
                  </div>
                  <div>
                    <span className="contact-label">Last Activity</span>
                    <strong className="contact-value">
                      {activeNow ? '🟢 Active in last 20m' : new Date(formData.lastActivity).toLocaleTimeString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Exact SCADA Notification Matrix (Smart Node, EEMACS, Alarm) */}
              <div className="modal-scada-routing-matrix">
                <h4 className="matrix-heading">SCADA Message Routing Configuration</h4>

                <div className="matrix-columns-grid">
                  <div className="matrix-column-card">
                    <h5>Smart Node Messages</h5>
                    <div className="channel-check-row">
                      <span>Screen</span>
                      <strong className={formData.nodeMessagesScreen ? 'text-on' : 'text-off'}>
                        {formData.nodeMessagesScreen ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                    <div className="channel-check-row">
                      <span>SMS Text</span>
                      <strong className={formData.nodeMessagesText ? 'text-on' : 'text-off'}>
                        {formData.nodeMessagesText ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                    <div className="channel-check-row">
                      <span>Email</span>
                      <strong className={formData.nodeMessagesEmail ? 'text-on' : 'text-off'}>
                        {formData.nodeMessagesEmail ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                  </div>

                  <div className="matrix-column-card">
                    <h5>EEMACS Messages</h5>
                    <div className="channel-check-row">
                      <span>Screen</span>
                      <strong className={formData.eemacsMessagesScreen ? 'text-on' : 'text-off'}>
                        {formData.eemacsMessagesScreen ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                    <div className="channel-check-row">
                      <span>SMS Text</span>
                      <strong className={formData.eemacsMessagesText ? 'text-on' : 'text-off'}>
                        {formData.eemacsMessagesText ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                    <div className="channel-check-row">
                      <span>Email</span>
                      <strong className={formData.eemacsMessagesEmail ? 'text-on' : 'text-off'}>
                        {formData.eemacsMessagesEmail ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                  </div>

                  <div className="matrix-column-card">
                    <h5>Alarm Messages</h5>
                    <div className="channel-check-row">
                      <span>Screen</span>
                      <strong className={formData.alarmMessagesScreen ? 'text-on' : 'text-off'}>
                        {formData.alarmMessagesScreen ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                    <div className="channel-check-row">
                      <span>SMS Text</span>
                      <strong className={formData.alarmMessagesText ? 'text-on' : 'text-off'}>
                        {formData.alarmMessagesText ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                    <div className="channel-check-row">
                      <span>Email</span>
                      <strong className={formData.alarmMessagesEmail ? 'text-on' : 'text-off'}>
                        {formData.alarmMessagesEmail ? '✓ ON' : '— OFF'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Table Actions */}
              <div className="modal-quick-actions-bar">
                <button
                  type="button"
                  className="btn-scada-edit"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit"></i> Edit User
                </button>

                <button
                  type="button"
                  className="btn-scada-reset"
                  onClick={() => {
                    onResetPassword(formData);
                  }}
                >
                  <i className="fas fa-undo"></i> Reset Password
                </button>

                <button
                  type="button"
                  className="btn-scada-sendlink"
                  onClick={() => {
                    onSendLink(formData);
                  }}
                >
                  <i className="fas fa-share-square"></i> Send Link
                </button>

                {onDelete && (
                  <button
                    type="button"
                    className="btn-scada-delete"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete user ${formData.firstName} ${formData.lastName}?`)) {
                        onDelete(formData.userId);
                        onClose();
                      }
                    }}
                  >
                    <i className="fas fa-ban"></i> Delete
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* EDIT / CREATE MODE - EXACT FIELDS FROM Edit.cshtml & Register.cshtml */
            <form onSubmit={handleSubmit} className="sketch-edit-form">
              <input type="hidden" value={formData.userId} />

              <div className="form-row-two">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First Name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <label>Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Organization"
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Mobile Number"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.selectedRole}
                    onChange={e => setFormData({ ...formData, selectedRole: e.target.value })}
                  >
                    {ORIGINAL_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isNew && (
                <div className="form-row-two">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              )}

              {/* Exact SCADA Fieldsets from Edit.cshtml */}
              <div className="scada-fieldsets-wrap">
                <fieldset className="scada-fieldset">
                  <legend>Smart Node Messages</legend>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.nodeMessagesScreen}
                      onChange={e => setFormData({ ...formData, nodeMessagesScreen: e.target.checked })}
                    />
                    <span>Screen</span>
                  </label>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.nodeMessagesText}
                      onChange={e => setFormData({ ...formData, nodeMessagesText: e.target.checked })}
                    />
                    <span>SMS Text</span>
                  </label>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.nodeMessagesEmail}
                      onChange={e => setFormData({ ...formData, nodeMessagesEmail: e.target.checked })}
                    />
                    <span>Email</span>
                  </label>
                </fieldset>

                <fieldset className="scada-fieldset">
                  <legend>EEMACS Messages</legend>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.eemacsMessagesScreen}
                      onChange={e => setFormData({ ...formData, eemacsMessagesScreen: e.target.checked })}
                    />
                    <span>Screen</span>
                  </label>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.eemacsMessagesText}
                      onChange={e => setFormData({ ...formData, eemacsMessagesText: e.target.checked })}
                    />
                    <span>SMS Text</span>
                  </label>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.eemacsMessagesEmail}
                      onChange={e => setFormData({ ...formData, eemacsMessagesEmail: e.target.checked })}
                    />
                    <span>Email</span>
                  </label>
                </fieldset>

                <fieldset className="scada-fieldset">
                  <legend>Alarm Messages</legend>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.alarmMessagesScreen}
                      onChange={e => setFormData({ ...formData, alarmMessagesScreen: e.target.checked })}
                    />
                    <span>Screen</span>
                  </label>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.alarmMessagesText}
                      onChange={e => setFormData({ ...formData, alarmMessagesText: e.target.checked })}
                    />
                    <span>SMS Text</span>
                  </label>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={formData.alarmMessagesEmail}
                      onChange={e => setFormData({ ...formData, alarmMessagesEmail: e.target.checked })}
                    />
                    <span>Email</span>
                  </label>
                </fieldset>
              </div>

              {/* Form Buttons */}
              <div className="form-submit-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    if (isNew) onClose();
                    else setIsEditing(false);
                  }}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button type="submit" className="btn-save">
                  <i className="fas fa-check"></i> {isNew ? 'Register User' : 'Update User'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
