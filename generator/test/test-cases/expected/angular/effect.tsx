function view(model: Widget) {

}
function subscribe(p: string, s: number, i: number) {
    return 1;
}
function unsubscribe(id: number) {
    return undefined;
}
import { Input, Output, EventEmitter } from "@angular/core";
export class WidgetInput {
    @Input() p: string = "10";
    @Input() s: number = 10;
    @Output() sChange: EventEmitter<number> = new EventEmitter();
}

import { Component, NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({ selector: "dx-widget" })
export default class Widget extends WidgetInput {
    i: number = 10
    __setupData(): any {
        const id = subscribe(this.p, this.s, this.i);
        this._i = 15;
        return () => unsubscribe(id);
    }

    get restAttributes(){
        return {}
    }

    __destroyEffects: Array<() => any> = [];
    __viewCheckedSubscribeEvent: Array<() => void> = [];
    
    __schedule_setupData(){
        this.__destroyEffects[0]?.();
        this.__viewCheckedSubscribeEvent[0] = ()=>{
            this.__destroyEffects[0] = this.__setupData()
        }
    }

    __destroyEffects: Array<() => any> = []

    ngAfterViewInit() {
        this.__destroyEffects.push(this.__setupData());
    }

    ngOnChanges(changes: {[name:string]: any}) {
        if (this.__destroyEffects.length && ["p", "s"].some(d => changes[d] !== null)) {
            this.__schedule_setupData();
        }
    }

    ngOnDestroy() {
        this.__destroyEffects.forEach(d => d && d());
    }

    ngAfterViewChecked(){   
        this.__viewCheckedSubscribeEvent.forEach(s=>s?.());
        this.__viewCheckedSubscribeEvent = [];
    }

    set  _i(i:number){
        this.i = i;
        if (this.__destroyEffects.length) {
            this.__schedule_setupData();
        }
    }

}
@NgModule({
    declarations: [Widget],
    imports: [
        CommonModule
    ],
    exports: [Widget]
})
export class DxWidgetModule { }