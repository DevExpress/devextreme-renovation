function view(){
            
}
export class WidgetProps  {
     @Input() height?:number = 10;

}

import {Component,NgModule,Input} from "@angular/core";
import {CommonModule} from "@angular/common"
@Component({selector:"dx-widget"})
export default class DxWidgetComponent extends WidgetProps {
     onClick():any{
     const v=this.height
}
    
}
@NgModule({
    declarations: [DxWidgetComponent],
    imports: [
        CommonModule
    ],
    exports: [DxWidgetComponent]
})
export class DxWidgetModule {}