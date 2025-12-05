// frontend/src/hooks/usePrivateChat.ts
import { useEffect, useState } from "react";

export type PrivateMessage = {
  sender: string;
  recipient: string;
  content: string;
  created_at: string;
  id: number;
};

type UsePrivateChatOptions = {
  socket: WebSocket | null;
  username: string; // your username
};

export function usePrivateChat({ socket, username }: UsePrivateChatOptions) {
//   const [messages, setMessages] = useState<PrivateMessage[]>([]);
const [messagesMap, setMessagesMap] = useState<Record<string, PrivateMessage[]>>({});

  // Receive messages from WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "receive_private_message") {
          const msg = data.msg as PrivateMessage;

          // Only include messages where I'm sender or recipient
          if (msg.sender === username || msg.recipient === username) {
            const otherUser = msg.sender === username ? msg.recipient : msg.sender;
            setMessagesMap((prev) => {
              const userMessages = prev[otherUser] || [];
              return {
                ...prev,
                [otherUser]: [...userMessages, msg],
              };
            });
          }
        }
      } catch (err) {
        console.error("Invalid message", err);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, username]);

  // Function to send a private message
  const sendMessage = (recipient: string, content: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected");
      return;
    }

    const payload = {
      type: "private_message",
      sender: username,
      recipient,
      content,
    };

    socket.send(JSON.stringify(payload));

    // Append the sent message to local state
    const newMessage: PrivateMessage = {
        sender: username,
        recipient,
        content,
        created_at: new Date().toISOString(),
        id: Date.now(), // using timestamp as id placeholder
      };
  
      setMessagesMap((prev) => {
        const userMessages = prev[recipient] || [];
        return {
          ...prev,
          [recipient]: [...userMessages, newMessage],
        };
      });
  };

  return {
    messagesMap,
    sendMessage,
  };
}