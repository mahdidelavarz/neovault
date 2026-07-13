"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  type Prompt,
  PROMPT_TYPES,
  AI_PLATFORMS,
  type AIPlatform,
} from "@/features/prompts/types/prompt";
import {
  useTogglePromptFavorite,
  useIncrementPromptUsage,
} from "@/features/prompts/hooks/usePrompt";
import {
  extractVariables,
  replaceVariables,
  copyToClipboard,
  sendToAI,
} from "@/features/prompts/utils/promptUtils";
import VariableForm from "./VariableForm";
import Modal from "@/features/shared/ui/Modal";
import ProjectBadge from "@/features/projects/components/ProjectBadge";
import Button from "@/features/shared/ui/Button";
import Alert from "@/features/shared/ui/Alert";
import {
  LucideStar,
  LucideCopy,
  LucideExternalLink,
  LucideFolder,
  LucideTag,
  LucideClock,
  LucideBarChart3,
  LucideBot,
  LucideBrain,
  LucideSparkles,
  LucideGem,
  HugeiconsChatGpt,
  HugeiconsDeepseek,
  HugeiconsClaude,
  HugeiconsGoogleGemini,
} from "@/Icons/Icons";

interface PromptCardProps {
  prompt: Prompt;
}

const platformIcons: Record<string, React.ComponentType<{ width?: number }>> = {
  chatgpt: LucideBot,
  deepseek: LucideBrain,
  claude: LucideSparkles,
  gemini: LucideGem,
};

type PendingAction = { kind: "copy" } | { kind: "send"; platform: AIPlatform } | null;

export default function PromptCard({ prompt }: PromptCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [sentToAI, setSentToAI] = useState<AIPlatform | null>(null);
  const [varModalOpen, setVarModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const toggleFavorite = useTogglePromptFavorite();
  const incrementUsage = useIncrementPromptUsage();

  // Merge extracted variables with stored defaults (P3-8 persistence)
  const variables = extractVariables(prompt.content).map(v => ({
    ...v,
    defaultValue: prompt.variables?.find(sv => sv.name === v.name)?.defaultValue ?? v.defaultValue,
  }));

  const promptType = PROMPT_TYPES[prompt.promptType];
  const aiPlatform = prompt.targetAI ? AI_PLATFORMS[prompt.targetAI] : null;
  const PlatformIcon = prompt.targetAI ? platformIcons[prompt.targetAI] : null;

  const goToDetail = () => router.push(`/prompts/${prompt.id}`);

  const doCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      incrementUsage.mutate(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const doSend = (text: string, platform: AIPlatform) => {
    const success = sendToAI(text, platform);
    if (success) {
      setSentToAI(platform);
      incrementUsage.mutate(prompt.id);
      setTimeout(() => setSentToAI(null), 3000);
    }
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (variables.length > 0) {
      setPendingAction({ kind: "copy" });
      setVarModalOpen(true);
    } else {
      doCopy(prompt.content);
    }
  };

  const handleSendClick = (e: React.MouseEvent, platform: AIPlatform) => {
    e.stopPropagation();
    if (variables.length > 0) {
      setPendingAction({ kind: "send", platform });
      setVarModalOpen(true);
    } else {
      doSend(prompt.content, platform);
    }
  };

  const handleVariablesFilled = (values: Record<string, string>) => {
    const replaced = replaceVariables(prompt.content, values);
    setVarModalOpen(false);
    if (pendingAction?.kind === "copy") {
      doCopy(replaced);
    } else if (pendingAction?.kind === "send") {
      doSend(replaced, pendingAction.platform);
    }
    setPendingAction(null);
  };

  const closeVarModal = () => {
    setVarModalOpen(false);
    setPendingAction(null);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="prompt-card">
        {/* Header */}
        <div className="prompt-card-header">
          <div className="prompt-card-type">
            <span className="prompt-card-type-icon">
              {promptType?.icon || "✨"}
            </span>
            <div>
              <h3 className="prompt-card-title">{prompt.title}</h3>
              <div className="prompt-card-meta">
                <span className="prompt-card-meta-type">
                  {promptType?.label}
                </span>
                {aiPlatform && (
                  <span className="prompt-card-platform">
                    {PlatformIcon && <PlatformIcon width={11} />}
                    {aiPlatform.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite.mutate(prompt.id); }}
            className={[
              "prompt-card-fav",
              prompt.isFavorite ? "prompt-card-fav--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={prompt.isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <LucideStar width={18} />
          </button>
        </div>

        {/* Description */}
        {prompt.description && (
          <p className="prompt-card-description">{prompt.description}</p>
        )}

        {/* Content Preview — clicking here navigates to detail */}
        <div
          className="prompt-card-content"
          role="button"
          tabIndex={0}
          onClick={goToDetail}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToDetail(); }
          }}
        >
          <pre className="prompt-card-content-text">{prompt.content}</pre>
        </div>

        {/* Tags & Category */}
        <div className="prompt-card-taxonomy">
          {prompt.category && (
            <span className="prompt-card-category">
              <LucideFolder width={11} />
              {prompt.category.name}
            </span>
          )}
          {prompt.tags?.map((tag: any) => (
            <span key={tag.id} className="prompt-card-tag">
              <LucideTag width={10} />
              {tag.name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="prompt-card-stats">
          <span className="prompt-card-stat">
            <LucideBarChart3 width={12} />
            Used {prompt.usageCount}x
          </span>
          {prompt.lastUsedAt && (
            <span className="prompt-card-stat">
              <LucideClock width={12} />
              {new Date(prompt.lastUsedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Alerts */}
        {copied && (
          <div className="prompt-card-alert">
            <Alert type="success" message="Copied to clipboard!" />
          </div>
        )}
        {sentToAI && (
          <div className="prompt-card-alert">
            <Alert
              type="info"
              message={`Opening ${AI_PLATFORMS[sentToAI].name}...`}
            />
          </div>
        )}

        {/* Actions */}
        <div className="prompt-card-actions">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={LucideCopy}
            onClick={handleCopyClick}
          >
            Copy
          </Button>

          {aiPlatform && prompt.targetAI ? (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={LucideExternalLink}
              onClick={(e) => handleSendClick(e, prompt.targetAI as AIPlatform)}
            >
              Send to {aiPlatform.name}
            </Button>
          ) : (
            <div className="prompt-card-quick-send">
              <button
                onClick={(e) => handleSendClick(e, "chatgpt")}
                className="quick-send-btn quick-send-btn--white"
                title="Send to ChatGPT"
              >
                <HugeiconsChatGpt width={24} />
              </button>
              <button
                onClick={(e) => handleSendClick(e, "deepseek")}
                className="quick-send-btn quick-send-btn--blue"
                title="Send to DeepSeek"
              >
                <HugeiconsDeepseek width={24} />
              </button>
              <button
                onClick={(e) => handleSendClick(e, "claude")}
                className="quick-send-btn quick-send-btn--orange"
                title="Send to Claude"
              >
                <HugeiconsClaude width={24} />
              </button>
              <button
                onClick={(e) => handleSendClick(e, "gemini")}
                className="quick-send-btn quick-send-btn--teal"
                title="Send to Gemini"
              >
                <HugeiconsGoogleGemini width={24} />
              </button>
            </div>
          )}

          <ProjectBadge itemType="prompt" itemId={prompt.id} />
        </div>
      </div>

      {/* Variable-fill modal for Copy / Send-to-AI */}
      <Modal isOpen={varModalOpen} onClose={closeVarModal} size="sm">
        <VariableForm variables={variables} onSubmit={handleVariablesFilled} onCancel={closeVarModal} />
      </Modal>
    </>
  );
}

const CSS = `
.prompt-card {
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding:       20px;
  display:       flex;
  flex-direction: column;
  gap:           12px;
  cursor:        default;
  transition:    border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.prompt-card:hover {
  border-color: var(--border-strong);
  box-shadow:   0 2px 12px rgba(0,0,0,0.05);
}

/* Header */
.prompt-card-header {
  display:     flex;
  align-items: flex-start;
  gap:         12px;
}
.prompt-card-type {
  display: flex;
  align-items: flex-start;
  gap:     10px;
  flex:    1;
  min-width: 0;
}
.prompt-card-type-icon { font-size: 20px; flex-shrink: 0; line-height: 1; }
.prompt-card-title {
  font-size:     var(--text-base);
  font-weight:   600;
  color:         var(--text-primary);
  line-height:   1.3;
  margin-bottom: 2px;
}
.prompt-card-meta {
  display:     flex;
  align-items: center;
  gap:         8px;
  flex-wrap:   wrap;
}
.prompt-card-meta-type {
  font-size: var(--text-xs);
  color:     var(--text-tertiary);
}
.prompt-card-platform {
  display:      inline-flex;
  align-items:  center;
  gap:          4px;
  padding:      2px 8px;
  background:   var(--bg-overlay);
  border-radius: var(--radius-full);
  font-size:    var(--text-xs);
  color:        var(--text-secondary);
}
.prompt-card-fav {
  display:     flex;
  padding:     4px;
  background:  transparent;
  border:      none;
  border-radius: var(--radius-sm);
  color:       var(--text-tertiary);
  cursor:      pointer;
  flex-shrink: 0;
  transition:  color var(--transition-fast), transform var(--transition-fast);
}
.prompt-card-fav:hover { color: #f59e0b; transform: scale(1.15); }
.prompt-card-fav--active { color: #f59e0b; }

/* Description */
.prompt-card-description {
  font-size: var(--text-sm);
  color:     var(--text-tertiary);
  line-height: 1.5;
}

/* Content */
.prompt-card-content {
  background:    var(--code-bg);
  border-radius: var(--radius-md);
  padding:       14px;
  max-height:    160px;
  overflow-y:    auto;
  cursor:        pointer;
  border:        1px solid var(--code-border);
  transition:    border-color var(--transition-fast);
}
.prompt-card-content:hover { border-color: var(--code-border-hover); }
.prompt-card-content-text {
  font-family:   var(--font-mono, monospace);
  font-size:     var(--text-xs);
  color:         var(--ct-fg);
  white-space:   pre-wrap;
  word-break:    break-word;
  margin:        0;
}

/* Taxonomy */
.prompt-card-taxonomy {
  display:   flex;
  flex-wrap: wrap;
  gap:       6px;
}
.prompt-card-category {
  display:      inline-flex;
  align-items:  center;
  gap:          4px;
  padding:      3px 10px;
  background:   var(--primary-muted);
  border-radius: var(--radius-full);
  font-size:    var(--text-xs);
  color:        var(--primary);
}
.prompt-card-tag {
  display:      inline-flex;
  align-items:  center;
  gap:          4px;
  padding:      3px 10px;
  background:   var(--bg-overlay);
  border-radius: var(--radius-full);
  font-size:    var(--text-xs);
  color:        var(--text-tertiary);
}

/* Stats */
.prompt-card-stats {
  display:     flex;
  align-items: center;
  gap:         12px;
  flex-wrap:   wrap;
}
.prompt-card-stat {
  display:     flex;
  align-items: center;
  gap:         4px;
  font-size:   var(--text-xs);
  color:       var(--text-tertiary);
}

/* Alert */
.prompt-card-alert { margin-top: -4px; }

/* Actions */
.prompt-card-actions {
  display:     flex;
  align-items: center;
  gap:         8px;
  flex-wrap:   wrap;
  padding-top: 12px;
  border-top:  1px solid var(--border-default);
}

/* Quick send */
.prompt-card-quick-send {
  display: flex;
  gap:     8px;
}
.quick-send-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           30px;
  height:          30px;
  padding:         0;
  border:          none;
  border-radius:   var(--radius-sm);
  cursor:          pointer;
  transition:      all var(--transition-fast);
}
.quick-send-btn--green  { background: rgba(16,185,129,0.1);  color: #10b981; }
.quick-send-btn--teal   { background: rgba(20,184,166,0.1);  color: #14b8a6; }
.quick-send-btn--orange { background: rgba(249,115,22,0.1);  color: #f97316; }
.quick-send-btn--blue   { background: rgba(59,130,246,0.1);  color: #3b82f6; }
.quick-send-btn:hover   { filter: brightness(0.9); transform: scale(1.1); }

/* Mobile cards keep a short, scrollable preview so actions stay visible. */
@media (max-width: 639px) {
  .prompt-card { padding: 12px; gap: 10px; }
  .prompt-card-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .prompt-card-content { max-height: 112px; overflow-y: auto; padding: 11px 12px; }
  .prompt-card-actions { padding-top: 10px; gap: 6px; }
}
`;
