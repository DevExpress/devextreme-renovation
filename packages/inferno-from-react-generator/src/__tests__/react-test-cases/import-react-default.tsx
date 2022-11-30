// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getTemplate } from '@devextreme/runtime/react';
import React from 'react';
import { useCallback } from 'react';

export const viewFunction = (m: any): any => (
  <>
    <div>{getTemplate('test')}</div>
  </>
);

//* Component={"name":"Icon"}
function Icon(props: any) {
  const __sourceType = useCallback(
    (): string | false => (''),
    [],
  );

  return viewFunction({});
}
export { Icon };
export default Icon;
