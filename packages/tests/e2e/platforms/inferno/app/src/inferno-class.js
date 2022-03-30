import { createElement as h } from "inferno-create-element";
import { render } from "inferno";
import App from "./pages/inferno-class";

render(<App />, document.getElementById("app"));

module.hot.accept();
