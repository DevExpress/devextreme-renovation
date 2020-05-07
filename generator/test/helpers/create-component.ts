import Generator from "../../base-generator";
import { Property, Method } from "../../base-generator/expressions/class-members";
import { Expression } from "../../base-generator/expressions/base";

export default function (generator: Generator) {

    function createComponentDecorator(paramenters: { [name: string]: any }) {
        return generator.createDecorator(
            generator.createCall(
                generator.createIdentifier("Component"),
                [],
                [generator.createObjectLiteral(
                    Object.keys(paramenters).map(k =>
                        generator.createPropertyAssignment(
                            generator.createIdentifier(k),
                            paramenters[k]
                        )
                    ),
                    false
                )]
            )
        )
    }

    function createDecorator(name: string) { 
        return generator.createDecorator(
            generator.createCall(generator.createIdentifier(name), [], [])
        );
    }

    function createComponent(properties: Array<Property | Method> = [], paramenters: { [name: string]: Expression } = {}) {
        return generator.createComponent(
            createComponentDecorator(paramenters),
            [],
            generator.createIdentifier("BaseWidget"),
            [],
            [],
            properties
        );
    }

    return {
        createComponentDecorator,
        createDecorator,
        createComponent
    };
}