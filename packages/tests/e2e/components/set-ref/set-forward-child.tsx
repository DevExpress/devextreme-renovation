import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  Ref,
  ForwardRef,
  RefObject,
  OneWay,
} from "@devextreme-generator/declarations";

function view({ host, props: { visible } }: SetForwardRef) {
  return visible && (<span className="set-forward-ref" ref={host}></span>);
}

@ComponentBindings()
class Props {
  @OneWay() visible = true;
  @ForwardRef() forwardHost?: RefObject<HTMLDivElement>;
}

@Component({
  view,
  jQuery: { register: true },
})
export default class SetForwardRef extends JSXComponent<Props>() {
  @Ref() host!: RefObject<HTMLDivElement>;

  @Effect({ run: "always" })
  forwardHost() {
    if (this.props.forwardHost) {
      this.props.forwardHost.current = this.host.current;
    }
  }
}
