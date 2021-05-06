import {
    ComponentBindings,
    Nested,
    OneWay,
    TwoWay,
} from "@devextreme-generator/declarations";

@ComponentBindings()
export class FakeNested {
  @OneWay() baseProp = 0;
}

@ComponentBindings()
export class WidgetProps {
  @OneWay() baseProp = 0;
  @Nested() someProp: FakeNested = new FakeNested();
}
@ComponentBindings()
export class TooltipProps {
  @OneWay() tooltipValue = 0;
  @Nested() tooltipNested: WidgetProps[] = [new WidgetProps()];
}
@ComponentBindings()
export class BulletProps extends WidgetProps {
  @OneWay() value = 0;

  @Nested() tooltip?: TooltipProps = new TooltipProps();
}

@ComponentBindings()
export class BulletProps2 extends BulletProps {
  @Nested() fakeNestedArr: FakeNested[] = [new FakeNested()];
}

@ComponentBindings()
export class BulletProps3 extends BulletProps2 {
  @Nested() fakeNestedArr2: FakeNested[] = [new FakeNested()];
}