import {
    Component,  
    ComponentBindings,
    JSXComponent,
    Slot,
} from '@devextreme-generator/declarations';

export const viewFunction = (viewModel: SimpleSlot) => (
    <div>
        {viewModel.props.children}
    </div>
);

@ComponentBindings()
export class SimpleSlotProps {
    @Slot() children?: any;
}

@Component({
    defaultOptionRules: null,
    view: viewFunction,
})

export class SimpleSlot extends JSXComponent(SimpleSlotProps) {}