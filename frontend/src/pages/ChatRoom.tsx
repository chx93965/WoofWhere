import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/lib/socket";
import { useAuth } from '@/context/authContext';
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  sender: string;
  recipient?: string;
  content: string;
  created_at: string;
};

export default function ChatRoom() {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState<string[]>([]);
  const [text, setText] = useState("");
  // const [username, setUsername] = useState(localStorage.getItem("user") || `Guest${Math.floor(Math.random() * 1000)}`);
  const [username, setUsername] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return `Guest${Math.floor(Math.random() * 1000)}`;
    try {
      return JSON.parse(stored).name; // Extract "name"
    } catch {
      return stored; // fallback
    }
  });

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_chat", { username });
    socket.on("message_history", (history) => setMessages(history));
    socket.on("new_message", (msg) => setMessages(prev => [...prev, msg]));
    socket.on("online_users", (list) => setOnline(list));
    return () => {
      socket.off("message_history");
      socket.off("new_message");
      socket.off("online_users");
    };
  }, [socket, username]);

  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!text.trim() || !selectedUser) return;
    const message = { sender: username, recipient: selectedUser, content: text };
    socket?.emit("send_message", message);
    setMessages(prev => [...prev, {
      id: `${Date.now()}`,
      sender: username,
      recipient: selectedUser,
      content: text,
      created_at: new Date().toISOString(),
    }]);
    setText("");
  }

  return (
    <div className="flex flex-col space-y-2 px-4">
      <div>
        <h2>Online Users</h2>
        {online.map(user => (
  <Button
    key={user}
    type="button"              
    size="sm"
    className="flex-1 px-4 mb-2"   
    onClick={() => setSelectedUser(user)}
  >
    {user}
  </Button>
))}
      </div>
      <div ref={scrollRef} style={{ maxHeight: 400, overflowY: "auto" }}>
        {messages.map(msg => (
          <div key={msg.id}><b>{msg.sender}:</b> {msg.content}</div>
        ))}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type your message..." />
      <Button
  type="button"            
  onClick={sendMessage}
  disabled={!selectedUser}  
  size="lg"
  className="mt-2 w-full"  
>
  Send
</Button>
    </div>
  );
}