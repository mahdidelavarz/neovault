'use client'

import { useState } from 'react'
import { LucideDownload } from '@/Icons/Icons'
import Modal from '@/features/shared/ui/Modal'
import Button from '@/features/shared/ui/Button'
import { parseCurlCommand } from '@/features/snippets/utils/snippetUtils'

export interface ParsedCurl {
  method:  string
  url:     string
  headers: Record<string, string>
  body:    string
}

interface Props {
  isOpen:   boolean
  onClose:  () => void
  onImport: (parsed: ParsedCurl) => void
}

export default function ImportCurlModal({ isOpen, onClose, onImport }: Props) {
  const [text,  setText]  = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleImport = () => {
    const parsed = parseCurlCommand(text)
    if (!parsed || !parsed.url) {
      setError('Could not parse a URL from this cURL command.')
      return
    }
    onImport(parsed)
    setText('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import from cURL" size="md">
      <style>{CSS}</style>
      <div className="icm">
        <p className="icm-hint">
          Paste a cURL command — method, URL, headers, and body will be parsed into the request builder.
        </p>
        <textarea
          className="icm-textarea"
          value={text}
          onChange={(e) => { setText(e.target.value); setError('') }}
          placeholder={"curl -X POST 'https://api.example.com/users' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"Ada\"}'"}
          rows={8}
          spellCheck={false}
          autoFocus
        />
        {error && <p className="icm-error">{error}</p>}
        <div className="icm-actions">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleImport} disabled={!text.trim()}>
            <LucideDownload width={14} />
            Import
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const CSS = `
.icm { display: flex; flex-direction: column; gap: 10px; }
.icm-hint { font-size: var(--text-xs); color: var(--text-tertiary); margin: 0; line-height: var(--leading-relaxed); }
.icm-textarea {
  width:         100%;
  background:    var(--bg-elevated);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-md);
  color:         var(--text-primary);
  font-family:   var(--font-mono);
  font-size:     var(--text-xs);
  line-height:   var(--leading-relaxed);
  padding:       10px 12px;
  outline:       none;
  resize:        vertical;
  transition:    border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.icm-textarea::placeholder { color: var(--text-tertiary); }
.icm-textarea:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-muted); }
.icm-error { font-size: var(--text-xs); color: var(--danger); margin: 0; }
.icm-actions { display: flex; justify-content: flex-end; gap: 8px; }
`
