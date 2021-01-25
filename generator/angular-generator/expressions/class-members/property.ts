import { Property as BaseProperty } from "../../../base-generator/expressions/class-members";
import { Identifier } from "../../../base-generator/expressions/common";
import { Decorator } from "../decorator";
import {
  TypeExpression,
  FunctionTypeNode,
} from "../../../base-generator/expressions/type";
import { Decorators } from "../../../component_declaration/decorators";
import {
  capitalizeFirstLetter,
  compileType,
} from "../../../base-generator/utils/string";
import SyntaxKind from "../../../base-generator/syntaxKind";
import {
  Expression,
  SimpleExpression,
} from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../types";

function parseEventType(type: TypeExpression | string) {
  if (type instanceof FunctionTypeNode) {
    const typeList = type.parameters.map((p) => {
      const type = p.type?.toString() || "any";
      if (p.questionToken === SyntaxKind.QuestionToken && type !== "any") {
        return `${type}|${SyntaxKind.UndefinedKeyword}`;
      }
      return type;
    });
    return typeList.length ? `<${typeList}>` : "<void>";
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
      questionOrExclamationToken =
        questionOrExclamationToken === SyntaxKind.ExclamationToken
          ? ""
          : questionOrExclamationToken;
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
  toString(options?: toStringOptions) {
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
      const decoratorString =
        !options?.forwardRefs?.some(
          (forwardRef) => `${forwardRef.name}Ref` === this.name
        ) &&
        options?.members
          .filter((m) => m.isForwardRefProp || m.isForwardRef)
          .some((forwardRef) => `${forwardRef.name}Ref` === this.name)
          ? ""
          : `@ViewChild("${this.name}", {static: false}) `;
      return `${decoratorString}${this.name}${this.questionOrExclamationToken}:ElementRef<${this.type}>`;
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
      const type = `ElementRef<${this.type}>`;
      const returnType = `${type}${
        this.questionOrExclamationToken === SyntaxKind.QuestionToken
          ? "|undefined"
          : ""
      }`;
      return `${this.modifiers.join(" ")} ${this.decorators
        .map((d) => d.toString())
        .join(" ")} ${this.name}${
        this.questionOrExclamationToken
      }:(ref?:${type})=>${returnType}`;
    }

    if (this.isForwardRef) {
      return `${this.modifiers.join(" ")} ${this.decorators
        .map((d) => d.toString())
        .join(" ")} ${this.name}${this.questionOrExclamationToken}:ElementRef<${
        this.type
      }>`;
    }

    if (this.isTemplate) {
      return `${this.modifiers.join(" ")} ${this.decorators
        .map((d) => d.toString())
        .join(" ")} ${this.typeDeclaration()} = null`;
    }
    return defaultValue;
  }

  getter(componentContext?: string, keepRef: boolean = false) {
    componentContext = this.processComponentContext(componentContext);
    if (this.isEvent) {
      return `${componentContext}_${this.name}`;
    }
    if (this.isRef || this.isForwardRef || this.isForwardRefProp) {
      if (keepRef) {
        return `${componentContext}${this.name}`;
      }
      const postfix = this.isForwardRefProp ? "Ref" : "";
      if (this.isForwardRefProp) {
        return `${componentContext}${this.name}?.()`;
      }
      return `${componentContext}${this.name}${postfix}`;
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

  typeDeclaration(): string {
    if (this.isTemplate) {
      return `${this.name}${compileType(
        `TemplateRef<any> | null`,
        this.questionOrExclamationToken
      )}`;
    }
    return super.typeDeclaration();
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
    if (
      this.isEvent ||
      this.isNested ||
      this.isForwardRefProp ||
      this.isRef ||
      this.isRefProp ||
      this.isForwardRef
    ) {
      return false;
    }
    return super.canBeDestructured;
  }
}
