import { createContext } from "@devextreme-generator/declarations";

export class PluginContext {
  onChange?: Function;
  plugins: { [name: string]: any } = {};
  registerPlugin(name: string, plugin: any) {
    this.plugins[name] = plugin;
    this.onChange?.();
  }

  getPlugin(name: string) {
    return this.plugins[name];
  }
}

export const Context = createContext<PluginContext | null>(null);

export const SimpleContext = createContext<number>(10);
export interface NumberContextType {
  counter: number,
  increaseCounter: ()=>void;
}
export const NumberContext = createContext<NumberContextType>({counter:1, increaseCounter: ()=>{}});
