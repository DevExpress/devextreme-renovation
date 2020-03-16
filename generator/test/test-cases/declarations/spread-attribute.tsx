import { Component, ComponentBindings, JSXComponent, Ref } from "../../../component_declaration/common";

function view(model: Widget) { 
    return <div ref={model.host as any} {...model.attr1}>
        <input {...model.attr2}/>
    </div>;
}

@ComponentBindings()
export class WidgetInput {}

@Component({
    view: view
})
export default class Widget extends JSXComponent<WidgetInput> {
    @Ref() host?: HTMLDivElement;
            
    get attr1() { 
        return {}
    }
          
    get attr2() { 
        return {}
    }
}
