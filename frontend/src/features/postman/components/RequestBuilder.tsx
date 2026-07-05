'use client'

import { useState } from 'react'
import {
  LucideTerminal, LucideSave, LucideBookmarkPlus, LucideTrash2,
  LucideLayers, LucideChevronDown, LucideSettings2, SvgSpinnersRingResize,
  LucideSend, LucideArrowRight, LucideSlidersHorizontal, LucideList,
  LucideBraces, LucideShieldCheck, LucideLock, LucideShieldAlert,
  LucideX, LucidePlus,
} from '@/Icons/Icons'
import { type HttpMethod, type Environment, type KeyValue, type AuthType, type AuthData, HTTP_METHODS, AUTH_TYPES } from '@/features/postman/types/apiClient'
import { useVault } from '@/features/settings/security/hooks/useVault'

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET:     '#34d399', POST:    '#60a5fa', PUT:     '#fbbf24',
  PATCH:   '#a78bfa', DELETE:  '#f87171', HEAD:    '#22d3ee', OPTIONS: '#9ca3af',
}

interface RequestBuilderProps {
  method:       HttpMethod
  url:          string
  headers:      string
  body:         string
  bodyType:     'json' | 'raw' | 'form-data'
  isSaved:      boolean
  isSending:    boolean
  environments:   Environment[]
  activeEnvId:    number | null
  queryParams:    KeyValue[]
  authType:       AuthType
  authData:       Partial<AuthData>
  endpointId:     number | null
  onMethodChange:   (m: HttpMethod) => void
  onUrlChange:      (u: string) => void
  onHeadersChange:  (h: string) => void
  onBodyChange:     (b: string) => void
  onBodyTypeChange: (t: 'json' | 'raw' | 'form-data') => void
  onSend:       () => void
  onSave:       () => void
  onDelete:     () => void
  onEnvChange:        (id: number | null) => void
  onManageEnvs:       () => void
  onQueryParamsChange: (params: KeyValue[]) => void
  onAuthTypeChange:   (t: AuthType) => void
  onAuthDataChange:   (d: Partial<AuthData>) => void
  onImportCurl:       () => void
  title:        string
}

type Tab = 'params' | 'headers' | 'body' | 'auth'

export default function RequestBuilder({
  method, url, headers, body, bodyType,
  isSaved, isSending,
  environments, activeEnvId, queryParams,
  authType, authData, endpointId,
  onMethodChange, onUrlChange, onHeadersChange, onBodyChange, onBodyTypeChange,
  onSend, onSave, onDelete, onEnvChange, onManageEnvs, onQueryParamsChange,
  onAuthTypeChange, onAuthDataChange, onImportCurl,
  title,
}: RequestBuilderProps) {
  const [activeTab, setActiveTab] = useState<Tab>('params')
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method)
  const enabledParamCount = queryParams.filter((p) => p.key.trim() && p.enabled).length
  const { isEnabled: vaultEnabled, isUnlocked: vaultUnlocked } = useVault()
  const vaultLocked = vaultEnabled && !vaultUnlocked

  // Resolve {{VAR}} tokens against the active environment for the preview line
  const activeEnv = environments.find((e) => e.id === activeEnvId) ?? null
  const resolvedUrl = activeEnv?.variables?.length && url
    ? url.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const v = activeEnv.variables!.find((v) => v.key === key.trim() && v.enabled)
        return v ? v.value : match
      })
    : url
  const hasSubstitution = resolvedUrl !== url

  // When vault is locked, replace substituted variable values with bullets
  const maskedUrl = vaultLocked
    ? url.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const v = activeEnv?.variables?.find((v) => v.key === key.trim() && v.enabled)
        return v ? '••••••••' : match
      })
    : resolvedUrl

  return (
    <>
      <style>{CSS}</style>
      <div className="rb">

        {/* ── Title row ── */}
        <div className="rb-title-row">
          <span className="rb-title">{title}</span>
          <div className="rb-title-actions">
            <button className="rb-import-btn" onClick={onImportCurl} title="Import from cURL">
              <LucideTerminal width={14} />
              <span className="rb-import-label">Import cURL</span>
            </button>
            <button className="rb-save-btn" onClick={onSave} title={isSaved ? 'Update' : 'Save'}>
              {isSaved ? <LucideSave width={14} /> : <LucideBookmarkPlus width={14} />}
              {isSaved ? 'Update' : 'Save'}
            </button>
            {isSaved && (
              <button className="rb-del-btn" onClick={onDelete} title="Delete endpoint">
                <LucideTrash2 width={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Environment bar ── */}
        <div className="rb-env-bar">
          <div className="rb-env-pill">
            <LucideLayers width={12} className="rb-env-pill-icon" />
            <select
              className="rb-env-select"
              value={activeEnvId ?? ''}
              onChange={(e) => onEnvChange(e.target.value ? parseInt(e.target.value) : null)}
              title="Active environment"
            >
              <option value="">No environment</option>
              {environments.filter(e => e.id > 0).length > 0 && (
                <optgroup label="Environments">
                  {environments.filter(e => e.id > 0).map((env) => (
                    <option key={env.id} value={env.id}>{env.name}</option>
                  ))}
                </optgroup>
              )}
              {environments.filter(e => e.id < 0).length > 0 && (
                <optgroup label="From Infrastructure">
                  {environments.filter(e => e.id < 0).map((env) => (
                    <option key={env.id} value={env.id}>{env.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
            <LucideChevronDown width={11} className="rb-env-pill-chevron" />
          </div>
          <button className="rb-env-manage" onClick={onManageEnvs} title="Manage environments">
            <LucideSettings2 width={13} />
            Manage
          </button>
          {activeEnv && (
            <span className="rb-env-count">
              {(activeEnv.variables ?? []).filter((v) => v.enabled).length} var{(activeEnv.variables ?? []).filter((v) => v.enabled).length !== 1 ? 's' : ''} active
            </span>
          )}
        </div>

        {/* ── URL bar — structure unchanged from before env feature ── */}
        <div className="rb-url-bar">
          {/* Method select */}
          <div className="rb-method-wrap">
            <select
              className="rb-method"
              value={method}
              onChange={(e) => onMethodChange(e.target.value as HttpMethod)}
              style={{ color: METHOD_COLORS[method] }}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <LucideChevronDown className="rb-method-chevron" style={{ color: METHOD_COLORS[method] }} />
          </div>

          {/* URL input */}
          <input
            className="rb-url"
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://api.example.com/endpoint  or  {{BASE_URL}}/path"
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            spellCheck={false}
          />

          {/* Send button */}
          <button
            suppressHydrationWarning
            className="rb-send-btn"
            onClick={onSend}
            disabled={!url.trim() || isSending}
            aria-label="Send request"
          >
            {isSending
              ? <SvgSpinnersRingResize width={16} />
              : <LucideSend width={16} />
            }
            <span className="rb-send-label">Send</span>
          </button>
        </div>

        {/* ── Resolved URL preview — shows when a variable is substituted ── */}
        {hasSubstitution && (
          <div className="rb-resolved">
            <LucideArrowRight width={11} className="rb-resolved-arrow" />
            <span className="rb-resolved-url">{maskedUrl}</span>
          </div>
        )}

        {/* ── Tabs: Params / Headers / Body ── */}
        <div className="rb-tabs">
          <button
            className={['rb-tab', activeTab === 'params' ? 'rb-tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => setActiveTab('params')}
          >
            <LucideSlidersHorizontal width={13} />
            Params
            {enabledParamCount > 0 && <span className="rb-tab-badge">{enabledParamCount}</span>}
          </button>
          <button
            className={['rb-tab', activeTab === 'headers' ? 'rb-tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => setActiveTab('headers')}
          >
            <LucideList width={13} />
            Headers
            {headers.trim() && <span className="rb-tab-dot" />}
          </button>
          <button
            suppressHydrationWarning
            className={['rb-tab', activeTab === 'body' ? 'rb-tab--active' : '', !hasBody ? 'rb-tab--disabled' : ''].filter(Boolean).join(' ')}
            onClick={() => hasBody && setActiveTab('body')}
            disabled={!hasBody}
            title={!hasBody ? 'Body not available for ' + method : undefined}
          >
            <LucideBraces width={13} />
            Body
            {hasBody && body.trim() && <span className="rb-tab-dot" />}
          </button>
          <button
            className={['rb-tab', activeTab === 'auth' ? 'rb-tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => setActiveTab('auth')}
          >
            <LucideShieldCheck width={13} />
            Auth
            {authType !== 'none' && <span className="rb-tab-dot" />}
          </button>
        </div>

        {/* ── Params panel ── */}
        {activeTab === 'params' && (
          <div className="rb-panel">
            {queryParams.length > 0 && (
              <div className="rb-params-header">
                <span />
                <span className="rb-params-col-label">Key</span>
                <span className="rb-params-col-label">Value</span>
                <span />
              </div>
            )}
            <div className="rb-params-list">
              {queryParams.map((param) => (
                <div key={param.id} className="rb-params-row">
                  <button
                    className={['rb-param-toggle', param.enabled ? 'rb-param-toggle--on' : ''].filter(Boolean).join(' ')}
                    onClick={() => onQueryParamsChange(queryParams.map((p) => p.id === param.id ? { ...p, enabled: !p.enabled } : p))}
                    title={param.enabled ? 'Disable' : 'Enable'}
                  />
                  <input
                    className="rb-param-input rb-param-input--key"
                    placeholder="key"
                    value={param.key}
                    onChange={(e) => onQueryParamsChange(queryParams.map((p) => p.id === param.id ? { ...p, key: e.target.value } : p))}
                    spellCheck={false}
                  />
                  <input
                    className="rb-param-input rb-param-input--value"
                    placeholder="value"
                    value={param.value}
                    onChange={(e) => onQueryParamsChange(queryParams.map((p) => p.id === param.id ? { ...p, value: e.target.value } : p))}
                    spellCheck={false}
                  />
                  <button
                    className="rb-param-remove"
                    onClick={() => onQueryParamsChange(queryParams.filter((p) => p.id !== param.id))}
                    title="Remove"
                  >
                    <LucideX width={12} />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="rb-params-add"
              onClick={() => onQueryParamsChange([...queryParams, { id: crypto.randomUUID(), key: '', value: '', enabled: true }])}
            >
              <LucidePlus width={13} />
              Add parameter
            </button>
            {queryParams.length === 0 && (
              <p className="rb-panel-hint">
                Add query parameters here, or type them directly in the URL bar — they sync automatically.
              </p>
            )}
          </div>
        )}

        {/* ── Headers panel ── */}
        {activeTab === 'headers' && (
          <div className="rb-panel">
            <p className="rb-panel-hint">
              One header per line: <code>Key: Value</code>. Use <code>{'{{VAR}}'}</code> for environment variables.
            </p>
            <textarea
              className="rb-textarea rb-textarea--mono"
              value={headers}
              onChange={(e) => onHeadersChange(e.target.value)}
              placeholder={'Content-Type: application/json\nAuthorization: Bearer {{TOKEN}}'}
              rows={6}
              spellCheck={false}
            />
          </div>
        )}

        {/* ── Body panel ── */}
        {activeTab === 'body' && hasBody && (
          <div className="rb-panel">
            <div className="rb-body-type-row">
              {(['json', 'raw', 'form-data'] as const).map((t) => (
                <button
                  key={t}
                  className={['rb-body-type-btn', bodyType === t ? 'rb-body-type-btn--active' : ''].filter(Boolean).join(' ')}
                  onClick={() => onBodyTypeChange(t)}
                >
                  {t === 'json' ? 'JSON' : t === 'raw' ? 'Raw' : 'Form Data'}
                </button>
              ))}
            </div>
            <textarea
              className="rb-textarea rb-textarea--mono"
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
              placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : bodyType === 'form-data' ? 'key=value\nfoo=bar' : 'Raw body content'}
              rows={8}
              spellCheck={false}
            />
          </div>
        )}

        {/* ── Auth panel ── */}
        {activeTab === 'auth' && (
          <div className="rb-panel">
            {/* Auth type selector */}
            <div className="rb-auth-types">
              {AUTH_TYPES.map((t) => (
                <button
                  key={t.value}
                  className={['rb-auth-type-btn', authType === t.value ? 'rb-auth-type-btn--active' : ''].filter(Boolean).join(' ')}
                  onClick={() => { onAuthTypeChange(t.value); onAuthDataChange({}); }}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Bearer token */}
            {authType === 'bearer' && (
              <div className="rb-auth-fields">
                <label className="rb-auth-label">Bearer Token</label>
                {vaultLocked ? (
                  <div className="rb-auth-locked">
                    <LucideLock width={13} />
                    <span>Unlock vault to view or edit credentials</span>
                  </div>
                ) : (
                  <input
                    className="rb-auth-input"
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={authData.token ?? ''}
                    onChange={(e) => onAuthDataChange({ ...authData, token: e.target.value })}
                    spellCheck={false}
                  />
                )}
                {!vaultLocked && !vaultEnabled && authData.token && (
                  <p className="rb-auth-hint">
                    <LucideShieldAlert width={11} />
                    Enable vault to encrypt this token at rest
                  </p>
                )}
              </div>
            )}

            {/* Basic auth */}
            {authType === 'basic' && (
              <div className="rb-auth-fields">
                {vaultLocked ? (
                  <div className="rb-auth-locked">
                    <LucideLock width={13} />
                    <span>Unlock vault to view or edit credentials</span>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="rb-auth-label">Username</label>
                      <input
                        className="rb-auth-input"
                        type="text"
                        placeholder="username"
                        value={authData.username ?? ''}
                        onChange={(e) => onAuthDataChange({ ...authData, username: e.target.value })}
                        spellCheck={false}
                      />
                    </div>
                    <div>
                      <label className="rb-auth-label">Password</label>
                      <input
                        className="rb-auth-input"
                        type="password"
                        placeholder="password"
                        value={authData.password ?? ''}
                        onChange={(e) => onAuthDataChange({ ...authData, password: e.target.value })}
                        spellCheck={false}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* API Key */}
            {authType === 'api-key' && (
              <div className="rb-auth-fields">
                <div>
                  <label className="rb-auth-label">Header Name</label>
                  <input
                    className="rb-auth-input"
                    type="text"
                    placeholder="X-API-Key"
                    value={authData.apiKeyHeader ?? ''}
                    onChange={(e) => onAuthDataChange({ ...authData, apiKeyHeader: e.target.value })}
                    spellCheck={false}
                  />
                </div>
                {vaultLocked ? (
                  <div className="rb-auth-locked">
                    <LucideLock width={13} />
                    <span>Unlock vault to view or edit the API key value</span>
                  </div>
                ) : (
                  <div>
                    <label className="rb-auth-label">API Key</label>
                    <input
                      className="rb-auth-input"
                      type="password"
                      placeholder="sk-••••••••••••••••"
                      value={authData.apiKey ?? ''}
                      onChange={(e) => onAuthDataChange({ ...authData, apiKey: e.target.value })}
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>
            )}

            {authType === 'none' && (
              <p className="rb-panel-hint">No authentication configured for this request.</p>
            )}

            {authType === 'oauth2' && (
              <p className="rb-panel-hint">
                OAuth 2.0 — paste your access token in Bearer Token mode, or add it directly to the Authorization header.
              </p>
            )}

            {vaultEnabled && vaultUnlocked && authType !== 'none' && isSaved && (
              <p className="rb-auth-vault-note">
                <LucideShieldCheck width={11} />
                Credentials will be encrypted in your vault when saved
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

const CSS = `
.rb {
  display:        flex;
  flex-direction: column;
  background:     var(--bg-surface);
  border:         1px solid var(--border-default);
  border-radius:  var(--radius-lg);
  overflow:       hidden;
  height:         100%;
}

/* Title row */
.rb-title-row {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  gap:             12px;
  padding:         12px 16px;
  border-bottom:   1px solid var(--border-subtle);
  flex-shrink:     0;
}
.rb-title        { font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rb-title-actions{ display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.rb-save-btn {
  display:       flex; align-items: center; gap: 6px;
  height:        30px; padding: 0 12px;
  background:    var(--accent-muted); border: 1px solid var(--accent-border);
  border-radius: var(--radius-md); color: var(--cyan-300);
  font-size:     var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 44px;
  transition:    background var(--transition-fast), box-shadow var(--transition-fast);
}
.rb-save-btn:hover { background: var(--accent); color: white; }
.rb-import-btn {
  display:       flex; align-items: center; gap: 6px;
  height:        30px; padding: 0 12px;
  background:    transparent; border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-tertiary);
  font-size:     var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 44px;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.rb-import-btn:hover { border-color: var(--border-strong); color: var(--text-primary); }
@media (max-width: 559px) { .rb-import-label { display: none; } }
.rb-del-btn {
  display:         flex; align-items: center; justify-content: center;
  width:           34px; height: 30px; min-height: 44px;
  background:      transparent; border: 1px solid var(--border-default);
  border-radius:   var(--radius-md); color: var(--text-tertiary); cursor: pointer;
  transition:      background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.rb-del-btn:hover { background: var(--danger-muted); border-color: rgba(239,68,68,0.3); color: var(--danger); }

/* Environment bar */
.rb-env-bar {
  display:       flex;
  align-items:   center;
  gap:           8px;
  padding:       6px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background:    var(--bg-elevated);
  flex-shrink:   0;
}

.rb-env-pill {
  position:      relative;
  display:       flex;
  align-items:   center;
  gap:           5px;
  height:        26px;
  padding:       0 22px 0 8px;
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-md);
  cursor:        pointer;
  transition:    border-color var(--transition-fast);
}
.rb-env-pill:focus-within { border-color: var(--border-focus); }
.rb-env-pill-icon    { color: var(--text-tertiary); flex-shrink: 0; }
.rb-env-pill-chevron { position: absolute; right: 6px; color: var(--text-tertiary); pointer-events: none; }

.rb-env-select {
  background:         transparent;
  border:             none;
  color:              var(--text-secondary);
  font-size:          var(--text-xs);
  font-family:        var(--font-sans);
  outline:            none;
  cursor:             pointer;
  appearance:         none;
  -webkit-appearance: none;
  max-width:          140px;
}
.rb-env-select option { background: var(--bg-elevated); color: var(--text-primary); }

.rb-env-manage {
  display:       flex; align-items: center; gap: 4px;
  height:        26px; padding: 0 10px;
  background:    transparent; border: 1px solid var(--border-default);
  border-radius: var(--radius-md); color: var(--text-tertiary);
  font-size:     var(--text-xs); font-family: var(--font-sans);
  cursor:        pointer;
  transition:    background var(--transition-fast), color var(--transition-fast);
}
.rb-env-manage:hover { background: var(--bg-overlay); color: var(--text-primary); }

.rb-env-count {
  font-size:   var(--text-xs);
  color:       var(--text-tertiary);
  background:  var(--accent-muted);
  border:      1px solid var(--accent-border);
  color:       var(--cyan-400);
  border-radius: 99px;
  padding:     1px 8px;
}

@media (max-width: 479px) {
  .rb-env-manage span { display: none; }
  .rb-env-count       { display: none; }
}

/* URL bar */
.rb-url-bar {
  display:       flex;
  align-items:   center;
  gap:           8px;
  padding:       12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink:   0;
}

.rb-method-wrap { position: relative; display: flex; align-items: center; flex-shrink: 0; }
.rb-method {
  height:38px;
  padding:            0 28px 0 10px;
  background:         var(--bg-elevated);
  border:             1px solid var(--border-default);
  border-radius:      var(--radius-md);
  font-family:        var(--font-mono);
  font-size:          var(--text-sm);
  font-weight:        700;
  outline:            none;
  cursor:             pointer;
  appearance:         none;
  -webkit-appearance: none;
  transition:         border-color var(--transition-fast);
}
.rb-method:focus           { border-color: var(--border-focus); }
.rb-method option          { background: var(--bg-elevated); color: var(--text-primary); font-weight: 700; }
.rb-method-chevron         { position: absolute; right: 8px; width: 12px; height: 12px; pointer-events: none; }

.rb-url {
  flex:          1;
  height:        38px;
  padding:       0 12px;
  background:    var(--bg-subtle);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-md);
  color:         var(--text-primary);
  font-family:   var(--font-mono);
  font-size:     var(--text-sm);
  outline:       none;
  transition:    border-color var(--transition-fast), background var(--transition-fast);
  min-width:     0;
}
.rb-url::placeholder { color: var(--text-tertiary); }
.rb-url:focus        { border-color: var(--border-focus); background: var(--bg-elevated); }

.rb-send-btn {
  display:       flex; align-items: center; gap: 6px;
  height:        38px; padding: 0 16px;
  background:    var(--accent); border: none;
  border-radius: var(--radius-md); color: var(--text-inverse);
  font-size:     var(--text-sm); font-family: var(--font-sans); font-weight: 600;
  cursor:        pointer; flex-shrink: 0; min-height: 44px;
  transition:    background var(--transition-fast), box-shadow var(--transition-fast), opacity var(--transition-fast);
}
.rb-send-btn:hover:not(:disabled) { background: var(--accent-hover); box-shadow: var(--shadow-glow); }
.rb-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
/* ── Mobile (≤767px) ──
   Secondary chrome (title actions + env bar) moves into the page-level
   bottom action sheet, so it's hidden here. The URL input takes a full-width
   row of its own; method + Send sit on the row beneath it. */
@media (max-width: 767px) {
  .rb-title-row  { display: none; }
  .rb-env-bar    { display: none; }
  .rb-url-bar    { flex-wrap: wrap; padding: 10px 12px; gap: 8px; }
  .rb-url        { order: -1; width: 100%; flex: 1 0 100%; }
  .rb-method-wrap { flex: 0 0 auto; }
  .rb-send-btn   { flex: 1; justify-content: center; }
}
@media (max-width: 479px) {
  .rb-send-label { display: none; }
}

/* Resolved URL preview */
.rb-resolved {
  display:       flex;
  align-items:   center;
  gap:           6px;
  padding:       5px 16px;
  background:    var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink:   0;
}
.rb-resolved-arrow { color: var(--cyan-400); flex-shrink: 0; }
.rb-resolved-url {
  font-family:   var(--font-mono);
  font-size:     var(--text-xs);
  color:         var(--cyan-300);
  white-space:   nowrap;
  overflow:      hidden;
  text-overflow: ellipsis;
  min-width:     0;
}

/* Tabs */
.rb-tabs {
  display:       flex;
  gap:           2px;
  padding:       8px 12px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink:   0;
}
.rb-tab {
  display:       flex; align-items: center; gap: 5px;
  height:        30px; padding: 0 12px;
  background:    transparent; border: 1px solid transparent; border-radius: var(--radius-md);
  color:         var(--text-tertiary); font-size: var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 40px; position: relative;
  transition:    background var(--transition-fast), color var(--transition-fast);
}
.rb-tab:hover         { background: var(--bg-overlay); color: var(--text-primary); }
.rb-tab--active       { background: var(--bg-overlay); color: var(--text-primary); border-color: var(--border-default); }
.rb-tab--disabled     { opacity: 0.4; cursor: not-allowed; }
.rb-tab-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent); position: absolute; top: 6px; right: 6px;
}
.rb-tab-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 16px; height: 16px; padding: 0 4px;
  background: var(--accent-muted); border: 1px solid var(--accent-border);
  border-radius: 8px; color: var(--cyan-300); font-size: 10px; font-weight: 600;
}

/* Panel */
.rb-panel { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; min-height: 0; }
.rb-panel-hint { font-size: var(--text-xs); color: var(--text-tertiary); }
.rb-panel-hint code { background: var(--bg-overlay); color: var(--cyan-300); padding: 1px 5px; border-radius: 3px; font-family: var(--font-mono); }

.rb-textarea {
  width:         100%;
  background:    var(--bg-elevated);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-md);
  color:         var(--text-primary);
  font-family:   var(--font-sans);
  font-size:     var(--text-sm);
  line-height:   var(--leading-relaxed);
  padding:       10px 12px;
  outline:       none;
  resize:        vertical;
  transition:    border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.rb-textarea--mono   { font-family: var(--font-mono); font-size: var(--text-xs); }
.rb-textarea::placeholder { color: var(--text-tertiary); }
.rb-textarea:focus   { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-muted); }

/* Body type */
.rb-body-type-row { display: flex; gap: 4px; }
.rb-body-type-btn {
  height:        28px; padding: 0 12px;
  background:    transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md);
  color:         var(--text-tertiary); font-size: var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 40px;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.rb-body-type-btn:hover       { border-color: var(--border-strong); color: var(--text-primary); }
.rb-body-type-btn--active     { background: var(--accent-muted); border-color: var(--accent-border); color: var(--cyan-300); }

/* Params table */
.rb-params-header {
  display: grid; grid-template-columns: 24px 1fr 1fr 28px;
  gap: 6px; padding: 0 2px; margin-bottom: 2px;
}
.rb-params-col-label { font-size: 10px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.04em; }
.rb-params-list { display: flex; flex-direction: column; gap: 4px; }
.rb-params-row {
  display: grid; grid-template-columns: 24px 1fr 1fr 28px;
  gap: 6px; align-items: center;
}
.rb-param-toggle {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid var(--border-default); background: transparent; cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  flex-shrink: 0;
}
.rb-param-toggle--on { background: var(--accent); border-color: var(--accent); }
.rb-param-input {
  height: 32px; padding: 0 10px;
  background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-sm);
  color: var(--text-primary); font-size: var(--text-xs); font-family: var(--font-mono);
  outline: none; transition: border-color var(--transition-fast);
}
.rb-param-input::placeholder { color: var(--text-tertiary); }
.rb-param-input:focus { border-color: var(--border-focus); }
.rb-param-remove {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; background: transparent;
  border: 1px solid transparent; border-radius: var(--radius-sm);
  color: var(--text-tertiary); cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.rb-param-remove:hover { background: var(--bg-overlay); border-color: var(--border-default); color: var(--red-400, #f87171); }
.rb-params-add {
  display: inline-flex; align-items: center; gap: 5px;
  height: 30px; padding: 0 10px; margin-top: 4px; align-self: flex-start;
  background: transparent; border: 1px dashed var(--border-default); border-radius: var(--radius-sm);
  color: var(--text-tertiary); font-size: var(--text-xs); font-family: var(--font-sans); cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}
.rb-params-add:hover { border-color: var(--border-strong); color: var(--text-secondary); }

/* Auth panel */
.rb-auth-types {
  display:   flex;
  flex-wrap: wrap;
  gap:       6px;
}
.rb-auth-type-btn {
  display:       flex; align-items: center; gap: 5px;
  height:        30px; padding: 0 12px;
  background:    transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md);
  color:         var(--text-tertiary); font-size: var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 40px;
  transition:    background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.rb-auth-type-btn:hover       { border-color: var(--border-strong); color: var(--text-primary); }
.rb-auth-type-btn--active     { background: var(--accent-muted); border-color: var(--accent-border); color: var(--cyan-300); }

.rb-auth-fields { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }
.rb-auth-label  { display: block; font-size: var(--text-xs); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
.rb-auth-input {
  width:         100%;
  height:        36px; padding: 0 12px;
  background:    var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md);
  color:         var(--text-primary); font-family: var(--font-mono); font-size: var(--text-sm);
  outline:       none; transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.rb-auth-input::placeholder { color: var(--text-tertiary); }
.rb-auth-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--accent-muted); }

.rb-auth-locked {
  display:       flex; align-items: center; gap: 8px;
  padding:       10px 14px;
  background:    var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
  color:         var(--text-tertiary); font-size: var(--text-xs);
}
.rb-auth-hint {
  display:     flex; align-items: center; gap: 5px;
  font-size:   var(--text-xs); color: var(--text-tertiary);
  margin:      0;
}
.rb-auth-vault-note {
  display:     flex; align-items: center; gap: 5px;
  font-size:   var(--text-xs); color: var(--cyan-400);
  background:  var(--accent-muted); border: 1px solid var(--accent-border);
  border-radius: var(--radius-md); padding: 6px 10px; margin: 0;
}
`
