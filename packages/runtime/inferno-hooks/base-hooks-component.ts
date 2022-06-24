import { findDOMfromVNode } from 'inferno';
import { HookContainer } from './container';

interface VDomCustomClassesData {
  previous: string[];
  removed: string[];
  added: string[];
}

type ElementWithCustomClassesData = Element & {
  dxClasses: VDomCustomClassesData;
};
export class InfernoWrapperComponent extends HookContainer {
  vDomElement: ElementWithCustomClassesData | null = null;

  vDomUpdateClasses(): void {
    const el = this.vDomElement as ElementWithCustomClassesData;
    const currentClasses = el.className.length
      ? el.className.split(' ')
      : [];
    const addedClasses = currentClasses.filter(
      (className) => el.dxClasses.previous.indexOf(className) < 0,
    );
    const removedClasses = el.dxClasses.previous.filter(
      (className: string): boolean => currentClasses.indexOf(className) < 0,
    );

    addedClasses.forEach((value: string): void => {
      const indexInRemoved = el.dxClasses.removed.indexOf(value);
      if (indexInRemoved > -1) {
        el.dxClasses.removed.splice(indexInRemoved, 1);
      } else {
        el.dxClasses.added.push(value);
      }
    });

    removedClasses.forEach((value: string): void => {
      const indexInAdded = el.dxClasses.added.indexOf(value);
      if (indexInAdded > -1) {
        el.dxClasses.added.splice(indexInAdded, 1);
      } else {
        el.dxClasses.removed.push(value);
      }
    });
  }

  componentDidMount(): void {
    const el = findDOMfromVNode(this.$LI, true) as ElementWithCustomClassesData;
    this.vDomElement = el;
    super.componentDidMount();
    el.dxClasses = el.dxClasses || {
      removed: [], added: [], previous: [],
    };
    el.dxClasses.previous = el?.className.length
      ? el.className.split(' ')
      : [];
  }

  componentDidUpdate(): void {
    const el = this.vDomElement;
    if (el !== null) {
      el.dxClasses.added.forEach((className: string): void => el.classList.add(className));
      el.dxClasses.removed.forEach((className: string): void => el.classList.remove(className));
      el.dxClasses.previous = el.className.length
        ? el.className.split(' ')
        : [];
    }
    super.componentDidUpdate();
  }

  shouldComponentUpdate(nextProps: Record<string, unknown>,
    nextState: Record<string, unknown>,
    context: Record<string, unknown> | undefined): boolean {
    const shouldUpdate = super.shouldComponentUpdate(nextProps, nextState, context);
    if (shouldUpdate) {
      this.vDomUpdateClasses();
    }
    return shouldUpdate;
  }
}
