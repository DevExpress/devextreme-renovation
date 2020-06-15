function view(viewModel: Widget) {
	return <div></div>;
}
export declare type WidgetInputType = {};
const WidgetInput: WidgetInputType = {};

import React, { useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface Widget {
	props: typeof WidgetInput & RestProps;
	privateMethod: (a: number) => any;
	method1: (a: number) => void;
	method2: () => null;
	restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
	const privateMethod = useCallback(function privateMethod(a: number) { }, []);
	const method1 = useCallback(function method1(a: number) {
		return privateMethod(a);
	}, []);
	const method2 = useCallback(function method2() {
		return null;
	}, []);
	const __restAttributes = useCallback(
		function __restAttributes() {
			const { ...restProps } = props;
			return restProps;
		},
		[props]
	);

	return view(({
		props: { ...props },
		privateMethod,
		method1,
		method2,
		restAttributes: __restAttributes(),
	}));
}

Widget.defaultProps = {
	...WidgetInput,
};
