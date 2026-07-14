import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@/api/custom-fetch";

// When the client is hosted separately from the API (e.g. Vercel/Netlify),
// set VITE_API_URL to the API origin at build time. Defaults to same-origin.
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
