import { Property as BaseProperty } from "../../../base-generator/expressions/class-members";
import { Identifier } from "../../../base-generator/expressions/common";
import { Decorator } from "../decorator";
import {
  SimpleTypeExpression,
  TypeExpression,
  FunctionTypeNode,
} from "../../../base-generator/expressions/type";
import { Decorators } from "../../../component_declaration/decorators";
import { capitalizeFirstLetter } from "../../../base-generator/utils/string";
import SyntaxKind from "../../../base-generator/syntaxKind";
import {
  Expression,
  SimpleExpression,
} from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../../base-generator/types";

function parseEventType(type: TypeExpression | string) {
  if (type instanceof FunctionTypeNode) {
    const typeList = type.parameters.map((p) => {
      const type = p.type?.toString() || "any";
      if (p.questionToken === SyntaxKind.QuestionToken && type !== "any") {
        return `${type}|${SyntaxKind.UndefinedKeyword}`;
      }
      return type;
    });
    return typeList.length ? `<${typeList}>` : "";
  }
  return "<any>";
}

export class Property extends BaseProperty {
  get name() {
    return this._name.toString();
  }
  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] = [],
    name: Identifier,
    questionOrExclamationToken: string = "",
    type?: TypeExpression | string,
    initializer?: Expression,
    inherited: boolean = false
  ) {
    if (decorators.find((d) => d.name === Decorators.Template)) {
      type = new SimpleTypeExpression(`TemplateRef<any> | null`);
      initializer = new SimpleExpression("null");
    }
    if (!initializer && decorators.find((d) => d.name === Decorators.Event)) {
      initializer = new SimpleExpression("(e: any) => void 0");
    }
    super(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer,
      inherited
    );
  }
  toString() {
    const eventDecorator = this.decorators.find(
      (d) => d.name === Decorators.Event
    );
    const defaultValue = super.toString();
    if (eventDecorator) {
      return `${eventDecorator} ${this.name}:EventEmitter${parseEventType(
        this.type
      )} = new EventEmitter();`;
    }
    if (this.isRef) {
      return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:ElementRef<${this.type}>`;
    }
    if (this._hasDecorator(Decorators.ApiRef)) {
      return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:${this.type}`;
    }
    if (this.isSlot) {
      const selector = `slot${capitalizeFirstLetter(this.name)}`;
      return `__${selector}?: ElementRef<HTMLDivElement>;

            get ${this.name}(){
                return this.__${selector}?.nativeElement?.innerHTML.trim()||"";
            }`;
    }
    if (this.isNestedComp) {
      return `@ContentChildren(${this.type}) ${this.name}!: QueryList<${this.type}>`;
    }

    if (this.isProvider || this.isConsumer) {
      return "";
    }

    if (this.isForwardRefProp) {
      return `${this.modifiers.join(" ")} ${this.decorators
        .map((d) => d.toString())
        .join(" ")} ${this.name}:(ref:any)=>void=()=>{}`;
    }

    if (this.isForwardRef) {
      return `${this.modifiers.join(" ")} ${this.decorators
        .map((d) => d.toString())
        .join(" ")} ${this.name}${this.questionOrExclamationToken}:ElementRef<${
        this.type
      }>`;
    }

    return defaultValue;
  }

  getter(componentContext?: string) {
    componentContext = this.processComponentContext(componentContext);
    if (this.isEvent) {
      return `${componentContext}_${this.name}`;
    }
    if (this.isRef || this.isForwardRef || this.isForwardRefProp) {
      const postfix = this.isForwardRefProp ? "Ref" : "";
      const type = this.type.toString();
      const isElement = type.includes("HTML") && type.includes("Element");
      return `${componentContext}${this.name}${postfix}${
        isElement
          ? `${
              this.questionOrExclamationToken === SyntaxKind.ExclamationToken
                ? ""
                : this.questionOrExclamationToken
            }.nativeElement`
          : ""
      }`;
    }
    if (this.isRefProp) {
      return `${componentContext}${this.name}`;
    }
    if (this.isConsumer) {
      return `${componentContext}${this.name}Consumer`;
    }
    if (this.isProvider) {
      return `${componentContext}${this.name}.value`;
    }
    if (this._hasDecorator(Decorators.ApiRef)) {
      return `${componentContext}${this.name}`;
    }
    return `${componentContext}${this.name}`;
  }

  getDependency(options: toStringOptions) {
    return [this.name];
  }

  inherit() {
    return new Property(
      this.decorators as Decorator[],
      this.modifiers,
      this._name,
      this.questionOrExclamationToken,
      this.type,
      this.initializer,
      true
    );
  }

  get canBeDestructured() {
    if (this.isEvent || this.isNested) {
      return false;
    }
    return super.canBeDestructured;
  }
}
