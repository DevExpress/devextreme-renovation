import {
  useCallback,
  useState
} from "@devextreme-generator/declarations";

export default function Counter({ id = 'default' }: { id?: string }) {
  const [value, setValue] = useState(1);
  const onClick = useCallback(() => {
    setValue(value + 1);
  }, [value]);
  return (
    <button id={id} onClick={onClick}>
      {value}
    </button>
  );
}
