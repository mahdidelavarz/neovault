export default function FileCardSkeleton() {
  return (
    <>
      <style>{CSS}</style>
      <div className="fcard-sk">
        <div className="fcard-sk-icon" />
        <div className="fcard-sk-meta">
          <div className="fcard-sk-line fcard-sk-line--name" />
          <div className="fcard-sk-line fcard-sk-line--size" />
        </div>
        <div className="fcard-sk-footer">
          <div className="fcard-sk-line fcard-sk-line--date" />
          <div className="fcard-sk-actions">
            <div className="fcard-sk-btn" />
            <div className="fcard-sk-btn" />
            <div className="fcard-sk-btn" />
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
.fcard-sk {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}
.fcard-sk-icon {
  width: 44px; height: 44px;
  background: var(--bg-overlay);
  border-radius: var(--radius-md);
  animation: fcard-pulse 1.4s ease-in-out infinite;
}
.fcard-sk-meta { display: flex; flex-direction: column; gap: 6px; }
.fcard-sk-line {
  height: 10px;
  background: var(--bg-overlay);
  border-radius: var(--radius-sm);
  animation: fcard-pulse 1.4s ease-in-out infinite;
}
.fcard-sk-line--name { width: 70%; }
.fcard-sk-line--size { width: 30%; }
.fcard-sk-line--date { width: 40%; }
.fcard-sk-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid var(--border-subtle); }
.fcard-sk-actions { display: flex; gap: 4px; }
.fcard-sk-btn { width: 30px; height: 30px; background: var(--bg-overlay); border-radius: var(--radius-sm); animation: fcard-pulse 1.4s ease-in-out infinite; }
@keyframes fcard-pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
}
`;
