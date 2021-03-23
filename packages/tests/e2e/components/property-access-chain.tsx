import {
  ComponentBindings,
  Component,
  JSXComponent,
  InternalState,
} from "@devextreme-generator/declarations";

function view({ i1, i2, i3 }: TestPropertyAccessChain) {
  return (
    <div id="test-property-access-chain">
      <span id="test-property-access-chain-undefined">{i1?.value + ""}</span>
      <span id="test-property-access-chain-null">{i2?.value + ""}</span>
      <span id="test-property-access-chain-exist">{i3?.value + ""}</span>
    </div>
  );
}

@ComponentBindings()
export class ButtonInput {}

type InternalStateType = { value: string };

@Component({
  view,
})
export default class TestPropertyAccessChain extends JSXComponent(ButtonInput) {
  @InternalState() i1?: InternalStateType;
  @InternalState() i2: InternalStateType | null = null;
  @InternalState() i3?: InternalStateType = { value: "value" };
}
