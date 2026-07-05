"use client";

import { Suspense, useState, useCallback, useRef } from "react";
import { useFiles } from "@/features/files/hooks/useFiles";
import { useInfiniteScroll } from "@/features/shared/hooks/useInfiniteScroll";
import FileCard from "@/features/files/components/FileCard";
import FileCardSkeleton from "@/features/files/components/FileCardSkeleton";
import FileUploadZone from "@/features/files/components/FileUploadZone";
import PageLayout from "@/features/shared/layout/PageLayout";
import PageHeader from "@/features/shared/ui/PageHeader";
import EmptyState from "@/features/shared/ui/EmptyState";
import CardGrid from "@/features/shared/components/CardGrid";
import { LucideSearch, LucideX, SolarFileBold } from "@/Icons/Icons";

export default function FilesPage() {
  return (
    <Suspense fallback={null}>
      <FilesPageContent />
    </Suspense>
  );
}

function FilesPageContent() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFiles({ search: appliedSearch || undefined });

  const files = data?.pages.flatMap((p) => p.items) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;

  const onReach = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);
  const sentinelRef = useInfiniteScroll(onReach, !!hasNextPage && !isLoading);

  const hasFilters = !!appliedSearch;
  const clearFilters = () => {
    setSearch("");
    setAppliedSearch("");
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setAppliedSearch(search);
    if (e.key === "Escape") clearFilters();
  };

  return (
    <>
      <style>{CSS}</style>
      <PageLayout
        top={
          <PageHeader
            title="Files"
            subtitle={isLoading ? undefined : `${totalCount} file${totalCount !== 1 ? "s" : ""}`}
          />
        }
      >
        <div className="files-layout">
          {/* ── Upload panel ── */}
          <aside className="files-upload-panel">
            <p className="files-upload-label">Upload</p>
            <FileUploadZone />
          </aside>

          {/* ── File list panel ── */}
          <section className="files-list-panel">
            {/* Search bar */}
            <div className="files-search-wrap">
              <LucideSearch className="files-search-icon" />
              <input
                className="files-search"
                placeholder="Search files…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKey}
                onBlur={() => setAppliedSearch(search)}
              />
              {search && (
                <button className="files-search-clear" onClick={clearFilters}>
                  <LucideX width={13} />
                </button>
              )}
            </div>

            {isLoading ? (
              <CardGrid minCardWidth={260}>
                {[...Array(6)].map((_, i) => <FileCardSkeleton key={i} />)}
              </CardGrid>
            ) : files.length > 0 ? (
              <>
                <CardGrid minCardWidth={260}>
                  {files.map((f) => <FileCard key={f.id} file={f} />)}
                </CardGrid>
                <div ref={sentinelRef} style={{ height: 1 }} />
                {isFetchingNextPage && (
                  <CardGrid minCardWidth={260}>
                    {[...Array(3)].map((_, i) => <FileCardSkeleton key={i} />)}
                  </CardGrid>
                )}
              </>
            ) : (
              <EmptyState
                icon={SolarFileBold}
                title="No files yet"
                subtitle="Upload your first file using the panel on the left"
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
                filteredTitle="No files match your search"
                filteredSubtitle="Try a different search term"
              />
            )}
          </section>
        </div>
      </PageLayout>
    </>
  );
}

const CSS = `
.files-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.files-upload-panel {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.files-upload-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin: 0;
}

.files-list-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.files-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.files-search-icon {
  position: absolute;
  left: 10px;
  width: 14px;
  height: 14px;
  color: var(--text-tertiary);
  pointer-events: none;
  flex-shrink: 0;
}
.files-search {
  width: 100%;
  height: 36px;
  padding: 0 32px 0 32px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  transition: border-color var(--transition-fast);
}
.files-search:focus { outline: none; border-color: var(--border-focus); }
.files-search::placeholder { color: var(--text-tertiary); }
.files-search-clear {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}
.files-search-clear:hover { color: var(--text-primary); }

@media (max-width: 767px) {
  .files-layout {
    flex-direction: column;
  }
  .files-upload-panel {
    width: 100%;
    position: static;
  }
}
`;
