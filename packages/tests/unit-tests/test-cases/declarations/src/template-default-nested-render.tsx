import {
    Component,
    JSXComponent,
    Fragment,
    ComponentBindings,
    Template,
    JSXTemplate,
    OneWay,
  } from '@devextreme-generator/declarations';
import { WidgetWithProps } from './dx-widget-with-props';
import { PublicWidgetWithProps, WidgetWithPropsInput } from './dx-public-widget-with-props';
  
export const viewFunction = ({
  props: {
    cellTemplate: Cell,
    rows
  },
}: DateTableBody): JSX.Element => (
<Fragment>
    {rows.map((cells) => (
    <WidgetWithProps>
        {cells.map((value) => (
        <Cell
            value={value}
        />
        ))}
    </WidgetWithProps>
    ))}
</Fragment>
);

@ComponentBindings()
export class DateTableBodyProps {
  @Template() cellTemplate: JSXTemplate<WidgetWithPropsInput> = PublicWidgetWithProps;

  @OneWay() rows: string[][] = [];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableBody extends JSXComponent<DateTableBodyProps, 'cellTemplate'>() {
}
  