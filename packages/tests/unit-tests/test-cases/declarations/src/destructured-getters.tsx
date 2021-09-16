import { Component, JSXComponent, ComponentBindings, Method, OneWay, InternalState } from '@devextreme-generator/declarations';
@ComponentBindings()
class WidgetProps {
  @OneWay() someProp: string =''
	@OneWay() type?: string = '';
}
interface FirstGetter {
	field1: string;
	field2: number;
	field3: number;
  }
const view = ()=><div></div>
@Component({view})
class Widget extends JSXComponent(WidgetProps){
	@InternalState() someState: string = '';

	get someObj() {
		return {
			stateField: this.someState,
			propField: this.props.someProp
		};
	}
	get objectFromDestructured() {
		const {stateField , propField} = this.someObj
		return {stateField, propField}
	}

  get arrayFromObj(): (string|undefined)[] {
    const {stateField , propField} = this.someObj
		return [stateField, propField]
  }

  get arrayFromArr(): (string|undefined)[] {
    const [stateField , propField] = this.arrayFromObj
		return [stateField, propField]
  }
  
  get someMethod(): { stateField: string, propField: string } {
   const { stateField, propField } = this.objectFromDestructured;
	 return { stateField, propField }
  }
  
  someMethod2() {
    const state = this.someObj.stateField;
    const prop = this.someObj.propField;
  }
  get someMethod3(): { stateField: string, propField: string } {
		const something = this.someObj
		return something
	}
	@Method()
	changeState(newValue: string) {
		this.someState = newValue;
	}
	get emptyMethod() {
		return ''
	}
}