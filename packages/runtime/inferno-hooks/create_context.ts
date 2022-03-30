import { Component } from 'inferno';

let contextId = 0;
export const createContext = function<T>(defaultValue: T): { id: number, Provider: any } {
  const id = contextId++;

  return {
    id,
    Provider: class extends Component<{ value: T }> {
      getChildContext() {
        return {
          ...this.context,
          [id]: this.props.value || (defaultValue as unknown as T),
        };
      }

      render() {
        return this.props.children;
      }
    },

  };
};
