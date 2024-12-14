"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RedirectStateService } from "@/lib/services/redirect-state";

/**
 * Send Message Component 🚀
 *
 * Handles message sending with:
 * - Authentication checks
 * - Message persistence across login
 * - Loading states
 * - Error handling
 *
 * !IMPORTANT: This component preserves message content during auth flow
 */

interface SendMessageProps {
  recipientId: number; // ID of the tutor receiving the message
  tutorPostId: number; // ID of the related tutor post
}

export function SendMessage({ recipientId, tutorPostId }: SendMessageProps) {
  // 🔄 State management
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  /**
   * Form submission handler
   *
   * !CRITICAL: Must check auth before sending message
   *
   * Flow:
   * 1. Validate message ✨
   * 2. Check auth status 🔒
   * 3. Save state if not logged in 💾
   * 4. Send message if authenticated 📤
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 🔒 Check auth status before sending
    const authResponse = await fetch("/api/auth/session");
    const { user } = await authResponse.json();

    if (!user) {
      // !IMPORTANT: Save message before redirect
      RedirectStateService.save(window.location.pathname, {
        message: message.trim(),
      });

      toast.info("Please sign in to send messages");
      window.location.href = `/login?returnTo=${encodeURIComponent(
        window.location.pathname
      )}`;
      return;
    }

    setIsSending(true);
    try {
      // 📤 Send the message
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          tutorPostId,
          message: message.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Message sent successfully! 🎉");
        setMessage(""); // Clear form after success
      } else {
        toast.error(data.message || "Failed to send message 😕");
      }
    } catch (error) {
      toast.error("Failed to send message 😕");
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Message restoration on mount
   *
   * !IMPORTANT: Recovers unsent message after login redirect
   * This prevents users from having to retype their message! 🙌
   */
  useEffect(() => {
    const savedState = RedirectStateService.load();
    if (savedState?.formState?.message) {
      setMessage(savedState.formState.message);
      RedirectStateService.clear(); // Clean up after restoration
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here... ✍️"
        className="min-h-[100px]"
      />
      <Button
        type="submit"
        disabled={isSending || !message.trim()}
        className="w-full bg-[#4B2E83] hover:bg-[#4B2E83]/90 text-white"
      >
        {isSending ? "Sending... 📤" : "Send Message ✉️"}
      </Button>
    </form>
  );
}
//
