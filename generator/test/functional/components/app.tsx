import { Component, ComponentBindings, JSXComponent, InternalState, Fragment } from "../../../component_declaration/common";

import SimpleComponent from "./simple.tsx";
import ButtonComponent from "./button.tsx";
import ButtonWithState from "./state.tsx";
import ComponentWithSpread from "./spread-attributes.tsx";
import VisibilityChange from "./change-visibility.tsx";
import VisibilityChangeProp from "./change-visibility-prop.tsx";
import ComponentWithRest from "./rest-attributes.tsx";
import CallMethodInGetterWidget from "./call-method-in-getter.tsx";
import ComponentWithFragment from "./component-with-fragment.tsx";

function view(model: App) { 
    return <div>
        <SimpleComponent width={100} height={100}></SimpleComponent>

        <ButtonComponent
            id="button-1"
            onClick={model.onButtonClick}
        >{"DefaultSlot"}</ButtonComponent>
        <div id="button-1-click-counter">{model.clickCount}</div>

        <ButtonWithState
            id="button-2"
            pressedChange={model.onButtonWithStatePressedChange}></ButtonWithState>
        <div id="button-with-state-pressed">{model.buttonWithStateIsPressed.toString()}</div>

        <ComponentWithSpread containerId="component-with-spread" aria={model.spreadAttributesComponentAria}></ComponentWithSpread>
        <ButtonComponent id="button-3" onClick={model.onChangeAriaButtonClick}>{"Change Aria"}</ButtonComponent>
    
        <VisibilityChange></VisibilityChange>

        <ButtonComponent id="button-4" onClick={model.onVisibilityChangePropClick}>{"Open"}</ButtonComponent>
        <VisibilityChangeProp visible={model.visibilityChangePropValue}></VisibilityChangeProp>

        <ComponentWithRest id="component-with-rest-attributes" label="rest-attributes"></ComponentWithRest>

        <CallMethodInGetterWidget id={"call-method-in-getter-widget"} prop={model.callMethodInGetterWidgetProp}></CallMethodInGetterWidget>
        <ButtonComponent id="button-5" onClick={model.changeCallMethodInGetterWidgetProp}>{"UpdateValue"}</ButtonComponent>
        <div>
            <ComponentWithFragment/>
        </div>
    </div>;
}

@ComponentBindings()
class AppInput { 
    
}

@Component({
    view
})

export default class App extends JSXComponent<AppInput> {
    @InternalState() clickCount: number = 0;
    @InternalState() buttonWithStateIsPressed = false;

    @InternalState() spreadAttributesComponentAria = "init";

    @InternalState() callMethodInGetterWidgetProp = 1;

    onButtonClick() { 
        this.clickCount = this.clickCount + 1;
    }

    onButtonWithStatePressedChange(p:boolean) { 
        this.buttonWithStateIsPressed = p;
    }

    onChangeAriaButtonClick() { 
        this.spreadAttributesComponentAria = "changed"
    }

    changeCallMethodInGetterWidgetProp() { 
        this.callMethodInGetterWidgetProp = 10;
    }

    @InternalState() visibilityChangePropValue: boolean = false;

    onVisibilityChangePropClick() {
        this.visibilityChangePropValue = true;
     }
}
