import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ConfigProvider, theme } from "antd";
import { Global, css, ThemeProvider } from "@emotion/react";
import { darkTheme } from "./style/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <ThemeProvider theme={darkTheme}>
        <Global styles={css`
          body {
            background: ${darkTheme.colors.background};
            color: ${darkTheme.colors.textColor};
            margin: 0;
            padding: 0;
          }`
        }
        />
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
