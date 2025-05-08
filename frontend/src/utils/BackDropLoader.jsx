import { Backdrop } from "@mui/material";
import React from "react";
import { ClipLoader } from "react-spinners";

export default function BackDropLoader() {
  return (
    <>
      <Backdrop
        open={true}
        sx={{
          color: "#fff",
          zIndex:  100000000000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader color="rgb(30, 136, 229)" size={60} />
      </Backdrop>
    </>
  );
}
