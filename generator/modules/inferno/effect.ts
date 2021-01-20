export class InfernoEffect {
  private destroy?: () => void;
  private timeout = 0;
  constructor(
    private effect: () => () => void,
    private dependency: Array<any>
  ) {
    this.destroy = effect();
  }

  update(dependency?: Array<any>) {
    if (!dependency || dependency.some((d, i) => this.dependency[i] !== d)) {
      this.destroy?.();
      clearTimeout(this.timeout);
      this.destroy = this.effect();
    }
    if (dependency) {
      this.dependency = dependency;
    }
  }

  dispose() {
    this.destroy?.();
  }
}
