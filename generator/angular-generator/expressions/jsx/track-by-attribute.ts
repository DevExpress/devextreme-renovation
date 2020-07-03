import { JsxAttribute } from "./attribute";
import { Identifier } from "../../../base-generator/expressions/common";
import { SimpleExpression } from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../types";
import SyntaxKind from "../../../base-generator/syntaxKind";

export class TrackByAttribute extends JsxAttribute {
  indexName: string;
  itemName: string;
  trackByExpressionString: string;
  constructor(
    name: Identifier,
    trackByExpressionString: string,
    indexName: string,
    itemName: string
  ) {
    super(name, new SimpleExpression(SyntaxKind.NullKeyword));
    this.indexName = indexName;
    this.itemName = itemName;
    this.trackByExpressionString = trackByExpressionString;
  }

  toString(options?: toStringOptions) {
    return "";
  }

  getTrackByDeclaration(): string {
    return `${this.name}(${this.indexName || "_index"}: number, ${
      this.itemName
    }: any){
            return ${this.trackByExpressionString};
        }`;
  }
}
