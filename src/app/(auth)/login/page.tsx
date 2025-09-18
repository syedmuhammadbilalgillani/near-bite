"use client";
import React, { useState } from "react";
import { InputGroup, Input } from "@/components/catalyst/input"; // Update with the actual path
import * as Headless from "@headlessui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingButton from "@/components/LoadingButton";

export default function SignInPage() {
  // Local state for form fields and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let formIsValid = true;
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
      formIsValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      formIsValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      // console.log("Form submitted:", { email, password });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      // console.log(result, "result");
      if (result?.status === 200) {
        setLoading(false);
        router.push("/");
      }

      if (result?.error) {
        setLoading(false);
        setErrors({
          password: "Invalid email or password",
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 dark:bg-zinc-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-zinc-50 p-8 dark:bg-zinc-800">
        {/* Logo  */}
        <div className="flex items-center justify-center">
          <Image
            src="/logo/Logo.png"
            alt="LOGO"
            height={150}
            width={150}
            priority
          />
        </div>

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Email Address
            </label>
            <InputGroup>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </InputGroup>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black dark:text-white"
            >
              Password
            </label>
            <InputGroup>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </InputGroup>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <LoadingButton
              className="w-full"
              loading={loading}
              className="w-full rounded-lg bg-zinc-700 px-4 py-2 font-semibold text-white hover:bg-zinc-600 focus:ring-4 focus:ring-zinc-500 focus:ring-opacity-50"
            >
              Sign In
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
