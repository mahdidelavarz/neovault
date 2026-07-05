
import { LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleAlert, LucideX } from '@/Icons/Icons'
import type { ComponentType, ReactNode, SVGProps } from 'react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type?:      AlertType
  title?:     string
  message?:   ReactNode
  onClose?:   () => void
  className?: string
}

const config: Record<AlertType, { icon: ComponentType<SVGProps<SVGSVGElement>>; css: string }> = {
  success: { icon: LucideCircleCheck,  css: 'alert--success' },
  error:   { icon: LucideCircleX,      css: 'alert--error'   },
  warning: { icon: LucideTriangleAlert, css: 'alert--warning' },
  info:    { icon: LucideInfo,           css: 'alert--info'    },
}

export default function Alert({
  type      = 'info',
  title,
  message,
  onClose,
  className = '',
}: AlertProps) {
  const { icon : Icon, css } = config[type]

  return (
    <>
      <style>{CSS}</style>
      <div className={['alert', css, className].filter(Boolean).join(' ')} role="alert">
        <Icon  className="alert-icon" />

        <div className="alert-body">
          {title   && <p className="alert-title">{title}</p>}
          {message && <p className="alert-message">{message}</p>}
        </div>

        {onClose && (
          <button className="alert-close" onClick={onClose} aria-label="Dismiss">
            <LucideX width={14} />
          </button>
        )}
      </div>
    </>
  )
}

const CSS = `
.alert {
  display:       flex;
  align-items:   flex-start;
  gap:           10px;
  padding:       12px 14px;
  border-radius: var(--radius-md);
  border:        1px solid transparent;
  font-size:     var(--text-sm);
  animation:     fadeInDown var(--transition-base) ease both;
}

.alert-icon {
  width:      16px;
  height:     16px;
  flex-shrink: 0;
  margin-top: 1px;
}
.alert-body { flex: 1; min-width: 0; }
.alert-title {
  font-weight:   600;
  font-size:     var(--text-sm);
  margin-bottom: 2px;
}
.alert-message {
  font-size:   var(--text-sm);
  line-height: var(--leading-snug);
  opacity:     0.85;
}
.alert-close {
  display:      flex;
  align-items:  center;
  padding:      2px;
  background:   transparent;
  border:       none;
  border-radius: var(--radius-sm);
  cursor:       pointer;
  opacity:      0.6;
  transition:   opacity var(--transition-fast);
  flex-shrink:  0;
}
.alert-close:hover { opacity: 1; }

/* Types */
.alert--success {
  background:   var(--success-muted);
  border-color: rgba(16,185,129,0.25);
  color:        #34d399;
}
.alert--error {
  background:   var(--danger-muted);
  border-color: rgba(239,68,68,0.25);
  color:        #f87171;
}
.alert--warning {
  background:   var(--warning-muted);
  border-color: rgba(245,158,11,0.25);
  color:        #fbbf24;
}
.alert--info {
  background:   var(--accent-muted);
  border-color: var(--accent-border);
  color:        var(--cyan-300);
}

/* Light mode — darker text for readability on white */
[data-theme="light"] .alert--success { color: #059669; }
[data-theme="light"] .alert--error   { color: #dc2626; }
[data-theme="light"] .alert--warning { color: #d97706; }
[data-theme="light"] .alert--info    { color: var(--text-accent); }
`