"use client";

import Link from "next/link";
import { LoginForm } from "@/components/features/auth/login-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useURLState } from "@/lib/context/url-state-context";

export function LoginPageContent() {
  const { getParam } = useURLState();
  const returnTo = getParam("returnTo");

  return (
    <Card className="w-full border-none bg-white/95 shadow-2xl">
      <CardHeader className="space-y-4 text-center pb-2">
        <div className="mx-auto w-20 h-20 rounded-full bg-[#4B2E83] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#FFC726]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#4B2E83]">
          Welcome Back!
        </h1>
        <p className="text-lg text-gray-600">
          Enter your credentials to access your account
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <LoginForm />
      </CardContent>

      <CardFooter className="flex justify-center pb-8">
        <p className="text-base text-gray-600">
          Don't have an account?{" "}
          <Link
            href={`/register${returnTo ? `?returnTo=${returnTo}` : ""}`}
            className="font-semibold text-[#4B2E83] hover:text-[#FFC726] transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
