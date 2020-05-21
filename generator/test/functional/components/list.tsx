import { Component, ComponentBindings, JSXComponent, Event, Slot, Effect, Ref, OneWay } from "../../../component_declaration/common";

function view(model: List) { 
    return <div>
        {model.props.items.map(item =>
            <div style={model.style("red")} key={item.key}>{item.text}</div>
        )}
        {model.props.items.map((item, index) =>
            <div style={model.style("green")} key={index}>{item.text}</div>
        )}

        {model.props.items.map(({text, key}) =>
            <div style={model.style("blue")} key={key}>{text}</div>
        )}

        {model.props.items.map(({ text, key }) => {
            const value = `${key}: ${text} `;
            return value;
        } )}
    </div>;
}

@ComponentBindings()
export class ListProps { 
    @OneWay() items?: {
        text: string;
        key: number
    }[] = [];
}

@Component({
    view
})
export default class List extends JSXComponent<ListProps> {
    style(color: string) { 
        return {
            backgroundColor: color,
            margin: 2,
            fontSize: 18,
            display: "inline-block",
            color: "white",
        };
    }
}
