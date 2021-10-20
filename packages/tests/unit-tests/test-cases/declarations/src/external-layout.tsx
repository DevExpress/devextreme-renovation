import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';
import { InnerLayout } from './inner-layout';
import { InnerComponent } from './inner-component';

export const viewFunction = (): JSX.Element => (
  <InnerLayout
    innerComponentTemplate={InnerComponent}
  />
);

@ComponentBindings()
export class Props {
  @OneWay() prop = 0;
} 

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ExternalLayout extends JSXComponent(Props) {}
