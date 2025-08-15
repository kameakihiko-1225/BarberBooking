import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initWebVitals } from "./lib/web-vitals";

// Initialize web vitals logging
initWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
