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
interface GetterType {
	stateField: string,
	propField: string
}
const view = ()=><div></div>
@Component({view})
class Widget extends JSXComponent(WidgetProps){
	@InternalState() someState: string = '';

// 	get someObj() {
// 		return {
// 			stateField: this.someState,
// 			propField: this.props.someProp
// 		};
// 	}
// 	get objectFromDestructured() {
// 		const {stateField , propField} = this.someObj
// 		return {stateField, propField}
// 	}
// 	//[someObj.statefield, someObj.propField]
// 	// ngOnChanges(changes){ if (["statefield", "propfield"] in changes) {this.gettercahce[]}}
// 	// componentWillupdate
//   get arrayFromObj(): (string|undefined)[] {
//     const {stateField , propField} = this.someObj
// 		return [stateField, propField]
// 		// [someobj.statefield, someobj.propfield]
//   }

//   get someObj2() {
// 	return {
// 		stateField: [this.someState, this.props.someProp],
// 		propField: this.newGetter
// 	};
// 	//[someState, someProp, newGetter]
// }
//   get arrayFromObj2(): (string|undefined)[] {
//     const {stateField} = this.someObj2
// 	return stateField;

// 		// [someobj2]
// 		// {name: this.someObj2.stateField, owner:}
//   }
//   get newGetter(){
// 	  return this.props.someProp
//   }

//   get arrayFromArr(): (string|undefined)[] {
//     const [stateField , propField] = this.arrayFromObj
// 		return [stateField, propField]
//   }

//   get someMethod(): { stateField: string, propField: string } {
//    const { stateField, propField } = this.objectFromDestructured;
// 	 return { stateField, propField }
//   }

//   someMethod2() {
//     const state = this.someObj.stateField;
//     const prop = this.someObj.propField;
//   }
//   get someMethod3(): { stateField: string, propField: string } {
// 		const something = this.someObj
// 		return something
// 	}
// 	@Method()
// 	changeState(newValue: string) {
// 		this.someState = newValue;
// 	}
// 	get emptyMethod() {
// 		return ''
// 	}
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

	someMethod1() {
	const { stateField: stateField2 , propField } = this.someObj;
	// There is no dependencies [this.somestate, this.props.someProp]
	}

	someMethodFromDestructured(): GetterType {
		const { stateField , propField } = this.objectFromDestructured;
		return {stateField, propField}
	}

	someMethod2() {
		const state = this.someObj.stateField;
		const prop = this.someObj.propField;
	// There is we have dependencies [this.somestate, this.props.someProp]
	}

  @Method()
  changeState(newValue: string) {
    this.someState = newValue;
  }
}