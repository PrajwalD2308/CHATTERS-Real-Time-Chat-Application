import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../../Zustans/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSetSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const {
    messages,
    // setMessage,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);
  //chats function
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setNewMessage(message);
      console.log("New message received:", message);
      // Update the chatUser state
      setChatUser((prevChatUser) => {
        return prevChatUser.map((user) => {
          if (user._id === message.senderId) {
            return { ...user, hasNewMessage: true };
          }
          return user;
        });
      });
    });
    return () => socket?.off("newMessage");
  }, [socket]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const chatters = await axios.get(
          `http://localhost:3000/api/user/currentchatters`
        );
        setChatUser(chatters.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch initially
    fetchChatUsers();

    // Set up socket listener for real-time updates
    socket?.on("updateChatUsers", () => {
      fetchChatUsers(); // Refresh users when an update event is received
    });

    // Set up periodic fetch as a fallback
    const intervalId = setInterval(() => {
      fetchChatUsers();
    }, 3000); // Refresh every 3 seconds

    return () => {
      clearInterval(intervalId);
      socket?.off("updateChatUsers");
    };
  }, [socket]);
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        setChatUser(chatters.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch initially
    fetchChatUsers();

    // Set up socket listener for real-time updates
    socket?.on("updateChatUsers", () => {
      fetchChatUsers(); // Refresh users when an update event is received
    });

    // Set up periodic fetch as a fallback
    const intervalId = setInterval(() => {
      fetchChatUsers();
    }, 3000); // Refresh every 3 seconds

    return () => {
      clearInterval(intervalId);
      socket?.off("updateChatUsers");
    };
  }, [socket]);
  // //show user with u chatted
  // useEffect(() => {
  //   const chatUserHandler = async () => {
  //     setLoading(true);
  //     try {
  //       const chatters = await axios.get(`/api/user/currentchatters`, {
  //         withCredentials: true,
  //       });
  //       const data = chatters.data;
  //       if (data.success === false) {
  //         setLoading(false);
  //         console.log(data.message);
  //       }
  //       setLoading(false);
  //       setChatUser(data);
  //     } catch (error) {
  //       setLoading(false);
  //       console.log(error);
  //     }
  //   };
  //   chatUserHandler();
  // }, []);

  //show user from the search result
  const handelSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`, {
        withCredentials: true,
      });
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User Not Found");
      } else {
        setSearchuser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //show which user is selected
  const handelUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSetSelectedUserId(user._id);
    // setNewMessageUsers("");

    // Reset the new message indicator for this user
    setChatUser((prevChatUser) =>
      prevChatUser.map((chatUser) => {
        if (chatUser._id === user._id) {
          return { ...chatUser, hasNewMessage: false };
        }
        return chatUser;
      })
    );

    setNewMessage(null); // Reset the new message state
  };

  //back from search result
  const handSearchback = () => {
    setSearchuser([]);
    setSearchInput("");
  };

  //logout
  const handelLogOut = async () => {
    setLoading(true);
    const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
    if (confirmlogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data?.success === false) {
          setLoading(false);
          console.log(data?.message);
        }
        toast.info(data?.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("LogOut Cancelled");
    }
  };

  return (
    <div className="w-80 h-screen bg-white/10 backdrop-blur-md text-white p-4 flex flex-col">
      {/* Search & Profile */}
      <div className="flex items-center gap-2 mb-4">
        <form
          onSubmit={handelSearchSubmit}
          className="flex flex-1 items-center bg-white/20 rounded-full px-4 py-2"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="search user"
            className="bg-transparent text-white placeholder-white outline-none flex-1"
          />
          <button type="submit">
            <FaSearch className="text-white" />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          className="h-12 w-12 rounded-full cursor-pointer hover:scale-110 transition"
          alt="profile"
        />
      </div>

      {/* Divider */}
      <div className="border-b border-white/20 mb-2" />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {searchUser.map((user, index) => (
          <div
            key={user._id}
            onClick={() => handelUserClick(user)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition hover:bg-white/10 ${
              selectedUserId === user._id ? "bg-white/20" : ""
            }`}
          >
            {/*Socket is Online*/}
            <div
              className={`relative w-12 h-12 rounded-full overflow-hidden border avatar ${
                isOnline[index] ? "border-green-400" : "border-gray-500"
              }`}
            >
              <img
                src={user.profilepic}
                alt="avatar"
                className="w-12 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col flex-1">
              <p className="text-base text-gray-950 font-semibold">
                {user.username}
              </p>
            </div>
            {newMessage?.receiverId === authUser._id &&
              newMessage?.senderId === user._id && (
                <div className="bg-red-500 text-xs rounded-full px-2 py-1">
                  +new message
                </div>
              )}
          </div>
        ))}

        {searchUser.length === 0 && chatUser.length === 0 && (
          <div className="text-center text-yellow-400 mt-8 space-y-1">
            <h1 className="text-lg font-semibold">Why are you Alone!!🤔</h1>
            <p>Search username to chat</p>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-auto w-10 flex items-center gap-2 text-sm text-white/80 hover:text-white hover:bg-red-600 cursor-pointer pt-4">
        <button onClick={handelLogOut}>
          <BiLogOut size={24} />
        </button>
        <p>Logout</p>
      </div>
    </div>
  );
};

export default Sidebar;
