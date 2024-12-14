"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { RedirectStateService } from "@/lib/services/redirect-state";
import { useURLState } from "@/lib/context/url-state-context";

/**
 * Login Form Component
 *
 * A comprehensive authentication form that provides:
 * - SFSU-specific email validation to ensure only university accounts
 * - Secure password handling with minimum requirements
 * - Real-time form validation for immediate user feedback
 * - Smart redirect handling to return users to their intended destination
 *
 * Key Technical Decisions:
 * 1. Uses react-hook-form for efficient form handling and validation
 *    - Reduces unnecessary re-renders
 *    - Provides built-in error handling
 *    - Manages form state without excessive boilerplate
 *
 * 2. Implements Zod schema validation because:
 *    - Type-safe validation at runtime
 *    - Easily extendable validation rules
 *    - Automatic TypeScript type inference
 *
 * 3. Includes redirect state management to:
 *    - Preserve intended destination after login
 *    - Handle deep linking and protected routes
 *    - Maintain good UX for interrupted flows
 */

// Strongly typed form data structure for type safety
interface LoginFormData {
  email: string;
  password: string;
}

// Zod schema defines validation rules
const formSchema = z.object({
  email: z
    .string()
    .email()
    .endsWith("@sfsu.edu", "Must be an SFSU email address (@sfsu.edu)"), // Ensures institutional emails only
  password: z.string().min(8), // Security requirement
});

export function LoginForm() {
  // Loading state for UI feedback during async operations
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { getParam } = useURLState();

  const redirectTo = getParam("returnTo") ?? "/";

  // Form initialization with validation integration
  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Enables real-time validation for better UX
  });

  // Real-time field watching for dynamic validation feedback
  const watchedFields = form.watch();
  const emailError = form.formState.errors.email;
  const passwordError = form.formState.errors.password;

  /**
   * Updated to use URLState for redirect handling
   */
  const handleLoginSuccess = async () => {
    const returnTo = getParam("returnTo");
    const savedState = RedirectStateService.load();

    if (returnTo) {
      router.push(returnTo);
    } else if (savedState?.returnTo) {
      router.push(savedState.returnTo);
    } else {
      router.push("/dashboard");
    }

    toast.success("Welcome back!");
  };

  /**
   * Form submission handler with error handling
   * - Manages loading state
   * - Handles API communication
   * - Provides user feedback
   * - Triggers appropriate redirects
   */
  async function onSubmit(values: LoginFormData) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      handleLoginSuccess();
      router.refresh(); // Refresh page to update authentication state
      router.push(redirectTo);
    } catch (error) {
      // Detailed error feedback for better user experience
      toast.error(
        error instanceof Error ? error.message : "Invalid credentials",
        { description: "Please check your email and password" }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field with real-time validation */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="you@sfsu.edu"
                  type="email"
                  className={cn(
                    "h-11 text-base transition-colors",
                    emailError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isLoading}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger("email"); // Immediate validation feedback
                  }}
                />
              </FormControl>
              {/* Positive reinforcement for valid input */}
              {watchedFields.email && !emailError && (
                <p className="text-sm text-green-600">✓ Valid SFSU email</p>
              )}
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Password Field with security measures */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your password"
                  type="password" // Ensures password masking
                  className={cn(
                    "h-11 text-base transition-colors",
                    passwordError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Additional user options and submit button */}
        <div className="flex justify-start">
          <Link
            href="#"
            className="text-sm text-[#4B2E83] hover:text-[#FFC726] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-32 h-11 bg-[#4B2E83] hover:bg-[#4B2E83]/90 text-white font-semibold rounded-md"
          >
            {/* Visual feedback during submission */}
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}
