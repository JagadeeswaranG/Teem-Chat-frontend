import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

function ChatBox({fetchAgain, setFetchAgain, user}) {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth="1px"
    >
      <SingleChat user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  );
}

export default ChatBox;