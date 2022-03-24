import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

export default function PopAlert({ errors }) {
  Object.values(errors).forEach((error) => {
    console.log(error);
  });
  return (
    <>
      {Object.values(errors).length > 0 && (
        <Stack
          sx={{ width: "50%" }}
          spacing={2}
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <Alert severity="error" style={{ textAlign: "left" }}>
            <AlertTitle>Oops! Validation Error</AlertTitle>
            <ul>
              {Object.values(errors).map((error, i) => (
                <div key={i}>
                  {typeof error !== "object" && <li>{error}</li>}
                </div>
              ))}
            </ul>
          </Alert>
        </Stack>
      )}
    </>
  );
}
