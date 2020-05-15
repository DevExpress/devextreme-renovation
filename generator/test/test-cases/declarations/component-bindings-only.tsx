import { OneWay, ComponentBindings } from "../../../component_declaration/common";

@ComponentBindings()
export default class WidgetProps { 
    @OneWay() height?: number = 10;
}
