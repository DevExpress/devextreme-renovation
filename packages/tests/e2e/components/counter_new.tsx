import {
  Component,
  ComponentBindings,
  OneWay,
  useCallback,
  useState
} from "@devextreme-generator/declarations";
import Button from "./button";

@ComponentBindings()
export class CounterInput {
  @OneWay() id?: string;
}

@Component({
  jQuery: {register: true},
})
export default function Counter(model: CounterInput) {
  const [value, setValue] = useState(1)
  const onClick = useCallback(() => {
    setValue(value + 1);
  }, [value])
  return (
    <Button id={model.id} onClick={onClick}>
      {value}
    </Button>
  );
}
