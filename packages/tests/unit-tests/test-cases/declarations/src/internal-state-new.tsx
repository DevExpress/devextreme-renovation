
import {
  useCallback,
  useState
} from "@devextreme-generator/declarations";

export function Widget() {
  const [hovered, setHovered] = useState(false);

  const updateState = useCallback(() => {
    setHovered(!hovered);
  }, [hovered]);

  return <span></span>;
}
