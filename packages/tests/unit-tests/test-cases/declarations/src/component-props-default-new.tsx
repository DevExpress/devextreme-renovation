export default function Button({ text = 'default' }: { text?: string}) {
  return (
    <button>
      {text}
    </button>
  );
}
