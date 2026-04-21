import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

// ── Eye icon components (inline SVG — no icon lib dependency yet) ─────────────
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

// ── Animation variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ── Component ─────────────────────────────────────────────────────────────────
const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError]     = useState('');

  // Redirect destination after login (defaults to dashboard)
  const from = location.state?.from || '/admin/dashboard';

  // If already authenticated redirect immediately
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  // Focus email field on mount
  useEffect(() => { setFocus('email'); }, [setFocus]);

  const onSubmit = async (data) => {
    setLoginError('');
    setIsSubmitting(true);

    try {
      await login(data.email, data.password);
      toast.success('Welcome back!', { icon: '👋' });
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setLoginError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 bg-grid-pattern bg-grid flex items-center justify-center p-4">

      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64
                        bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card p-8 shadow-2xl shadow-black/40">

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            {/* Logo mark */}
            <div className="inline-flex items-center justify-center w-14 h-14
                            rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500
                            mb-4 shadow-lg shadow-brand-600/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="white"
                   strokeWidth={1.5} className="w-7 h-7">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-slate-100 mb-1">
              Admin Panel
            </h1>
            <p className="text-slate-500 text-sm">
              VickyVfx — Content Management
            </p>
          </motion.div>

          {/* Error banner */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{   opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg
                           px-4 py-3 text-red-400 text-sm flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={1.5} className="w-4 h-4 shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {loginError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <motion.div variants={itemVariants} className="space-y-5">

              {/* Email field */}
              <div>
                <label htmlFor="email" className="admin-label">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <MailIcon />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@vickyvfx.me"
                    className={`admin-input pl-10 ${
                      errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : ''
                    }`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value:   /^\S+@\S+\.\S+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="admin-label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <LockIcon />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`admin-input pl-10 pr-10 ${
                      errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : ''
                    }`}
                    {...register('password', {
                      required:  'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />
                  {/* Show/hide toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               text-slate-500 hover:text-slate-300
                               transition-colors duration-150"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full h-11 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor"
                              strokeWidth={2} className="opacity-25"/>
                      <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                            strokeWidth={2} strokeLinecap="round" className="opacity-75"/>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Admin Panel
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth={1.5} className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

            </motion.div>
          </form>

          {/* Security note */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-xs text-slate-600"
          >
            Secured with JWT authentication &middot; Session expires in 7 days
          </motion.p>
        </div>

        {/* Back to site link */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-300
                       transition-colors duration-200 inline-flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-3.5 h-3.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View public portfolio
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;