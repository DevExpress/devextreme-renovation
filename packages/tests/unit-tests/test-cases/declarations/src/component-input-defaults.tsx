import {
  OneWay,
  Nested,
  JSXComponent,
  Component,
  ComponentBindings,
  Template,
  JSXTemplate,
} from "@devextreme-generator/declarations";

function view(model: Widget) {
  return <div></div>;
}

function isMaterial() {
  return true;
}

function format(key: string) {
  return 'localized_' + key;
}

@ComponentBindings()
export class BaseProps {
  @OneWay() empty?: string;
  @OneWay() height?: number = 10;
  @OneWay() width?: number = isMaterial() ? 20 : 10;
  @Nested() baseNested?: TextsProps = new TextsProps();
}

@ComponentBindings()
export class TextsProps {
  @OneWay() text?: string = format('text');
}

@ComponentBindings()
export class WidgetProps extends BaseProps {
  @OneWay() text?: string = format('text');
  @OneWay() texts1?: TextsProps = {
    text: format('text')
  }
  @Nested() texts2?: TextsProps = {
    text: format('text')
  }
  @Nested() texts3?: TextsProps = new TextsProps();

  @Template() someTemplate?: JSXTemplate<void> = () => <div></div>;
}

@ComponentBindings()
export class PickedProps {
  @OneWay() someValue?: string = format('text');
}

export type WidgetTypeProps = WidgetProps & Pick<PickedProps, 'someValue'>;
@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetProps) {
}
