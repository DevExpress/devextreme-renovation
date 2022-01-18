import {
  Component,
  ComponentBindings,
  OneWay,
  useCallback,
  useState
} from "@devextreme-generator/declarations";

@ComponentBindings()
export class CounterInput {
  @OneWay() id?: string;
}

@Component({
  defaultOptionRules: null,
  jQuery: {register: true},
})
export default function Counter(model: CounterInput) {
  const [value, setValue] = useState(1)
  const onClick = useCallback(() => {
    setValue(value + 1);
  }, [value])
  return (
    <button id={model.id} onClick={onClick}>
      {value}
    </button>
  );
}
