import {
  Component,
  ComponentBindings,
  JSXComponent,
  Effect,
  ForwardRef,
  RefObject,
  Fragment,
  InternalState,
  Ref,
} from "@devextreme-generator/declarations";

import SetForwardRef from "./set-forward-child";

function view({ ref, hostHasCurrent, host, visible }: SetForwardRefParent) {
  return <Fragment>
    <div ref={ref} className='ref-forwarding'>{hostHasCurrent.toString()}</div>
    <SetForwardRef forwardHost={host} visible={visible} />
  </Fragment>;
}

@ComponentBindings()
class Props { }

@Component({
  view,
  jQuery: { register: true },
})
export default class SetForwardRefParent extends JSXComponent<Props>() {
  @Ref() ref!: RefObject<HTMLDivElement>;
  @InternalState() visible = true;
  @InternalState() hostHasCurrent: boolean = false;
  @ForwardRef() host!: RefObject<HTMLDivElement>;

  @Effect({ run: "always"})
  setContent() {
    if (this.host.current) {
      this.host.current.innerHTML = "content in forwardRef";
    }
    this.hostHasCurrent = !!this.host.current;
  }
  @Effect() click() {
    const handler = () => {
      this.visible = !this.visible;
    };
    this.ref.current?.addEventListener('click', handler);
    return () => this.ref.current?.removeEventListener('click', handler)
  }
}
