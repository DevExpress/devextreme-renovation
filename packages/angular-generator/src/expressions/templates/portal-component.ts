export const angularPortalTemplate = `@Component({
    selector: "dx-portal",
    template: \`<div #content style="display:contents" *ngIf="container">
      <ng-content></ng-content>
    </div>\`
  })
  class DxPortal {
    @Input() container?: HTMLElement;
    @ViewChild("content") content?: ElementRef<HTMLDivElement>;
    _portal?: DomPortal;
    _outlet?: DomPortalOutlet;

    constructor(
      private _cfr: ComponentFactoryResolver,
      private _ar: ApplicationRef,
      private _injector: Injector,
    ) {}

    _renderPortal() {
      if(this._portal && this._portal.isAttached) {
        this._portal.detach();
      }
      if (this.content) {
        this._portal = new DomPortal(this.content);
      }
    }

    _renderOutlet() {
      if(this._outlet) {
        this._outlet.detach();
      }
      if (this.container && document) {
        this._outlet = new DomPortalOutlet(
          this.container,
          this._cfr,
          this._ar,
          this._injector,
          document
        );
      }
    }

    _attachPortal() {
      if(this._outlet && this._portal) {
        this._outlet.attach(this._portal);
      }
    }

    ngAfterViewInit() {
      this._renderPortal();
      this._renderOutlet();
      this._attachPortal();
    }

    ngOnChanges(changes: any) {
      if (changes.container) {
        this._renderPortal();
        this._renderOutlet();
        this._attachPortal();
      }
    }

    ngOnDestroy() {
      if(this._outlet) {
        this._outlet.dispose();
      }
    }
  }`;

export const angularPortalCoreImports = [
  "ViewChild",
  "ComponentFactoryResolver",
  "ApplicationRef",
  "Injector",
  "ElementRef",
];

export const angularPortalCdkImports = ["DomPortalOutlet", "DomPortal"];
