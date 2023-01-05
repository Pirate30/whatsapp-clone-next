import styled from "@emotion/styled";
import { Button } from "@mui/material";
import Head from "next/head";
import { auth, provider } from "../firebase";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" />
        <Button onClick={signIn} variant="outlined">
          Sign in with google
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 15px;
  box-shadow: 2px 3px 19px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 2px 3px 19px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 3px 19px 0px rgba(0, 0, 0, 0.75);
`;

const Logo = styled.img`
  height: 220px;
  width: 220px;
  margin-bottom: 20px;
`;
