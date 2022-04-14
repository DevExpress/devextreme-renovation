export abstract class SomeClass {
  constructor(a: string) {
    this.p++;
  }

  p: number = 10;
  m(): string {
    return '';
  }
  abstract someMethod(prop: number): void;
  abstract someMethod2(): void;
  get g(): number {
    return this.p;
  }
}
