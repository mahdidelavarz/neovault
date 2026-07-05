
import type { ComponentType, ReactNode, SVGProps } from 'react'

export type BadgeVariant = 'default' | 'cyan' | 'success' | 'warning' | 'danger' | 'purple' | 'orange' | 'pink'
export type BadgeSize    = 'sm' | 'md'

interface BadgeProps {
  children:   ReactNode
  variant?:   BadgeVariant
  size?:      BadgeSize
  icon?:      ComponentType<SVGProps<SVGSVGElement>>
  dot?:       boolean
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'badge--default',
  cyan:    'badge--cyan',
  success: 'badge--success',
  warning: 'badge--warning',
  danger:  'badge--danger',
  purple:  'badge--purple',
  orange:  'badge--orange',
  pink:    'badge--pink',
}

export default function Badge({
  children,
  variant   = 'default',
  size      = 'sm',
  icon : Icon,
  dot       = false,
  className = '',
}: BadgeProps) {
  return (
    <>
      <style>{CSS}</style>
      <span className={[
        'badge',
        variants[variant],
        size === 'md' ? 'badge--md' : '',
        className,
      ].filter(Boolean).join(' ')}>
        {dot && <span className="badge-dot" />}
        {Icon && <Icon className="badge-icon" />}
        {children}
      </span>
    </>
  )
}

const CSS = `
.badge {
  display:       inline-flex;
  align-items:   center;
  gap:           4px;
  padding:       2px 8px;
  font-size:     var(--text-xs);
  font-weight:   500;
  line-height:   1.6;
  border-radius: var(--radius-full);
  border:        1px solid transparent;
  white-space:   nowrap;
  font-family:   var(--font-sans);
}
.badge--md {
  padding:   3px 10px;
  font-size: var(--text-sm);
}

.badge-dot {
  width:         6px;
  height:        6px;
  border-radius: 50%;
  background:    currentColor;
  flex-shrink:   0;
}
.badge-icon {
  width:     11px;
  height:    11px;
  flex-shrink: 0;
}

/* Variants */
.badge--default {
  background:   var(--bg-overlay);
  border-color: var(--border-default);
  color:        var(--text-secondary);
}
.badge--cyan {
  background:   var(--accent-muted);
  border-color: var(--accent-border);
  color:        var(--cyan-300);
}
.badge--success {
  background:   var(--success-muted);
  border-color: rgba(16,185,129,0.2);
  color:        #34d399;
}
.badge--warning {
  background:   var(--warning-muted);
  border-color: rgba(245,158,11,0.2);
  color:        #fbbf24;
}
.badge--danger {
  background:   var(--danger-muted);
  border-color: rgba(239,68,68,0.2);
  color:        #f87171;
}
.badge--purple {
  background:   rgba(139,92,246,0.12);
  border-color: rgba(139,92,246,0.25);
  color:        #a78bfa;
}
.badge--orange {
  background:   rgba(249,115,22,0.12);
  border-color: rgba(249,115,22,0.25);
  color:        #fb923c;
}
.badge--pink {
  background:   rgba(236,72,153,0.12);
  border-color: rgba(236,72,153,0.25);
  color:        #f472b6;
}

/* Light mode — darker text for readability on white */
[data-theme="light"] .badge--cyan    { color: var(--text-accent); }
[data-theme="light"] .badge--success { color: #059669; }
[data-theme="light"] .badge--warning { color: #d97706; }
[data-theme="light"] .badge--danger  { color: #dc2626; }
[data-theme="light"] .badge--purple  { color: #7c3aed; }
[data-theme="light"] .badge--orange  { color: #ea580c; }
[data-theme="light"] .badge--pink    { color: #db2777; }
`