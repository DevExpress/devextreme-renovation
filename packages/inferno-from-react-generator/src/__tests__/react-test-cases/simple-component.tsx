const simpleComponentProps = { prop: 1 };

//* Component={"name":"SimpleComponent", "jQueryRegistered":"true"}
export function SimpleComponent(_props: typeof simpleComponentProps): string {
    return "content";
}
//* Component={"name":"SimpleComponentConst", "jQueryRegistered":"true"}
export const SimpleComponentConst = (_props: typeof simpleComponentProps): string => {
    return "content";
}

SimpleComponent.defaultProps = simpleComponentProps;
