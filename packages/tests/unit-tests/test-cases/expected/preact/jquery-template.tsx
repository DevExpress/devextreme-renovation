import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-template";

export default class Widget extends BaseComponent {
  getProps() {
    const props = super.getProps();
    props.template = this._createTemplateComponent(props, props.template);
    props.anotherTemplate = this._createTemplateComponent(
      props,
      props.anotherTemplate
    );
    return props;
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ["template", "anotherTemplate"],
      props: ["template", "anotherTemplate"],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent("dxWidget", Widget);
