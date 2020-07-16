() => {
  let a = 1 + 2 - (3 * 10) / 20 + -10;
  let b = (a > 10 && a < 20) || (a >= 100 && a <= 399);

  a += 2;
  a++;
  a--;
  a -= 2;
  --a;

  1 | (3 & 7);

  a |= 1;
  a &= 2;

  ~~10;

  !!b;

  10 % 3;

  10 ^ 2;

  const regExp = /.+\/([^.]+)\..+$/;
};

const items: any[] = [];
const options = {};
((items as any[]) || []).forEach(() => {});