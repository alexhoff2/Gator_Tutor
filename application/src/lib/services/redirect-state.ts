/**
 * Redirect State Service
 *
 * Picture this flow:
 * -----------------
 * 1. Student finds a tutor they like
 * 2. They start filling out a message form
 * 3. They hit "Send" but aren't logged in
 * 4. Instead of losing their message, we:
 *    - Save their message (formState)
 *    - Remember where they were (returnTo)
 *    - Send them to login
 *    - Bring them back after login
 *    - Restore their message
 *    - Let them hit send again
 *
 * Two flavors of state saving:
 * --------------------------
 * 1. RedirectStateService (Short-term)
 *    - For quick auth redirects (like sending messages)
 *    - Lives in sessionStorage (dies with tab)
 *    - Expires in 5 minutes
 *
 * 2. TutorFormStateService (Long-term)
 *    - For the massive tutor signup form
 *    - Lives in localStorage (survives tab close)
 *    - Expires in 24 hours
 *    - Because losing that form would be painful!
 *
 *    - However, the create tutor post form has file uploads that we don't handle
 *      (it just reminds the user to reupload those when they come back after login/register)
 *
 * !IMPORTANT: This is what makes our "lazy auth" work - users only need
 * to log in right before they take an action, not before they start
 *
 * TODO Consider just using a single service with a configurable expiry
 * TODO Consider just having the form auto POST after login/register (would need to handle file uploads though)
 */

// Types for our stored states
interface RedirectState {
  returnTo: string; // Where to go after auth
  formState?: any; // Any form data we need to preserve
  timestamp: number; // When we saved it
}

interface TutorFormState {
  formData: any; // The actual form data
  hadFiles: {
    // Track which files were uploaded
    profilePhoto: boolean;
    profileVideo: boolean;
    resumePdf: boolean;
  };
  timestamp: number;
}

// Constants
const STORAGE_KEY = "authRedirect";
const MAX_AGE = 1000 * 60 * 5; // 5 minutes

/**
 * Handles quick redirects during auth flow
 * Uses sessionStorage (clears when tab closes)
 */
export const RedirectStateService = {
  // Save state before redirect
  save: (returnTo: string, formState?: any) => {
    const state: RedirectState = {
      returnTo,
      formState,
      timestamp: Date.now(),
    };
    console.log("Saving redirect state:", state);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  // Load state after redirect (with expiry check)
  load: (): RedirectState | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      console.log("Loading redirect state:", JSON.parse(stored));
    }
    if (!stored) return null;

    const state = JSON.parse(stored);

    // Expire after 5 minutes
    if (Date.now() - state.timestamp > MAX_AGE) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return state;
  },

  // Clean up after we're done
  clear: () => {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};

/**
 * Handles tutor form state persistence
 * Uses localStorage (survives tab closes)
 * Keeps state for 24 hours because that form is a beast
 * TODO is 24h a good expiry?
 */
export const TutorFormStateService = {
  // Save form progress
  save: (formData: any, hadFiles: any) => {
    const state = {
      formData,
      hadFiles,
      timestamp: Date.now(),
    };
    localStorage.setItem("tutorFormState", JSON.stringify(state));
  },

  // Load saved progress (with 24h expiry)
  // TODO reevaluate if this is even necessary anymore, I think we're not using it
  load: () => {
    const state = localStorage.getItem("tutorFormState");
    if (!state) return null;

    const parsed = JSON.parse(state);

    // Expire after 24 hours
    const EXPIRY_TIME = 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > EXPIRY_TIME) {
      TutorFormStateService.clear();
      return null;
    }

    return parsed;
  },

  // Clean up saved state
  clear: () => {
    localStorage.removeItem("tutorFormState");
  },
};
