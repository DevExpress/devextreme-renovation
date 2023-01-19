import { PickedProps, GridColumnProps } from './nested-props';
export const CustomColumnComponent = (props: typeof GridColumnProps) => {};
function view(model: Widget) {
  return <div />;
}

import { __collectChildren, equalByValue } from '@devextreme/runtime/react';
import {
  useCallback,
  useMemo,
  useRef,
  HookContainer,
} from '@devextreme/runtime/inferno-hooks';
import {
  EditingProps,
  CustomProps,
  ColumnEditingProps,
  AnotherCustomProps,
} from './nested-props';
export const Column: React.FunctionComponent<typeof GridColumnProps> & {
  propName: string;
} = () => null;
Column.propName = 'columns';
Column.defaultProps = GridColumnProps;
export const Editing: React.FunctionComponent<typeof EditingProps> & {
  propName: string;
} = () => null;
Editing.propName = 'editing';
Editing.defaultProps = EditingProps;
export const ColumnCustom: React.FunctionComponent<typeof CustomProps> & {
  propName: string;
} = () => null;
ColumnCustom.propName = 'custom';
ColumnCustom.defaultProps = CustomProps;
export const ColumnEditing: React.FunctionComponent<
  typeof ColumnEditingProps
> & { propName: string } = () => null;
ColumnEditing.propName = 'editing';
ColumnEditing.defaultProps = ColumnEditingProps;
export const EditingCustom: React.FunctionComponent<typeof CustomProps> & {
  propName: string;
} = () => null;
EditingCustom.propName = 'custom';
EditingCustom.defaultProps = CustomProps;
export const EditingAnotherCustom: React.FunctionComponent<
  typeof AnotherCustomProps
> & { propName: string } = () => null;
EditingAnotherCustom.propName = 'anotherCustom';
EditingAnotherCustom.defaultProps = AnotherCustomProps;

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof PickedProps & RestProps;
  __getNestedEditing: typeof EditingProps;
  __getNestedColumns: Array<typeof GridColumnProps | string> | undefined;
  getColumns: () => any;
  isEditable: any;
  restAttributes: RestProps;
}

function ReactWidget(props: typeof PickedProps & RestProps) {
  const cachedNested = useRef<any>(__collectChildren(props.children));

  const __getNestedEditing = useMemo(
    function __getNestedEditing(): typeof EditingProps {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.editing
        ? props.editing
        : cachedNested.current.editing
        ? cachedNested.current.editing?.[0]
        : props?.__defaultNestedValues?.editing;
    },
    [props.editing, props.children]
  );
  const __getNestedColumns = useMemo(
    function __getNestedColumns():
      | Array<typeof GridColumnProps | string>
      | undefined {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.columns
        ? props.columns
        : cachedNested.current.columns
        ? cachedNested.current.columns
        : undefined;
    },
    [props.columns, props.children]
  );
  const __getColumns = useCallback(
    function __getColumns(): any {
      return __getNestedColumns?.map((el) =>
        typeof el === 'string' ? el : el.name
      );
    },
    [__getNestedColumns]
  );
  const __isEditable = useCallback(
    function __isEditable(): any {
      return (
        __getNestedEditing.editEnabled || __getNestedEditing.custom?.length
      );
    },
    [__getNestedEditing]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        children,
        columns,
        editing,
        ...restProps
      } = {
        ...props,
        columns: __getNestedColumns,
        editing: __getNestedEditing,
      };
      return restProps;
    },
    [props]
  );

  return view({
    props: {
      ...props,
      columns: __getNestedColumns,
      editing: __getNestedEditing,
    },
    __getNestedEditing,
    __getNestedColumns,
    getColumns: __getColumns,
    isEditable: __isEditable(),
    restAttributes: __restAttributes(),
  });
}

HooksWidget.defaultProps = PickedProps;

function HooksWidget(props: typeof PickedProps & RestProps) {
  return <HookContainer renderFn={ReactWidget} renderProps={props} />;
}
export { HooksWidget as Widget };
export default HooksWidget;
