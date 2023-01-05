import { Chat, MoreVert, SearchOutlined } from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import { auth, db } from "../firebase";
import SideBarChat from "./SideBarChat";

function Sidebar() {
  const [user] = useAuthState(auth);

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const chatExists = (receipientEmail) => {
    const res = chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === receipientEmail)?.length > 0
    );
    return !!res;
  };

  const createChat = () => {
    const input = window.prompt(
      "Please enter am email of user you want to chat with:"
    );

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      input !== user.email &&
      !chatExists(input)
    ) {
      // push to db
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconeContainer>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </IconeContainer>
      </Header>

      <Search>
        <SearchOutlined />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <NewChatBtn onClick={createChat}>Start a new chat</NewChatBtn>

      {chatsSnapshot?.docs.map((chat) => (
        <SideBarChat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  /* Optional: show position indicator in red */
  ::-webkit-scrollbar-thumb {
    background: #ff0000;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  padding: 15px;
  height: 100px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  /* margin: 10px; */
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconeContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 5px;
  background-color: white;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const NewChatBtn = styled(Button)`
  width: 100%;
  background-color: white;

  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;
