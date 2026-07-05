'use client'

import { useState } from 'react'
import { LucideCheck, LucideCopy } from '@/Icons/Icons'
import Modal from '@/features/shared/ui/Modal'
import Button from '@/features/shared/ui/Button'
import { generateCode, CODE_FORMATS, type CodeFormat, type RequestSnapshot } from '@/features/postman/utils/apiCodegen'

interface Props {
  isOpen:  boolean
  onClose: () => void
  request: RequestSnapshot
}

export default function GenerateCodeModal({ isOpen, onClose, request }: Props) {
  const [format, setFormat] = useState<CodeFormat>('curl')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const code = generateCode(format, request)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Code" size="lg">
      <style>{CSS}</style>
      <div className="gcm">
        <div className="gcm-tabs">
          {CODE_FORMATS.map((f) => (
            <button
              key={f.value}
              className={['gcm-tab', format === f.value ? 'gcm-tab--active' : ''].filter(Boolean).join(' ')}
              onClick={() => setFormat(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <pre className="gcm-code"><code>{code}</code></pre>
        <div className="gcm-actions">
          <Button type="button" variant="secondary" onClick={handleCopy}>
            {copied ? <LucideCheck width={14} /> : <LucideCopy width={14} />}
            {copied ? 'Copied' : 'Copy code'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const CSS = `
.gcm { display: flex; flex-direction: column; gap: 12px; }

.gcm-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.gcm-tab {
  height:        30px; padding: 0 14px;
  background:    transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md);
  color:         var(--text-tertiary); font-size: var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 40px;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.gcm-tab:hover     { border-color: var(--border-strong); color: var(--text-primary); }
.gcm-tab--active   { background: var(--accent-muted); border-color: var(--accent-border); color: var(--cyan-300); }

.gcm-code {
  margin:        0;
  padding:       14px 16px;
  background:    var(--bg-elevated);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-md);
  color:         var(--cyan-200);
  font-family:   var(--font-mono);
  font-size:     var(--text-xs);
  line-height:   var(--leading-relaxed);
  white-space:   pre-wrap;
  word-break:    break-word;
  max-height:    50vh;
  overflow:      auto;
}

.gcm-actions { display: flex; justify-content: flex-end; }
`
