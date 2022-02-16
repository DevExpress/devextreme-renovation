import {
  Component, ComponentBindings, Effect, JSXComponent, React, TwoWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: First): JSX.Element => (
  <div>
    {viewModel.currentDateGetter.toLocaleString()}
  </div>

);

@ComponentBindings()
export class FirstProps {
  @TwoWay() currentDate = new Date();
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export default class First extends JSXComponent(FirstProps) {
  get currentDateGetter(): Date {
    return this.props.currentDate;
  }

  @Effect({ run: 'once' })
  clickEffect(): void {
    this.props.currentDate = new Date(2023, 1, 12);
  }
}
