import React from 'react';
import Simple from '../../../../components/simple.tsx';

const App = ({ title }) => {
  return <div>
    <div>{title}</div>
    <Simple width={100} height={100}></Simple>
  </div>;
}

export default App;