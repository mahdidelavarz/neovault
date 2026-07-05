"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/features/auth/hooks/useAuth";
import Input from "@/features/shared/ui/Input";
import Button from "@/features/shared/ui/Button";
import Alert from "@/features/shared/ui/Alert";
import {
  LucideEye,
  LucideEyeOff,
  LucideLock,
  LucideLockKeyhole,
  LucideVault,
} from "@/Icons/Icons";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    if (!token) return;
    resetMutation.mutate({ token, password: data.password });
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

          {!token ? (
            /* ── Invalid / missing token ── */
            <div className="auth-error-state">
              <Alert
                type="error"
                message="Invalid reset link. Please request a new one."
              />
              <Link href="/forgot-password" className="auth-link">
                Request new link
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-heading">
                <h1 className="auth-title">Set new password</h1>
                <p className="auth-subtitle">
                  Choose a strong password for your vault.
                </p>
              </div>

              {resetMutation.isError && (
                <Alert
                  type="error"
                  message={
                    resetMutation.error instanceof Error
                      ? resetMutation.error.message
                      : "Something went wrong. Please try again."
                  }
                />
              )}

              <form
                className="auth-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div className="auth-password-wrap">
                  <Input
                    label="New password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    leftIcon={LucideLock}
                    error={errors.password?.message}
                    autoComplete="new-password"
                    autoFocus
                    rightNode={
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowPassword((p) => !p)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <LucideEyeOff width={14} />
                        ) : (
                          <LucideEye width={14} />
                        )}
                      </button>
                    }
                    {...register("password")}
                  />
                </div>

                <Input
                  label="Confirm new password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your new password"
                  leftIcon={LucideLockKeyhole}
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                  rightNode={
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowConfirm((p) => !p)}
                      tabIndex={-1}
                      aria-label={showConfirm ? "Hide" : "Show"}
                    >
                      {showConfirm ? (
                        <LucideEyeOff width={14} />
                      ) : (
                        <LucideEye width={14} />
                      )}
                    </button>
                  }
                  {...register("confirmPassword")}
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={resetMutation.isPending || isSubmitting}
                >
                  Reset password
                </Button>
              </form>

              <p className="auth-footer-text">
                <Link href="/login" className="auth-link">
                  ← Back to sign in
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

.auth-form          { display: flex; flex-direction: column; gap: 16px; }
.auth-password-wrap { display: flex; flex-direction: column; gap: 8px; }

.auth-eye-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           26px;
  height:          26px;
  background:      transparent;
  border:          none;
  border-radius:   var(--radius-sm);
  color:           var(--text-tertiary);
  cursor:          pointer;
  transition:      color var(--transition-fast);
}
.auth-eye-btn:hover { color: var(--text-primary); }

.auth-error-state {
  display:        flex;
  flex-direction: column;
  align-items:    center;
  gap:            16px;
  text-align:     center;
}

.auth-footer-text { text-align: center; font-size: var(--text-sm); color: var(--text-tertiary); }
.auth-link { color: var(--text-accent); font-weight: 500; transition: color var(--transition-fast); }
.auth-link:hover { color: var(--accent-hover); }
`;
