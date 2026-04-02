import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosAdmin from '@/api/axiosAdmin';
import { useAuth } from '@/context/AuthContext';

const ChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosAdmin.put('/api/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      toast.success('Password changed. Please log in again.');
      reset();

      // Server clears all sessions — force re-login
      await logout();
      navigate('/admin/login');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Change Password</h2>
        <p className="text-slate-500 text-sm mt-1">
          All active sessions will be invalidated after changing your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-5">

        {/* Current password */}
        <div>
          <label className="admin-label">Current password</label>
          <input
            type="password"
            className={`admin-input ${errors.currentPassword ? 'border-red-500/50' : ''}`}
            placeholder="••••••••"
            {...register('currentPassword', { required: 'Current password is required' })}
          />
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New password */}
        <div>
          <label className="admin-label">New password</label>
          <input
            type="password"
            className={`admin-input ${errors.newPassword ? 'border-red-500/50' : ''}`}
            placeholder="••••••••"
            {...register('newPassword', {
              required:  'New password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' },
              pattern: {
                value:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Must include uppercase, lowercase, and a number',
              },
            })}
          />
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm new password */}
        <div>
          <label className="admin-label">Confirm new password</label>
          <input
            type="password"
            className={`admin-input ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) => v === newPassword || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>

      </form>
    </motion.div>
  );
};

export default ChangePassword;