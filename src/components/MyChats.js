import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatLoading from "../components/ChatLoading";
import { ChatState } from "../context/ChatProvider";
import { configs } from "../serverConnect/Config";
import { getSender } from "./Getsender";
import GroupChatModal from "./GroupChatModal";

function MyChats({ user , fetchAgain}) {
  const [loggedUser, setLoggedUser] = useState("");
  // const [selectedChat, setSelectedChat] = useState();
  // const [chats, setChats] = useState([]);

  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();
  

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${configs.api}/api/chat`,
        config
      );
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };
  // console.log(chats);



  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg="lightgrey"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display={"flex"}
        w="100%"
        justifyContent={"space-between"}
        alignItems="center"
      >
        My Chats
        <GroupChatModal user={user}>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="grey"
        w={"100%"}
        h="100%"
        borderRadius={"lg"}
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflow={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
