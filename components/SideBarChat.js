import styled from "@emotion/styled";
import { Avatar } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import getRecepientEmail from "../utils/getReceipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

function SideBarChat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [receipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecepientEmail(users, user))
  );

  const receipient = receipientSnapshot?.docs?.[0]?.data();

  const receipientEmail = getRecepientEmail(users, user);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {receipient ? (
        <UserAvatar src={receipient?.photoURL} />
      ) : (
        <UserAvatar>{receipientEmail[0]}</UserAvatar>
      )}
      <p>{receipientEmail}</p>
    </Container>
  );
}

export default SideBarChat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
