"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { changePassword } from "@/lib/auth";

type FormData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export default function ChangePasswordPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const newPassword = watch("new_password");

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { confirm_password, ...changePasswordData } = data;
      await changePassword(changePasswordData);
      setSuccess("Password changed successfully!");
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

        <label className="block mb-2">
          Old Password
          <input
            {...register("old_password", {
              required: "Old password is required",
            })}
            type="password"
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.old_password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.old_password.message}
            </p>
          )}
        </label>

        <label className="block mb-2">
          New Password
          <input
            {...register("new_password", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.new_password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.new_password.message}
            </p>
          )}
        </label>

        <label className="block mb-4">
          Confirm New Password
          <input
            {...register("confirm_password", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            type="password"
            className="w-full mt-1 p-2 border rounded"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirm_password.message}
            </p>
          )}
        </label>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            {success}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

