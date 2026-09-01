import { createRoot } from "react-dom/client";
import { store, persistedStore } from "./redux/store/index.tsx";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Provider } from "react-redux";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistedStore}></PersistGate>
    <App />
  </Provider>,
);
