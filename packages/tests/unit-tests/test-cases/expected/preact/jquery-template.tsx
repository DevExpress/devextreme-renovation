import registerComponent from "../../../../jquery-helpers/jquery_component_registrator";
import BaseComponent from "../../../../jquery-helpers/jquery_base_component";
import WidgetComponent from "../../../../jquery-template";

export default class Widget extends BaseComponent {
  getProps() {
    const props = super.getProps();
    props.template = this.componentTemplates.template;
    props.anotherTemplate = this.componentTemplates.anotherTemplate;
    return props;
  }

  _optionChanged(option) {
    const { name, value } = option;
    if (name === "template") {
      this.componentTemplates.template = this._createTemplateComponent(value);
    }
    if (name === "anotherTemplate") {
      this.componentTemplates.anotherTemplate = this._createTemplateComponent(
        value
      );
    }
    super._optionChanged(option);
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
