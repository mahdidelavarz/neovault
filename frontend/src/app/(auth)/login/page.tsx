"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/features/auth/hooks/useAuth";
import Input from "@/features/shared/ui/Input";
import Button from "@/features/shared/ui/Button";
import Alert from "@/features/shared/ui/Alert";
import {
  LucideEye,
  LucideEyeOff,
  LucideLock,
  LucideUser,
  LucideVault,
} from "@/Icons/Icons";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-page">
        {/* Card */}
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <LucideVault width={34} />
            </div>
            <span className="auth-logo-text">NeoVault</span>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your personal vault</p>
          </div>

          {/* Error */}
          {loginMutation.isError && (
            <Alert
              type="error"
              message={
                loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : "Login failed. Please try again."
              }
            />
          )}

          {/* Form */}
          <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              leftIcon={LucideUser}
              error={errors.username?.message}
              autoComplete="username"
              autoFocus
              {...register("username")}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              leftIcon={LucideLock}
              error={errors.password?.message}
              autoComplete="current-password"
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

            <div className="auth-forgot-row">
              <Link href="/forgot-password" className="auth-link auth-link--sm">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loginMutation.isPending || isSubmitting}
            >
              Sign in
            </Button>
          </form>

          {/* Footer */}
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link href="/register" className="auth-link">
              Sign up
            </Link>
          </p>
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
  /* subtle grid pattern */
  background-image: radial-gradient(circle at 1px 1px, var(--border-subtle) 1px, transparent 0);
  background-size: 28px 28px;
}

.auth-card {
  width:         100%;
  max-width:     420px;
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding:       36px 32px;
  box-shadow:    var(--shadow-lg);
  display:       flex;
  flex-direction: column;
  gap:           24px;
  animation:     fadeInUp var(--transition-slow) ease both;
}
@media (max-width: 479px) {
  .auth-card {
    padding:       28px 20px;
    border-radius: var(--radius-lg);
  }
}

/* Logo */
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

/* Heading */
.auth-heading { text-align: center; }
.auth-title {
  font-size:      var(--text-2xl);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom:  6px;
}
.auth-subtitle {
  font-size: var(--text-sm);
  color:     var(--text-tertiary);
}

/* Form */
.auth-form {
  display:        flex;
  flex-direction: column;
  gap:            16px;
}

/* Eye button inside password input */
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

.auth-forgot-row {
  display:         flex;
  justify-content: flex-end;
  margin-top:      -4px;
}
.auth-link--sm { font-size: var(--text-xs); }

/* Footer */
.auth-footer-text {
  text-align: center;
  font-size:  var(--text-sm);
  color:      var(--text-tertiary);
}
.auth-link {
  color:       var(--text-accent);
  font-weight: 500;
  transition:  color var(--transition-fast);
}
.auth-link:hover { color: var(--accent-hover); }
`;
