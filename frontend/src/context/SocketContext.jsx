import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

// Context
const SocketContext = createContext();

// Hook
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// Provider
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:3000", {
        query: {
          userId: authUser?._id,
        },
      });

      // socket.emit("setup", authUser);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });

      setSocket(socket);

      return () => socket.close();
      // setSocket(null);
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};

//  Export everything in a single object (best for Vite Fast Refresh)
// export { SocketContextProvider, useSocketContext };
