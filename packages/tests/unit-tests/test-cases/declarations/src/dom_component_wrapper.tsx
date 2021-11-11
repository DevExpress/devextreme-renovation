import {
    Component,
    ComponentBindings,
    JSXComponent,
  } from "@devextreme-generator/declarations";

  function view(model: DomCompoentWrapper): JSX.Element {
    return (
      <span>
      </span>
    );
  }

  @ComponentBindings()
  export class DomCompoentWrapperProps {
  }

  @Component({
    view: view,
  })
  export default class DomCompoentWrapper extends JSXComponent(DomCompoentWrapperProps) {
  }
