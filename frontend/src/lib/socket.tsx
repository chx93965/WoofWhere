import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

//Dummy Comment
type SocketContextType = { socket: Socket | null };
const SocketContext = createContext<SocketContextType>({ socket: null });

type SocketProviderProps = { children: ReactNode };

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // TODO: modify hardcoded URL
    const s = io("http://localhost:4001", { transports: ["websocket"] }); //REMOVE IF NEEDED - 0
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
