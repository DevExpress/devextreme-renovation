import * as Preact from "preact";
import App from "./pages/index";

Preact.render(<App />, document.getElementById("app"));

module.hot.accept();
