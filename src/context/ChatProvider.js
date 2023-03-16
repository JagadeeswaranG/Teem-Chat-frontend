import { createContext, useContext,  useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  //   const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState([]);

  //   useEffect(() => {
  //     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //     setUser(userInfo);

  //     if (!userInfo) {
  //       history.push("/");
  //     }
  //   }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        notifications,
        setNotifications,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
