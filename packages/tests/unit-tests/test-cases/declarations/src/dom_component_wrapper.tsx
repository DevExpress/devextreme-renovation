import {
    Component,
    ComponentBindings,
    JSXComponent,
  } from "@devextreme-generator/declarations";

  function view(model: DomComponentWrapper): JSX.Element {
    return (
      <span>
      </span>
    );
  }

  @ComponentBindings()
  export class DomComponentWrapperProps {
  }

  @Component({
    view: view,
  })
  export default class DomComponentWrapper extends JSXComponent(DomComponentWrapperProps) {
  }
