import { Component, ComponentBindings, JSXComponent, OneWay } from '../../../../component_declaration/common';

@ComponentBindings()
export class ListInput {
  @OneWay() items?: Array<{key: number, text: string}>
}

@Component({
  view
})
export default class List extends JSXComponent(ListInput) {
}

function view(viewModel: List) {
  const items = viewModel.props.items?.map((item: any) => {
    return (
      <div key={item.key}>
          {item.text}
      </div>
    );
  });

  return (
    <div>
        {items}
    </div>
  );
}
