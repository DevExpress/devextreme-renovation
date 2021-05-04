import {
  Component,
  Template,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "@devextreme-generator/declarations";

const loadingJSX = ({ text }: any) => {
  return <div>{text}</div>;
};

function infoJSX(text: string, name: string) {
  return <span>{`${text} ${name}`}</span>;
}

@ComponentBindings()
export class WidgetInput {
  @OneWay() loading: boolean = true;
  @OneWay() greetings: string = "Hello";
}

@Component({
  view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
  get loadingProps() {
    return { text: "Loading..." };
  }
  get name() {
    return "User";
  }
}

function view(viewModel: Widget):JSX.Element|null {
  const MyComponent = viewModel.props.loading
    ? loadingJSX(viewModel.loadingProps)
    : infoJSX(viewModel.props.greetings, viewModel.name);
  return <div>{MyComponent}</div>;
}
