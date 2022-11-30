import React, { useEffect, useMemo } from 'react';

//* Component={"name":"DxComponent"}
function DxComponent() {
  const className = useEffect.toString() + useMemo.toString();
  return <div className={className} />;
}
export { DxComponent };
