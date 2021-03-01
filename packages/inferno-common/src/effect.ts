export class InfernoEffect {
  private destroy?: (() => void) | void;
  constructor(
    private effect: () => (() => void) | void,
    private dependency: Array<any>
  ) {
    this.destroy = effect();
  }

  update(dependency?: Array<any>) {
    if (!dependency || dependency.some((d, i) => this.dependency[i] !== d)) {
      this.dispose();
      this.destroy = this.effect();
    }
    if (dependency) {
      this.dependency = dependency;
    }
  }

  dispose() {
    if (this.destroy) {
      this.destroy();
    }
  }
}
