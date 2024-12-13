"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RedirectStateService } from "@/lib/services/redirect-state";
import { useURLState } from "@/lib/context/url-state-context";

/**
 * Authentication Protection Hook 🛡️
 *
 * Picture this: A student finds the perfect tutor and writes them a message.
 * They hit send, but wait - they're not logged in! Instead of losing their
 * carefully crafted message, we:
 * 1. Safely store their message
 * 2. Redirect them to login
 * 3. Bring them right back to send it
 *
 * Two ways to use this:
 * --------------------
 * 1. Guard an entire page:
 *    ```
 *    const { isChecking } = useAuthProtection();
 *    if (isChecking) return <LoadingSpinner />;
 *    ```
 *
 * 2. Guard just the important bits (like sending a message):
 *    ```
 *    const { checkAuth } = useAuthProtection({
 *      formState: messageText,
 *      immediate: false
 *    });
 *
 *    const onSubmit = async () => {
 *      if (!(await checkAuth())) return;
 *       Message gets sent
 *    };
 *    ```
 */

interface UseAuthProtectionOptions {
  returnTo?: string; // Where to send them after login
  formState?: any; // Any data we need to preserve (like a draft message)
  immediate?: boolean; // Should we check auth right away or wait for an action?
}

export function useAuthProtection({
  returnTo,
  formState,
  immediate = true,
}: UseAuthProtectionOptions = {}) {
  const router = useRouter();
  const { setParams } = useURLState();
  // Track if we're in the middle of checking auth
  const [isChecking, setIsChecking] = useState(true);

  /**
   * The main authentication check. This is where the magic happens.
   *
   * The sequence:
   * 1. Ask the server "hey, is this user logged in?"
   * 2. If yes: carry on! 🎉
   * 3. If no: carefully preserve their work and redirect to login
   *
   * Why async? Because checking auth requires talking to the server,
   * and network requests take time.
   *
   * @param redirect - Should we auto-redirect to login? (default: true)
   * @returns true if authenticated, false otherwise
   */
  const checkAuth = useCallback(
    async (redirect = true) => {
      try {
        // First, let's check if they're logged in
        const response = await fetch("/api/auth/session");
        const { user } = await response.json();

        // Not logged in? Let's handle that gracefully
        if (!user && redirect) {
          // If they were working on something, let's save it
          // It's like bookmarking their spot in a book
          if (formState) {
            RedirectStateService.save(
              returnTo || window.location.pathname,
              formState
            );
          }

          // Update URL state and redirect
          setParams({
            returnTo: returnTo || window.location.pathname + window.location.search
          });
          
          router.push("/login");
          return false;
        }

        // All good! They're logged in
        return true;
      } catch (error) {
        // Something went wrong checking auth
        // Better to fail safely than make assumptions
        console.error("Auth check failed:", error);
        return false;
      } finally {
        // Whether it worked or not, we're done checking
        setIsChecking(false);
      }
    },
    [formState, returnTo, router, setParams]
  );

  /**
   * If immediate=true, check auth as soon as this hook is used
   * Perfect for protecting entire pages
   *
   * Why useEffect? Because we can't use async directly in the hook,
   * and we want this to run once when the component mounts
   */
  useEffect(() => {
    if (immediate) {
      checkAuth();
    }
  }, [immediate, checkAuth]);

  return { isChecking, checkAuth };
}
