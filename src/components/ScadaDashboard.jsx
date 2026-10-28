import React, { useState, useEffect, useRef } from 'react';

/* ============================================================
   WATER SCADA — Modern Industrial HMI P&ID Dashboard
   Design-2 — Rockwell FactoryTalk Style
   Pure React + Inline SVG | all classNames prefixed "d2-"
   ============================================================ */

// ── Helpers ─────────────────────────────────────────────────
function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function padZ(n) { return String(n).padStart(2, '0'); }

// ── Gradient / Defs IDs ──────────────────────────────────────
const TANK_CFG = [
  {
    id: 'T1', label: 'TANK-01', subLabel: 'Raw Water',
    liquidTop: '#ff9d1a', liquidBot: '#c94000',
    rimTop: '#e87a00', surfaceColor: '#ffb84d',
    cx: 330, initLevel: 45, minLevel: 20, maxLevel: 90, cap: 12000,
  },
  {
    id: 'T2', label: 'TANK-02', subLabel: 'Treated Water',
    liquidTop: '#c8e61a', liquidBot: '#4a6b00',
    rimTop: '#a0c000', surfaceColor: '#d9f033',
    cx: 590, initLevel: 62, minLevel: 30, maxLevel: 95, cap: 15000,
  },
  {
    id: 'T3', label: 'TANK-03', subLabel: 'Filtered Water',
    liquidTop: '#2ea8ff', liquidBot: '#00318b',
    rimTop: '#1080e0', surfaceColor: '#60c8ff',
    cx: 850, initLevel: 77, minLevel: 40, maxLevel: 95, cap: 18000,
  },
  {
    id: 'T4', label: 'TANK-04', subLabel: 'Dist. Header',
    liquidTop: '#00e4d8', liquidBot: '#005a60',
    rimTop: '#00b8b0', surfaceColor: '#60f0eb',
    cx: 1110, initLevel: 52, minLevel: 25, maxLevel: 85, cap: 10000,
  },
];

const TANK_W = 180;   // tank body width
const TANK_H = 260;   // tank body height
const TANK_Y = 175;   // top of tank body
const ELLIPSE_RY = 22; // ellipse vertical radius for 3-D rims

// Build clipPath top-y from level%
function liquidY(level) {
  return TANK_Y + TANK_H * (1 - level / 100);
}

// ── Sub-components ───────────────────────────────────────────

/* 3-D Cylindrical Tank in SVG */
function Tank({ cfg, level, waveOffset, onClick }) {
  const bx = cfg.cx - TANK_W / 2;  // body left x
  const bodyBot = TANK_Y + TANK_H;
  const liqY = liquidY(level);
  const clipId = `clip-liq-${cfg.id}`;
  const bodyGradId = `body-grad-${cfg.id}`;
  const liqGradId = `liq-grad-${cfg.id}`;
  const rimGradId = `rim-grad-${cfg.id}`;
  const glowId = `glow-${cfg.id}`;
  const pct = Math.round(level);
  const volume = Math.round(cfg.cap * level / 100);

  // wave sine path (7 bumps)
  const waveY = liqY;
  const amp = 4;
  const wavePath = (() => {
    let d = `M ${bx} ${waveY}`;
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const x = bx + (TANK_W * i) / steps;
      const y = waveY + amp * Math.sin((i / steps) * Math.PI * 6 + waveOffset);
      d += ` L ${x} ${y}`;
    }
    d += ` L ${bx + TANK_W} ${waveY + TANK_H} L ${bx} ${waveY + TANK_H} Z`;
    return d;
  })();

  const levelColor = pct < 30 ? '#ff4444' : pct < 50 ? '#ffaa00' : '#00e676';

  return (
    <g className="d2-tank-group" onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* ── Defs for this tank ── */}
      <defs>
        {/* Body cylinder gradient: left highlight → centre bright → right shadow */}
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6a7080" />
          <stop offset="18%"  stopColor="#b0b8c8" />
          <stop offset="38%"  stopColor="#d8dce8" />
          <stop offset="55%"  stopColor="#f0f4fc" />
          <stop offset="72%"  stopColor="#c0c8d8" />
          <stop offset="88%"  stopColor="#808898" />
          <stop offset="100%" stopColor="#484f60" />
        </linearGradient>
        {/* Rim gradient */}
        <radialGradient id={rimGradId} cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#e0e6f4" />
          <stop offset="60%"  stopColor="#9aa0b4" />
          <stop offset="100%" stopColor="#484f60" />
        </radialGradient>
        {/* Liquid gradient */}
        <linearGradient id={liqGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={cfg.liquidTop} stopOpacity="0.95" />
          <stop offset="100%" stopColor={cfg.liquidBot}  stopOpacity="1" />
        </linearGradient>
        {/* Liquid clip */}
        <clipPath id={clipId}>
          <rect x={bx} y={liqY} width={TANK_W} height={TANK_H - (liqY - TANK_Y)} />
        </clipPath>
        {/* Glow filter */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Tank name strip ── */}
      <rect x={bx - 2} y={TANK_Y - 46} width={TANK_W + 4} height={22} rx="3" fill="#1a2030" stroke="#3a4560" strokeWidth="1"/>
      <text x={cfg.cx} y={TANK_Y - 30} textAnchor="middle" fill="#e0e8ff" fontSize="11" fontWeight="700" fontFamily="'Consolas','Courier New',monospace" letterSpacing="2">
        {cfg.label}
      </text>
      <text x={cfg.cx} y={TANK_Y - 52} textAnchor="middle" fill="#8899bb" fontSize="9" fontFamily="'Segoe UI',sans-serif">
        {cfg.subLabel}
      </text>

      {/* ── Cylinder body (grey metallic rect) ── */}
      <rect x={bx} y={TANK_Y} width={TANK_W} height={TANK_H} fill={`url(#${bodyGradId})`} />

      {/* ── Liquid fill (clipped) ── */}
      <rect x={bx} y={TANK_Y} width={TANK_W} height={TANK_H} fill={`url(#${liqGradId})`} clipPath={`url(#${clipId})`} />

      {/* ── Liquid wave surface ── */}
      {level > 2 && (
        <path d={wavePath} fill={cfg.surfaceColor} opacity="0.45" clipPath={`url(#${clipId})`} />
      )}

      {/* ── Liquid surface sheen ── */}
      {level > 2 && (
        <ellipse cx={cfg.cx} cy={liqY} rx={TANK_W / 2 - 1} ry={ELLIPSE_RY * 0.55} fill={cfg.surfaceColor} opacity="0.35" />
      )}

      {/* ── Top rim ellipse (3-D cap) ── */}
      <ellipse cx={cfg.cx} cy={TANK_Y} rx={TANK_W / 2} ry={ELLIPSE_RY} fill={`url(#${rimGradId})`} stroke="#707888" strokeWidth="1.5" />
      {/* Inner highlight ring on top */}
      <ellipse cx={cfg.cx} cy={TANK_Y} rx={TANK_W / 2 - 8} ry={ELLIPSE_RY - 6} fill="none" stroke="#d0d8f0" strokeWidth="0.7" opacity="0.6" />

      {/* ── Bottom rim ellipse ── */}
      <ellipse cx={cfg.cx} cy={bodyBot} rx={TANK_W / 2} ry={ELLIPSE_RY} fill="#3a4050" stroke="#555e70" strokeWidth="1.5" />
      {/* bottom highlight */}
      <ellipse cx={cfg.cx} cy={bodyBot} rx={TANK_W / 2 - 4} ry={ELLIPSE_RY - 4} fill="#4a5268" opacity="0.5"/>

      {/* ── Vertical level bar (right side of tank) ── */}
      <rect x={bx + TANK_W + 8} y={TANK_Y} width={8} height={TANK_H} rx="3" fill="#0d1118" stroke="#2a3248" strokeWidth="1"/>
      <rect x={bx + TANK_W + 8} y={liqY} width={8} height={bodyBot - liqY} rx="3" fill={levelColor} opacity="0.85"/>
      {/* Min marker */}
      <line x1={bx + TANK_W + 6} y1={liquidY(cfg.minLevel)} x2={bx + TANK_W + 18} y2={liquidY(cfg.minLevel)} stroke="#ff4444" strokeWidth="1.5"/>
      {/* Max marker */}
      <line x1={bx + TANK_W + 6} y1={liquidY(cfg.maxLevel)} x2={bx + TANK_W + 18} y2={liquidY(cfg.maxLevel)} stroke="#00e676" strokeWidth="1.5"/>

      {/* ── Outlet pipe at bottom centre ── */}
      <rect x={cfg.cx - 10} y={bodyBot + ELLIPSE_RY - 4} width={20} height={28} fill="url(#pipeHorizGrad)" stroke="#3a4050" strokeWidth="1"/>

      {/* ── Digital readout panel ── */}
      <rect x={bx - 5} y={bodyBot + ELLIPSE_RY + 26} width={TANK_W + 10} height={76} rx="5" fill="#0b0f18" stroke="#2a3860" strokeWidth="1.5"/>
      {/* Panel title */}
      <text x={cfg.cx} y={bodyBot + ELLIPSE_RY + 42} textAnchor="middle" fill="#4466aa" fontSize="8.5" fontFamily="'Consolas',monospace" letterSpacing="1.5">TANK LEVEL</text>
      {/* Big volume readout */}
      <text x={cfg.cx} y={bodyBot + ELLIPSE_RY + 64} textAnchor="middle" fill="#00e8cc" fontSize="20" fontWeight="700" fontFamily="'Consolas','Courier New',monospace">
        {volume.toLocaleString()}
      </text>
      <text x={cfg.cx} y={bodyBot + ELLIPSE_RY + 76} textAnchor="middle" fill="#4466aa" fontSize="8" fontFamily="'Consolas',monospace">LITERS</text>
      {/* Percent badge */}
      <rect x={cfg.cx + 48} y={bodyBot + ELLIPSE_RY + 54} width={36} height={18} rx="3" fill={levelColor} opacity="0.18" stroke={levelColor} strokeWidth="0.8"/>
      <text x={cfg.cx + 66} y={bodyBot + ELLIPSE_RY + 66} textAnchor="middle" fill={levelColor} fontSize="10" fontWeight="700" fontFamily="'Consolas',monospace">{pct}%</text>
      {/* Mini bar in panel */}
      <rect x={bx + 6} y={bodyBot + ELLIPSE_RY + 82} width={TANK_W - 12} height={8} rx="3" fill="#1a2038" stroke="#2a3860" strokeWidth="0.8"/>
      <rect x={bx + 6} y={bodyBot + ELLIPSE_RY + 82} width={Math.max(0, (TANK_W - 12) * level / 100)} height={8} rx="3" fill={levelColor} opacity="0.8"/>
    </g>
  );
}

/* Pump symbol in SVG */
function PumpSymbol({ cx, cy, r = 28, active, label, flow, onToggle }) {
  const outerGradId = `pump-outer-${label}`;
  const innerGradId = `pump-inner-${label}`;
  return (
    <g className="d2-pump-group" onClick={onToggle} style={{ cursor: 'pointer' }}>
      <defs>
        <radialGradient id={outerGradId} cx="35%" cy="30%" r="65%">
          <stop offset="0%"  stopColor={active ? '#60a0ff' : '#707888'} />
          <stop offset="100%" stopColor={active ? '#1040a0' : '#303848'} />
        </radialGradient>
        <radialGradient id={innerGradId} cx="40%" cy="35%" r="55%">
          <stop offset="0%"  stopColor={active ? '#c0e0ff' : '#a0a8b8'} />
          <stop offset="100%" stopColor={active ? '#4080e0' : '#505868'} />
        </radialGradient>
        {active && (
          <filter id={`pump-glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        )}
      </defs>
      {/* Outer ring */}
      {active && <circle cx={cx} cy={cy} r={r + 10} fill="#1848c8" opacity="0.15" filter={`url(#pump-glow-${label})`}/>}
      <circle cx={cx} cy={cy} r={r + 4} fill={`url(#${outerGradId})`} stroke={active ? '#4080ff' : '#505868'} strokeWidth="2" />
      {/* Inner disc */}
      <circle cx={cx} cy={cy} r={r - 4} fill={`url(#${innerGradId})`} />
      {/* Chevron/impeller arrow */}
      <path
        d={`M ${cx - 10} ${cy - 8} L ${cx + 10} ${cy} L ${cx - 10} ${cy + 8} Z`}
        fill={active ? '#ffffff' : '#9098a8'}
        opacity={active ? '0.95' : '0.6'}
      />
      {/* Spin ring when active */}
      {active && (
        <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke="#80b8ff" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="1.5s" repeatCount="indefinite"/>
        </circle>
      )}
      {/* Label */}
      <text x={cx} y={cy + r + 16} textAnchor="middle" fill={active ? '#80c0ff' : '#8898b0'} fontSize="9" fontFamily="'Consolas',monospace" fontWeight="700">{label}</text>
      {/* Flow readout */}
      <rect x={cx - 28} y={cy + r + 20} width={56} height={16} rx="3" fill="#0b0f18" stroke="#2a3860" strokeWidth="1"/>
      <text x={cx} y={cy + r + 31} textAnchor="middle" fill={active ? '#00e8cc' : '#506080'} fontSize="9.5" fontFamily="'Consolas',monospace" fontWeight="700">
        {active ? `${flow} L/m` : 'STANDBY'}
      </text>
    </g>
  );
}

/* Valve symbol */
function Valve({ cx, cy, open = true, label }) {
  const color = open ? '#00e676' : '#ff4444';
  return (
    <g>
      {/* Valve body: two triangles facing each other (gate valve symbol) */}
      <rect x={cx - 10} y={cy - 10} width={20} height={20} rx="2" fill="#0d1520" stroke={color} strokeWidth="1.5"/>
      <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} stroke={color} strokeWidth="1.5"/>
      <line x1={cx - 8} y1={cy + 8} x2={cx + 8} y2={cy - 8} stroke={color} strokeWidth="1.5"/>
      {/* Status dot */}
      <circle cx={cx} cy={cy} r={3} fill={color} />
      {label && (
        <text x={cx} y={cy + 18} textAnchor="middle" fill={color} fontSize="7.5" fontFamily="'Consolas',monospace">{label}</text>
      )}
    </g>
  );
}

/* Pressure gauge circle */
function Gauge({ cx, cy, r = 24, value, unit, label, color = '#00e8cc' }) {
  const angle = -135 + (value / 100) * 270;
  const rad = (angle * Math.PI) / 180;
  const needleX = cx + (r - 6) * Math.cos(rad);
  const needleY = cy + (r - 6) * Math.sin(rad);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} fill="#0d1520" stroke="#2a3860" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r={r} fill="#10182a"/>
      {/* Arc background */}
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke="#1a2840" strokeWidth="6"/>
      {/* Value arc */}
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${(value / 100) * (r - 4) * 2 * Math.PI * 0.75} ${(r - 4) * 2 * Math.PI}`}
        strokeDashoffset={(r - 4) * 2 * Math.PI * 0.125}
        strokeLinecap="round" opacity="0.9"
      />
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={3} fill="#ffffff"/>
      {/* Value text */}
      <text x={cx} y={cy + 8} textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="'Consolas',monospace">{value}</text>
      <text x={cx} y={cy + r + 12} textAnchor="middle" fill="#6080a0" fontSize="7.5" fontFamily="'Consolas',monospace">{label}</text>
    </g>
  );
}

/* Animated flowing pipe segment */
function FlowPipe({ x1, y1, x2, y2, w = 10, active = true, horizontal = true }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const gradId = `pipe-flow-${x1}-${y1}`;
  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2={horizontal ? '0%' : '100%'} y2={horizontal ? '100%' : '0%'}>
          <stop offset="0%"   stopColor="#404858"/>
          <stop offset="30%"  stopColor="#70808a"/>
          <stop offset="50%"  stopColor="#a8b4c0"/>
          <stop offset="70%"  stopColor="#70808a"/>
          <stop offset="100%" stopColor="#404858"/>
        </linearGradient>
      </defs>
      {/* Pipe body */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${gradId})`} strokeWidth={w} strokeLinecap="square"/>
      {/* Flow animation stripe */}
      {active && (
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#60b0ff" strokeWidth={Math.max(2, w - 6)}
          strokeDasharray="12 20" strokeLinecap="round" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="0.8s" repeatCount="indefinite"/>
        </line>
      )}
    </g>
  );
}

/* Status pill badge */
function StatusBadge({ label, status }) {
  const colors = {
    ok:      { bg: '#0d2a1a', border: '#00c853', text: '#00e676', dot: '#00e676' },
    warn:    { bg: '#2a1a00', border: '#ff9800', text: '#ffb74d', dot: '#ff9800' },
    error:   { bg: '#2a0a0a', border: '#f44336', text: '#ef5350', dot: '#f44336' },
    info:    { bg: '#0a1a2a', border: '#1e88e5', text: '#64b5f6', dot: '#1e88e5' },
  };
  const c = colors[status] || colors.info;
  return (
    <g>
      <rect width={110} height={26} rx="13" fill={c.bg} stroke={c.border} strokeWidth="1"/>
      <circle cx={16} cy={13} r={4} fill={c.dot}>
        {status === 'ok' && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>}
      </circle>
      <text x={26} y={18} fill={c.text} fontSize="9.5" fontFamily="'Consolas',monospace" fontWeight="600">{label}</text>
    </g>
  );
}

// ── Main Dashboard ───────────────────────────────────────────
export default function ScadaDashboard() {
  const now = useNow();

  // Tank levels (%)
  const [levels, setLevels] = useState(() => TANK_CFG.map(t => t.initLevel));
  // Wave animation offsets
  const [waveOffsets, setWaveOffsets] = useState([0, 1, 2, 3]);
  // Pump states
  const [pumps, setPumps] = useState([
    { label: 'PUMP-01', active: true,  flow: 312 },
    { label: 'PUMP-02', active: false, flow: 0   },
  ]);
  // Bottom metrics
  const [metrics, setMetrics] = useState({ pressure: 4.8, totalFlow: 890, alarms: 0 });

  // ── Simulation tick ──────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setLevels(prev => prev.map((lvl, i) => {
        const delta = (Math.random() - 0.48) * 2.2;
        return Math.min(TANK_CFG[i].maxLevel + 2, Math.max(3, lvl + delta));
      }));
      setPumps(prev => prev.map(p =>
        p.active ? { ...p, flow: Math.round(270 + Math.random() * 90) } : p
      ));
      setMetrics(prev => ({
        pressure: +(4.2 + Math.random() * 1.2).toFixed(2),
        totalFlow: Math.round(800 + Math.random() * 200),
        alarms: prev.alarms,
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // ── Wave animation ────────────────────────────────────────
  useEffect(() => {
    let frame;
    let t = 0;
    const animate = () => {
      t += 0.04;
      setWaveOffsets([t, t + 1.1, t + 2.2, t + 3.3]);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // ── Pump toggle ───────────────────────────────────────────
  const togglePump = (i) => {
    setPumps(prev => prev.map((p, idx) =>
      idx === i ? { ...p, active: !p.active, flow: !p.active ? Math.round(280 + Math.random() * 80) : 0 } : p
    ));
  };

  const totalVolume = levels.reduce((acc, lvl, i) => acc + Math.round(TANK_CFG[i].cap * lvl / 100), 0);
  const timeStr = `${padZ(now.getHours())}:${padZ(now.getMinutes())}:${padZ(now.getSeconds())}`;
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  // Main pipe Y (top of tanks area)
  const MAIN_PIPE_Y = 120;
  const PIPE_W = 14;

  return (
    <div className="d2-wrapper">
      <svg
        viewBox="0 0 1400 720"
        xmlns="http://www.w3.org/2000/svg"
        className="d2-svg-canvas"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ════════════════════════════════════
            GLOBAL DEFS
        ════════════════════════════════════ */}
        <defs>
          {/* Background gradient */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1c2026"/>
            <stop offset="100%" stopColor="#141820"/>
          </linearGradient>

          {/* Horizontal pipe gradient (top-lit 3D) */}
          <linearGradient id="pipeHorizGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#909aaa"/>
            <stop offset="25%"  stopColor="#d0d8e8"/>
            <stop offset="55%"  stopColor="#b0b8c8"/>
            <stop offset="100%" stopColor="#404858"/>
          </linearGradient>

          {/* Vertical pipe gradient (side-lit) */}
          <linearGradient id="pipeVertGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#404858"/>
            <stop offset="30%"  stopColor="#909aaa"/>
            <stop offset="55%"  stopColor="#c8d0e0"/>
            <stop offset="100%" stopColor="#505868"/>
          </linearGradient>

          {/* Panel gradient */}
          <linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1e2838"/>
            <stop offset="100%" stopColor="#10161e"/>
          </linearGradient>

          {/* Toolbar gradient */}
          <linearGradient id="toolbarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#0e1320"/>
            <stop offset="60%"  stopColor="#141820"/>
            <stop offset="100%" stopColor="#0e1320"/>
          </linearGradient>

          {/* Left panel gradient */}
          <linearGradient id="leftPanelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#10141c"/>
            <stop offset="100%" stopColor="#141820"/>
          </linearGradient>

          {/* Right panel gradient */}
          <linearGradient id="rightPanelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#141820"/>
            <stop offset="100%" stopColor="#10141c"/>
          </linearGradient>

          {/* Grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2838" strokeWidth="0.5"/>
          </pattern>

          {/* Scan line pattern */}
          <pattern id="scanlines" width="2" height="3" patternUnits="userSpaceOnUse">
            <rect width="2" height="1" fill="#000000" opacity="0.08"/>
          </pattern>
        </defs>

        {/* ════════════════════════════════════
            BACKGROUND
        ════════════════════════════════════ */}
        <rect width="1400" height="720" fill="url(#bgGrad)"/>
        <rect width="1400" height="720" fill="url(#grid)" opacity="0.5"/>
        <rect width="1400" height="720" fill="url(#scanlines)"/>

        {/* ════════════════════════════════════
            TOP TOOLBAR (y=0, h=55)
        ════════════════════════════════════ */}
        {/* Accent strip */}
        <rect x={0} y={0} width={1400} height={3} fill="url(#accentStrip)"/>
        <defs>
          <linearGradient id="accentStrip" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#ff4444"/>
            <stop offset="30%"  stopColor="#ff9800"/>
            <stop offset="65%"  stopColor="#00c853"/>
            <stop offset="100%" stopColor="#1e88e5"/>
          </linearGradient>
        </defs>

        <rect x={0} y={3} width={1400} height={52} fill="url(#toolbarGrad)" stroke="#2a3448" strokeWidth="1"/>

        {/* ── Logo/Title area (left) ── */}
        {/* Logo block */}
        <rect x={12} y={10} width={38} height={38} rx="4" fill="#c8200a"/>
        <text x={31} y={24} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="700" fontFamily="'Segoe UI',sans-serif">RA</text>
        <rect x={12} y={28} width={38} height={3} fill="#ffffff" opacity="0.9"/>
        <text x={31} y={43} textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="'Segoe UI',sans-serif">AUTO</text>
        {/* Title */}
        <text x={58} y={26} fill="#e8f0ff" fontSize="15" fontWeight="700" fontFamily="'Segoe UI',sans-serif" letterSpacing="1">WATER SCADA</text>
        <text x={58} y={44} fill="#5070a0" fontSize="9" fontFamily="'Consolas',monospace" letterSpacing="2">PROCESS MONITORING SYSTEM  v4.2.1</text>
        {/* Divider */}
        <line x1={260} y1={10} x2={260} y2={48} stroke="#2a3448" strokeWidth="1"/>

        {/* ── Status Badges (center) ── */}
        {[
          { x: 290, label: 'CIP: ACTIVE', status: 'ok'   },
          { x: 410, label: 'ALARMS: 0',   status: 'ok'   },
          { x: 530, label: 'SYS: NORMAL', status: 'ok'   },
          { x: 650, label: 'NET: ONLINE', status: 'info' },
        ].map(b => (
          <g key={b.x} transform={`translate(${b.x}, 17)`}>
            <StatusBadge label={b.label} status={b.status}/>
          </g>
        ))}

        {/* ── Right: time & user ── */}
        <text x={1380} y={22} textAnchor="end" fill="#00e8cc" fontSize="16" fontWeight="700" fontFamily="'Consolas','Courier New',monospace" letterSpacing="2">{timeStr}</text>
        <text x={1380} y={38} textAnchor="end" fill="#4466aa" fontSize="9" fontFamily="'Consolas',monospace">{dateStr}</text>
        <text x={1380} y={51} textAnchor="end" fill="#3a5480" fontSize="9" fontFamily="'Consolas',monospace">OPR: ADMIN • SHIFT-B</text>

        {/* ════════════════════════════════════
            LEFT PANEL — Pump & Source (x=0..230)
        ════════════════════════════════════ */}
        <rect x={0} y={55} width={230} height={605} fill="url(#leftPanelGrad)" stroke="#1e2838" strokeWidth="1"/>

        {/* Water Source header */}
        <rect x={10} y={68} width={210} height={30} rx="4" fill="#0d1520" stroke="#2a4060" strokeWidth="1"/>
        <text x={115} y={79} textAnchor="middle" fill="#4080c0" fontSize="8" fontFamily="'Consolas',monospace" letterSpacing="2">WATER SOURCE</text>
        <text x={115} y={91} textAnchor="middle" fill="#80b0e0" fontSize="10" fontWeight="700" fontFamily="'Consolas',monospace">MUNICIPAL SUPPLY</text>

        {/* Inlet flow arrow pipe */}
        <rect x={148} y={100} width={82} height={12} fill="url(#pipeHorizGrad)" stroke="#3a4858" strokeWidth="0.8"/>
        <line x1={148} y1={100} x2={148} y2={112} stroke="#555e70" strokeWidth="1.5"/>
        {/* Animated flow on inlet */}
        <rect x={148} y={100} width={82} height={12} fill="none">
          <animate attributeName="x" values="148;220" dur="0.8s" repeatCount="indefinite"/>
        </rect>
        <line x1={148} y1={100} x2={148} y2={112} stroke="#60b0ff" strokeWidth="6" strokeDasharray="8 14" opacity="0.4">
          <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="0.8s" repeatCount="indefinite"/>
        </line>
        {/* Arrow head */}
        <path d="M 228 104 L 236 106 L 228 108 Z" fill="#4080ff" opacity="0.8"/>

        {/* Source pressure readout */}
        <rect x={10} y={108} width={130} height={36} rx="3" fill="#0a0e18" stroke="#1e2838" strokeWidth="1"/>
        <text x={75} y={120} textAnchor="middle" fill="#3a5070" fontSize="7.5" fontFamily="'Consolas',monospace" letterSpacing="1">INLET PRESSURE</text>
        <text x={75} y={138} textAnchor="middle" fill="#00e8cc" fontSize="17" fontWeight="700" fontFamily="'Consolas',monospace">
          {metrics.pressure.toFixed(1)} bar
        </text>

        {/* ── Pumps ── */}
        <text x={115} y={170} textAnchor="middle" fill="#3a5070" fontSize="8.5" fontFamily="'Consolas',monospace" letterSpacing="2">── PUMP STATION ──</text>

        <PumpSymbol cx={75}  cy={215} active={pumps[0].active} label={pumps[0].label} flow={pumps[0].flow} onToggle={() => togglePump(0)}/>
        <PumpSymbol cx={165} cy={215} active={pumps[1].active} label={pumps[1].label} flow={pumps[1].flow} onToggle={() => togglePump(1)}/>

        {/* Pump toggle hint */}
        <text x={115} y={296} textAnchor="middle" fill="#2a3a50" fontSize="7.5" fontFamily="'Consolas',monospace">[ CLICK TO TOGGLE ]</text>

        {/* ── Gauges ── */}
        <text x={115} y={320} textAnchor="middle" fill="#3a5070" fontSize="8.5" fontFamily="'Consolas',monospace" letterSpacing="2">── SYSTEM GAUGES ──</text>
        <Gauge cx={70}  cy={370} value={Math.round(metrics.pressure / 8 * 100)} unit="bar" label="INLET PRESS" color="#00e8cc"/>
        <Gauge cx={165} cy={370} value={Math.round(metrics.totalFlow / 12)} unit="L/m" label="TOTAL FLOW" color="#ffb74d"/>

        {/* ── Flow readouts ── */}
        {[
          { label: 'PUMP-01 FLOW', val: pumps[0].active ? `${pumps[0].flow} L/m` : '--- L/m', active: pumps[0].active },
          { label: 'PUMP-02 FLOW', val: pumps[1].active ? `${pumps[1].flow} L/m` : '--- L/m', active: pumps[1].active },
          { label: 'INLET FLOW',   val: `${metrics.totalFlow} L/m`, active: true },
          { label: 'SYSTEM PRESS', val: `${metrics.pressure} bar`, active: true },
        ].map((row, i) => (
          <g key={i} transform={`translate(10, ${420 + i * 34})`}>
            <rect width={210} height={28} rx="3" fill="#0a0e18" stroke="#1a2030" strokeWidth="1"/>
            <text x={8} y={11} fill="#3a5070" fontSize="7" fontFamily="'Consolas',monospace" letterSpacing="1">{row.label}</text>
            <text x={8} y={23} fill={row.active ? '#00e8cc' : '#405070'} fontSize="12" fontWeight="700" fontFamily="'Consolas',monospace">{row.val}</text>
          </g>
        ))}

        {/* ════════════════════════════════════
            MAIN PIPE NETWORK
        ════════════════════════════════════ */}

        {/* Main horizontal header pipe (top, connecting all tanks) */}
        <rect x={230} y={MAIN_PIPE_Y - PIPE_W / 2} width={900} height={PIPE_W} fill="url(#pipeHorizGrad)" stroke="#3a4858" strokeWidth="0.8"/>
        {/* Flow animation on main header */}
        <rect x={230} y={MAIN_PIPE_Y - 3} width={900} height={6} fill="#5090ff" opacity="0.3" strokeDasharray="16 24">
          <animate attributeName="x" values="230;1130" dur="3s" repeatCount="indefinite" additive="replace"/>
          <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/>
        </rect>
        <line x1={230} y1={MAIN_PIPE_Y - 4} x2={230} y2={MAIN_PIPE_Y + 4} stroke="#c0c8d8" strokeWidth="1" opacity="0.6"/>

        {/* Pump outlet into main pipe */}
        <rect x={220} y={106} width={14} height={MAIN_PIPE_Y - 106 + PIPE_W / 2} fill="url(#pipeVertGrad)" stroke="#3a4858" strokeWidth="0.8"/>

        {/* Per-tank vertical drop pipes + valves */}
        {TANK_CFG.map((cfg) => {
          const vpipeX = cfg.cx - 7;
          const pipeTop = MAIN_PIPE_Y + PIPE_W / 2;
          const pipeBot = TANK_Y - ELLIPSE_RY + 8;
          return (
            <g key={cfg.id}>
              {/* Vertical inlet pipe */}
              <rect x={vpipeX} y={pipeTop} width={14} height={pipeBot - pipeTop} fill="url(#pipeVertGrad)" stroke="#3a4858" strokeWidth="0.8"/>
              {/* Flow anim on vert pipe */}
              <rect x={vpipeX + 3} y={pipeTop} width={8} height={pipeBot - pipeTop} fill="#5090ff" opacity="0.25" strokeDasharray="10 16">
                <animate attributeName="y" values={`${pipeTop};${pipeBot}`} dur="1.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.25;0;0.25" dur="1.2s" repeatCount="indefinite"/>
              </rect>
              {/* Valve at junction */}
              <Valve cx={cfg.cx} cy={pipeTop + 20} open={true} label="V" />
            </g>
          );
        })}

        {/* Inter-tank connecting pipe (bottom manifold) */}
        <rect x={300} y={TANK_Y + TANK_H + ELLIPSE_RY + 18} width={860} height={10} fill="url(#pipeHorizGrad)" stroke="#3a4858" strokeWidth="0.8"/>
        {/* Valves on manifold */}
        {TANK_CFG.slice(0, 3).map((cfg, i) => (
          <Valve key={i} cx={(cfg.cx + TANK_CFG[i + 1].cx) / 2} cy={TANK_Y + TANK_H + ELLIPSE_RY + 23} open={true} />
        ))}

        {/* ════════════════════════════════════
            TANK CYLINDERS
        ════════════════════════════════════ */}
        {TANK_CFG.map((cfg, i) => (
          <Tank key={cfg.id} cfg={cfg} level={levels[i]} waveOffset={waveOffsets[i]} onClick={() => {}} />
        ))}

        {/* ════════════════════════════════════
            RIGHT PANEL — PRV & Distribution (x=1200..1400)
        ════════════════════════════════════ */}
        <rect x={1200} y={55} width={200} height={605} fill="url(#rightPanelGrad)" stroke="#1e2838" strokeWidth="1"/>

        <rect x={1210} y={68} width={180} height={30} rx="4" fill="#0d1520" stroke="#2a4060" strokeWidth="1"/>
        <text x={1300} y={79} textAnchor="middle" fill="#4080c0" fontSize="8" fontFamily="'Consolas',monospace" letterSpacing="2">PRV STATION</text>
        <text x={1300} y={91} textAnchor="middle" fill="#80b0e0" fontSize="10" fontWeight="700" fontFamily="'Consolas',monospace">PRESSURE REDUCE</text>

        {/* PRV upstream / downstream */}
        {[
          { label: 'UPSTREAM',   val: `${(metrics.pressure * 1.4).toFixed(1)} bar`, color: '#ff9800' },
          { label: 'DOWNSTREAM', val: `${(metrics.pressure * 0.7).toFixed(1)} bar`, color: '#00e8cc' },
          { label: 'DIFF PRESS', val: `${(metrics.pressure * 0.7).toFixed(1)} bar`, color: '#64b5f6' },
        ].map((row, i) => (
          <g key={i} transform={`translate(1210, ${108 + i * 46})`}>
            <rect width={180} height={40} rx="4" fill="#0a0e18" stroke="#1a2838" strokeWidth="1"/>
            <text x={90} y={13} textAnchor="middle" fill="#3a5070" fontSize="7.5" fontFamily="'Consolas',monospace" letterSpacing="1">{row.label}</text>
            <text x={90} y={32} textAnchor="middle" fill={row.color} fontSize="18" fontWeight="700" fontFamily="'Consolas',monospace">{row.val}</text>
          </g>
        ))}

        {/* PRV valve symbol */}
        <g transform="translate(1270, 252)">
          <rect width={60} height={40} rx="4" fill="#0d1520" stroke="#2a3860" strokeWidth="1.5"/>
          {/* Valve triangle symbol */}
          <path d="M 10 10 L 30 20 L 10 30 Z" fill="#2a6040" stroke="#00c853" strokeWidth="1.5"/>
          <path d="M 50 10 L 30 20 L 50 30 Z" fill="#2a6040" stroke="#00c853" strokeWidth="1.5"/>
          <line x1={30} y1={5} x2={30} y2={15} stroke="#00c853" strokeWidth="2"/>
          <text x={30} y={52} textAnchor="middle" fill="#4a6a50" fontSize="7.5" fontFamily="'Consolas',monospace">PRV-01</text>
        </g>

        {/* Distribution Zones */}
        <text x={1300} y={320} textAnchor="middle" fill="#3a5070" fontSize="8.5" fontFamily="'Consolas',monospace" letterSpacing="2">── DISTRIBUTION ──</text>
        {[
          { zone: 'ZONE-A', flow: 280, pressure: 3.8, active: true  },
          { zone: 'ZONE-B', flow: 195, pressure: 3.5, active: true  },
          { zone: 'ZONE-C', flow: 0,   pressure: 0,   active: false },
        ].map((z, i) => {
          const c = z.active ? '#00e676' : '#ff4444';
          return (
            <g key={i} transform={`translate(1210, ${332 + i * 70})`}>
              <rect width={180} height={62} rx="4" fill="#0a0e18" stroke={z.active ? '#0d3020' : '#2a0a0a'} strokeWidth="1"/>
              <circle cx={16} cy={14} r={5} fill={c}>
                {z.active && <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>}
              </circle>
              <text x={26} y={18} fill={c} fontSize="9.5" fontWeight="700" fontFamily="'Consolas',monospace">{z.zone}</text>
              <text x={164} y={18} textAnchor="end" fill={z.active ? '#00c853' : '#c02020'} fontSize="8" fontFamily="'Consolas',monospace">{z.active ? 'OPEN' : 'CLOSED'}</text>
              <text x={8} y={34} fill="#2a4060" fontSize="7.5" fontFamily="'Consolas',monospace">FLOW</text>
              <text x={8} y={48} fill={z.active ? '#00e8cc' : '#405070'} fontSize="14" fontWeight="700" fontFamily="'Consolas',monospace">{z.active ? `${z.flow} L/m` : '--- L/m'}</text>
              <text x={110} y={34} textAnchor="end" fill="#2a4060" fontSize="7.5" fontFamily="'Consolas',monospace">PRESS</text>
              <text x={172} y={48} textAnchor="end" fill={z.active ? '#ffb74d' : '#405070'} fontSize="13" fontWeight="700" fontFamily="'Consolas',monospace">{z.active ? `${z.pressure} bar` : '---'}</text>
            </g>
          );
        })}

        {/* Right panel gauge */}
        <Gauge cx={1255} cy={575} r={28} value={Math.round(metrics.pressure / 8 * 100)} unit="bar" label="SYS PRESS" color="#ffb74d"/>
        <Gauge cx={1345} cy={575} r={28} value={Math.round(metrics.totalFlow / 12)} unit="L/m" label="DIST FLOW" color="#64b5f6"/>

        {/* Pipe from tank-4 to right panel */}
        <rect x={1200} y={MAIN_PIPE_Y - PIPE_W / 2} width={30} height={PIPE_W} fill="url(#pipeHorizGrad)" stroke="#3a4858" strokeWidth="0.8"/>

        {/* ════════════════════════════════════
            BOTTOM STATUS BAR (y=660, h=60)
        ════════════════════════════════════ */}
        <rect x={0} y={660} width={1400} height={60} fill="#080c12" stroke="#1a2438" strokeWidth="1"/>
        {/* Separator line at top of bottom bar */}
        <line x1={0} y1={660} x2={1400} y2={660} stroke="#2a3860" strokeWidth="1.5"/>

        {[
          { label: 'TOTAL VOLUME',   val: `${totalVolume.toLocaleString()} L`,    color: '#00e8cc', x: 90  },
          { label: 'SYSTEM PRESSURE',val: `${metrics.pressure.toFixed(2)} bar`,   color: '#ffb74d', x: 370 },
          { label: 'TOTAL FLOW RATE',val: `${metrics.totalFlow} L/min`,           color: '#64b5f6', x: 650 },
          { label: 'ACTIVE ALARMS',  val: `${metrics.alarms} ACTIVE`,             color: '#00e676', x: 930 },
          { label: 'UPTIME',         val: `99.94%`,                               color: '#b39ddb', x: 1180},
          { label: 'MODE',           val: `AUTO / NORMAL`,                        color: '#ef9a9a', x: 1340},
        ].map(m => (
          <g key={m.x}>
            <text x={m.x} y={681} textAnchor="middle" fill="#2a4060" fontSize="7.5" fontFamily="'Consolas',monospace" letterSpacing="1.5">{m.label}</text>
            <text x={m.x} y={703} textAnchor="middle" fill={m.color} fontSize="16" fontWeight="700" fontFamily="'Consolas','Courier New',monospace">{m.val}</text>
          </g>
        ))}

        {/* Vertical separators in bottom bar */}
        {[230, 510, 790, 1070, 1260].map(sx => (
          <line key={sx} x1={sx} y1={664} x2={sx} y2={716} stroke="#1a2438" strokeWidth="1"/>
        ))}

        {/* ════════════════════════════════════
            DECORATIVE — corner brackets
        ════════════════════════════════════ */}
        {[[4, 58, 1, 1], [1400 - 4, 58, -1, 1], [4, 658, 1, -1], [1400 - 4, 658, -1, -1]].map(([x, y, dx, dy], i) => (
          <g key={i} stroke="#2a4060" strokeWidth="1.5" fill="none">
            <path d={`M ${x} ${y + dy * 22} L ${x} ${y} L ${x + dx * 22} ${y}`}/>
          </g>
        ))}

        {/* Process area label */}
        <text x={715} y={72} textAnchor="middle" fill="#1e2a40" fontSize="9" fontFamily="'Consolas',monospace" letterSpacing="3">PROCESS AREA — P&amp;ID SCHEMATIC</text>

      </svg>
    </div>
  );
}
