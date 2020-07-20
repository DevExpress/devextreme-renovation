<script>
class Base {}

export class SomeClass extends Base {
  constructor(a) {
    super();
  }

  p = 10;
  m() {
    return "";
  }
  get g() {
    return this.p;
  }
}
</script>
