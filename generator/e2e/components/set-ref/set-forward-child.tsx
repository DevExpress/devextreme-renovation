import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  ForwardRef,
} from "../../../component_declaration/common";

function view({ host }: SetForwardRef) {
  return <span className="set-forward-ref" ref={host as any}></span>;
}

@ComponentBindings()
class Props {
  @ForwardRef() forwardHost?: HTMLDivElement;
}

@Component({
  view,
})
export default class SetForwardRef extends JSXComponent<Props>() {
  @Ref() host!: HTMLDivElement;

  @Effect({ run: "once" })
  forwardHost() {
    if (this.props.forwardHost) {
      this.props.forwardHost = this.host;
    }
  }
}
