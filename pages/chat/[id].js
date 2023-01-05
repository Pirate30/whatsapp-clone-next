import styled from "@emotion/styled";
import Head from "next/head";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import getRecepientEmail from "../../utils/getReceipientEmail";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecepientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

// server side thing
export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  const msgResponse = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();
  // console.log("msgres", msgResponse);

  const messages = msgResponse.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chatRes = await ref.get();

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  // console.log("ssr", chat, messages);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  /* Optional: show position indicator in red */
  ::-webkit-scrollbar-thumb {
    background: #ff0000;
  }
`;
