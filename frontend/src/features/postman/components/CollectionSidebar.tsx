'use client'

import { useState } from 'react'
import {
  LucideFolderPlus, LucideX, SvgSpinnersRingResize, LucideCheck,
  LucideRadio, LucideChevronRight, LucideChevronDown, LucideFolder,
  LucideTrash2, LucidePlus, LucideStar,
} from '@/Icons/Icons'
import { type ApiEndpoint, type ApiCollection, type HttpMethod, METHOD_COLORS } from '@/features/postman/types/apiClient'
import { useCreateCollection, useDeleteCollection } from '@/features/postman/hooks/useApiClient'

const METHOD_BADGE: Record<HttpMethod, string> = {
  GET:     'method--get',
  POST:    'method--post',
  PUT:     'method--put',
  PATCH:   'method--patch',
  DELETE:  'method--delete',
  HEAD:    'method--head',
  OPTIONS: 'method--options',
}

interface CollectionSidebarProps {
  collections:         ApiCollection[] | undefined
  endpoints:           ApiEndpoint[]   | undefined
  selectedCollection:  number | null
  selectedEndpoint:    ApiEndpoint | null
  onSelectCollection:  (id: number | null) => void
  onSelectEndpoint:    (ep: ApiEndpoint) => void
  onNewRequest:        () => void
  // Mobile
  mobileOpen:          boolean
  onMobileClose:       () => void
}

export default function CollectionSidebar({
  collections, endpoints, selectedCollection, selectedEndpoint,
  onSelectCollection, onSelectEndpoint, onNewRequest,
  mobileOpen, onMobileClose,
}: CollectionSidebarProps) {
  const [showNewColl,       setShowNewColl]       = useState(false)
  const [collName,          setCollName]          = useState('')
  const [collapsedIds,      setCollapsedIds]      = useState<Set<number>>(new Set())
  const [confirmDeleteId,   setConfirmDeleteId]   = useState<number | null>(null)

  const createCollection = useCreateCollection()
  const deleteCollection = useDeleteCollection()

  const handleCreateCollection = async () => {
    if (!collName.trim()) return
    await createCollection.mutateAsync({ name: collName.trim() })
    setCollName('')
    setShowNewColl(false)
  }

  const toggleCollapse = (id: number) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Endpoints per collection (or all)
  const collEndpoints   = (colId: number) => endpoints?.filter((e) => e.collectionId === colId) ?? []
  const uncollected     = endpoints?.filter((e) => !e.collectionId) ?? []

  const SidebarContent = (
    <>
      <style>{CSS}</style>
      <div className="csb">

        {/* Header */}
        <div className="csb-header">
          <span className="csb-title">Collections</span>
          <div className="csb-header-actions">
            <button className="csb-icon-btn" onClick={() => setShowNewColl((p) => !p)} aria-label="New collection">
              <LucideFolderPlus width={15} />
            </button>
            <button className="csb-icon-btn csb-close-btn" onClick={onMobileClose} aria-label="Close">
              <LucideX width={15} />
            </button>
          </div>
        </div>

        {/* New collection inline input */}
        {showNewColl && (
          <div className="csb-new-coll">
            <input
              className="csb-coll-input"
              placeholder="Collection name…"
              value={collName}
              onChange={(e) => setCollName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
              autoFocus
            />
            <button
              className="csb-coll-save"
              onClick={handleCreateCollection}
              disabled={!collName.trim() || createCollection.isPending}
            >
              {createCollection.isPending ? <SvgSpinnersRingResize width={14} /> : <LucideCheck width={14} />}
            </button>
            <button className="csb-coll-cancel" onClick={() => { setShowNewColl(false); setCollName('') }}>
              <LucideX width={14} />
            </button>
          </div>
        )}

        {/* All endpoints (no collection) */}
        <div className="csb-section">
          <button
            className={['csb-all-btn', !selectedCollection ? 'csb-all-btn--active' : ''].filter(Boolean).join(' ')}
            onClick={() => { onSelectCollection(null); onMobileClose() }}
          >
            <LucideRadio width={14} />
            <span>All Endpoints</span>
            <span className="csb-count">{endpoints?.length ?? 0}</span>
          </button>
        </div>

        {/* Collections */}
        <div className="csb-collections">
          {collections?.map((col) => {
            const eps        = collEndpoints(col.id)
            const isSelected = selectedCollection === col.id
            const isCollapsed= collapsedIds.has(col.id)
            return (
              <div key={col.id} className="csb-coll-group">
                <div
                  className={['csb-coll-row', isSelected ? 'csb-coll-row--active' : ''].filter(Boolean).join(' ')}
                  onClick={() => { onSelectCollection(col.id); onMobileClose() }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectCollection(col.id)}
                >
                  <button
                    className="csb-collapse-btn"
                    onClick={(e) => { e.stopPropagation(); toggleCollapse(col.id) }}
                    aria-label="Collapse"
                  >
                    {isCollapsed ? <LucideChevronRight width={12} /> : <LucideChevronDown width={12} />}
                  </button>
                  <LucideFolder width={14} className="csb-coll-icon" />
                  <span className="csb-coll-name">{col.name}</span>
                  <span className="csb-count">{eps.length}</span>
                  <button
                    className="csb-del-btn"
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(col.id) }}
                    aria-label="Delete collection"
                  >
                    <LucideTrash2 width={12} />
                  </button>
                </div>

                {!isCollapsed && eps.map((ep) => (
                  <EndpointRow
                    key={ep.id}
                    endpoint={ep}
                    isActive={selectedEndpoint?.id === ep.id}
                    onClick={() => { onSelectEndpoint(ep); onMobileClose() }}
                    indent
                  />
                ))}
              </div>
            )
          })}

          {/* Uncollected endpoints */}
          {uncollected.length > 0 && (
            <div className="csb-coll-group">
              <p className="csb-uncoll-label">Uncategorized</p>
              {uncollected.map((ep) => (
                <EndpointRow
                  key={ep.id}
                  endpoint={ep}
                  isActive={selectedEndpoint?.id === ep.id}
                  onClick={() => { onSelectEndpoint(ep); onMobileClose() }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer: new request */}
        <div className="csb-footer">
          <button className="csb-new-req" onClick={() => { onNewRequest(); onMobileClose() }}>
            <LucidePlus width={14} />
            New Request
          </button>
        </div>
      </div>
    </>
  )

  const confirmingCollection = collections?.find(c => c.id === confirmDeleteId)
  const endpointsInCollection = confirmDeleteId ? (collections?.find(c => c.id === confirmDeleteId) ? endpoints?.filter(e => e.collectionId === confirmDeleteId) ?? [] : []) : []

  return (
    <>
      {/* Desktop */}
      <aside className="csb-desktop">{SidebarContent}</aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="csb-backdrop" onClick={onMobileClose} aria-hidden="true" />
      )}

      {/* Mobile drawer */}
      <aside className={['csb-mobile-drawer', mobileOpen ? 'csb-mobile-drawer--open' : ''].filter(Boolean).join(' ')}>
        {SidebarContent}
      </aside>

      {/* Delete collection confirmation */}
      {confirmDeleteId !== null && (
        <div className="csb-confirm-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="csb-confirm-box" onClick={(e) => e.stopPropagation()}>
            <p className="csb-confirm-title">Delete &ldquo;{confirmingCollection?.name}&rdquo;?</p>
            <p className="csb-confirm-body">
              {endpointsInCollection.length > 0
                ? `${endpointsInCollection.length} endpoint${endpointsInCollection.length > 1 ? 's' : ''} will become uncollected — they won't be deleted.`
                : 'This collection is empty.'}
            </p>
            <div className="csb-confirm-actions">
              <button className="csb-confirm-cancel" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button
                className="csb-confirm-delete"
                onClick={() => { const id = confirmDeleteId; setConfirmDeleteId(null); if (id !== null) deleteCollection.mutate(id); }}
                disabled={deleteCollection.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function EndpointRow({ endpoint, isActive, onClick, indent = false }: {
  endpoint: ApiEndpoint; isActive: boolean; onClick: () => void; indent?: boolean
}) {
  return (
    <button
      className={['csb-ep-row', isActive ? 'csb-ep-row--active' : '', indent ? 'csb-ep-row--indent' : ''].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <span className={['method-badge', METHOD_BADGE[endpoint.method] ?? ''].filter(Boolean).join(' ')}>
        {endpoint.method}
      </span>
      <span className="csb-ep-title">{endpoint.title}</span>
      {endpoint.isFavorite && <LucideStar width={11} className="csb-ep-star"/>}
    </button>
  )
}

const CSS = `
/* ── Desktop ── */
.csb-desktop {
  display:        flex;
  flex-shrink:    0;
}
@media (max-width: 767px) { .csb-desktop { display: none; } }

/* ── Backdrop ── */
.csb-backdrop {
  position:        fixed; inset: 0;
  background:      rgba(0,0,0,0.65); backdrop-filter: blur(2px);
  z-index:         calc(var(--z-modal) - 1);
  animation:       fadeIn var(--transition-base) ease both;
}

/* ── Mobile drawer ── */
.csb-mobile-drawer {
  display:    none;
  position:   fixed; top: 0; left: 0; bottom: 0;
  width:      300px; max-width: 90vw;
  z-index:    var(--z-modal);
  transform:  translateX(-100%);
  transition: transform var(--transition-slow);
}
.csb-mobile-drawer--open { transform: translateX(0); }
@media (max-width: 767px) { .csb-mobile-drawer { display: block; } }

/* ── Inner ── */
.csb {
  display:        flex;
  flex-direction: column;
  width:          260px;
  height:         100%;
  background:     var(--bg-surface);
  border-right:   1px solid var(--border-default);
  overflow:       hidden;
}
.csb-mobile-drawer .csb { width: 100%; }

/* Header */
.csb-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         14px 12px 10px;
  border-bottom:   1px solid var(--border-subtle);
  flex-shrink:     0;
}
.csb-title { font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
.csb-header-actions { display: flex; gap: 4px; }
.csb-icon-btn {
  display:         flex; align-items: center; justify-content: center;
  width:           28px; height: 28px; border-radius: var(--radius-sm);
  background:      transparent; border: none; color: var(--text-tertiary);
  cursor:          pointer; transition: background var(--transition-fast), color var(--transition-fast);
}
.csb-icon-btn:hover { background: var(--bg-overlay); color: var(--text-primary); }
.csb-close-btn { display: none; }
@media (max-width: 767px) { .csb-close-btn { display: flex; } }

/* New collection */
.csb-new-coll {
  display:     flex;
  gap:         4px;
  padding:     8px 10px;
  border-bottom: 1px solid var(--border-subtle);
  background:  var(--bg-elevated);
  flex-shrink: 0;
}
.csb-coll-input {
  flex:          1;
  height:        30px;
  padding:       0 8px;
  background:    var(--bg-subtle);
  border:        1px solid var(--border-focus);
  border-radius: var(--radius-sm);
  color:         var(--text-primary);
  font-size:     var(--text-sm);
  font-family:   var(--font-sans);
  outline:       none;
}
.csb-coll-save, .csb-coll-cancel {
  display:         flex; align-items: center; justify-content: center;
  width:           30px; height: 30px; border-radius: var(--radius-sm);
  border:          none; cursor: pointer;
  transition:      background var(--transition-fast);
}
.csb-coll-save   { background: var(--accent-muted); color: var(--cyan-400); }
.csb-coll-save:hover { background: var(--accent); color: white; }
.csb-coll-save:disabled { opacity: 0.5; pointer-events: none; }
.csb-coll-cancel { background: transparent; color: var(--text-tertiary); }
.csb-coll-cancel:hover { background: var(--bg-overlay); }

/* All btn */
.csb-section { padding: 8px 8px 4px; flex-shrink: 0; }
.csb-all-btn {
  display:       flex; align-items: center; gap: 8px;
  width:         100%; padding: 7px 8px;
  background:    transparent; border: none; border-radius: var(--radius-md);
  color:         var(--text-secondary); font-size: var(--text-sm); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 44px;
  transition:    background var(--transition-fast), color var(--transition-fast);
}
.csb-all-btn:hover     { background: var(--bg-overlay); color: var(--text-primary); }
.csb-all-btn--active   { background: var(--accent-muted); color: var(--cyan-300); }
.csb-all-btn span:first-of-type { flex: 1; text-align: left; }

/* Collections */
.csb-collections { flex: 1; overflow-y: auto; padding: 4px 8px; }
.csb-collections::-webkit-scrollbar { width: 0; }

.csb-coll-group  { margin-bottom: 4px; }
.csb-coll-row {
  display:       flex; align-items: center; gap: 6px;
  padding:       6px 8px; border-radius: var(--radius-md);
  color:         var(--text-secondary); font-size: var(--text-sm); font-weight: 500;
  cursor:        pointer; min-height: 44px;
  transition:    background var(--transition-fast), color var(--transition-fast);
  position:      relative;
}
.csb-coll-row:hover      { background: var(--bg-overlay); color: var(--text-primary); }
.csb-coll-row--active    { background: var(--accent-muted); color: var(--cyan-300); }
.csb-collapse-btn {
  display:         flex; align-items: center; justify-content: center;
  width:           18px; height: 18px; flex-shrink: 0;
  background:      transparent; border: none; color: currentColor; cursor: pointer;
  border-radius:   var(--radius-sm);
}
.csb-coll-icon { flex-shrink: 0; color: var(--text-tertiary); }
.csb-coll-name { flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.csb-count {
  font-size: 10px; font-weight: 600; color: var(--text-tertiary);
  background: var(--bg-overlay); padding: 1px 6px; border-radius: 99px; flex-shrink: 0;
}
.csb-del-btn {
  display:         flex; align-items: center; justify-content: center;
  width:           22px; height: 22px; border-radius: var(--radius-sm);
  background:      transparent; border: none;
  color:           var(--text-tertiary);
  opacity:         0.4;
  cursor:          pointer; flex-shrink: 0;
  transition:      background var(--transition-fast), color var(--transition-fast), opacity var(--transition-fast);
}
.csb-coll-row:hover .csb-del-btn { opacity: 1; }
.csb-del-btn:hover { background: var(--danger-muted); color: var(--danger); opacity: 1; }

/* Endpoint rows */
.csb-ep-row {
  display:       flex; align-items: center; gap: 7px;
  width:         100%; padding: 5px 8px; border-radius: var(--radius-sm);
  background:    transparent; border: none;
  color:         var(--text-secondary); font-size: var(--text-xs); font-family: var(--font-sans);
  cursor:        pointer; min-height: 40px; text-align: left;
  transition:    background var(--transition-fast);
}
.csb-ep-row:hover     { background: var(--bg-overlay); }
.csb-ep-row--active   { background: var(--accent-muted); }
.csb-ep-row--indent   { padding-left: 28px; }
.csb-ep-title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.csb-ep-star  { color: #fbbf24; flex-shrink: 0; }

.csb-uncoll-label {
  font-size:      var(--text-xs); font-weight: 600; color: var(--text-tertiary);
  text-transform: uppercase; letter-spacing: 0.06em;
  padding:        8px 8px 4px;
}

/* Method badge */
.method-badge {
  display:       inline-flex; align-items: center;
  padding:       1px 5px; border-radius: var(--radius-sm);
  font-size:     9px; font-family: var(--font-mono); font-weight: 700;
  white-space:   nowrap; flex-shrink: 0;
}
.method--get     { background: rgba(16,185,129,0.15); color: #34d399; }
.method--post    { background: rgba(59,130,246,0.15); color: #60a5fa; }
.method--put     { background: rgba(245,158,11,0.15); color: #fbbf24; }
.method--patch   { background: rgba(139,92,246,0.15); color: #a78bfa; }
.method--delete  { background: rgba(239,68,68,0.15);  color: #f87171; }
.method--head    { background: rgba(6,182,212,0.15);  color: var(--cyan-300); }
.method--options { background: rgba(107,114,128,0.15);color: #9ca3af; }

/* Footer */
.csb-footer {
  padding:      8px;
  border-top:   1px solid var(--border-subtle);
  flex-shrink:  0;
}
.csb-new-req {
  display:       flex; align-items: center; justify-content: center; gap: 6px;
  width:         100%; height: 36px;
  background:    var(--accent-muted); border: 1px solid var(--accent-border);
  border-radius: var(--radius-md); color: var(--cyan-300);
  font-size:     var(--text-sm); font-family: var(--font-sans); font-weight: 500;
  cursor:        pointer; min-height: 44px;
  transition:    background var(--transition-fast), box-shadow var(--transition-fast);
}
.csb-new-req:hover { background: var(--accent); color: white; box-shadow: var(--shadow-glow); }

/* Delete confirm overlay */
.csb-confirm-overlay {
  position:        fixed; inset: 0; z-index: 1000;
  background:      rgba(0,0,0,0.5);
  display:         flex; align-items: center; justify-content: center;
  padding:         16px;
}
.csb-confirm-box {
  background:      var(--bg-surface);
  border:          1px solid var(--border-default);
  border-radius:   var(--radius-lg);
  padding:         20px;
  width:           100%; max-width: 320px;
  display:         flex; flex-direction: column; gap: 10px;
  box-shadow:      var(--shadow-lg);
}
.csb-confirm-title {
  font-size:   var(--text-sm); font-weight: 600; color: var(--text-primary); margin: 0;
}
.csb-confirm-body {
  font-size:   var(--text-xs); color: var(--text-secondary); line-height: 1.5; margin: 0;
}
.csb-confirm-actions {
  display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px;
}
.csb-confirm-cancel {
  height: 30px; padding: 0 14px; background: var(--bg-overlay);
  border: 1px solid var(--border-default); border-radius: var(--radius-md);
  color: var(--text-secondary); font-size: var(--text-xs); font-family: var(--font-sans);
  cursor: pointer; transition: background var(--transition-fast);
}
.csb-confirm-cancel:hover { background: var(--bg-subtle); }
.csb-confirm-delete {
  height: 30px; padding: 0 14px; background: var(--danger);
  border: none; border-radius: var(--radius-md);
  color: #fff; font-size: var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor: pointer; transition: opacity var(--transition-fast);
}
.csb-confirm-delete:hover { opacity: 0.85; }
.csb-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }
`