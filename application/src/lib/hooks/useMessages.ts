import { useEffect, useState } from "react";
import type { Message } from "@/lib/types/message";

export function useMessages() {
  //Three states that needs to be tracked
  const [messages, setMessages] = useState<Message[]>([]); //The messages
  const [loading, setLoading] = useState(true); //If still fetching
  const [error, setError] = useState<string | null>(null); //Errors

  //When component first uses hook
  useEffect(() => {
    //Fetch from server
    async function fetchMessages() {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();

        //Check if fetch was successful
        if (data.success) {
          setMessages(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    }

    //Fetch when a component needs message
    fetchMessages();
  }, []); //Fetch when the component first appears

  //Returns all data
  return { messages, loading, error, setMessages };
}
