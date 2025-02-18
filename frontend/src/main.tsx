import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";
import { darkTheme } from "./style/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
