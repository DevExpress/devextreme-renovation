import {
  Component,
  ComponentBindings,
  JSXComponent,
  Ref,
  RefObject,
} from "@devextreme-generator/declarations";
import PortalComponent from "./portal-component";

function view(model: PortalContainer) {
  return (
    <div>
      <PortalComponent containerRef={model.containerRef} />
      <div>{"I'm above portal"}</div>
      <div ref={model.containerRef}>
        {/* uncomment below line bellow once #502 is Fixed */}
        {/* {"Here should be portal"} */}
      </div>
      <div>{"I'm below portal"}</div>
    </div>
  );
}

@ComponentBindings()
class Props {}

@Component({
  view,
})
export default class PortalContainer extends JSXComponent(Props) {
  @Ref() containerRef?: RefObject<HTMLDivElement>;
}
