const simpleComponentProps = { prop: 1 };
//* Component={"name":"SimpleComponent", "jQueryRegistered":"true"}
export function SimpleComponent(_props) {
    return "content";
}
//* Component={"name":"SimpleComponentConst", "jQueryRegistered":"true"}
export const SimpleComponentConst = (_props) => {
    return "content";
};
SimpleComponent.defaultProps = simpleComponentProps;
