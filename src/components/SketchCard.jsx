import React from 'react';
import { isActiveLast20Mins, isWaterRole } from '../mockData';

export default function SketchCard({ user, onOpenDetail }) {
  const isWater = isWaterRole(user.selectedRole);
  const activeNow = isActiveLast20Mins(user.lastActivity);

  // Role tag color mapping matching original SCADA roles
  const roleColorMap = {
    Administrator: { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' },
    Operator: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
    Control: { bg: '#CCFBF1', text: '#0F766E', border: '#99F6E4' },
    Monitor: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
    Auditor: { bg: '#F3E8FF', text: '#7E22CE', border: '#E9D5FF' },
    None: { bg: '#F8FAFC', text: '#94A3B8', border: '#E2E8F0' },
  };

  const roleStyle = roleColorMap[user.selectedRole] || { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };

  return (
    <div
      className={`sketch-compact-card ${isWater ? 'compact-water' : 'compact-tech'}`}
      onClick={() => onOpenDetail(user)}
      role="button"
      tabIndex={0}
      title="Click to view full user details & edit routing"
    >
      {/* Top Specialty Icon (Dripping Tap for Water, Cloud/Chip for Tech) */}
      <div className="compact-corner-icon">
        {isWater ? (
          <span className="specialty-symbol" title="Water Operations Specialty">🚰</span>
        ) : (
          <span className="specialty-symbol" title="Technology & Executive Leadership">⚡</span>
        )}
      </div>

      {/* Top Center: Circular Avatar with active status beacon (Active in last 20 mins) */}
      <div className="compact-avatar-wrap">
        <img
          src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
          alt={`${user.firstName} ${user.lastName}`}
          className="compact-avatar-img"
        />
        {activeNow && (
          <span className="compact-live-beacon" title="Active on SCADA within last 20 mins"></span>
        )}
      </div>

      {/* Center: Full Name, Organization, and System Role Badge */}
      <div className="compact-info-center">
        <h3 className="compact-name">{user.firstName} {user.lastName}</h3>
        <p className="compact-position">{user.organization}</p>
        
        <div className="compact-badges-row">
          <span
            className="compact-role-pill"
            style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, borderColor: roleStyle.border }}
          >
            {user.selectedRole}
          </span>
          <span className="compact-category-tag">
            {isWater ? 'Water Ops' : 'Tech / Admin'}
          </span>
        </div>
      </div>

      {/* Bottom Bar: Company Logo on Left, Primary Contact on Right */}
      <div className="compact-bottom-bar">
        <div className="compact-company-badge">
          <span className="company-word-extreme">Extreme</span>
          <span className="company-word-endeavors">Endeavors</span>
        </div>

        <div className="compact-contact-summary">
          <span className="compact-phone">{user.phoneNumber}</span>
          <span className="compact-view-link">View Details →</span>
        </div>
      </div>
    </div>
  );
}
