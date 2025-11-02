import ReactDOM from "react-dom/client";

import { App } from "./app";
import "./index.css";
import "./tailwind.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
ReactDOM.createRoot(rootElement).render(<App />);
