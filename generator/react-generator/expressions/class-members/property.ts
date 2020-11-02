import { Property as BaseProperty } from "../../../base-generator/expressions/class-members";
import { Decorators } from "../../../component_declaration/decorators";
import SyntaxKind from "../../../base-generator/syntaxKind";
import {
  compileType,
  capitalizeFirstLetter,
} from "../../../base-generator/utils/string";
import { toStringOptions } from "../../../base-generator/types";
import { Identifier } from "../../../base-generator/expressions/common";
import { TypeExpression } from "../../../base-generator/expressions/type";
import {
  compileJSXTemplateProps,
  TypeReferenceNode,
} from "../type-refence-node";

export function getLocalStateName(
  name: Identifier | string,
  componentContext: string = ""
) {
  return `${componentContext}__state_${name}`;
}

export function getPropName(
  name: Identifier | string,
  componentContext: string = "",
  scope = "props."
) {
  return `${componentContext}${scope}${name}`;
}

export function stateSetter(stateName: Identifier | string) {
  return `__state_set${capitalizeFirstLetter(stateName)}`;
}

export function compileJSXTemplateType(
  type: string | TypeExpression,
  isComponent = false
) {
  if (
    type instanceof TypeReferenceNode &&
    type.typeName.toString() === "JSXTemplate"
  ) {
    return `React.${
      isComponent ? "JSXElementConstructor" : "FunctionComponent"
    }<${compileJSXTemplateProps(type.typeArguments)}>`;
  }

  return type;
}

export class Property extends BaseProperty {
  REF_OBJECT_TYPE = "MutableRefObject";

  defaultProps() {
    return this.defaultDeclaration();
  }

  compileTypeDeclarationType(type: string | TypeExpression) {
    return compileType(
      type.toString(),
      this.questionOrExclamationToken === SyntaxKind.ExclamationToken
        ? ""
        : this.questionOrExclamationToken
    );
  }

  typeDeclaration() {
    let type = this.type;

    if (this.isSlot) {
      type = "React.ReactNode";
    }
    if (
      this.decorators.find(
        (d) =>
          d.name === Decorators.Ref ||
          d.name === Decorators.ApiRef ||
          d.name === Decorators.ForwardRef
      )
    ) {
      type = "any";
    }
    if (this.isRefProp || this.isForwardRefProp) {
      type = `${this.REF_OBJECT_TYPE}<${this.type}>`;
    }
    let name = this.name;
    if (this.isRef || this.isForwardRef || this.isApiRef) {
      name = this._name.toString();
    }

    return `${name}${this.compileTypeDeclarationType(type)}`;
  }

  getter(componentContext?: string, keepRef: boolean = false) {
    componentContext = this.processComponentContext(componentContext);
    const scope = this.processComponentContext(this.scope);
    if (this.isInternalState) {
      return getLocalStateName(this.name, componentContext);
    } else if (
      this.decorators.some(
        (d) =>
          d.name === Decorators.OneWay ||
          d.name === Decorators.Event ||
          d.name === Decorators.Template ||
          d.name === Decorators.Slot
      )
    ) {
      return getPropName(this.name, componentContext, scope);
    } else if (
      this.decorators.some(
        (d) =>
          d.name === Decorators.Ref ||
          d.name === Decorators.ForwardRef ||
          d.name === Decorators.ApiRef ||
          d.name === Decorators.RefProp ||
          d.name === Decorators.ForwardRefProp
      )
    ) {
      if (componentContext === "") {
        if (keepRef && this.isForwardRefProp) {
          return `${scope}${this.name}`;
        }
        return `${scope}${this.name}${
          scope ? this.questionOrExclamationToken : ""
        }.current!`;
      }
      return getPropName(this.name, componentContext, scope);
    } else if (this.isState) {
      const propName = getPropName(this.name, componentContext, scope);
      return `(${propName}!==undefined?${propName}:${getLocalStateName(
        this.name,
        componentContext
      )})`;
    } else if (this.isNested) {
      return `__getNested${capitalizeFirstLetter(this.name)}()`;
    } else if (this.isProvider || this.isConsumer) {
      return this.name;
    }
    throw `Can't parse property: ${this._name}`;
  }

  getDependency(options: toStringOptions) {
    if (this.isInternalState) {
      return [getLocalStateName(this.name)];
    } else if (
      this.decorators.some(
        (d) =>
          d.name === Decorators.OneWay ||
          d.name === Decorators.Event ||
          d.name === Decorators.Template ||
          d.name === Decorators.Slot
      )
    ) {
      return [getPropName(this.name)];
    } else if (
      this.decorators.some(
        (d) =>
          d.name === Decorators.Ref ||
          d.name === Decorators.ForwardRef ||
          d.name === Decorators.ApiRef ||
          d.name === Decorators.RefProp ||
          d.name === Decorators.ForwardRefProp
      )
    ) {
      const scope = this.processComponentContext(this.scope);
      return this.questionOrExclamationToken === "?"
        ? [
            `${scope}${this.name.toString()}${
              scope ? this.questionOrExclamationToken : ""
            }.current`,
          ]
        : [];
    } else if (this.isState) {
      return [getPropName(this.name), getLocalStateName(this.name)];
    } else if (this.isNested) {
      return [getPropName(this.name), getPropName("children")];
    } else if (this.isProvider || this.isConsumer) {
      return [this.name];
    }
    throw `Can't parse property: ${this._name}`;
  }

  inherit() {
    return new Property(
      this.decorators,
      this.modifiers,
      this._name,
      this.questionOrExclamationToken,
      this.type,
      this.initializer,
      true
    );
  }

  toString(options?: toStringOptions) {
    if (!options) {
      return super.toString();
    }
    const type = `${this.type}${
      this.questionOrExclamationToken === SyntaxKind.QuestionToken
        ? " | undefined"
        : ""
    }`;
    if (this.isState) {
      const propName = getPropName(this.name);
      const defaultExclamationToken =
        this.initializer &&
        this.questionOrExclamationToken !== SyntaxKind.QuestionToken
          ? SyntaxKind.ExclamationToken
          : "";

      return `const [${getLocalStateName(this.name)}, ${stateSetter(
        this.name
      )}] = useState<${type}>(()=>${propName}!==undefined?${propName}:props.default${capitalizeFirstLetter(
        this.name
      )}${defaultExclamationToken})`;
    }

    if (this.isConsumer) {
      return `const ${this.name} = useContext(${this.context})`;
    }

    if (this.isProvider) {
      return `const [${this.name}] = useState(${this.initializer})`;
    }

    return `const [${getLocalStateName(this.name)}, ${stateSetter(
      this.name
    )}] = useState<${type}>(${this.initializer})`;
  }

  get canBeDestructured() {
    if (
      this.isState ||
      this.isRefProp ||
      this.isNested ||
      this.isForwardRefProp
    ) {
      return false;
    }
    return super.canBeDestructured;
  }
}
