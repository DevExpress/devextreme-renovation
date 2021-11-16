import { Component, JSXComponent, ComponentBindings, Method, OneWay, InternalState, TwoWay } from '@devextreme-generator/declarations';
import { 
	InterfaceTemplateInput as externalInterface,
	Options as externalType,
} from './types.d'
@ComponentBindings()
class WidgetProps {
  @OneWay() someProp: string =''
	@OneWay() type?: string = '';
	@TwoWay() currentDate: Date | number | string = new Date();
}
interface internalInterface {
	field1: {a: string};
	field2: number;
	field3: number;
}
type internalType = {
	a: string;
}
const view = ()=><div></div>
@Component({view})
class Widget extends JSXComponent(WidgetProps){
	get internalInterfaceGetter(): internalInterface {
		return {
			field1: {a: this.props.someProp},
			field2: 2,
			field3: 3,
			}
	}
	get internalTypeGetter(): internalType {
		return {a: '1'}
	}
	get externalInterfaceGetter(): externalInterface {
		return {inputInt: 2}
	}
	get externalTypeGetter(): externalType {
		return {value: ''}
	}
	get someDate(): Date {
    return new Date(this.props.currentDate);
  }
}