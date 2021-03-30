import { createElement as h } from "inferno-create-element";
import { render } from "inferno";
import App from "./pages/native-components";

render(<App />, document.getElementById("app"));

module.hot.accept();
