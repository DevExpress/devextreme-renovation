import { ComponentBindings, TwoWay, OneWay } from '@devextreme-generator/declarations';

@ComponentBindings()
class BaseProps {
    @OneWay() p1 = value;
    @OneWay() p2 = value;
    @OneWay() p3;
}
@ComponentBindings()
class Props2 {
    @TwoWay() p3 = value;
    @OneWay() p4 = value;
}
type Props = BaseProps & Props2;