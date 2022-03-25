import { Component } from 'inferno';
// export const createContext = function<T>(defaultValue: T) { return defaultValue; };
let contextId = 0;
export const createContext = function (defaultValue) {
    const id = contextId++;
    return {
        id,
        Provider: class extends Component {
            getChildContext() {
                return Object.assign(Object.assign({}, this.context), { [id]: this.props.value || defaultValue });
            }
            render() {
                return this.props.children;
            }
        },
    };
    //   // return defaultValue;
};
