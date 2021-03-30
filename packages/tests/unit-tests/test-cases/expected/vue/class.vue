<script>
class Base {}
export class SomeClass extends Base {
  m() {
    return "";
  }
  get g() {
    return this.p;
  }

  constructor(a) {
    super();
    this.p = 10;
    this.p++;
  }
}
export class ClassWithImplements {
  m() {
    return this.p;
  }

  constructor() {
    this.p = 10;
  }
}
export class WithoutConstructor extends Base {
  constructor(...args) {
    super(...args);
    this.p = 10;
  }
}
export class WithoutConstructorAndProps extends Base {
  m() {
    return 10;
  }
}
</script>
