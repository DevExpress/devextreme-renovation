import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from "../../../component_declaration/common";

function view({
  props: {
    optionalBoolean,
    booleanWithDefault,
    numberWithDefault,
    optionalNumber,
    optionalBooleanOrNumber,
  },
  booleanPropsInRest,
}: DefaultPropsComponent) {
  return (
    <div>
      <span className="default-props-optional-boolean">
        {optionalBoolean + ""}
      </span>
      <span className="default-props-boolean-with-default">
        {booleanWithDefault + ""}
      </span>

      <span className="default-props-optional-number">
        {optionalNumber + ""}
      </span>
      <span className="default-props-number-with-default">
        {numberWithDefault + ""}
      </span>

      <span className="default-props-optional-boolean-or-number">
        {optionalBooleanOrNumber + ""}
      </span>

      <span className="default-props-optional-boolean-in-rest">
        {booleanPropsInRest.optionalBoolean + ""}
      </span>
    </div>
  );
}

@ComponentBindings()
class Props {
  @OneWay() optionalBoolean?: boolean;
  @OneWay() booleanWithDefault = false;

  @OneWay() optionalNumber?: number;
  @OneWay() numberWithDefault: number = 1;

  @OneWay() optionalBooleanOrNumber?: boolean | number;
}

@Component({
  view,
})
export default class DefaultPropsComponent extends JSXComponent(Props) {
  get booleanPropsInRest(): {
    optionalBoolean: boolean;
  } {
    const {
      optionalBooleanOrNumber,
      optionalNumber,
      numberWithDefault,
      booleanWithDefault,
      ...rest
    } = this.props;
    return {
      optionalBoolean: false,
      ...rest,
    };
  }
}
