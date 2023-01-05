import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { Avatar, IconButton } from "@mui/material";
import { AttachFile, InsertEmoticon, Mic, MoreVert } from "@mui/icons-material";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState } from "react";
import firebase from "firebase/compat/app";
import TimeAgo from "timeago-react";

import getRecepientEmail from "../utils/getReceipientEmail";
import Message from "./Message";

function ChatScreen({ chat, messages }) {
  // console.log(chat, messages);
  const [user] = useAuthState(auth);

  const [input, setInput] = useState("");

  const EndOfMessageRef = useRef(null);

  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [receipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecepientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // last seen
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // push chat
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      messages: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    ScrollToBottom();
  };

  const recepient = receipientSnapshot?.docs?.[0]?.data();
  const receipientEmail = getRecepientEmail(chat.users, user);

  const ScrollToBottom = () => {
    EndOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Container>
      <Header>
        {recepient ? (
          <Avatar src={recepient.photoURL} />
        ) : (
          <Avatar>{receipientEmail[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{receipientEmail}</h3>
          {receipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recepient?.lastSeen?.toDate() ? (
                <TimeAgo date={recepient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Last Active ...</p>
          )}
        </HeaderInfo>
        <IconButton>
          <AttachFile />
        </IconButton>
        <IconButton>
          <MoreVert />
        </IconButton>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={EndOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <Mic />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

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

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 5px;
  }
  > p {
    font-size: 15px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  background-color: #e5ded8;
  min-height: 90vh;
  padding: 30px;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  /* align-items: center; */
  border-radius: 10px;
  /* position: sticky; */
  /* bottom: 0; */
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
