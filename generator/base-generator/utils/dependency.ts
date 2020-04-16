import { Expression } from "../expressions/base";
import { BaseClassMember } from "../expressions/class-members";

export function checkDependency(expression: Expression, properties: Array<BaseClassMember>=[]) {
    const dependency = expression.getAllDependency().reduce((r: { [name: string]: boolean }, d) => {
        r[d] = true;
        return r;
    }, {});

    return properties.find(s => dependency[s.name.toString()]);
}
