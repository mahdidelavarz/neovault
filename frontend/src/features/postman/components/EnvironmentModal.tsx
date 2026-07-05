'use client'

import { useState, useEffect } from 'react'
import {
  LucideLayers, LucideX, LucideBox, LucideCheck, LucidePlus,
  LucideTrash2, SvgSpinnersRingResize, LucideSave,
} from '@/Icons/Icons'
import { type Environment, type KeyValue } from '@/features/postman/types/apiClient'
import {
  useCreateEnvironment,
  useUpdateEnvironment,
  useDeleteEnvironment,
} from '@/features/postman/hooks/useApiClient'
import { VaultGuard } from '@/features/settings/security/components/VaultGuard'
import { useVault } from '@/features/settings/security/hooks/useVault'

interface Props {
  environments: Environment[]
  onClose: () => void
}

function makeVar(): KeyValue {
  return { id: crypto.randomUUID(), key: '', value: '', enabled: true }
}

export default function EnvironmentModal({ environments, onClose }: Props) {
  const [selectedId, setSelectedId]   = useState<number | null>(environments[0]?.id ?? null)
  const [newEnvName,  setNewEnvName]  = useState('')
  const [creating,    setCreating]    = useState(false)

  // Local edit state for selected env
  const [editName, setEditName] = useState('')
  const [editVars, setEditVars] = useState<KeyValue[]>([])
  const [dirty,    setDirty]   = useState(false)

  const createEnv = useCreateEnvironment()
  const updateEnv = useUpdateEnvironment()
  const deleteEnv = useDeleteEnvironment()
  const { isEnabled } = useVault()

  const selectedEnv = environments.find((e) => e.id === selectedId) ?? null

  // Sync local edit state when selected env changes
  useEffect(() => {
    if (selectedEnv) {
      setEditName(selectedEnv.name)
      setEditVars(
        (selectedEnv.variables ?? []).map((v) => ({ ...v, id: v.id ?? crypto.randomUUID() }))
      )
      setDirty(false)
    }
  }, [selectedId, selectedEnv?.id])

  const handleSelectEnv = (id: number) => {
    setSelectedId(id)
  }

  const handleCreateEnv = async () => {
    const name = newEnvName.trim()
    if (!name) return
    const created = await createEnv.mutateAsync({ name, variables: [] })
    setNewEnvName('')
    setCreating(false)
    setSelectedId(created.id)
  }

  const handleDeleteEnv = async () => {
    if (!selectedEnv) return
    await deleteEnv.mutateAsync(selectedEnv.id)
    const remaining = environments.filter((e) => e.id !== selectedEnv.id)
    setSelectedId(remaining[0]?.id ?? null)
  }

  const handleSave = async () => {
    if (!selectedEnv) return
    const vars = editVars.filter((v) => v.key.trim())
    await updateEnv.mutateAsync({ id: selectedEnv.id, name: editName.trim() || selectedEnv.name, variables: vars })
    setDirty(false)
  }

  // Variable row helpers
  const addVar = () => {
    setEditVars((prev) => [...prev, makeVar()])
    setDirty(true)
  }

  const updateVar = (id: string, field: keyof KeyValue, value: string | boolean) => {
    setEditVars((prev) => prev.map((v) => v.id === id ? { ...v, [field]: value } : v))
    setDirty(true)
  }

  const removeVar = (id: string) => {
    setEditVars((prev) => prev.filter((v) => v.id !== id))
    setDirty(true)
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="em-overlay" onClick={onClose}>
        <div className="em" onClick={(e) => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="em-header">
            <span className="em-header-title">
              <LucideLayers width={15} />
              Environments
            </span>
            <button className="em-close" onClick={onClose} aria-label="Close">
              <LucideX width={16} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="em-body">

            {/* Env list sidebar */}
            <div className="em-sidebar">
              {environments.map((env) => (
                <button
                  key={env.id}
                  className={['em-env-item', selectedId === env.id ? 'em-env-item--active' : ''].filter(Boolean).join(' ')}
                  onClick={() => handleSelectEnv(env.id)}
                >
                  <LucideBox width={13} />
                  <span className="em-env-name">{env.name}</span>
                  <span className="em-env-count">{(env.variables ?? []).filter((v) => v.enabled).length}</span>
                </button>
              ))}

              {creating ? (
                <div className="em-new-env-row">
                  <input
                    className="em-new-env-input"
                    autoFocus
                    placeholder="Environment name"
                    value={newEnvName}
                    onChange={(e) => setNewEnvName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateEnv()
                      if (e.key === 'Escape') { setCreating(false); setNewEnvName('') }
                    }}
                  />
                  <button className="em-new-env-ok" onClick={handleCreateEnv} disabled={createEnv.isPending}>
                    <LucideCheck width={13} />
                  </button>
                  <button className="em-new-env-cancel" onClick={() => { setCreating(false); setNewEnvName('') }}>
                    <LucideX width={13} />
                  </button>
                </div>
              ) : (
                <button className="em-add-env-btn" onClick={() => setCreating(true)}>
                  <LucidePlus width={13} />
                  New environment
                </button>
              )}
            </div>

            {/* Env detail pane */}
            <div className="em-detail">
              {selectedEnv ? (
                <>
                  {/* Env name */}
                  <div className="em-detail-header">
                    <input
                      className="em-env-name-input"
                      value={editName}
                      onChange={(e) => { setEditName(e.target.value); setDirty(true) }}
                      placeholder="Environment name"
                    />
                    <button
                      className="em-del-env-btn"
                      onClick={handleDeleteEnv}
                      disabled={deleteEnv.isPending}
                      title="Delete this environment"
                    >
                      <LucideTrash2 width={13} />
                      Delete
                    </button>
                  </div>

                  {/* Variable table — guarded when vault is enabled + locked */}
                  <VaultGuard enabled={isEnabled}>
                    <div className="em-vars-header">
                      <span className="em-vars-col em-vars-col--key">Variable</span>
                      <span className="em-vars-col em-vars-col--value">Value</span>
                      <span className="em-vars-col em-vars-col--actions" />
                    </div>

                    <div className="em-vars-list">
                      {editVars.map((v) => (
                        <div key={v.id} className="em-var-row">
                          <button
                            className={['em-var-toggle', v.enabled ? 'em-var-toggle--on' : ''].filter(Boolean).join(' ')}
                            onClick={() => updateVar(v.id!, 'enabled', !v.enabled)}
                            title={v.enabled ? 'Disable variable' : 'Enable variable'}
                          />
                          <input
                            className="em-var-input em-var-input--key"
                            placeholder="KEY"
                            value={v.key}
                            onChange={(e) => updateVar(v.id!, 'key', e.target.value)}
                            spellCheck={false}
                          />
                          <input
                            className="em-var-input em-var-input--value"
                            placeholder="value"
                            value={v.value}
                            onChange={(e) => updateVar(v.id!, 'value', e.target.value)}
                            spellCheck={false}
                          />
                          <button className="em-var-remove" onClick={() => removeVar(v.id!)} title="Remove variable">
                            <LucideX width={12} />
                          </button>
                        </div>
                      ))}

                      <button className="em-add-var-btn" onClick={addVar}>
                        <LucidePlus width={13} />
                        Add variable
                      </button>
                    </div>

                    <p className="em-vars-hint">
                      Use <code>{'{{VARIABLE_NAME}}'}</code> in URLs, headers, and request body.
                    </p>
                  </VaultGuard>
                </>
              ) : (
                <div className="em-empty">
                  <LucideLayers width={28} className="em-empty-icon" />
                  <p>No environment selected.</p>
                  <p>Create one to start using variables.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="em-footer">
            <button className="em-cancel-btn" onClick={onClose}>Close</button>
            {selectedEnv && (
              <button
                className="em-save-btn"
                onClick={handleSave}
                disabled={!dirty || updateEnv.isPending}
              >
                {updateEnv.isPending
                  ? <SvgSpinnersRingResize width={14} />
                  : <LucideSave width={14} />
                }
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const CSS = `
.em-overlay {
  position:        fixed;
  inset:           0;
  background:      rgba(0,0,0,0.6);
  display:         flex;
  align-items:     center;
  justify-content: center;
  z-index:         200;
  padding:         16px;
}

.em {
  display:        flex;
  flex-direction: column;
  width:          min(780px, 100%);
  max-height:     80dvh;
  background:     var(--bg-surface);
  border:         1px solid var(--border-default);
  border-radius:  var(--radius-xl);
  overflow:       hidden;
  box-shadow:     var(--shadow-xl);
}

/* Header */
.em-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         14px 20px;
  border-bottom:   1px solid var(--border-subtle);
  flex-shrink:     0;
}
.em-header-title {
  display:     flex;
  align-items: center;
  gap:         7px;
  font-size:   var(--text-md);
  font-weight: 600;
  color:       var(--text-primary);
}
.em-close {
  display:         flex; align-items: center; justify-content: center;
  width:           28px; height: 28px;
  background:      transparent; border: none;
  border-radius:   var(--radius-md); color: var(--text-tertiary); cursor: pointer;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.em-close:hover { background: var(--bg-overlay); color: var(--text-primary); }

/* Body */
.em-body {
  display:    flex;
  flex:       1;
  min-height: 0;
  overflow:   hidden;
}

/* Sidebar */
.em-sidebar {
  width:        200px;
  flex-shrink:  0;
  border-right: 1px solid var(--border-subtle);
  display:      flex;
  flex-direction: column;
  padding:      8px;
  gap:          2px;
  overflow-y:   auto;
}
.em-sidebar::-webkit-scrollbar { width: 4px; }
.em-sidebar::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

.em-env-item {
  display:       flex;
  align-items:   center;
  gap:           7px;
  width:         100%;
  padding:       7px 10px;
  background:    transparent;
  border:        1px solid transparent;
  border-radius: var(--radius-md);
  color:         var(--text-secondary);
  font-size:     var(--text-sm);
  text-align:    left;
  cursor:        pointer;
  min-height:    36px;
  transition:    background var(--transition-fast), color var(--transition-fast);
}
.em-env-item:hover       { background: var(--bg-overlay); color: var(--text-primary); }
.em-env-item--active     { background: var(--accent-muted); border-color: var(--accent-border); color: var(--cyan-300); }
.em-env-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.em-env-count {
  font-size: var(--text-xs); color: var(--text-tertiary);
  background: var(--bg-overlay); border-radius: 99px; padding: 1px 6px; flex-shrink: 0;
}

.em-new-env-row {
  display:     flex;
  align-items: center;
  gap:         4px;
  padding:     4px 4px;
}
.em-new-env-input {
  flex:          1; min-width: 0;
  height:        30px; padding: 0 8px;
  background:    var(--bg-elevated); border: 1px solid var(--border-focus);
  border-radius: var(--radius-md); color: var(--text-primary);
  font-size:     var(--text-xs); outline: none;
}
.em-new-env-ok, .em-new-env-cancel {
  display:         flex; align-items: center; justify-content: center;
  width:           26px; height: 26px; flex-shrink: 0;
  background:      transparent; border: 1px solid var(--border-default);
  border-radius:   var(--radius-md); color: var(--text-tertiary); cursor: pointer;
}
.em-new-env-ok:hover     { background: var(--accent-muted); color: var(--cyan-300); border-color: var(--accent-border); }
.em-new-env-cancel:hover { background: var(--danger-muted); color: var(--danger); }

.em-add-env-btn {
  display:       flex; align-items: center; gap: 6px;
  width:         100%; padding: 7px 10px;
  background:    transparent; border: 1px dashed var(--border-default);
  border-radius: var(--radius-md); color: var(--text-tertiary);
  font-size:     var(--text-xs); cursor: pointer; min-height: 36px;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
  margin-top:    4px;
}
.em-add-env-btn:hover { background: var(--bg-overlay); color: var(--text-primary); border-color: var(--border-strong); }

/* Detail pane */
.em-detail {
  flex:       1;
  display:    flex;
  flex-direction: column;
  gap:        0;
  overflow-y: auto;
  padding:    16px 20px;
}
.em-detail::-webkit-scrollbar { width: 4px; }
.em-detail::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

.em-detail-header {
  display:     flex;
  align-items: center;
  gap:         10px;
  margin-bottom: 16px;
}
.em-env-name-input {
  flex:          1;
  height:        36px; padding: 0 12px;
  background:    var(--bg-elevated); border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-primary);
  font-size:     var(--text-sm); font-weight: 600; outline: none;
  transition:    border-color var(--transition-fast);
}
.em-env-name-input:focus { border-color: var(--border-focus); }

.em-del-env-btn {
  display:       flex; align-items: center; gap: 5px;
  height:        32px; padding: 0 12px; flex-shrink: 0;
  background:    transparent; border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-tertiary);
  font-size:     var(--text-xs); cursor: pointer;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.em-del-env-btn:hover { background: var(--danger-muted); border-color: rgba(239,68,68,0.3); color: var(--danger); }

/* Variable table */
.em-vars-header {
  display:    grid;
  grid-template-columns: 1fr 1fr 24px;
  gap:        6px;
  padding:    0 4px 6px;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 6px;
}
.em-vars-col {
  font-size:   var(--text-xs);
  font-weight: 600;
  color:       var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.em-vars-list {
  display:        flex;
  flex-direction: column;
  gap:            4px;
  flex:           1;
}

.em-var-row {
  display:     grid;
  grid-template-columns: 20px 1fr 1fr 24px;
  gap:         6px;
  align-items: center;
}

.em-var-toggle {
  width:         14px; height: 14px; flex-shrink: 0;
  border-radius: 50%;
  background:    var(--bg-overlay); border: 2px solid var(--border-default);
  cursor:        pointer;
  transition:    background var(--transition-fast), border-color var(--transition-fast);
}
.em-var-toggle--on { background: var(--accent); border-color: var(--accent); }

.em-var-input {
  height:        32px; padding: 0 10px;
  background:    var(--bg-elevated); border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-primary);
  font-family:   var(--font-mono); font-size: var(--text-xs);
  outline:       none; width: 100%;
  transition:    border-color var(--transition-fast);
}
.em-var-input:focus   { border-color: var(--border-focus); }
.em-var-input--key    { color: var(--cyan-300); }
.em-var-input::placeholder { color: var(--text-tertiary); font-family: var(--font-mono); }

.em-var-remove {
  display:         flex; align-items: center; justify-content: center;
  width:           24px; height: 24px;
  background:      transparent; border: none;
  border-radius:   var(--radius-sm); color: var(--text-tertiary); cursor: pointer;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.em-var-remove:hover { background: var(--danger-muted); color: var(--danger); }

.em-add-var-btn {
  display:       flex; align-items: center; gap: 6px;
  width:         fit-content; padding: 6px 12px; margin-top: 6px;
  background:    transparent; border: 1px dashed var(--border-default);
  border-radius: var(--radius-md); color: var(--text-tertiary);
  font-size:     var(--text-xs); cursor: pointer;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.em-add-var-btn:hover { background: var(--bg-overlay); color: var(--text-primary); border-color: var(--border-strong); }

.em-vars-hint {
  margin-top:  12px;
  font-size:   var(--text-xs);
  color:       var(--text-tertiary);
  line-height: 1.6;
}
.em-vars-hint code {
  background:  var(--bg-overlay); color: var(--cyan-300);
  padding:     1px 5px; border-radius: 3px; font-family: var(--font-mono);
}

/* Empty state */
.em-empty {
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  justify-content: center;
  gap:             8px;
  flex:            1;
  color:           var(--text-tertiary);
  font-size:       var(--text-sm);
  text-align:      center;
  padding:         40px;
}
.em-empty-icon { opacity: 0.3; margin-bottom: 4px; }

/* Footer */
.em-footer {
  display:         flex;
  align-items:     center;
  justify-content: flex-end;
  gap:             8px;
  padding:         12px 20px;
  border-top:      1px solid var(--border-subtle);
  flex-shrink:     0;
}
.em-cancel-btn {
  height:        34px; padding: 0 16px;
  background:    transparent; border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-secondary);
  font-size:     var(--text-sm); cursor: pointer;
  transition:    background var(--transition-fast);
}
.em-cancel-btn:hover { background: var(--bg-overlay); }
.em-save-btn {
  display:       flex; align-items: center; gap: 6px;
  height:        34px; padding: 0 16px;
  background:    var(--accent); border: none;
  border-radius: var(--radius-md); color: var(--text-inverse);
  font-size:     var(--text-sm); font-weight: 600; cursor: pointer;
  transition:    background var(--transition-fast), opacity var(--transition-fast);
}
.em-save-btn:hover:not(:disabled) { background: var(--accent-hover); }
.em-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 599px) {
  .em-body    { flex-direction: column; }
  .em-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border-subtle); flex-direction: row; flex-wrap: wrap; overflow-x: auto; }
  .em-env-item { width: auto; }
}
`
