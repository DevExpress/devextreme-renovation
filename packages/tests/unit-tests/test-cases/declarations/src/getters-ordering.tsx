import { Component, JSXComponent, ComponentBindings, Method, OneWay, Effect } from '@devextreme-generator/declarations';

@ComponentBindings()
class WidgetProps {
    @OneWay() someProp: string =''
	@OneWay() type?: string = '';

}
const view = ()=><div></div>
@Component({view})
class Widget extends JSXComponent(WidgetProps){
    get g7(){
        return this.g6
    }
    get g5(): (string|undefined)[]{
        return [...this.g3(), this.g2]      
    }
	get g1(){
        return this.props.someProp
    }
    get g2(){
        return this.props.type
    }
    @Method()
    g3(): (string|undefined)[]{
        return [this.g1, this.g2]
    }
    get g4(): (string|undefined)[]{
        return [...this.g3(), this.g1]
    }

    get g6(): (string|undefined)[]{
        return [...this.g5, ...this.g4]
    }

    @Effect()
    someEffect() {
      return ()=>(this.g7)
    }
}