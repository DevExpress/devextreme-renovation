export declare type BasePropsType = {
  p1: any;
  p2: any;
  p3: any;
};
const BaseProps: BasePropsType = {
  p1: value,
  p2: value,
} as any as BasePropsType;
export declare type Props2Type = {
  p3: any;
  p4: any;
  defaultP3: any;
  p3Change?: (p3: any) => void;
};
const Props2: Props2Type = {
  p4: value,
  defaultP3: value,
  p3Change: () => {},
} as any as Props2Type;
export declare type PropsType = {
  p1: any;
  p2: any;
  p3: any;
  p4: any;
  defaultP3: any;
  p3Change?: (p3: any) => void;
};
const Props: PropsType = {
  p1: BaseProps.p1,
  p2: BaseProps.p2,
  p4: Props2.p4,
  defaultP3: Props2.defaultP3,
  p3Change: Props2.p3Change,
} as any as PropsType;
