import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ClickTheme } from "./context/ClickTheme.tsx";
import { ClickForHomepage } from "./context/ClickForHomepage.tsx";
import { createRoot } from "react-dom/client";
import { AdminController } from "./context/AdminController.tsx";
import { AddToCartContext } from "./context/AddToCartContext.tsx";
import { AuthProvider } from "./context/LoginContext.tsx";
const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
  <AuthProvider>
    <ClickTheme>
      <ClickForHomepage>
        <AdminController>
          <AddToCartContext>
          <App />
          </AddToCartContext>
        </AdminController>
      </ClickForHomepage>
    </ClickTheme>
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();
