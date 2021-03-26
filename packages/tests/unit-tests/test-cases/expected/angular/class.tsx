class Base {}

export class SomeClass extends Base {
  constructor(a: string) {
    super();
    this.p++;
  }

  p: number = 10;
  m(): string {
    return "";
  }
  get g(): number {
    return this.p;
  }
}

export class ClassWithImplements implements Base {
  p: number = 10;
  m(): any {
    return this.p;
  }
}

export class WithoutConstructor extends Base {
  p: number = 10;
}

export class WithoutConstructorAndProps extends Base {
  m(): number {
    return 10;
  }
}
