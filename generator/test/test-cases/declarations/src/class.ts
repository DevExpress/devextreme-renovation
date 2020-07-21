class Base {}

export class SomeClass extends Base {
  constructor(a: string) {
    super();
  }

  p: number = 10;

  m(): string {
    return "";
  }

  get g(): number {
    return this.p;
  }
}
