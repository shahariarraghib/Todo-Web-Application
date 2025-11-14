"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signup } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const [error, setError] = useState<string>("");

  const password = watch("password");

  // show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const { confirm_password, ...signupData } = data;
      await signup(signupData);
      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="bg-secondary h-screen hidden md:flex w-1/2 items-center justify-center">
        <Image
          alt="Picture of the signupBanner"
          src="/images/signup/image.png"
          height={344}
          width={613}
          loading="lazy"
          quality={100}
          className="flex justify-center items-center"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8  w-full max-w-md"
        >
          <h2 className="text-[30px] font-bold font-inter mb-0 text-center">
            Create your account
          </h2>
          <p className="text-[16px] font-inter mb-6 text-center text-[#4B5563]">
            Start managing your tasks efficiently
          </p>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <label className="block">
              <p className="font-medium text-[14px]">First Name</p>
              <input
                {...register("first_name", {
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Please enter a valid name format.",
                  },
                })}
                className="w-full mt-1 p-2 border rounded"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </label>

            <label className="block">
              <p className="font-medium text-[14px]">Last Name</p>

              <input
                {...register("last_name", {
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Please enter a valid name format.",
                  },
                })}
                className="w-full mt-1 p-2 border rounded"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </label>
          </div>

          {/* Email */}
          <label className="block mb-2">
            <p className="font-medium text-[14px]"> Email</p>

            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="w-full mt-1 p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </label>

          {/* Password */}
          <label className="block mb-2">
            <p className="font-medium text-[14px]">Password</p>

            <div className="relative">
              <input
                {...register("password", {
                  required: "4 characters minimum.",
                  minLength: {
                    value: 4,
                    message: "4 characters minimum.",
                  },
                })}
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 p-2 border rounded"
              />

              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </label>

          {/* Confirm Password */}
          <label className="block mb-4">
            <p className="font-medium text-[14px]">Confirm Password</p>

            <div className="relative">
              <input
                {...register("confirm_password", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type={showCPassword ? "text" : "password"}
                className="w-full mt-1 p-2 border rounded"
              />

              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={() => setShowCPassword(!showCPassword)}
              >
                {showCPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>
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

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#5272FF] text-white mb-4"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
