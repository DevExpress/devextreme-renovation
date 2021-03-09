() => {
  const o1 = { a: 1, b: 2 };

  const a = 10;
  const b = "b";

  let o2 = { a, b };

  const { a: v } = o1;

  const o3 = { a: 10 + 2, v };

  const o4 = { ...o3, b: "" };

  const o5: Object = {};
};
