import React, { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────
   TANK CARD — animated CSS water fill with wave SVG
───────────────────────────────────────────────────────── */
function TankCard({ name, location, level, volume, height, onLevelChange, index }) {
  const pct = Math.min(100, Math.max(0, Math.round(level)));
  const waveColor =
    pct < 30 ? '#ef4444' :
    pct < 50 ? '#f59e0b' :
               '#0ea5e9';

  const waveColorLight =
    pct < 30 ? '#fca5a5' :
    pct < 50 ? '#fcd34d' :
               '#7dd3fc';

  return (
    <div className="d2-tank-card">
      {/* Wave background SVG decorative */}
      <svg className="d2-tank-wave-bg" viewBox="0 0 400 80" preserveAspectRatio="none">
        <path
          d="M0,40 C80,10 160,70 240,40 C320,10 360,60 400,40 L400,80 L0,80 Z"
          fill="#e0f2fe"
          opacity="0.6"
        />
        <path
          d="M0,55 C60,30 140,75 220,55 C300,35 360,65 400,50 L400,80 L0,80 Z"
          fill="#bae6fd"
          opacity="0.5"
        />
      </svg>

      {/* Header */}
      <div className="d2-tank-header">
        <div>
          <div className="d2-tank-name">{name}</div>
          <div className="d2-tank-location">📍 {location}</div>
        </div>
        <div className={`d2-tank-status-pill ${pct < 30 ? 'd2-pill-danger' : pct < 50 ? 'd2-pill-warn' : 'd2-pill-ok'}`}>
          {pct < 30 ? '⚠️ Low' : pct < 50 ? '🟡 Medium' : '✅ Good'}
        </div>
      </div>

      {/* Animated water fill visual */}
      <div className="d2-tank-visual-area">
        <div className="d2-tank-tube">
          <div
            className="d2-water-fill"
            style={{
              height: `${pct}%`,
              background: `linear-gradient(180deg, ${waveColorLight} 0%, ${waveColor} 100%)`,
            }}
          >
            {/* Animated wave on top of fill */}
            <div className="d2-wave-top" style={{ background: waveColorLight }} />
          </div>
          {/* Tick marks */}
          {[75, 50, 25].map(t => (
            <div key={t} className="d2-tick" style={{ bottom: `${t}%` }}>
              <span className="d2-tick-label">{t}%</span>
            </div>
          ))}
        </div>

        <div className="d2-tank-pct-display">
          <span
            className="d2-pct-number"
            style={{ color: waveColor }}
          >
            {pct}%
          </span>
          <span className="d2-pct-label">Full</span>
        </div>
      </div>

      {/* Badge row */}
      <div className="d2-tank-badge-row">
        <div className="d2-info-badge">
          <span className="d2-badge-icon">💧</span>
          <span className="d2-badge-val">{volume.toLocaleString()} L</span>
          <span className="d2-badge-lbl">Volume</span>
        </div>
        <div className="d2-info-badge">
          <span className="d2-badge-icon">📏</span>
          <span className="d2-badge-val">{height} m</span>
          <span className="d2-badge-lbl">Height</span>
        </div>
      </div>

      {/* Slider */}
      <div className="d2-slider-row">
        <label className="d2-slider-label">Set Level</label>
        <input
          type="range"
          className="d2-level-slider"
          min={0}
          max={100}
          step={1}
          value={pct}
          onChange={e => onLevelChange(Number(e.target.value))}
          style={{ accentColor: waveColor }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PUMP CARD — animated spinning gear SVG
───────────────────────────────────────────────────────── */
function PumpCard({ pump, onToggle }) {
  return (
    <div className={`d2-pump-card ${pump.running ? 'd2-pump-running' : 'd2-pump-standby'}`}>
      {/* Header */}
      <div className="d2-pump-header">
        <div className="d2-pump-icon-name">
          <span className="d2-pump-emoji">⚙️</span>
          <div>
            <div className="d2-pump-name">{pump.name}</div>
            <div className="d2-pump-zone">{pump.zone}</div>
          </div>
        </div>
        <span className={`d2-status-pill ${pump.running ? 'd2-pill-running' : 'd2-pill-standby'}`}>
          {pump.running ? 'RUNNING' : 'STANDBY'}
        </span>
      </div>

      {/* Gear animation */}
      <div className="d2-gear-center">
        <svg
          className={`d2-gear-svg ${pump.running ? 'd2-gear-spin' : ''}`}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(50,50)">
            {/* Gear teeth */}
            {Array.from({ length: 10 }, (_, i) => {
              const angle = (i * 36 * Math.PI) / 180;
              const x = Math.cos(angle) * 38;
              const y = Math.sin(angle) * 38;
              return (
                <rect
                  key={i}
                  x={x - 4}
                  y={y - 7}
                  width={8}
                  height={14}
                  rx={2}
                  fill={pump.running ? '#0ea5e9' : '#94a3b8'}
                  transform={`rotate(${i * 36})`}
                />
              );
            })}
            {/* Outer ring */}
            <circle r={30} fill={pump.running ? '#e0f2fe' : '#f1f5f9'} stroke={pump.running ? '#0ea5e9' : '#cbd5e1'} strokeWidth={3} />
            {/* Inner hub */}
            <circle r={10} fill={pump.running ? '#0284c7' : '#94a3b8'} />
            {/* Center dot */}
            <circle r={4} fill="white" />
            {/* Speed lines when running */}
            {pump.running && [0, 60, 120, 180, 240, 300].map((deg, i) => (
              <line
                key={i}
                x1={0} y1={0}
                x2={Math.cos((deg * Math.PI) / 180) * 22}
                y2={Math.sin((deg * Math.PI) / 180) * 22}
                stroke="#7dd3fc"
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.5}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Stats row */}
      <div className="d2-pump-stats-grid">
        <div className="d2-pump-stat">
          <span className="d2-stat-lbl">Flow</span>
          <span className="d2-stat-val">{pump.flow} L/s</span>
        </div>
        <div className="d2-pump-stat">
          <span className="d2-stat-lbl">Pressure</span>
          <span className="d2-stat-val">{pump.pressure} bar</span>
        </div>
        <div className="d2-pump-stat">
          <span className="d2-stat-lbl">RPM</span>
          <span className="d2-stat-val">{pump.rpm}</span>
        </div>
        <div className="d2-pump-stat">
          <span className="d2-stat-lbl">Runtime</span>
          <span className="d2-stat-val">{pump.runtime}h</span>
        </div>
      </div>

      {/* Toggle button */}
      <button
        className={`d2-pump-toggle-btn ${pump.running ? 'd2-btn-stop' : 'd2-btn-start'}`}
        onClick={onToggle}
      >
        {pump.running ? '⏹ Stop Pump' : '▶ Start Pump'}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PRV STATION — vertical gauge bars
───────────────────────────────────────────────────────── */
function PRVStation({ upstream, downstream }) {
  const maxBar = 10;
  const upPct = Math.min(100, (upstream / maxBar) * 100);
  const downPct = Math.min(100, (downstream / maxBar) * 100);

  return (
    <div className="d2-prv-card">
      <div className="d2-prv-header">
        <div className="d2-prv-title">PRV Station Alpha</div>
        <span className="d2-status-pill d2-pill-running">ACTIVE</span>
      </div>
      <div className="d2-prv-subtitle">Valley Pressure Reduction Zone</div>

      <div className="d2-prv-gauges-row">
        {/* Upstream gauge */}
        <div className="d2-prv-gauge-wrap">
          <div className="d2-gauge-label">Upstream</div>
          <div className="d2-vertical-gauge">
            <div
              className="d2-gauge-fill d2-gauge-upstream"
              style={{ height: `${upPct}%` }}
            >
              <div className="d2-gauge-shine" />
            </div>
            {[25, 50, 75].map(t => (
              <div key={t} className="d2-gauge-tick" style={{ bottom: `${t}%` }} />
            ))}
          </div>
          <div className="d2-gauge-value">{upstream.toFixed(1)}<span className="d2-gauge-unit"> bar</span></div>
        </div>

        {/* Arrow divider */}
        <div className="d2-prv-arrow-col">
          <div className="d2-prv-arrow-label">Reduction</div>
          <div className="d2-prv-arrow">▼</div>
          <div className="d2-prv-reduction-pct">
            -{Math.round(((upstream - downstream) / upstream) * 100)}%
          </div>
        </div>

        {/* Downstream gauge */}
        <div className="d2-prv-gauge-wrap">
          <div className="d2-gauge-label">Downstream</div>
          <div className="d2-vertical-gauge">
            <div
              className="d2-gauge-fill d2-gauge-downstream"
              style={{ height: `${downPct}%` }}
            >
              <div className="d2-gauge-shine" />
            </div>
            {[25, 50, 75].map(t => (
              <div key={t} className="d2-gauge-tick" style={{ bottom: `${t}%` }} />
            ))}
          </div>
          <div className="d2-gauge-value">{downstream.toFixed(1)}<span className="d2-gauge-unit"> bar</span></div>
        </div>
      </div>

      {/* PRV info row */}
      <div className="d2-prv-info-row">
        <div className="d2-prv-info-item">
          <span className="d2-prv-info-lbl">Valve Opening</span>
          <span className="d2-prv-info-val">65%</span>
        </div>
        <div className="d2-prv-info-item">
          <span className="d2-prv-info-lbl">Mode</span>
          <span className="d2-prv-info-val">AUTO</span>
        </div>
      </div>

      {/* Animated pressure pulse dots */}
      <div className="d2-prv-pulse-row">
        <span className="d2-prv-pulse-label">Pressure Signal</span>
        <div className="d2-pulse-dots">
          <span className="d2-pulse-dot d2-dot-1" />
          <span className="d2-pulse-dot d2-dot-2" />
          <span className="d2-pulse-dot d2-dot-3" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────── */
export default function ScadaDashboard() {
  // ── Tank state ──────────────────────────────────────────
  const [tanks, setTanks] = useState([
    { id: 1, name: 'Tank Alpha',  location: 'North Zone',  level: 62, volume: 248000, height: 12.5 },
    { id: 2, name: 'Tank Bravo',  location: 'East Ridge',  level: 45, volume: 180000, height: 10.0 },
    { id: 3, name: 'Tank Charlie',location: 'South Basin', level: 28, volume:  98000, height:  8.0 },
  ]);

  // ── Pump state ──────────────────────────────────────────
  const [pumps, setPumps] = useState([
    { id: 1, name: 'Pump Station 1', zone: 'North Booster',  running: true,  flow: 42.3, pressure: 5.8, rpm: 1450, runtime: 847 },
    { id: 2, name: 'Pump Station 2', zone: 'South Transfer', running: false, flow:  0.0, pressure: 0.0, rpm:    0, runtime: 312 },
  ]);

  // ── PRV state ───────────────────────────────────────────
  const [prv, setPrv] = useState({ upstream: 6.2, downstream: 4.1 });

  // ── Live simulation ──────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => {
      // Micro-fluctuate tank levels
      setTanks(prev => prev.map(t => ({
        ...t,
        level: Math.min(100, Math.max(5, t.level + (Math.random() - 0.5) * 0.6)),
        volume: Math.round(t.volume + (Math.random() - 0.5) * 500),
      })));

      // Fluctuate pump stats for running pumps
      setPumps(prev => prev.map(p => p.running ? ({
        ...p,
        flow:     +(p.flow     + (Math.random() - 0.5) * 1.2).toFixed(1),
        pressure: +(p.pressure + (Math.random() - 0.5) * 0.15).toFixed(2),
        rpm:       Math.round(p.rpm + (Math.random() - 0.5) * 20),
        runtime:   p.runtime,
      }) : p));

      // Fluctuate PRV
      setPrv(prev => ({
        upstream:   +(prev.upstream   + (Math.random() - 0.5) * 0.08).toFixed(2),
        downstream: +(prev.downstream + (Math.random() - 0.5) * 0.06).toFixed(2),
      }));
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  const togglePump = id => {
    setPumps(prev => prev.map(p => p.id === id
      ? { ...p, running: !p.running, flow: !p.running ? 42.0 : 0, pressure: !p.running ? 5.8 : 0, rpm: !p.running ? 1450 : 0 }
      : p
    ));
  };

  const setTankLevel = (id, level) => {
    setTanks(prev => prev.map(t => t.id === id ? { ...t, level } : t));
  };

  const runningPumps = pumps.filter(p => p.running).length;
  const warningTanks = tanks.filter(t => t.level < 30).length;

  return (
    <div className="d2-dashboard">

      {/* ── STATUS STRIP ──────────────────────────────── */}
      <div className="d2-status-strip">
        <div className="d2-status-pill-group">
          <span className="d2-strip-pill d2-strip-ok">🟢 All Systems Nominal</span>
          <span className="d2-strip-pill d2-strip-info">💧 {tanks.length} Tanks Monitored</span>
          <span className="d2-strip-pill d2-strip-active">⚡ {runningPumps} Pump{runningPumps !== 1 ? 's' : ''} Active</span>
          <span className={`d2-strip-pill ${warningTanks > 0 ? 'd2-strip-warn' : 'd2-strip-ok'}`}>
            🔔 {warningTanks} Warning{warningTanks !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="d2-strip-time">
          <span className="d2-live-dot" />
          Live · Updated 2s
        </div>
      </div>

      {/* ── SECTION LABEL: TANKS ────────────────────── */}
      <div className="d2-section-header">
        <span className="d2-section-icon">🏗️</span>
        <h2 className="d2-section-title">Storage Tanks</h2>
        <span className="d2-section-sub">Real-time fill monitoring</span>
      </div>

      {/* ── ROW 1: TANKS ────────────────────────────── */}
      <div className="d2-tanks-row">
        {tanks.map((tank, i) => (
          <TankCard
            key={tank.id}
            {...tank}
            index={i}
            onLevelChange={val => setTankLevel(tank.id, val)}
          />
        ))}
      </div>

      {/* ── SECTION LABEL: PUMPS + PRV ──────────────── */}
      <div className="d2-section-header">
        <span className="d2-section-icon">⚙️</span>
        <h2 className="d2-section-title">Pump Stations & PRV</h2>
        <span className="d2-section-sub">Pressure control & distribution</span>
      </div>

      {/* ── ROW 2: PUMPS + PRV ──────────────────────── */}
      <div className="d2-bottom-row">
        <div className="d2-pumps-col">
          {pumps.map(pump => (
            <PumpCard key={pump.id} pump={pump} onToggle={() => togglePump(pump.id)} />
          ))}
        </div>
        <div className="d2-prv-col">
          <PRVStation upstream={prv.upstream} downstream={prv.downstream} />
        </div>
      </div>

    </div>
  );
}
