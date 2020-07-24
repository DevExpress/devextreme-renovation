import { Property as BaseProperty } from "../../../base-generator/expressions/class-members";
import { Identifier } from "../../../base-generator/expressions/common";
import { Decorator } from "../decorator";
import {
  SimpleTypeExpression,
  isTypeArray,
  TypeExpression,
  FunctionTypeNode,
} from "../../../base-generator/expressions/type";
import { Decorators } from "../../../component_declaration/decorators";
import {
  capitalizeFirstLetter,
  compileType,
} from "../../../base-generator/utils/string";
import SyntaxKind from "../../../base-generator/syntaxKind";
import { Expression } from "../../../base-generator/expressions/base";
import syntaxKind from "../../../base-generator/syntaxKind";

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
      type = new SimpleTypeExpression(`TemplateRef<any>`);
      if (questionOrExclamationToken !== SyntaxKind.QuestionToken) {
        questionOrExclamationToken = SyntaxKind.ExclamationToken;
      }
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
  typeDeclaration() {
    return `${this.name}${this.questionOrExclamationToken}:${this.type}`;
  }
  toString() {
    const eventDecorator = this.decorators.find(
      (d) => d.name === Decorators.Event
    );
    const defaultValue = super.toString();
    if (eventDecorator) {
      return `${eventDecorator} ${this.name}:EventEmitter${parseEventType(
        this.type
      )} = new EventEmitter();
      _${this.name}${compileType(
        this.type.toString(),
        syntaxKind.ExclamationToken
      )}`;
    }
    if (this.isRef) {
      return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:ElementRef<${this.type}>`;
    }
    if (this._hasDecorator(Decorators.ApiRef)) {
      return `@ViewChild("${this.name}", {static: false}) ${this.name}${this.questionOrExclamationToken}:${this.type}`;
    }
    if (this.isSlot) {
      const selector = `slot${capitalizeFirstLetter(this.name)}`;
      return `@ViewChild("${selector}") ${selector}?: ElementRef<HTMLDivElement>;

            get ${this.name}(){
                return this.${selector}?.nativeElement?.innerHTML.trim();
            }`;
    }
    if (this.isNestedComp) {
      return `@ContentChildren(${this.type}) ${this.name}!: QueryList<${this.type}>`;
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
    const suffix = this.required ? "!" : "";
    componentContext = this.processComponentContext(componentContext);
    if (this.isEvent) {
      return `${componentContext}_${this.name}`;
    }
    if (this.isRef || this.isForwardRef || this.isForwardRefProp) {
      const postfix = this.isForwardRefProp ? "Ref" : "";
      const type = this.type.toString();
      const isElement = type.startsWith("HTML") && type.endsWith("Element");
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
    if (this.isNested) {
      const indexGetter = isTypeArray(this.type) ? "" : "?.[0]";
      return `(${componentContext}${this.name} || ${componentContext}${this.name}Nested.toArray()${indexGetter})`;
    }
    if (this._hasDecorator(Decorators.ApiRef)) {
      return `${componentContext}${this.name}${suffix}`;
    }
    return `${componentContext}${this.name}${suffix}`;
  }

  getDependency() {
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
