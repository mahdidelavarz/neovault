"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/features/shared/ui/Button";
import Modal from "@/features/shared/ui/Modal";
import LinkForm from "@/features/links/components/LinkForm";
import PromptForm from "@/features/prompts/components/PromptForm";

import {
  SolarLinkMinimalisticBold,
  SolarServerSquareCloudLinear,
  SolarCodeSquareLineDuotone,
  FluentPrompt16Regular,
  SolarRoundedMagniferLineDuotone,
} from "@/Icons/Icons";
import SnippetForm from "@/features/snippets/components/SnippetForm";
import InfraForm from "@/features/infrastructure/components/InfraForm";

type QuickActionType = "link" | "snippet" | "prompt" | "infra" | null;

const actions = [
  {
    type: "link" as const,
    icon: SolarLinkMinimalisticBold,
    label: "New Link",
    variant: "link" as const,
  },
  {
    type: "snippet" as const,
    icon: SolarCodeSquareLineDuotone,
    label: "New Snippet",
    variant: "snippet" as const,
  },
  {
    type: "prompt" as const,
    icon: FluentPrompt16Regular,
    label: "New Prompt",
    variant: "prompt" as const,
  },
  {
    type: "infra" as const,
    icon: SolarServerSquareCloudLinear,
    label: "New Infra",
    variant: "infra" as const,
  },
];

// Colors map to the shared item-type tokens (defined in globals.css) so they
// stay consistent with the dashboard and adapt to light/dark mode.
const typeStyle = (token: string) => ({
  bg: token,
  muted: `color-mix(in srgb, ${token} 12%, transparent)`,
  text: token,
});

const variantStyles = {
  link: typeStyle("var(--type-link)"),
  snippet: typeStyle("var(--type-snippet)"),
  prompt: typeStyle("var(--type-prompt)"),
  infra: typeStyle("var(--type-infra)"),
};

export default function QuickActions() {
  const [activeForm, setActiveForm] = useState<QuickActionType>(null);
  const router = useRouter();

  const handleClose = () => {
    setActiveForm(null);
  };

  const renderForm = () => {
    switch (activeForm) {
      case "link":
        return <LinkForm onClose={handleClose} />;
      case "snippet":
        return <SnippetForm onClose={handleClose} />;
      case "prompt":
        return <PromptForm onClose={handleClose} />;
      case "infra":
        return <InfraForm onClose={handleClose} />;
      default:
        return null;
    }
  };

  const getFormTitle = () => {
    switch (activeForm) {
      case "link":
        return "Add Link";
      case "snippet":
        return "Add Snippet";
      case "prompt":
        return "Add Prompt";
      case "infra":
        return "Add Infrastructure";
      default:
        return "";
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="quick-actions-panel">
        <h3 className="quick-actions-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          {actions.map((action) => {
            const Icon = action.icon;
            const colors = variantStyles[action.variant];
            return (
              <button
                key={action.type}
                onClick={() => setActiveForm(action.type)}
                className="quick-action-btn"
                style={{
                  backgroundColor: colors.muted,
                  color: colors.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.bg;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.muted;
                  e.currentTarget.style.color = colors.text;
                }}
              >
                <Icon width={20} height={20} />
                <span className="quick-action-label">{action.label}</span>
              </button>
            );
          })}
        </div>
        <div className="quick-actions-footer">
          <Button
            size="lg"
            variant="secondary"
            fullWidth
            leftIcon={SolarRoundedMagniferLineDuotone}
            onClick={() => router.push("/search")}
          >
            Search Everything
          </Button>
        </div>
      </div>

      <Modal
        isOpen={!!activeForm}
        onClose={handleClose}
        title={getFormTitle()}
        size="lg"
      >
        {renderForm()}
      </Modal>
    </>
  );
}

const CSS = `
.quick-actions-panel {
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding:       14px 16px;
}
.quick-actions-title {
  font-size:     var(--text-sm);
  font-weight:   600;
  color:         var(--text-primary);
  margin-bottom: 10px;
}
.quick-actions-grid {
  display:               grid;
  grid-template-columns: repeat(4, 1fr);
  gap:                   8px;
}
.quick-action-btn {
  display:          flex;
  flex-direction:   column;
  align-items:      center;
  justify-content:  center;
  gap:              4px;
  height:           60px;
  padding:          6px 4px;
  border:           none;
  border-radius:    var(--radius-md);
  font-family:      var(--font-sans);
  font-size:        var(--text-xs);
  font-weight:      500;
  cursor:           pointer;
  transition:       all var(--transition-fast);
}
.quick-action-label {
  white-space:   nowrap;
  overflow:      hidden;
  text-overflow: ellipsis;
  max-width:     100%;
}
.quick-actions-footer {
  margin-top:  12px;
  padding-top: 12px;
  border-top:  1px solid var(--border-default);
}

@media (max-width: 359px) {
  .quick-action-label { font-size: 10px; }
}
`;
