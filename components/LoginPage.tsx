"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { login as loginAPI, getProfile } from "../lib/auth";
import { setAuthToken } from "../lib/apiHook";
import Image from "next/image";

type FormData = { email: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const auth = useAuth();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await loginAPI({
        email: data.email,
        password: data.password,
      });

      if (auth && response.access) {
        const token = response.access;
        setAuthToken(token);

        try {
          const userData = await getProfile();
          const user = {
            id: userData.id || userData.pk || "",
            name: userData.name || userData.username || data.email,
            email: userData.email || data.email,
          };

          auth.login(user, token);
          router.push("/todos");
        } catch {
          const user = {
            id: "",
            name: data.email.split("@")[0],
            email: data.email,
          };
          auth.login(user, token);
          router.push("/todos");
        }
      } else {
        alert("Invalid response from server");
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="h-screen hidden md:flex w-1/2 secondary bg-secondary items-center justify-center">
        <Image
          alt="Picture of the signupBanner"
          src="/images/login/loginBanner.png"
          height={344}
          width={613}
          loading="lazy"
          quality={100}
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 w-full max-w-md"
        >
          <h2 className="text-[30px] font-bold font-inter mb-0 text-center">
            Create your account
          </h2>

          <p className="text-[16px] font-inter mb-6 text-center text-[#4B5563]">
            Start managing your tasks efficiently
          </p>

     
          <label className="block mb-2">
            <p className="font-medium text-[14px]">Email</p>
            <input
              {...register("email")}
              type="email"
              required
              placeholder="Enter your email"
              className="w-full mt-1 p-2 border rounded-md placeholder:text-[#8CA3CD]"
            />
          </label>

        
          <label className="block mb-2">
            <p className="font-medium text-[14px]">Password</p>
            <input
              {...register("password")}
              type="password"
              required
              placeholder="Enter your password "
              className="w-full mt-1 p-2 border rounded-md placeholder:text-[#8CA3CD]"
            />
          </label>

          <div className="flex items-center justify-between mb-4 mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-4 w-4" />
              Remember me
            </label>

            <a href="#" className="text-primary text-sm hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#5272FF] text-white mb-4"
          >
            Log In
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Register now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

