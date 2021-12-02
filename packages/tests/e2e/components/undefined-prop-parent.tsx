import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    TwoWay,
  } from '@devextreme-generator/declarations';
  import { InnerTest } from './undefined-prop-child';
  
  export function viewFunction (viewModel: Test) {
    return <InnerTest
        oneWayProp={viewModel.props.oneWayProp} // override InnerTest.array default = []
        twoWayProp={viewModel.props.twoWayProp}
      />
  }
  
  @ComponentBindings()
  export class TestProps {
    @OneWay() oneWayProp?: string;
    @TwoWay() twoWayProp?: string;
  }
  
  @Component({
    jQuery: {
      register: true,
    },
    view: viewFunction,
  })
  
  export default class Test extends JSXComponent(TestProps) {}