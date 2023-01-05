import React from "react";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment/moment";

function Message({ key, user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
  // console.log("mmmsssgg", message);
  return (
    <Container>
      <TypeOfMessage>
        {message.messages}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "-"}
        </TimeStamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  position: relative;
  text-align: center;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const TimeStamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 10px;
  position: absolute;
  bottom: -10px;
  text-align: right;
  right: 0;
`;
