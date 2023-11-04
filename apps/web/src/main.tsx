import React from "react"
import ReactDOM from "react-dom/client"

import { ThemeProvider } from "@/providers/theme.tsx"
import App from "./app.tsx"

import "./global.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
