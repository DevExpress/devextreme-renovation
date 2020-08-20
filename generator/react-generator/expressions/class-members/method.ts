import { Property, getLocalStateName } from "./property";
import { Method as BaseMethod } from "../../../base-generator/expressions/class-members";

export function calculateMethodDependency(
  dependency: string[],
  members: Array<Property | Method>
): string[] {
  const twoWayProps = members.filter((m) => m.isState);
  if (twoWayProps.length && dependency.indexOf("props") !== -1) {
    return [
      ...new Set(
        dependency.concat(
          twoWayProps.map((m) => `${getLocalStateName(m.name)}`)
        )
      ),
    ];
  }
  return dependency;
}

export class Method extends BaseMethod {
  filterDependencies(dependencies: string[]): string[] {
    return dependencies.filter((d) => d !== "props");
  }

  getDependency(members: Array<Property | Method>) {
    return calculateMethodDependency(super.getDependency(members), members);
  }
}
