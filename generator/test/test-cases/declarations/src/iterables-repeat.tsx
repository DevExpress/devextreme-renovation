import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  React,
  TwoWay,
  Method,
  Listen,
  Ref,
} from "../generator/component_declaration/common";

@ComponentBindings()
export class ListInput {
  @OneWay() items?: any[] = [];
  @OneWay() keyExpr?: string = "value";
}

function view(viewModel: List) {
  return (
    <div>
      <div>
        {viewModel.props.items?.map((item: any) => {
          return <div key={item.key}>One - {item.key}</div>;
        })}
      </div>
      <div>
        {viewModel.props.items?.map((item: any) => {
          return <div key={item.key}>Two - {item.key}</div>;
        })}
      </div>
    </div>
  );
}
@Component({ view })
export default class List extends JSXComponent(ListInput) {}
