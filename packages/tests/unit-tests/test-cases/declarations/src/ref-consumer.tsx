import {
  Component,
  ComponentBindings,
  JSXComponent,
  Provider,
  OneWay,
  createContext,
} from "@devextreme-generator/declarations";
export const SimpleContext = createContext<number>(10);

function view(model: GetterProvider) {
  return (
    <div id="context-getter-provider">
    </div>
  );
}

@ComponentBindings()
class Props {
  @OneWay() p = 0;
}

@Component({
  view,
})
export default class GetterProvider extends JSXComponent(Props) {
  @Provider(SimpleContext)
  get provide() {
    return this.props.p;
  }
}
