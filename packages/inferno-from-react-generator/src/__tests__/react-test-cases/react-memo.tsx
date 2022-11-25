import * as React  from 'react';
import {memo}  from 'react';

//* Component={"name":"PureComponent1"}
export const PureComponent1 = React.memo((_props): React.ReactElement => (<div />));
//* Component={"name":"PureComponent2"}

export const PureComponent2 = memo((_props): React.ReactElement => (<div />));
