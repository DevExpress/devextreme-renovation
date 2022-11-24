// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getTemplate } from '@devextreme/runtime/react';
import * as React from 'react';
import { useCallback } from 'react';
export const viewFunction = (m) => (<>
    <div>{getTemplate('test')}</div>
  </>);
//* Component={"name":"Icon"}
function Icon(props) {
    const __sourceType = useCallback(() => (''), []);
    return viewFunction({});
}
export { Icon };
export default Icon;
