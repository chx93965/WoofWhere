// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "@/lib/socket";
// import dayjs from "dayjs";
// import { Navigation } from "@/components/Navigation";

// type Message = {
//   id: string;
//   username: string;
//   content: string;
//   created_at: string;
// };

// export default function ChatRoom() {
//   const { socket } = useSocket();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [online, setOnline] = useState<string[]>([]);
//   const [text, setText] = useState("");

//   const [username, setUsername] = useState(
//     localStorage.getItem("chat_username") ||
//       `Guest${Math.floor(Math.random() * 1000)}`
//   );

//   const [selectedUser, setSelectedUser] = useState<string | null>(null);

//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Hardcoded users for UI
//   const users = ["Alice", "Bob", "Charlie", "David"];

//   useEffect(() => {
//     if (!socket) return;

//     socket.emit("join_chat", { username });

//     socket.on("message_history", (history) => {
//       setMessages(history);
//     });

//     socket.on("new_message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     socket.on("online_users", (list) => {
//       setOnline(list);
//     });

//     return () => {
//       socket.off("message_history");
//       socket.off("new_message");
//       socket.off("online_users");
//     };
//   }, [socket, username]);

//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   function sendMessage() {
//     if (!text.trim() || !selectedUser) return;

//     // FIXED (removed extra ])
//     const content = `[To ${selectedUser}] ${text}`;

//     socket?.emit("send_message", { username, content });

//     // Add locally
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: `${Date.now()}`,
//         username,
//         content,
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     setText("");
//   }

//   // ✔️ Correct filtering for selected user
//   const displayedMessages = selectedUser
//     ? messages.filter(
//         (m) =>
//           m.content.startsWith(`[To ${selectedUser}]`) ||
//           m.username === selectedUser
//       )
//     : messages;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
//       <Navigation />

//       <div className="flex max-w-5xl mx-auto mt-6 border rounded-lg bg-card shadow-sm overflow-hidden">

//         {/* Users Sidebar */}
//         <div className="w-48 border-r bg-muted/20 p-4">
//           <h3 className="font-bold text-sm mb-3">Users</h3>

//           <div className="flex flex-col gap-2">
//             {users.map((user) => (
//               <button
//                 key={user}
//                 className={`text-left px-3 py-2 rounded transition ${
//                   selectedUser === user
//                     ? "bg-primary/20 font-semibold"
//                     : "hover:bg-muted"
//                 }`}
//                 onClick={() => setSelectedUser(user)}
//               >
//                 {user}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat section */}
//         <div className="flex-1 flex flex-col p-4">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-xl font-bold">
//               {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
//             </h2>
//             <span className="text-sm text-muted-foreground">
//               {online.length} online
//             </span>
//           </div>

//           <div
//             ref={scrollRef}
//             className="flex-1 space-y-2 mb-3 overflow-auto border rounded p-3 bg-muted/10"
//           >
//             {displayedMessages.map((m) => {
//               // Remove "[To XYZ]" prefix for display
//               const cleanContent = m.content.replace(/\[To .*?\]\s?/g, "");

//               return (
//                 <div key={m.id} className="p-2 bg-muted rounded">
//                   <div className="text-xs text-muted-foreground">
//                     {dayjs(m.created_at).format("HH:mm")}
//                   </div>
//                   <div>{cleanContent}</div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Input */}
//           <div className="flex gap-2">
//             <input
//               className="flex-1 border rounded px-2 py-2 bg-background"
//               placeholder={
//                 selectedUser ? "Type a message..." : "Select a user to chat"
//               }
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               disabled={!selectedUser}
//             />

//             <button
//               className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
//               onClick={sendMessage}
//               disabled={!selectedUser}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/lib/socket";
import dayjs from "dayjs";
import { Navigation } from "@/components/Navigation";

type Message = {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  created_at: string;
};

export default function ChatRoom() {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState<string[]>([]);
  const [text, setText] = useState("");

  const [username, setUsername] = useState(
    localStorage.getItem("chat_username") ||
      `Guest${Math.floor(Math.random() * 1000)}`
  );

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Hardcoded users for demo
  const users = ["Alice", "Bob", "Charlie", "David"];

  //
  // ─── SOCKET LISTENERS ────────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_chat", { username });

    socket.on("online_users", (list) => {
      setOnline(list);
    });

    // Receive private message history
    socket.on("private_history", (history) => {
      setMessages(history);
    });

    // Receive private messages in real time
    socket.on("receive_private_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("online_users");
      socket.off("private_history");
      socket.off("receive_private_message");
    };
  }, [socket, username]);

  //
  // ─── LOAD PRIVATE CHAT WHEN USER SELECTS SOMEONE ─────────────────────────────
  //
  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.emit("load_private_history", {
      user: username,
      peer: selectedUser,
    });
  }, [socket, selectedUser, username]);

  //
  // ─── AUTO SCROLL WHEN MESSAGES CHANGE ─────────────────────────────────────────
  //
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  //
  // ─── SEND PRIVATE MESSAGE ──────────────────────────────────────────────────────
  //
  function sendMessage() {
    if (!text.trim() || !selectedUser) return;

    const message = {
      sender: username,
      recipient: selectedUser,
      content: text,
    };

    socket?.emit("send_private_message", message);

    // Add locally
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        sender: username,
        recipient: selectedUser,
        content: text,
        created_at: new Date().toISOString(),
      },
    ]);

    setText("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <Navigation />

      <div className="flex max-w-5xl mx-auto mt-6 border rounded-lg bg-card shadow-sm overflow-hidden">

        {/* Sidebar Users */}
        <div className="w-48 border-r bg-muted/20 p-4">
          <h3 className="font-bold text-sm mb-3">Users</h3>

          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <button
                key={user}
                className={`text-left px-3 py-2 rounded transition ${
                  selectedUser === user
                    ? "bg-primary/20 font-semibold"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">
              {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
            </h2>
            <span className="text-sm text-muted-foreground">{online.length} online</span>
          </div>

          {/* Chat Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-2 mb-3 overflow-auto border rounded p-3 bg-muted/10"
          >
            {messages.map((m) => {
              const isMe = m.sender === username;

              return (
                <div
                  key={m.id}
                  className={`p-2 rounded max-w-xs ${
                    isMe ? "ml-auto bg-primary/20" : "mr-auto bg-muted"
                  }`}
                >
                  <div className="text-xs text-muted-foreground">
                    {dayjs(m.created_at).format("HH:mm")}
                  </div>
                  <div>{m.content}</div>
                </div>
              );
            })}
          </div>

          {/* Input Section */}
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-2 bg-background"
              placeholder={
                selectedUser ? "Type a message..." : "Select a user to chat"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!selectedUser}
            />

            <button
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
              onClick={sendMessage}
              disabled={!selectedUser}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
