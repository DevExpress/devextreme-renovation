import {
    Component,
    ComponentBindings,
    JSXComponent,
    JSXTemplate,
    Template,
  } from '@devextreme-generator/declarations';
  import { SimpleSlot } from '../slot/simple-slot';
  import { SecondComponent, SecondComponentProps } from './second-component';
  
  export interface ComplexData {
    a: string;
  }
  
  export const viewFunction = ({
    complexData,
    props: {
      secondComponentTemplate: SecondComponentTemplate,
    },
  }: FirstComponent) => (
    <div>
      {complexData.map((data1) => (
        <SimpleSlot>
          {data1.map(({
            data,
          }) => <SecondComponentTemplate complexData={data} />)}
        </SimpleSlot>
      ))}
    </div>
  );
  
  @ComponentBindings()
  export class FirstComponentProps {
    @Template() secondComponentTemplate: JSXTemplate<SecondComponentProps> = SecondComponent;
  }
  
  @Component({
    defaultOptionRules: null,
    jQuery: { register: true },
    view: viewFunction,
  })
  
  export default class FirstComponent extends JSXComponent(FirstComponentProps) {
    get complexData(): {
      data: ComplexData | undefined;
    }[][] {
      return [[{ data: undefined }]];
    }
  }
