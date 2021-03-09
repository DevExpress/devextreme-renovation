function testIf(b: any) {
  if (b === true) {
    return null;
  }
  if (b == 1) {
    const a = 10;
    return a;
  } else if (b === 2) {
    return 0;
  }
}
