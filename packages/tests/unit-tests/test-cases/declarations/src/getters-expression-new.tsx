import { useMemo } from '@devextreme-generator/declarations';

const buttonClass = 'my-buttom';

export default function Button({ 
    className
}: { 
    className?: string
}) {
    const classes = className ? `${buttonClass} ${className}` : buttonClass;
    
    return (
      <button className={classes}>
        My Button
      </button>
    );
  }
  