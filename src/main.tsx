import { App } from "@/app/App"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./app/store"
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/todolist-19">
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
