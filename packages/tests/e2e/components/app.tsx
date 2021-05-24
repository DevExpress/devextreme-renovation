import {
  Component,
  ComponentBindings,
  JSXComponent,
  InternalState,
} from "@devextreme-generator/declarations";

import { SimpleComponent } from "./simple";
import ButtonComponent from "./button";
import ButtonWithState from "./state";
import ComponentWithSpread from "./spread-attributes";
import VisibilityChange from "./change-visibility";
import VisibilityChangeProp from "./change-visibility-prop";
import ComponentWithRest from "./rest-attributes";
import CallMethodInGetterWidget from "./call-method-in-getter";
import ComponentWithFragment from "./component-with-fragment";
import ComponentWithDefaultOptionRules, {
  defaultOptions as setDefaultOptions,
} from "./default-option-rules";
import List from "./list";
import SpreadProps from "./spread-props";
import TemplatePass from "./template-pass";
import RefPass from "./ref-pass";
import EffectsDOMUpdate from "./effects-dom-update";
import EffectsStateUpdate from "./effects-state-update";
import EffectSubscription from "./effect-subscribe-unsubscribe";
import SumArray from "./render/sum-array";
import ForwardRefParent from "./ref-on-children/forward-ref-parent";
import ForwardRefTemplate from "./ref-on-children/forward-ref-template";
import ForwardRefChild from "./ref-on-children/child";
import ForwardRefDeep from "./ref-on-children/forward-ref-deep";
import ProvideRefInFromParentToChildren from "./set-ref/provide-parent-ref-in-children/ref-provider";

import TemplateApp from "./template-passing/template-app";
import PortalContainer from "./portal-container";
import { PickPropsComponent } from "./pick-props";
import ContextApp from "./context/context-app";
import TestPropertyAccessChain from "./property-access-chain";
import TemplateDefaultValueApp from "./template-passing/template-default-value-app";
import RenderSlotCondition from "./slot/render-slot-condition";
import DefaultPropsComponent from "./default-props/default-props-component";
import SetNonElementRef from "./set-ref/set-non-element-ref";
import SetForwardRef from "./set-ref/set-forward-ref-parent";
import SetForwardRefDeep from "./set-ref/set-forward-ref-deep/parent";
import InlineArrowFunction from "./inline-arrow-function";
import ListTemplate from "./list-template";
import RefParent from "./refs-as-attributes/ref-parent";
import DynamicComponent from "./dynamic-components/dynamic-component";
import StylesWidget from "./styles";

function view(model: App) {
  return (
    <div>
      <SimpleComponent width={25} height={25}></SimpleComponent>
      <PickPropsComponent />
      <ButtonComponent id="button-1" onClick={model.onButtonClick}>
        {"DefaultSlot"}
      </ButtonComponent>
      <div id="button-1-click-counter">{model.clickCount}</div>
      <div>
        <ButtonComponent />
      </div>
      <ButtonWithState
        id="button-2"
        pressedChange={model.onButtonWithStatePressedChange}
      ></ButtonWithState>
      <div id="button-with-state-pressed">
        {model.buttonWithStateIsPressed.toString()}
      </div>
      <ComponentWithSpread
        containerId="component-with-spread"
        aria={model.spreadAttributesComponentAria}
      ></ComponentWithSpread>
      <ButtonComponent id="button-3" onClick={model.onChangeAriaButtonClick}>
        {"Change Aria"}
      </ButtonComponent>
      <VisibilityChange></VisibilityChange>
      <ButtonComponent
        id="button-4"
        onClick={model.onVisibilityChangePropClick}
      >
        {"Open"}
      </ButtonComponent>
      <VisibilityChangeProp
        visible={model.visibilityChangePropValue}
      ></VisibilityChangeProp>
      <ComponentWithRest
        id="component-with-rest-attributes"
        label="rest-attributes"
      ></ComponentWithRest>
      <CallMethodInGetterWidget
        id={"call-method-in-getter-widget"}
        prop={model.callMethodInGetterWidgetProp}
      ></CallMethodInGetterWidget>
      <ButtonComponent
        id="button-5"
        onClick={model.changeCallMethodInGetterWidgetProp}
      >
        {"UpdateValue"}
      </ButtonComponent>
      <div>
        <ComponentWithFragment />
      </div>
      <ComponentWithDefaultOptionRules id="component-with-default-options" />
      <List
        id={"list-1"}
        items={model.listItems}
        onClick={model.onListItemClick}
      />
      <ListTemplate
        id={"list-2"}
        items={model.listItems}
        onClick={model.onListItemClick}
      />
      <SpreadProps onClick={model.onButtonClick} id="spread-props">
        Can Spread Props
      </SpreadProps>
      <TemplatePass />
      <RefPass />
      <div>
        <ButtonComponent
          id="button-effects"
          onClick={model.onButtonEffectsClick}
        >
          {"Effects on DOM Update"}
        </ButtonComponent>
        <EffectsDOMUpdate
          name="effects-dom-update"
          text={model.domEffectsText}
        />
        <EffectsStateUpdate name="effects-state-update" />
        <EffectSubscription />
      </div>
      <SumArray id={"sum-array"} array={model.arrayForSum} />
      ForwardRef: <ForwardRefParent />
      ForwardRef Template:
      <ForwardRefTemplate contentTemplate={ForwardRefChild} />
      ForwardRef Deep:
      <ForwardRefTemplate contentTemplate={ForwardRefDeep} />
      <div id="set-ref">
        <SetNonElementRef />
        <SetForwardRef />
        <SetForwardRefDeep />
        <ProvideRefInFromParentToChildren />
      </div>
      <div style={{ border: "1px solid grey" }}>
        Check templates
        <TemplateApp />
      </div>
      <ContextApp />
      <PortalContainer />
      <TestPropertyAccessChain />
      <div style={{ border: "1px solid grey", padding: "5px" }}>
        <TemplateDefaultValueApp />
      </div>
      <RenderSlotCondition>content</RenderSlotCondition>
      <DefaultPropsComponent />
      <InlineArrowFunction />
      <DynamicComponent />
      <StylesWidget />
      <RefParent />
    </div>
  );
}

setDefaultOptions({
  device: () => true,
  options: {
    oneWayProp: "a",
    oneWayPropWithDefault: "b",
    twoWayProp: 15,
    twoWayPropWithDefault: 3,
    arrayProp: ["a", "b", "c"],
    objectProp: { val: "obj" },
    functionProp: () => "func",
  },
});

@ComponentBindings()
class AppInput {}

@Component({
  view,
})
export default class App extends JSXComponent(AppInput) {
  @InternalState() clickCount: number = 0;
  @InternalState() buttonWithStateIsPressed = false;

  @InternalState() spreadAttributesComponentAria = "init";

  @InternalState() callMethodInGetterWidgetProp = 1;

  @InternalState() listItems = [
    { key: 0, text: "a" },
    { key: 1, text: "b" },
  ];

  @InternalState() domEffectsText: string = "A";

  onButtonClick() {
    this.clickCount = this.clickCount + 1;
  }

  onButtonEffectsClick() {
    this.domEffectsText = this.domEffectsText === "A" ? "B" : "A";
  }

  onButtonWithStatePressedChange(p: boolean) {
    this.buttonWithStateIsPressed = p;
  }

  onListItemClick(i: number) {
    this.listItems = this.listItems.map((item) => {
      if (item.key === i) {
        return {
          ...item,
          color: "black",
        };
      }
      return item;
    });
  }

  onChangeAriaButtonClick() {
    this.spreadAttributesComponentAria = "changed";
  }

  changeCallMethodInGetterWidgetProp() {
    this.callMethodInGetterWidgetProp = 10;
  }

  @InternalState() visibilityChangePropValue: boolean = false;

  onVisibilityChangePropClick() {
    this.visibilityChangePropValue = true;
  }

  get arrayForSum(): number[] {
    return [1, 5, 10];
  }
}
