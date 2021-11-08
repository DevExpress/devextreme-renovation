import { Component, JSXComponent, ComponentBindings, Method, OneWay, InternalState } from '@devextreme-generator/declarations';
@ComponentBindings()
class WidgetProps {
  @OneWay() someProp: string =''
	@OneWay() type?: string = '';
	@OneWay() objectProp?: {someField: number};
}
interface FirstGetter {
	field1: string;
	field2: number;
	field3: number;
}
interface GetterType {
	stateField: string,
	propField: string
}
const view = ()=><div></div>
@Component({view})
class Widget extends JSXComponent(WidgetProps){
	@InternalState() someState: string = '';

  get arrayFromObj(): (string|undefined)[] {
    const {stateField , propField} = this.someObj
		return [stateField, propField]
  }

  get arrayFromArr(): (string|undefined)[] {
    const [stateField , propField] = this.arrayFromObj
		return [stateField, propField]
  }
	get someObj(): GetterType {
  	return {
    	stateField: this.someState,
    	propField: this.props.someProp
  	};
	}

	get objectFromDestructured(): GetterType {
		const {stateField , propField} = this.someObj
		return {stateField, propField}
	}

	get someGetter(): GetterType | undefined {
		const { stateField: stateField2 , propField } = this.someObj;
		return {stateField: stateField2 , propField  }
	}

	someMethodFromDestructured(): GetterType {
		const { stateField , propField } = this.objectFromDestructured;
		return {stateField, propField}
	}
  @Method()
  changeState(newValue: string) {
    this.someState = newValue;
  }
}
