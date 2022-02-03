import { useMemo } from '@devextreme-generator/declarations';

const buttonClass = 'my-buttom';

const getClasses = (className?: string) => {
  return className ? `${buttonClass} ${className}` : buttonClass;
}

export default function Button({ 
    className
}: { 
    className?: string
}) {
    const classes = getClasses(className);
    
    return (
      <button className={classes}>
        My Button
      </button>
    );
  }
  