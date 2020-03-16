function view(){
            
}
export class WidgetProps  {
     @Input() height?:number = 10;

}

import {Component,NgModule,Input} from "@angular/core";
import {CommonModule} from "@angular/common"
@Component({selector:"dx-widget"})
export default class Widget extends WidgetProps {
     __onClick():any{
     const v=this.height
}
    
}
@NgModule({
    declarations: [Widget],
    imports: [
        CommonModule
    ],
    exports: [Widget]
})
export class DxWidgetModule {}