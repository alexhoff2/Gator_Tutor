"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RedirectStateService } from "@/lib/services/redirect-state";
import { useURLState } from "@/lib/context/url-state-context";

/**
 * Registration Form Component
 *
 * A sophisticated form that implements:
 * 1. Advanced Password Requirements
 *    - Minimum 8 characters for security
 *    - Mixed case for complexity
 *    - Numbers and special characters
 *    - Real-time validation feedback
 *    Why? Ensures strong passwords while guiding users
 *
 * 2. Multi-step Validation
 *    - Email format and domain checking
 *    - Password matching verification
 *    - Terms acceptance requirement
 *    Why? Reduces errors and improves data quality
 *
 * 3. Enhanced User Experience
 *    - Immediate feedback on all fields
 *    - Visual indicators for validation state
 *    - Clear error messages
 *    Why? Helps users complete registration successfully
 */

// Zod schema with complex validation rules
const formSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format")
      .endsWith("@sfsu.edu", "Must be an SFSU email address (@sfsu.edu)")
      .transform((email) => email.toLowerCase()), // Normalize email
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Targets specific field for error
  });

// Type for form field props (improves type safety)
type FormField = {
  field: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };
};

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { getParam } = useURLState();

  // Initialize form with Zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Handles successful registration flow:
   * 1. Checks for return URL in query params
   * 2. Falls back to stored redirect state
   * 3. Defaults to dashboard
   * Why? Maintains user flow context after registration
   */
  const handleRegistrationSuccess = async () => {
    const returnTo = getParam("returnTo");
    const savedState = RedirectStateService.load();

    if (returnTo) {
      router.push(returnTo);
    } else if (savedState?.returnTo) {
      router.push(savedState.returnTo);
    } else {
      router.push("/dashboard");
    }

    toast.success("Registration successful!");
  };

  /**
   * Form submission handler with:
   * - Loading state management
   * - Error handling
   * - Success notifications
   * - Page refresh for auth state
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      handleRegistrationSuccess();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Real-time field validation tracking
  const watchedFields = form.watch();
  const emailError = form.formState.errors.email;
  const passwordError = form.formState.errors.password;
  const confirmPasswordError = form.formState.errors.confirmPassword;
  const termsError = form.formState.errors.acceptTerms;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email field with institutional validation */}
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
                    form.trigger("email"); // Trigger validation on change
                  }}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Password field with complexity indicators */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "h-11 text-base transition-colors",
                    passwordError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  disabled={isLoading}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger("password"); // Trigger validation on change
                  }}
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
              {watchedFields.password && (
                <div className="mt-2 space-y-1 text-sm">
                  <p
                    className={getValidationClass(
                      watchedFields.password.length >= 8
                    )}
                  >
                    ✓ At least 8 characters
                  </p>
                  <p
                    className={getValidationClass(
                      /[A-Z]/.test(watchedFields.password)
                    )}
                  >
                    ✓ One uppercase letter
                  </p>
                  <p
                    className={getValidationClass(
                      /[a-z]/.test(watchedFields.password)
                    )}
                  >
                    ✓ One lowercase letter
                  </p>
                  <p
                    className={getValidationClass(
                      /[0-9]/.test(watchedFields.password)
                    )}
                  >
                    ✓ One number
                  </p>
                  <p
                    className={getValidationClass(
                      /[@$!%*?&]/.test(watchedFields.password)
                    )}
                  >
                    ✓ One special character
                  </p>
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Confirm password with match validation */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }: FormField) => (
            <FormItem>
              <FormLabel className="text-base">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  className={cn(
                    "h-11 text-base transition-colors",
                    confirmPasswordError &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  {...field}
                  disabled={isLoading}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger("confirmPassword");
                  }}
                />
              </FormControl>
              {watchedFields.confirmPassword &&
                !confirmPasswordError &&
                watchedFields.confirmPassword === watchedFields.password && (
                  <p className="text-sm text-green-600">✓ Passwords match</p>
                )}
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Terms acceptance with link */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={cn(
                    "transition-colors",
                    termsError && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel
                  className={cn(
                    "text-sm font-normal",
                    termsError && "text-red-500"
                  )}
                >
                  I accept the{" "}
                  <Link
                    href="/terms"
                    className="text-[#4B2E83] hover:text-[#FFC726] transition-colors"
                  >
                    terms and conditions
                  </Link>
                </FormLabel>
                {termsError && (
                  <p className="text-sm text-red-500">{termsError.message}</p>
                )}
              </div>
            </FormItem>
          )}
        />

        {/* Submit button with loading state */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-32 h-11 bg-[#4B2E83] hover:bg-[#4B2E83]/90 text-white font-semibold rounded-md"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
}

/**
 * Helper function for validation styling
 * Provides consistent visual feedback across all validation states
 */
function getValidationClass(isValid: boolean): string {
  return cn("transition-colors", isValid ? "text-green-600" : "text-gray-400");
}
