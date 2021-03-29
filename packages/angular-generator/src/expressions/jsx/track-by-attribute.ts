import {
  Identifier,
  SimpleExpression,
  SyntaxKind,
} from "@devextreme-generator/core";
import { toStringOptions } from "../../types";
import { JsxAttribute } from "./attribute";

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

  toString(_options?: toStringOptions) {
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
