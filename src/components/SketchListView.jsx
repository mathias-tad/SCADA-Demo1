import React from 'react';
import { isActiveLast20Mins, isWaterRole } from '../mockData';

export default function SketchListView({
  users,
  onOpenDetail,
  onSendLink,
  onResetPassword,
  onDelete
}) {
  const roleColorMap = {
    Administrator: { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
    Operator:      { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
    Control:       { bg: '#CCFBF1', text: '#0F766E', border: '#99F6E4' },
    Monitor:       { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
    Auditor:       { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF' },
    None:          { bg: '#F8FAFC', text: '#94A3B8', border: '#E2E8F0' },
  };

  const renderChannelBadges = (screen, text, email) => {
    return (
      <div className="sketch-channel-group">
        <span className={`sketch-ch-badge ${screen ? 'ch-on' : 'ch-off'}`} title={screen ? "Screen Enabled" : "Screen Off"}>
          🖥️ Screen
        </span>
        <span className={`sketch-ch-badge ${text ? 'ch-on' : 'ch-off'}`} title={text ? "SMS Text Enabled" : "SMS Off"}>
          📱 SMS
        </span>
        <span className={`sketch-ch-badge ${email ? 'ch-on' : 'ch-off'}`} title={email ? "Email Enabled" : "Email Off"}>
          ✉️ Email
        </span>
      </div>
    );
  };

  return (
    <div className="sketch-list-wrapper">
      <table className="sketch-list-table">
        <thead>
          <tr>
            <th style={{ width: '45px' }}>Live</th>
            <th>User &amp; Organization</th>
            <th>Contact Details</th>
            <th>Role</th>
            <th>Smart Node Msgs</th>
            <th>EEMACS Msgs</th>
            <th>Alarm Msgs</th>
            <th style={{ width: '160px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const isWater = isWaterRole(user.selectedRole);
            const activeNow = isActiveLast20Mins(user.lastActivity);
            const roleStyle = roleColorMap[user.selectedRole] || { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };

            return (
              <tr key={user.userId} className={`sketch-table-row ${isWater ? 'row-water' : 'row-tech'}`}>
                {/* Status Indicator */}
                <td style={{ textAlign: 'center' }}>
                  <div className="sketch-status-beacon-wrap">
                    {activeNow ? (
                      <span className="sketch-beacon-live" title="Active within last 20 mins"></span>
                    ) : (
                      <span className="sketch-beacon-idle" title="Standby / Inactive"></span>
                    )}
                  </div>
                </td>

                {/* Name, Avatar & Org */}
                <td>
                  <div className="sketch-user-cell" onClick={() => onOpenDetail(user)}>
                    <div className="sketch-avatar-mini-wrap">
                      <img
                        src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="sketch-avatar-mini"
                      />
                      <span className="sketch-corner-glyph">{isWater ? '🚰' : '⚡'}</span>
                    </div>
                    <div className="sketch-user-meta">
                      <span className="sketch-user-title">{user.firstName} {user.lastName}</span>
                      <span className="sketch-user-org">{user.organization || 'Extreme SCADA'}</span>
                    </div>
                  </div>
                </td>

                {/* Contact (Phone & Email) */}
                <td>
                  <div className="sketch-contact-box">
                    <a href={`tel:${user.phoneNumber}`} className="sketch-link-phone" onClick={e => e.stopPropagation()}>
                      <i className="fas fa-phone-alt"></i> {user.phoneNumber}
                    </a>
                    <a href={`mailto:${user.email}`} className="sketch-link-email" onClick={e => e.stopPropagation()}>
                      <i className="fas fa-envelope"></i> {user.email}
                    </a>
                  </div>
                </td>

                {/* Role Badge */}
                <td>
                  <span
                    className="sketch-table-role-pill"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, borderColor: roleStyle.border }}
                  >
                    {user.selectedRole}
                  </span>
                </td>

                {/* Smart Node */}
                <td>
                  {renderChannelBadges(user.nodeMessagesScreen, user.nodeMessagesText, user.nodeMessagesEmail)}
                </td>

                {/* EEMACS Messages */}
                <td>
                  {renderChannelBadges(user.eemacsMessagesScreen, user.eemacsMessagesText, user.eemacsMessagesEmail)}
                </td>

                {/* Alarm Messages */}
                <td>
                  {renderChannelBadges(user.alarmMessagesScreen, user.alarmMessagesText, user.alarmMessagesEmail)}
                </td>

                {/* Action Buttons */}
                <td>
                  <div className="sketch-actions-cluster">
                    <button
                      type="button"
                      className="sketch-action-btn btn-edit"
                      onClick={() => onOpenDetail(user)}
                      title="Edit User Configuration"
                    >
                      <i className="fas fa-pencil-alt"></i> Edit
                    </button>

                    <button
                      type="button"
                      className="sketch-action-btn btn-link"
                      onClick={() => onSendLink(user)}
                      title="Send Magic Login Link"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>

                    <button
                      type="button"
                      className="sketch-action-btn btn-reset-pw"
                      onClick={() => onResetPassword(user)}
                      title="Reset Password"
                    >
                      <i className="fas fa-key"></i>
                    </button>

                    <button
                      type="button"
                      className="sketch-action-btn btn-delete-user"
                      onClick={() => onDelete(user.userId)}
                      title="Delete User"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
