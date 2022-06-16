const JQueryRegistredComponentProps = { prop: 1 };

//* Component={"name":"JQueryRegisteredComponent", "jQueryRegistered":"true"}
export function JQueryRegisteredComponent(_props: typeof JQueryRegistredComponentProps): string {
    return "content";
}
JQueryRegisteredComponent.defaultProps = JQueryRegistredComponentProps;
export default JQueryRegisteredComponent;

export function defaultOptions() {
    JQueryRegisteredComponent.defaultProps = Object.create(
        Object.prototype,
        Object.assign(
            Object.getOwnPropertyDescriptors(JQueryRegisteredComponent.defaultProps),
        )
    );
}