import { createRoot } from "react-dom/client";
import SimpleApp from "./SimpleApp";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="pacepal-theme">
    <SimpleApp />
  </ThemeProvider>
);