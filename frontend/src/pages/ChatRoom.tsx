// // // // // // // import { useEffect, useRef, useState } from "react";
// // // // // // // import { useSocket } from "@/lib/socket";
// // // // // // // import dayjs from "dayjs";
// // // // // // // import { Navigation } from "@/components/Navigation";

// // // // // // // type Message = {
// // // // // // //   id: string;
// // // // // // //   username: string;
// // // // // // //   content: string;
// // // // // // //   created_at: string;
// // // // // // // };

// // // // // // // export default function ChatRoom() {
// // // // // // //   const { socket } = useSocket();
// // // // // // //   const [messages, setMessages] = useState<Message[]>([]);
// // // // // // //   const [online, setOnline] = useState<string[]>([]);
// // // // // // //   const [text, setText] = useState("");

// // // // // // //   const [username, setUsername] = useState(
// // // // // // //     localStorage.getItem("chat_username") ||
// // // // // // //       `Guest${Math.floor(Math.random() * 1000)}`
// // // // // // //   );

// // // // // // //   const [selectedUser, setSelectedUser] = useState<string | null>(null);

// // // // // // //   const scrollRef = useRef<HTMLDivElement>(null);

// // // // // // //   // Hardcoded users for UI
// // // // // // //   const users = ["Alice", "Bob", "Charlie", "David"];

// // // // // // //   useEffect(() => {
// // // // // // //     if (!socket) return;

// // // // // // //     socket.emit("join_chat", { username });

// // // // // // //     socket.on("message_history", (history) => {
// // // // // // //       setMessages(history);
// // // // // // //     });

// // // // // // //     socket.on("new_message", (msg) => {
// // // // // // //       setMessages((prev) => [...prev, msg]);
// // // // // // //     });

// // // // // // //     socket.on("online_users", (list) => {
// // // // // // //       setOnline(list);
// // // // // // //     });

// // // // // // //     return () => {
// // // // // // //       socket.off("message_history");
// // // // // // //       socket.off("new_message");
// // // // // // //       socket.off("online_users");
// // // // // // //     };
// // // // // // //   }, [socket, username]);

// // // // // // //   useEffect(() => {
// // // // // // //     scrollRef.current?.scrollTo({
// // // // // // //       top: scrollRef.current.scrollHeight,
// // // // // // //       behavior: "smooth",
// // // // // // //     });
// // // // // // //   }, [messages]);

// // // // // // //   function sendMessage() {
// // // // // // //     if (!text.trim() || !selectedUser) return;

// // // // // // //     // FIXED (removed extra ])
// // // // // // //     const content = `[To ${selectedUser}] ${text}`;

// // // // // // //     socket?.emit("send_message", { username, content });

// // // // // // //     // Add locally
// // // // // // //     setMessages((prev) => [
// // // // // // //       ...prev,
// // // // // // //       {
// // // // // // //         id: `${Date.now()}`,
// // // // // // //         username,
// // // // // // //         content,
// // // // // // //         created_at: new Date().toISOString(),
// // // // // // //       },
// // // // // // //     ]);

// // // // // // //     setText("");
// // // // // // //   }

// // // // // // //   // ✔️ Correct filtering for selected user
// // // // // // //   const displayedMessages = selectedUser
// // // // // // //     ? messages.filter(
// // // // // // //         (m) =>
// // // // // // //           m.content.startsWith(`[To ${selectedUser}]`) ||
// // // // // // //           m.username === selectedUser
// // // // // // //       )
// // // // // // //     : messages;

// // // // // // //   return (
// // // // // // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
// // // // // // //       <Navigation />

// // // // // // //       <div className="flex max-w-5xl mx-auto mt-6 border rounded-lg bg-card shadow-sm overflow-hidden">

// // // // // // //         {/* Users Sidebar */}
// // // // // // //         <div className="w-48 border-r bg-muted/20 p-4">
// // // // // // //           <h3 className="font-bold text-sm mb-3">Users</h3>

// // // // // // //           <div className="flex flex-col gap-2">
// // // // // // //             {users.map((user) => (
// // // // // // //               <button
// // // // // // //                 key={user}
// // // // // // //                 className={`text-left px-3 py-2 rounded transition ${
// // // // // // //                   selectedUser === user
// // // // // // //                     ? "bg-primary/20 font-semibold"
// // // // // // //                     : "hover:bg-muted"
// // // // // // //                 }`}
// // // // // // //                 onClick={() => setSelectedUser(user)}
// // // // // // //               >
// // // // // // //                 {user}
// // // // // // //               </button>
// // // // // // //             ))}
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Chat section */}
// // // // // // //         <div className="flex-1 flex flex-col p-4">
// // // // // // //           <div className="flex justify-between items-center mb-3">
// // // // // // //             <h2 className="text-xl font-bold">
// // // // // // //               {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
// // // // // // //             </h2>
// // // // // // //             <span className="text-sm text-muted-foreground">
// // // // // // //               {online.length} online
// // // // // // //             </span>
// // // // // // //           </div>

// // // // // // //           <div
// // // // // // //             ref={scrollRef}
// // // // // // //             className="flex-1 space-y-2 mb-3 overflow-auto border rounded p-3 bg-muted/10"
// // // // // // //           >
// // // // // // //             {displayedMessages.map((m) => {
// // // // // // //               // Remove "[To XYZ]" prefix for display
// // // // // // //               const cleanContent = m.content.replace(/\[To .*?\]\s?/g, "");

// // // // // // //               return (
// // // // // // //                 <div key={m.id} className="p-2 bg-muted rounded">
// // // // // // //                   <div className="text-xs text-muted-foreground">
// // // // // // //                     {dayjs(m.created_at).format("HH:mm")}
// // // // // // //                   </div>
// // // // // // //                   <div>{cleanContent}</div>
// // // // // // //                 </div>
// // // // // // //               );
// // // // // // //             })}
// // // // // // //           </div>

// // // // // // //           {/* Input */}
// // // // // // //           <div className="flex gap-2">
// // // // // // //             <input
// // // // // // //               className="flex-1 border rounded px-2 py-2 bg-background"
// // // // // // //               placeholder={
// // // // // // //                 selectedUser ? "Type a message..." : "Select a user to chat"
// // // // // // //               }
// // // // // // //               value={text}
// // // // // // //               onChange={(e) => setText(e.target.value)}
// // // // // // //               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // // // // // //               disabled={!selectedUser}
// // // // // // //             />

// // // // // // //             <button
// // // // // // //               className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
// // // // // // //               onClick={sendMessage}
// // // // // // //               disabled={!selectedUser}
// // // // // // //             >
// // // // // // //               Send
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // import { useEffect, useRef, useState } from "react";
// // // // // // import { useSocket } from "@/lib/socket";
// // // // // // import dayjs from "dayjs";
// // // // // // import { Navigation } from "@/components/Navigation";

// // // // // // type Message = {
// // // // // //   id: string;
// // // // // //   sender: string;
// // // // // //   recipient: string;
// // // // // //   content: string;
// // // // // //   created_at: string;
// // // // // // };

// // // // // // export default function ChatRoom() {
// // // // // //   const { socket } = useSocket();
// // // // // //   const [messages, setMessages] = useState<Message[]>([]);
// // // // // //   const [online, setOnline] = useState<string[]>([]);
// // // // // //   const [text, setText] = useState("");

// // // // // //   const [username, setUsername] = useState(
// // // // // //     localStorage.getItem("chat_username") ||
// // // // // //       `Guest${Math.floor(Math.random() * 1000)}`
// // // // // //   );

// // // // // //   const [selectedUser, setSelectedUser] = useState<string | null>(null);

// // // // // //   const scrollRef = useRef<HTMLDivElement>(null);

// // // // // //   // Hardcoded users for demo
// // // // // //   const users = ["Alice", "Bob", "Charlie", "David"];
// // // // // //   useEffect(() => {
// // // // // //     if (!socket) return;

// // // // // //     socket.emit("join_chat", { username });

// // // // // //     socket.on("online_users", (list) => {
// // // // // //       setOnline(list);
// // // // // //     });

// // // // // //     // Receive private message history
// // // // // //     socket.on("private_history", (history) => {
// // // // // //       setMessages(history);
// // // // // //     });

// // // // // //     // Receive private messages in real time
// // // // // //     socket.on("receive_private_message", (msg) => {
// // // // // //       setMessages((prev) => [...prev, msg]);
// // // // // //     });

// // // // // //     return () => {
// // // // // //       socket.off("online_users");
// // // // // //       socket.off("private_history");
// // // // // //       socket.off("receive_private_message");
// // // // // //     };
// // // // // //   }, [socket, username]);

// // // // // //   useEffect(() => {
// // // // // //     if (!socket || !selectedUser) return;

// // // // // //     socket.emit("load_private_history", {
// // // // // //       user: username,
// // // // // //       peer: selectedUser,
// // // // // //     });
// // // // // //   }, [socket, selectedUser, username]);

// // // // // //   useEffect(() => {
// // // // // //     scrollRef.current?.scrollTo({
// // // // // //       top: scrollRef.current.scrollHeight,
// // // // // //       behavior: "smooth",
// // // // // //     });
// // // // // //   }, [messages]);

// // // // // //   function sendMessage() {
// // // // // //     if (!text.trim() || !selectedUser) return;

// // // // // //     const message = {
// // // // // //       sender: username,
// // // // // //       recipient: selectedUser,
// // // // // //       content: text,
// // // // // //     };

// // // // // //     socket?.emit("send_private_message", message);

// // // // // //     // Add locally
// // // // // //     setMessages((prev) => [
// // // // // //       ...prev,
// // // // // //       {
// // // // // //         id: `${Date.now()}`,
// // // // // //         sender: username,
// // // // // //         recipient: selectedUser,
// // // // // //         content: text,
// // // // // //         created_at: new Date().toISOString(),
// // // // // //       },
// // // // // //     ]);

// // // // // //     setText("");
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
// // // // // //       {/* <Navigation /> */}

// // // // // //       <div className="flex max-w-5xl mx-auto mt-6 border rounded-lg bg-card shadow-sm overflow-hidden min-h-[700px]">

// // // // // //         <div className="w-48 border-r bg-muted/25 p-4">
// // // // // //           <h3 className="font-bold text-sm mb-3">Users</h3>

// // // // // //           <div className="flex flex-col gap-2">
// // // // // //             {users.map((user) => (
// // // // // //               <button
// // // // // //                 key={user}
// // // // // //                 className={`text-left px-3 py-2 rounded transition ${
// // // // // //                   selectedUser === user
// // // // // //                     ? "bg-primary/20 font-semibold"
// // // // // //                     : "hover:bg-muted"
// // // // // //                 }`}
// // // // // //                 onClick={() => setSelectedUser(user)}
// // // // // //               >
// // // // // //                 {user}
// // // // // //               </button>
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         <div className="flex-1 flex flex-col p-4">
// // // // // //           <div className="flex justify-between items-center mb-3">
// // // // // //             <h2 className="text-xl font-bold">
// // // // // //               {selectedUser ? `Chat with ${selectedUser}` : "Select a user"}
// // // // // //             </h2>
// // // // // //             <span className="text-sm text-muted-foreground">{online.length} online</span>
// // // // // //           </div>

// // // // // //           <div
// // // // // //             ref={scrollRef}
// // // // // //             className="flex-1 space-y-2 mb-3 overflow-auto border rounded p-3 bg-muted/10"
// // // // // //           >
// // // // // //             {messages.map((m) => {
// // // // // //               const isMe = m.sender === username;

// // // // // //               return (
// // // // // //                 <div
// // // // // //                   key={m.id}
// // // // // //                   className={`p-2 rounded max-w-xs ${
// // // // // //                     isMe ? "ml-auto bg-primary/20" : "mr-auto bg-muted"
// // // // // //                   }`}
// // // // // //                 >
// // // // // //                   <div className="text-xs text-muted-foreground">
// // // // // //                     {dayjs(m.created_at).format("HH:mm")}
// // // // // //                   </div>
// // // // // //                   <div>{m.content}</div>
// // // // // //                 </div>
// // // // // //               );
// // // // // //             })}
// // // // // //           </div>

// // // // // //           <div className="flex gap-2">
// // // // // //             <input
// // // // // //               className="flex-1 border rounded px-2 py-2 bg-background"
// // // // // //               placeholder={
// // // // // //                 selectedUser ? "Type a message..." : "Select a user to chat"
// // // // // //               }
// // // // // //               value={text}
// // // // // //               onChange={(e) => setText(e.target.value)}
// // // // // //               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // // // // //               disabled={!selectedUser}
// // // // // //             />

// // // // // //             <button
// // // // // //               className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
// // // // // //               onClick={sendMessage}
// // // // // //               disabled={!selectedUser}
// // // // // //             >
// // // // // //               Send
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // import React, { useEffect, useRef, useState } from "react";

// // // // // type Msg = {
// // // // //   type: "message";
// // // // //   name: string;
// // // // //   text: string;
// // // // //   ts: number;
// // // // // };

// // // // // const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

// // // // // export default function Chat() {
// // // // //   const [ws, setWs] = useState<WebSocket | null>(null);
// // // // //   const [messages, setMessages] = useState<Msg[]>([]);
// // // // //   const [text, setText] = useState("");
// // // // //   const [name, setName] = useState("anon");
// // // // //   const messagesRef = useRef<HTMLDivElement | null>(null);

// // // // //   useEffect(() => {
// // // // //     const socket = new WebSocket(WS_URL);
// // // // //     socket.onopen = () => console.log("Connected to", WS_URL);
// // // // //     socket.onmessage = (ev) => {
// // // // //       try {
// // // // //         const data = JSON.parse(ev.data) as Msg;
// // // // //         if (data.type === "message") {
// // // // //           setMessages((m) => [...m, data]);
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error("invalid message", err);
// // // // //       }
// // // // //     };
// // // // //     socket.onclose = () => console.log("Disconnected");
// // // // //     setWs(socket);
// // // // //     return () => {
// // // // //       socket.close();
// // // // //     };
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     // auto scroll
// // // // //     if (messagesRef.current) {
// // // // //       messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
// // // // //     }
// // // // //   }, [messages]);

// // // // //   const send = () => {
// // // // //     if (!ws || ws.readyState !== WebSocket.OPEN) {
// // // // //       alert("WebSocket not connected");
// // // // //       return;
// // // // //     }
// // // // //     const payload = { type: "message", name, text };
// // // // //     ws.send(JSON.stringify(payload));
// // // // //     setText("");
// // // // //   };

// // // // //   return (
// // // // //     <div style={{ maxWidth: 800 }}>
// // // // //       <div style={{ marginBottom: 8 }}>
// // // // //         <label>
// // // // //           Name:{" "}
// // // // //           <input
// // // // //             value={name}
// // // // //             onChange={(e) => setName(e.target.value)}
// // // // //             style={{ padding: 6 }}
// // // // //           />
// // // // //         </label>
// // // // //       </div>

// // // // //       <div
// // // // //         ref={messagesRef}
// // // // //         style={{
// // // // //           border: "1px solid #ddd",
// // // // //           height: 400,
// // // // //           overflowY: "auto",
// // // // //           padding: 8,
// // // // //           marginBottom: 8,
// // // // //           background: "#fafafa",
// // // // //         }}
// // // // //       >
// // // // //         {messages.map((m, i) => (
// // // // //           <div key={i} style={{ marginBottom: 6 }}>
// // // // //             <div style={{ fontSize: 12, color: "#666" }}>
// // // // //               <strong>{m.name}</strong> ·{" "}
// // // // //               {new Date(m.ts).toLocaleTimeString()}
// // // // //             </div>
// // // // //             <div style={{ fontSize: 12, color: "#666" }}>
// // // // //               <strong>{m.name}</strong> ·{" "}
// // // // //               {m.text}
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>

// // // // //       <div style={{ display: "flex", gap: 8 }}>
// // // // //         <input
// // // // //           value={text}
// // // // //           onChange={(e) => setText(e.target.value)}
// // // // //           onKeyDown={(e) => e.key === "Enter" && send()}
// // // // //           placeholder="Type a message"
// // // // //           style={{ flex: 1, padding: 8 }}
// // // // //         />
// // // // //         <button onClick={send} style={{ padding: "8px 12px" }}>
// // // // //           Send
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // import React, { useEffect, useRef, useState } from "react";

// // // // type Message = {
// // // //   id: number;
// // // //   sender: string;
// // // //   recipient: string;
// // // //   content: string;
// // // //   created_at: string;
// // // // };

// // // // const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

// // // // export default function ChatRoom() {
// // // //   const [ws, setWs] = useState<WebSocket | null>(null);
// // // //   const [messages, setMessages] = useState<Message[]>([]);
// // // //   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
// // // //   const [text, setText] = useState("");
// // // //   const [username, setUsername] = useState(
// // // //     localStorage.getItem("chat_username") || `Guest${Math.floor(Math.random() * 1000)}`
// // // //   );
// // // //   const [selectedUser, setSelectedUser] = useState<string | null>(null);

// // // //   const messagesRef = useRef<HTMLDivElement | null>(null);

// // // //   // Initialize WebSocket connection
// // // //   useEffect(() => {
// // // //     const socket = new WebSocket(WS_URL);

// // // //     socket.onopen = () => {
// // // //       console.log("Connected to WebSocket server");
// // // //       // Register user
// // // //       socket.send(JSON.stringify({ type: "join", username }));
// // // //     };

// // // //     socket.onmessage = (ev) => {
// // // //       try {
// // // //         const data = JSON.parse(ev.data);

// // // //         // Online users list
// // // //         if (data.type === "online_users") {
// // // //           setOnlineUsers(data.users.filter((u: string) => u !== username));
// // // //         }

// // // //         // Private message history
// // // //         if (data.type === "private_history") {
// // // //           setMessages(data.history);
// // // //         }

// // // //         // Receive a private message
// // // //         if (data.type === "receive_private_message") {
// // // //           setMessages((prev) => [...prev, data.msg]);
// // // //         }
// // // //       } catch (err) {
// // // //         console.error("Invalid message", err);
// // // //       }
// // // //     };

// // // //     socket.onclose = () => console.log("Disconnected");

// // // //     setWs(socket);

// // // //     return () => {
// // // //       socket.close();
// // // //     };
// // // //   }, [username]);

// // // //   // Load private history when selecting a user
// // // //   useEffect(() => {
// // // //     if (ws && selectedUser) {
// // // //       ws.send(JSON.stringify({ type: "load_history", user: username, peer: selectedUser }));
// // // //     }
// // // //   }, [ws, selectedUser, username]);

// // // //   // Auto-scroll to bottom
// // // //   useEffect(() => {
// // // //     if (messagesRef.current) {
// // // //       messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
// // // //     }
// // // //   }, [messages]);

// // // //   const sendMessage = () => {
// // // //     if (!ws || ws.readyState !== WebSocket.OPEN) return;
// // // //     if (!text.trim() || !selectedUser) return;

// // // //     const message = {
// // // //       type: "private_message",
// // // //       sender: username,
// // // //       recipient: selectedUser,
// // // //       content: text,
// // // //     };

// // // //     ws.send(JSON.stringify(message));
// // // //     setText("");
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
// // // //       {/* <div className="mb-4">
// // // //         <label>
// // // //           Your Name:{" "}
// // // //           <input
// // // //             value={username}
// // // //             onChange={(e) => setUsername(e.target.value)}
// // // //             className="border px-2 py-1 rounded"
// // // //           />
// // // //         </label>
// // // //       </div> */}

// // // //       <div className="flex w-full max-w-5xl border rounded shadow bg-white overflow-hidden">
// // // //         {/* Users Sidebar */}
// // // //         <div className="w-48 border-r p-4 bg-gray-50">
// // // //           <h3 className="font-bold mb-2">Online Users</h3>
// // // //           <div className="flex flex-col gap-2">
// // // //             {onlineUsers.length === 0 && <div className="text-gray-500 text-sm">No one online</div>}
// // // //             {onlineUsers.map((user) => (
// // // //               <button
// // // //                 key={user}
// // // //                 className={`text-left px-3 py-2 rounded transition ${
// // // //                   selectedUser === user ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
// // // //                 }`}
// // // //                 onClick={() => setSelectedUser(user)}
// // // //               >
// // // //                 {user}
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         </div>

// // // //         {/* Chat Area */}
// // // //         <div className="flex-1 flex flex-col p-4">
// // // //           <div className="flex justify-between items-center mb-3">
// // // //             <h2 className="text-xl font-bold">
// // // //               {selectedUser ? `Chat with ${selectedUser}` : "Select a user to chat"}
// // // //             </h2>
// // // //             <span className="text-sm text-gray-500">{onlineUsers.length} online</span>
// // // //           </div>

// // // //           {/* Messages */}
// // // //           <div
// // // //             ref={messagesRef}
// // // //             className="flex-1 overflow-auto border rounded p-3 mb-3 bg-gray-50 space-y-2"
// // // //           >
// // // //             {messages.map((m) => {
// // // //               const isMe = m.sender === username;
// // // //               return (
// // // //                 <div
// // // //                   key={m.id}
// // // //                   className={`p-2 rounded max-w-xs ${
// // // //                     isMe ? "ml-auto bg-blue-100" : "mr-auto bg-gray-200"
// // // //                   }`}
// // // //                 >
// // // //                   <div className="text-xs text-gray-500">{new Date(m.created_at).toLocaleTimeString()}</div>
// // // //                   <div>{m.content}</div>
// // // //                 </div>
// // // //               );
// // // //             })}
// // // //           </div>

// // // //           {/* Input */}
// // // //           <div className="flex gap-2">
// // // //             <input
// // // //               value={text}
// // // //               onChange={(e) => setText(e.target.value)}
// // // //               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // // //               placeholder={selectedUser ? "Type a message..." : "Select a user to chat"}
// // // //               className="flex-1 border rounded px-2 py-2"
// // // //               disabled={!selectedUser}
// // // //             />
// // // //             <button
// // // //               onClick={sendMessage}
// // // //               className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
// // // //               disabled={!selectedUser}
// // // //             >
// // // //               Send
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // import React, { useEffect, useRef, useState } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Send } from "lucide-react";

// // // type Message = {
// // //   id: number;
// // //   sender: string;
// // //   recipient: string;
// // //   content: string;
// // //   created_at: string;
// // // };

// // // const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

// // // export default function ChatRoom() {
// // //   const [ws, setWs] = useState<WebSocket | null>(null);
// // //   const [messages, setMessages] = useState<Message[]>([]);
// // //   const [username, setUsername] = useState(
// // //     localStorage.getItem("chat_username") || `Guest${Math.floor(Math.random() * 1000)}`
// // //   );

// // //   const messagesRef = useRef<HTMLDivElement | null>(null);
// // //   const [recipient, setRecipient] = useState("");
// // //   const [text, setText] = useState("");

// // //   // Initialize WebSocket
// // //   useEffect(() => {
// // //     const socket = new WebSocket(WS_URL);

// // //     socket.onopen = () => {
// // //       console.log("Connected to WebSocket server");
// // //       socket.send(JSON.stringify({ type: "join", username }));
// // //     };

// // //     socket.onmessage = (ev) => {
// // //       try {
// // //         const data = JSON.parse(ev.data);
// // //         if (data.type === "receive_private_message") {
// // //           setMessages((prev) => [...prev, data.msg]);
// // //         }
// // //       } catch (err) {
// // //         console.error("Invalid message", err);
// // //       }
// // //     };

// // //     socket.onclose = () => console.log("Disconnected");
// // //     setWs(socket);

// // //     return () => {
// // //       socket.close();
// // //     };
// // //   }, [username]);

// // //   // Auto-scroll
// // //   useEffect(() => {
// // //     if (messagesRef.current) {
// // //       messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
// // //     }
// // //   }, [messages]);

// // //   const sendMessage = () => {
// // //     if (!ws || ws.readyState !== WebSocket.OPEN) {
// // //       alert("WebSocket not connected");
// // //       return;
// // //     }
// // //     if (!recipient.trim() || !text.trim()) return;

// // //     const message = {
// // //       type: "private_message",
// // //       sender: username,
// // //       recipient,
// // //       content: text,
// // //     };

// // //     ws.send(JSON.stringify(message));
// // //     setMessages((prev) => [
// // //       ...prev,
// // //       { ...message, id: Date.now(), created_at: new Date().toISOString() },
// // //     ]);

// // //     setText("");
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
// // //       <div className="flex flex-col w-full max-w-xl">
// // //         <div className="flex gap-2 mb-2">
// // //           <input
// // //             value={recipient}
// // //             onChange={(e) => setRecipient(e.target.value)}
// // //             placeholder="Recipient username"
// // //             className="flex-1 border rounded px-2 py-2"
// // //           />
// // //           <input
// // //             value={text}
// // //             onChange={(e) => setText(e.target.value)}
// // //             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// // //             placeholder="Type message"
// // //             className="flex-1 border rounded px-2 py-2"
// // //           />
// // //           <Button onClick={sendMessage} className="gap-2">
// // //   <Send className="h-4 w-4" />
// // //   Send
// // // </Button>
// // //         </div>

// // //         <div
// // //           ref={messagesRef}
// // //           className="border rounded p-3 bg-white h-96 overflow-auto space-y-2"
// // //         >
// // //           {messages.map((m) => (
// // //             <div
// // //               key={m.id}
// // //               className={`p-2 rounded max-w-xs ${
// // //                 m.sender === username ? "ml-auto bg-gradient-to-br" : "mr-auto bg-gradient-to-br"
// // //               }`}
// // //             >
// // //               <div className="text-xs text-gray-500">
// // //                 {/* {m.sender} → {m.recipient} ·  */}
// // //                 {new Date(m.created_at).toLocaleTimeString()}
// // //               </div>
// // //               <div>{m.content}</div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";

// type Message = {
//   id: number;
//   sender: string;
//   recipient: string;
//   content: string;
//   created_at: string;
// };

// const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

// export default function ChatRoom() {
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [messagesMap, setMessagesMap] = useState<{ [user: string]: Message[] }>({});
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
//   const [username, setUsername] = useState(
//     localStorage.getItem("chat_username") || `Guest${Math.floor(Math.random() * 1000)}`
//   );
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const [text, setText] = useState("");

//   const messagesRef = useRef<HTMLDivElement | null>(null);

//   // Initialize WebSocket
//   useEffect(() => {
//     const socket = new WebSocket(WS_URL);

//     socket.onopen = () => {
//       console.log("Connected to WebSocket server");
//       socket.send(JSON.stringify({ type: "join", username }));
//     };

//     socket.onmessage = (ev) => {
//       try {
//         const data = JSON.parse(ev.data);

//         if (data.type === "online_users") {
//           setOnlineUsers(data.users.filter((u: string) => u !== username));
//         }

//         if (data.type === "receive_private_message") {
//           const msg = data.msg as Message;
//           const key = msg.sender === username ? msg.recipient : msg.sender;

//           setMessagesMap((prev) => {
//             const userMessages = prev[key] || [];
//             return { ...prev, [key]: [...userMessages, msg] };
//           });
//         }

//         if (data.type === "private_history") {
//           // assume data.history is an array of Message
//           const history: Message[] = data.history;
//           if (history.length > 0) {
//             const key = history[0].sender === username ? history[0].recipient : history[0].sender;
//             setMessagesMap((prev) => ({ ...prev, [key]: history }));
//           }
//         }
//       } catch (err) {
//         console.error("Invalid message", err);
//       }
//     };

//     socket.onclose = () => console.log("Disconnected");
//     setWs(socket);

//     return () => {
//       socket.close();
//     };
//   }, [username]);

//   // Load history when selecting a user
//   useEffect(() => {
//     if (ws && selectedUser) {
//       ws.send(JSON.stringify({ type: "load_history", user: username, peer: selectedUser }));
//     }
//   }, [ws, selectedUser, username]);

//   // Auto-scroll
//   useEffect(() => {
//     if (messagesRef.current) {
//       messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
//     }
//   }, [messagesMap, selectedUser]);

//   const sendMessage = () => {
//     if (!ws || ws.readyState !== WebSocket.OPEN) return;
//     if (!text.trim() || !selectedUser) return;

//     const message: Message = {
//       id: Date.now(),
//       sender: username,
//       recipient: selectedUser,
//       content: text,
//       created_at: new Date().toISOString(),
//     };

//     ws.send(JSON.stringify({ type: "private_message", ...message }));

//     // Add to local state
//     setMessagesMap((prev) => {
//       const userMessages = prev[selectedUser] || [];
//       return { ...prev, [selectedUser]: [...userMessages, message] };
//     });

//     setText("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
//       <div className="flex w-full max-w-5xl border rounded shadow bg-white overflow-hidden">
//         {/* Sidebar */}
//         <div className="w-48 border-r p-4 bg-gray-50">
//           <h3 className="font-bold mb-2">Online Users</h3>
//           <div className="flex flex-col gap-2">
//             {onlineUsers.length === 0 && <div className="text-gray-500 text-sm">No one online</div>}
//             {onlineUsers.map((user) => (
//               <button
//                 key={user}
//                 className={`text-left px-3 py-2 rounded transition ${
//                   selectedUser === user ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
//                 }`}
//                 onClick={() => setSelectedUser(user)}
//               >
//                 {user}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col p-4">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-xl font-bold">
//               {selectedUser ? `Chat with ${selectedUser}` : "Select a user to chat"}
//             </h2>
//             <span className="text-sm text-gray-500">{onlineUsers.length} online</span>
//           </div>

//           {/* Messages */}
//           <div
//             ref={messagesRef}
//             className="flex-1 overflow-auto border rounded p-3 mb-3 bg-gray-50 space-y-2"
//           >
//             {selectedUser &&
//               (messagesMap[selectedUser] || []).map((m) => {
//                 const isMe = m.sender === username;
//                 return (
//                   <div
//                     key={m.id}
//                     className={`p-2 rounded max-w-xs ${
//                       isMe ? "ml-auto bg-blue-100" : "mr-auto bg-gray-200"
//                     }`}
//                   >
//                     <div className="text-xs text-gray-500">
//                       {m.sender} → {m.recipient} · {new Date(m.created_at).toLocaleTimeString()}
//                     </div>
//                     <div>{m.content}</div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* Input */}
//           <div className="flex gap-2">
//             <input
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder={selectedUser ? "Type a message..." : "Select a user to chat"}
//               className="flex-1 border rounded px-2 py-2"
//               disabled={!selectedUser}
//             />
//             <Button onClick={sendMessage} className="gap-2" disabled={!selectedUser}>
//               <Send className="h-4 w-4" />
//               Send
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "@/lib/socket";
// import { useAuth } from '@/context/authContext';

// type Message = {
//   id: string;
//   sender: string;
//   recipient?: string;
//   content: string;
//   created_at: string;
// };

// export default function ChatRoom() {
//   const { socket } = useSocket();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [online, setOnline] = useState<string[]>([]);
//   const [text, setText] = useState("");
//   // const [username, setUsername] = useState(localStorage.getItem("user") || `Guest${Math.floor(Math.random() * 1000)}`);
//   const [username, setUsername] = useState(() => {
//     const stored = localStorage.getItem("user");
//     if (!stored) return `Guest${Math.floor(Math.random() * 1000)}`;
//     try {
//       return JSON.parse(stored).name; // Extract "name"
//     } catch {
//       return stored; // fallback
//     }
//   });
  
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const { user, setUser } = useAuth();

//   useEffect(() => {
//     if (!socket) return;
//     socket.emit("join_chat", { username });
//     socket.on("message_history", (history) => setMessages(history));
//     socket.on("new_message", (msg) => setMessages(prev => [...prev, msg]));
//     socket.on("online_users", (list) => setOnline(list));
//     return () => {
//       socket.off("message_history");
//       socket.off("new_message");
//       socket.off("online_users");
//     };
//   }, [socket, username]);

//   useEffect(() => {
//     scrollRef.current?.scrollTo?.({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
//   }, [messages]);

//   function sendMessage() {
//     if (!text.trim() || !selectedUser) return;
//     const message = { sender: username, recipient: selectedUser, content: text };
//     socket?.emit("send_message", message);
//     setMessages(prev => [...prev, {
//       id: `${Date.now()}`,
//       sender: username,
//       recipient: selectedUser,
//       content: text,
//       created_at: new Date().toISOString(),
//     }]);
//     setText("");
//   }

//   return (
//     <div className="chat-room">
//       <div>
//         <h2>Online Users</h2>
//         {online.map(user => (
//           <button key={user} onClick={() => setSelectedUser(user)}>{user}</button>
//         ))}
//       </div>
//       <div ref={scrollRef} style={{ maxHeight: 400, overflowY: "auto" }}>
//         {messages.map(msg => (
//           <div key={msg.id}><b>{msg.sender}:</b> {msg.content}</div>
//         ))}
//       </div>
//       <input value={text} onChange={e => setText(e.target.value)} placeholder="Type your message..." />
//       <button onClick={sendMessage} disabled={!selectedUser}>Send</button>
//     </div>
//   );
// }

// import { useEffect } from "react";
// import { useSocket } from "@/lib/socket";
// import { useAuth } from "@/context/authContext";

// export default function ChatRoom() {
//   const { socket } = useSocket();
//   const { user } = useAuth();

//   console.log('user:', user);
//   console.log('socket:', socket);

//   useEffect(() => {
//     if (!user || !socket) return;
//     socket.emit("join_chat", {
//       id: user.id,
//       username: user.name,
//       displayName: user.name,
//     });
//     return () => {};
//   }, [user, socket]);

//   return (
//     <div>
//       <h1>Debug Chat Room</h1>
//       <p>user: {user ? JSON.stringify(user) : "NO USER"}</p>
//       <p>socket: {socket ? "connected" : "no socket"}</p>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "@/lib/socket";
// import { useAuth } from '@/context/authContext';
// import { Button } from "@/components/ui/button";

// type Message = {
//   id: string;
//   sender: string;
//   recipient?: string;
//   content: string;
//   created_at: string;
// };
// type OnlineUser = { id: string; username: string; displayName: string };

// export default function ChatRoom() {
//   const { socket } = useSocket();
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [online, setOnline] = useState<OnlineUser[]>([]);
//   const [text, setText] = useState("");
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // 1. Join chat with authenticated user info when available.
//   useEffect(() => {
//     if (!socket || !user) return;
//     socket.emit("join_chat", {
//       id: user.id,
//       username: user.name,         // or user.username if available
//       displayName: user.name,      // or user.displayName if you have it
//     });

//     socket.on("message_history", (history) => setMessages(history));
//     socket.on("new_message", (msg) => setMessages(prev => [...prev, msg]));
//     socket.on("online_users", (list) => setOnline(list));

//     return () => {
//       socket.off("message_history");
//       socket.off("new_message");
//       socket.off("online_users");
//     };
//   }, [socket, user]);

//   // 2. Scroll to bottom when messages update.
//   useEffect(() => {
//     scrollRef.current?.scrollTo?.({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
//   }, [messages]);

//   // 3. Send a message to the selected user.
//   function sendMessage() {
//     if (!text.trim() || !selectedUser || !user) return;
//     const message = {
//       sender: user.name,        // sender's display name
//       recipient: selectedUser,  // username of recipient
//       content: text,
//     };
//     socket?.emit("send_message", message);
//     setMessages(prev => [...prev, {
//       id: `${Date.now()}`,
//       sender: user.name,
//       recipient: selectedUser,
//       content: text,
//       created_at: new Date().toISOString(),
//     }]);
//     setText("");
//   }

//   // 4. Show only other users in online list, not self.
//   const otherUsers = online.filter(u => u.username !== user?.name);

//   return (
//     <div className="flex flex-col space-y-2 px-4">
//       <div>
//         <h2>Online Users</h2>
//         {otherUsers.length === 0 && <p>No other users online.</p>}
//         {otherUsers.map(u => (
//           <Button
//             key={u.id}
//             type="button"
//             size="sm"
//             className={`flex-1 px-4 mb-2 ${selectedUser === u.username ? "bg-accent text-accent-foreground font-semibold" : ""}`}
//             onClick={() => setSelectedUser(u.username)}
//           >
//             {u.displayName} ({u.username})
//           </Button>
//         ))}
//       </div>
//       <div ref={scrollRef} style={{ maxHeight: 400, overflowY: "auto" }}>
//         {selectedUser
//           ? messages
//               .filter(msg =>
//                 (msg.sender === user.name && msg.recipient === selectedUser) ||
//                 (msg.sender === selectedUser && msg.recipient === user.name)
//               )
//               .map(msg => (
//                 <div key={msg.id}>
//                   <b>{msg.sender === user.name ? "You" : msg.sender}:</b> {msg.content}
//                 </div>
//               ))
//           : (
//             <div className="text-gray-400 mt-8 text-center">Select a user to start chatting.</div>
//           )}
//       </div>
//       <input
//         value={text}
//         onChange={e => setText(e.target.value)}
//         placeholder="Type your message..."
//         disabled={!selectedUser}
//       />
//       <Button
//         type="button"
//         onClick={sendMessage}
//         disabled={!selectedUser || !text.trim()}
//         size="lg"
//         className="mt-2 w-full"
//       >
//         Send
//       </Button>
//     </div>
//   );
// }

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
type OnlineUser = { id: string; username: string; displayName: string };

export default function ChatRoom() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState<OnlineUser[]>([]);
  const [text, setText] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Join chat, fetch data, and listen for new messages
  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("join_chat", {
      id: user.id,
      username: user.name,
      displayName: user.name,
    });

    socket.on("message_history", (history) => setMessages(history));
    socket.on("new_message", (msg) => setMessages(prev => [...prev, msg]));
    socket.on("online_users", (list) => setOnline(list));

    return () => {
      socket.off("message_history");
      socket.off("new_message");
      socket.off("online_users");
    };
  }, [socket, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!text.trim() || !selectedUser || !user) return;
    const message = {
      sender: user.name,
      recipient: selectedUser,
      content: text,
    };
    socket?.emit("send_message", message);
    setText(""); // Only clear the input!
    // Don't add the message locally anymore!
  }

  const otherUsers = online.filter(u => u.username !== user?.name);

  return (
    <div className="flex flex-col space-y-2 px-4">
      <div>
        <h2>Online Users</h2>
        {otherUsers.length === 0 && <p>No other users online.</p>}
        {otherUsers.map(u => (
          <Button
            key={u.id}
            type="button"
            size="sm"
            className={`flex-1 px-4 mb-2 ${selectedUser === u.username ? "bg-accent text-accent-foreground font-semibold" : ""}`}
            onClick={() => setSelectedUser(u.username)}
          >
            {u.displayName} ({u.username})
          </Button>
        ))}
      </div>
      <div ref={scrollRef} style={{ maxHeight: 400, overflowY: "auto" }}>
        {selectedUser
          ? messages
              .filter(msg =>
                (msg.sender === user.name && msg.recipient === selectedUser) ||
                (msg.sender === selectedUser && msg.recipient === user.name)
              )
              .map(msg => (
                <div key={msg.id}>
                  <b>{msg.sender === user.name ? "You" : msg.sender}:</b> {msg.content}
                </div>
              ))
          : (
            <div className="text-gray-400 mt-8 text-center">Select a user to start chatting.</div>
          )}
      </div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your message..."
        disabled={!selectedUser}
      />
      <Button
        type="button"
        onClick={sendMessage}
        disabled={!selectedUser || !text.trim()}
        size="lg"
        className="mt-2 w-full"
      >
        Send
      </Button>
    </div>
  );
}