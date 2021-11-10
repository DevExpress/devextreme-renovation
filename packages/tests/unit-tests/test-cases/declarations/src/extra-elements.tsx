import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    Ref,
    RefObject,
  } from '@devextreme-generator/declarations';
  import { InnerLayout as Child } from './inner-layout';
  
  export const viewFunction = ( model: ExtraElement): JSX.Element => (
    <pre>
        {model.props.rf && <Child ref={model.props.rf} prop={3}/>}
        <div id="firstDiv"></div>
        <Child ref={model.props.rf} prop={4}></Child>
        <div id="secondDiv"/>
        <Child prop={2}/>
        <div id="thirdDiv"></div>
        <Child prop={1}></Child>
    </pre>
  );
  
  @ComponentBindings()
  export class Props {
    @OneWay() prop = 0;
    @Ref() rf?: RefObject<Child>;
  } 
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
    jQuery: {register: true},
  })
  export class ExtraElement extends JSXComponent(Props) {}
  