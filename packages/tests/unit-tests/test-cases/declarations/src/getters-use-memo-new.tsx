import { useMemo } from '@devextreme-generator/declarations';

const buttonClass = 'my-buttom';

export default function Button({ 
    className
}: { 
    className?: string
}) {
    const classes = useMemo(() => {
        return className ? `${buttonClass} ${className}` : buttonClass;
    }, [className]);
    
    return (
      <button className={classes}>
        My Button
      </button>
    );
  }
  