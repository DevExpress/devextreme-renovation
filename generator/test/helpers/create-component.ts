import Generator from "../../base-generator";

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

    return {
        createComponentDecorator,
        createDecorator
    };
}