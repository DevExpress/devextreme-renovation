import {
	Component,
	ComponentBindings,
	JSXComponent,
	OneWay,
	TwoWay,
} from '@devextreme-generator/declarations';

export function viewFunction(viewModel: InnerTest) {
	return <div id="undefinedPropDefaults">
		{viewModel.someGetter}{' '}{viewModel.props.twoWayProp}
	</div>;
}
@ComponentBindings()
export class InnerTestProps {
	@OneWay() oneWayProp: string = 'oneWayDefault';
	@TwoWay() twoWayProp: string = 'twoWayDefault';
}

@Component({
	jQuery: {
			register: true,
	},
	view: viewFunction,
})

export class InnerTest extends JSXComponent(InnerTestProps) {
	get someGetter(): string {
		return this.props.oneWayProp;
	}
}


