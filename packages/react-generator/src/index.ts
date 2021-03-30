import { ReactGenerator } from './react-generator';

export { ReactGenerator };
export * from "./expressions/class-members/get-accessor";
export * from "./expressions/class-members/method";
export * from "./expressions/class-members/property";
export * from "./expressions/heritage-clause"
export * from "./expressions/jsx/jsx-attribute";
export * from "./expressions/jsx/jsx-closing-element";
export * from "./expressions/jsx/jsx-opening-element";
export * from "./expressions/property-access";
export * from "./expressions/react-component-input";
export * from "./expressions/react-component";
export * from "./expressions/type-reference-node";

export default new ReactGenerator();
