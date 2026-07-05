"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Textarea from "@/features/shared/ui/TextArea";
import Button from "@/features/shared/ui/Button";
import Alert from "@/features/shared/ui/Alert";
import { SolarChatLineDuotone } from "@/Icons/Icons";
import { useCreateFeedback } from "@/features/feedback/hooks/useFeedback";
import { type FeedbackType } from "@/features/feedback/types/feedback";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  type: z.enum(["bug", "feature", "comment"]),
  message: z.string().min(1, "Message is required").max(5000),
});

type FormData = z.infer<typeof schema>;

const TYPE_OPTIONS: { value: FeedbackType; label: string; hint: string }[] = [
  { value: "bug", label: "Bug", hint: "Something is broken" },
  { value: "feature", label: "Feature", hint: "An idea or request" },
  { value: "comment", label: "Comment", hint: "General feedback" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const createFeedback = useCreateFeedback();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "bug", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitted(false);
    try {
      await createFeedback.mutateAsync(data);
      reset({ type: data.type, message: "" });
      setSubmitted(true);
    } catch {
      /* error surfaces via the mutation error Alert below */
    }
  };

  const error = createFeedback.error;

  return (
    <>
      <style>{CSS}</style>
      <form className="fb-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {submitted && (
          <Alert
            type="success"
            message="Thanks! Your feedback has been sent."
            onClose={() => setSubmitted(false)}
          />
        )}
        {error && (
          <Alert
            type="error"
            message={error instanceof Error ? error.message : "Something went wrong"}
          />
        )}

        <div className="fb-field">
          <label className="fb-label">Type</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="fb-types" role="radiogroup">
                {TYPE_OPTIONS.map((opt) => {
                  const active = field.value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={active ? "fb-type fb-type--active" : "fb-type"}
                      onClick={() => field.onChange(opt.value)}
                    >
                      <span className="fb-type-label">{opt.label}</span>
                      <span className="fb-type-hint">{opt.hint}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <Textarea
          label="Message"
          placeholder="Tell us what's on your mind…"
          rows={6}
          error={errors.message?.message}
          {...register("message")}
        />

        <div className="fb-actions">
          <Button
            type="submit"
            leftIcon={SolarChatLineDuotone}
            isLoading={createFeedback.isPending}
          >
            Send feedback
          </Button>
        </div>
      </form>
    </>
  );
}

const CSS = `
.fb-form  { display: flex; flex-direction: column; gap: 16px; max-width: 640px; }
.fb-field { display: flex; flex-direction: column; gap: 8px; }
.fb-label { font-size: var(--text-sm); font-weight: 500; color: var(--text-primary); }

.fb-types {
  display:               grid;
  grid-template-columns: repeat(3, 1fr);
  gap:                   8px;
}
@media (max-width: 479px) { .fb-types { grid-template-columns: 1fr; } }

.fb-type {
  display:          flex;
  flex-direction:   column;
  gap:              2px;
  padding:          10px 12px;
  text-align:       left;
  background:       var(--bg-subtle);
  border:           1px solid var(--border-default);
  border-radius:    var(--radius-md);
  cursor:           pointer;
  transition:       border-color var(--transition-fast), background var(--transition-fast);
}
.fb-type:hover { border-color: var(--border-strong); }
.fb-type--active {
  border-color: var(--border-focus);
  background:   var(--accent-muted);
  box-shadow:   0 0 0 3px var(--accent-muted);
}
.fb-type-label { font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
.fb-type-hint  { font-size: var(--text-xs); color: var(--text-tertiary); }

.fb-actions { display: flex; justify-content: flex-end; }
`;
