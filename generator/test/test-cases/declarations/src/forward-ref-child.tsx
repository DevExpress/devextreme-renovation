import {
  Component,
  ComponentBindings,
  JSXComponent,
  ForwardRef,
  OneWay,
} from "../../../../component_declaration/common";

function view({ props: { childRef, nullableRef } }: RefOnChildrenChild) {
  return (
    <div ref={childRef as any}>
      <div ref={nullableRef as any}></div>
    </div>
  );
}

@ComponentBindings()
class Props {
  @ForwardRef() childRef!: HTMLDivElement;
  @ForwardRef() nullableRef?: HTMLDivElement;
  @OneWay() state?: number;
}

@Component({
  view,
})
export default class RefOnChildrenChild extends JSXComponent<
  Props,
  "childRef"
>() {}
