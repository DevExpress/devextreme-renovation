import { createElement as h } from "inferno-create-element";
import { render } from "inferno";
import App from "./pages/inferno-hooks";

render(<App />, document.getElementById("app"));

module.hot.accept();
