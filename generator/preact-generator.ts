import reactGenerator, { ReactComponent, Decorator, Identifier, Property, Method } from "./react-generator";

class PreactComponent extends ReactComponent {
    compileImportStatements(hooks: string[]) {
        const imports = ["import * as Preact from 'preact'"]; 
        if (hooks.length) { 
            imports.push(`import {${hooks.join(",")}} from 'preact/hooks'`);
        }
        return imports;
    }
}

export default {
    ...reactGenerator,

    processSourceFileName(name: string) {
        return name.replace(/\.tsx$/, ".p.tsx");
    },

    createClassDeclaration(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: any, members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        if (componentDecorator) {
            return new PreactComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members);
        }

        return reactGenerator.createClassDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members);
    }
};
