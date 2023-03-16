import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/SideDrawer";
import { Box, SimpleGrid } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useHistory } from "react-router-dom";

function Chatpage() {
  // const { user } = ChatState();
  const [user, setUser] = useState();
  const [fetchAgain, setFetchAgain] = useState();
   const history = useHistory();

   useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer user={user} />}
      {/* <SimpleGrid columns={2} display="flex"> */}
        <Box
          display="flex"
          justifyContent={"space-between"}
          w="100%"
          h={"91.5vh"}
          p="10px"
        >
          {user && <MyChats user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
          {user && <ChatBox user={user} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
        {/* <Box
          d="flex"
          justifyContent={"space-between"}
          w="100%"
          h={"91.5vh"}
          p="10px"
        >
          {user && <MyChats />}
          {user && <ChatBox />}
        </Box> */}
      {/* </SimpleGrid> */}
    </div>
  );
}

export default Chatpage;
