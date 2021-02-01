import {
  ComponentBindings,
  Nested,
  OneWay,
} from "../../component_declaration/common";

@ComponentBindings()
export class Configs {
  @OneWay() prop1?: string = "prop1default";
  @OneWay() prop2?: string = "prop2default";
}

@ComponentBindings()
export class WithNestedTestInputProps {
  @Nested() parents?: Configs[];
}
