import React from "react";
import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center>
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png"
          alt="logo"
          height={200}
          style={{ marginBottom: 10 }}
        />
        <Circle size={60} color="#4ACB5A" />
      </div>
    </center>
  );
}

export default Loading;
