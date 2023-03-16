import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  SimpleGrid,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
import { useHistory } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "./Getsender";
import ProfileModal from "./ProfileModal";
import UserListItem from "./userAvatar/UserListItem";

function SideDrawer({ user }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const [selectedChat, setSelectedChat] = useState();
  // const [chats, setChats] = useState([]);

  const { setSelectedChat, chats, setChats, notifications, setNotifications } =
    ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter name/email for search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:3000/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching Data",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
        bg={"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        {/* <SimpleGrid columns={3} spacing={2}> */}
        {/* <Box justifyContent="flex-start" display="flex"> */}
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} bg="lightgrey" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        {/* </Box> */}

        {/* <Box justifyContent={"center"} display="flex"> */}
        <Text fontSize={"3xl"} fontFamily="Work sans">
          Teem Chat
        </Text>
        {/* </Box> */}

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
              count={notifications.length}
              effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "No New Messages"}
              {notifications.map((notific) => (
                <MenuItem 
                key={notific._id}
                onClick={()=>{
                  setSelectedChat(notific.chat)
                  setNotifications(notifications.filter((n)=> n !== notific))
                }}
                >
                  {notific.chat.isGroupChat
                    ? `New Message in ${notific.chat.chatName}`
                    : `New Message from ${getSender(user, notific.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg="lightgrey"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size={"sm"}
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
        {/* </SimpleGrid> */}
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name/email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
