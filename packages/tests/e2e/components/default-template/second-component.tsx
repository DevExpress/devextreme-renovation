import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
  } from '@devextreme-generator/declarations';
  export interface ComplexData {
    a: string;
  }
  
  export const viewFunction = (viewModel: SecondComponent): JSX.Element => (
    <div id="defaultTemplateMap">
      {viewModel.props.complexData!.a}
    </div>
  );
  
  @ComponentBindings()
  export class SecondComponentProps {
    @OneWay() complexData?: ComplexData = { a: 'Default value with map' };
  }
  
  @Component({
    defaultOptionRules: null,
    view: viewFunction,
  })
  
  export class SecondComponent extends JSXComponent(SecondComponentProps) {}
