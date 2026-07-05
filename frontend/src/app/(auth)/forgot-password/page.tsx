"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPassword } from "@/features/auth/hooks/useAuth";
import Input from "@/features/shared/ui/Input";
import Button from "@/features/shared/ui/Button";
import Alert from "@/features/shared/ui/Alert";
import {
  LucideCheckCircle,
  LucideMail,
  LucideVault,
} from "@/Icons/Icons";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email("Enter a valid email address").trim(),
});

type FormData = z.infer<typeof schema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const forgotMutation = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    forgotMutation.mutate(data, { onSuccess: () => setSubmitted(true) });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-page">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <LucideVault width={34} />
            </div>
            <span className="auth-logo-text">NeoVault</span>
          </div>

          {submitted ? (
            /* ── Success state ── */
            <div className="auth-success">
              <div className="auth-success-icon">
                <LucideCheckCircle width={32} />
              </div>
              <h1 className="auth-title">Check your inbox</h1>
              <p className="auth-subtitle">
                If an account with that email exists, we've sent a password
                reset link. It expires in 1 hour.
              </p>
              <Link href="/login" className="auth-back-link">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="auth-heading">
                <h1 className="auth-title">Forgot password?</h1>
                <p className="auth-subtitle">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {forgotMutation.isError && (
                <Alert
                  type="error"
                  message={
                    forgotMutation.error instanceof Error
                      ? forgotMutation.error.message
                      : "Something went wrong. Please try again."
                  }
                />
              )}

              <form
                className="auth-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={LucideMail}
                  error={errors.email?.message}
                  autoComplete="email"
                  autoFocus
                  {...register("email")}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={forgotMutation.isPending || isSubmitting}
                >
                  Send reset link
                </Button>
              </form>

              <p className="auth-footer-text">
                Remember your password?{" "}
                <Link href="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
.auth-page {
  min-height:      100dvh;
  display:         flex;
  align-items:     center;
  justify-content: center;
  background:      var(--bg-base);
  padding:         24px 16px;
  background-image: radial-gradient(circle at 1px 1px, var(--border-subtle) 1px, transparent 0);
  background-size: 28px 28px;
}

.auth-card {
  width:          100%;
  max-width:      420px;
  background:     var(--bg-surface);
  border:         1px solid var(--border-default);
  border-radius:  var(--radius-xl);
  padding:        36px 32px;
  box-shadow:     var(--shadow-lg);
  display:        flex;
  flex-direction: column;
  gap:            24px;
  animation:      fadeInUp var(--transition-slow) ease both;
}
@media (max-width: 479px) {
  .auth-card { padding: 28px 20px; border-radius: var(--radius-lg); }
}

.auth-logo {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             10px;
}
.auth-logo-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           42px;
  height:          42px;
}
.auth-logo-text {
  font-size:      var(--text-xl);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
}

.auth-heading { text-align: center; }
.auth-title {
  font-size:      var(--text-2xl);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom:  6px;
}
.auth-subtitle { font-size: var(--text-sm); color: var(--text-tertiary); }

.auth-form { display: flex; flex-direction: column; gap: 16px; }

/* Success state */
.auth-success {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  text-align:     center;
  gap:            12px;
}
.auth-success-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           56px;
  height:          56px;
  background:      var(--accent-muted);
  border:          1px solid var(--accent-border);
  border-radius:   var(--radius-full);
  color:           var(--cyan-400);
}
.auth-back-link {
  margin-top:  4px;
  font-size:   var(--text-sm);
  color:       var(--text-accent);
  font-weight: 500;
  transition:  color var(--transition-fast);
}
.auth-back-link:hover { color: var(--accent-hover); }

.auth-footer-text { text-align: center; font-size: var(--text-sm); color: var(--text-tertiary); }
.auth-link { color: var(--text-accent); font-weight: 500; transition: color var(--transition-fast); }
.auth-link:hover { color: var(--accent-hover); }
`;
