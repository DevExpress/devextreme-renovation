export class InfernoEffect {
  private destroy?: (() => void) | void;

  constructor(
    private effect: () => (() => void) | void,
    private dependency: Array<unknown>,
  ) {
    this.destroy = effect();
  }

  update(dependency?: Array<unknown>): void {
    const currentDependency = this.dependency;
    if (dependency) {
      this.dependency = dependency;
    }
    if (!dependency || dependency.some((d, i) => currentDependency[i] !== d)) {
      this.dispose();
      this.destroy = this.effect();
    }
  }

  dispose(): void {
    if (this.destroy) {
      this.destroy();
    }
  }
}
