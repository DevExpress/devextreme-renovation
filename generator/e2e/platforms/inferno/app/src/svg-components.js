import { createElement as h } from "inferno-create-element";
import { render } from "inferno";
import App from "./pages/svg-components";

render(<App />, document.getElementById("app"));

module.hot.accept();
