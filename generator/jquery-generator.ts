import {
    Generator,
    ReactComponent,
    GeneratorContex,
    Decorator,
    Identifier,
    ObjectLiteral,
    Property,
    Method,
    HeritageClause,
    getModuleRelativePath,
} from "./react-generator";
import path from "path";

const processModuleFileName = (module: string) => `${module}.p`;

export class JQueryComponent extends ReactComponent {
    context!: JQueryGeneratorContext;

    processModuleFileName(module: string) {
        return processModuleFileName(module);
    }

    toString() {
        const imports: string[] = [];

        // if(needPreact) {
        //     imports.push(`import * as Preact from 'preact'`)
        // }

        if (this.context.jqueryComponentRegistratorModule) {
            const relativePath = getModuleRelativePath(this.context.dirname!, this.context.jqueryComponentRegistratorModule);
            imports.push(`import registerComponent from '${relativePath}'`);
        }

        if (this.context.jqueryBaseComponentModule) {
            const relativePath = getModuleRelativePath(this.context.dirname!, this.context.jqueryBaseComponentModule);
            imports.push(`import Component from '${relativePath}'`);
        }

        const relativePath = getModuleRelativePath(this.context.dirname!, this.context.path!);
        imports.push(`import ${this.name}Component from '${this.processModuleFileName(relativePath.replace(path.extname(relativePath), ''))}'`);

        return `
        ${imports.join(';\n')}

        export class ${this.name} extends Component {
            get _viewComponent() {
                return ${this.name}Component;
            }

            ${this.compileGetProps()}

            ${this.compileAPI()}
            
            ${this.compileInit()}
        }

        registerComponent('${this.name}', ${this.name});
        `;
    }

    compileGetProps() {
        const statements: string[] = [];
        const templates = this.props.filter(p => p.property.decorators.find(d => d.name === "Template"))

        statements.splice(-1, 0, ...templates.map(t => {
            return `
            if(props.${t.property._name}) {
                props.${t.name} = this._createTemplateComponent(props, '${t.property._name}');
            }
            `;
        }));

        if(!statements.length) {
            return '';
        }

        return `
        getProps(props:any) {
            ${statements.join('\n')}

            return props;
        }
        `;
    }

    compileAPI() {
        if(!this.api.length) return '';

        const api = this.api.map(a => `${a.name}(${a.parametersTypeDeclaration()}) {
            this.viewRef.current.${a.name}(${a.parameters.map(p => p.name).join(',')});
        }`);

        return `${api.join('\n')}`;
    }

    compileInit() {
        const statements: string[] = [];
        if(this.api.length) {
            statements.push('this._createViewRef();');
        }

        if(!statements.length) {
            return '';
        }

        return `
        _initWidget() {
            ${statements.join(';\n')}
        }
        `;
    }
}

export type JQueryGeneratorContext = GeneratorContex & {
    jqueryComponentRegistratorModule?: string
    jqueryBaseComponentModule?: string
}

function withEmptyToString(smth: any) {
    smth.toString = () => "";
    return smth;
}

export class JQueryGenerator extends Generator {
    processSourceFileName(name: string) {
        return name.replace(/\.tsx$/, ".j.tsx");
    }

    context: JQueryGeneratorContext[] = [];

    setContext(context: JQueryGeneratorContext | null) {
        super.setContext(context);
    }

    getContext() { 
        return super.getContext() as JQueryGeneratorContext;
    }

    jqueryComponentRegistratorModule?: string
    jqueryBaseComponentModule?: string

    createClassDeclaration(decorators: Decorator[], modifiers: string[], name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        const componentDecorator = decorators.find(d => d.name === "Component");
        const registerJQuery = componentDecorator && (componentDecorator.expression.arguments[0] as ObjectLiteral).getProperty("registerJQuery") || false;

        let result: JQueryComponent;
        if (componentDecorator && registerJQuery) {
            result = new JQueryComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
            this.addComponent(name.toString(), result);
        } else {
            result = withEmptyToString(super.createClassDeclaration(decorators, modifiers, name, typeParameters, heritageClauses, members));
        }

        return result;
    }

    /* istanbul ignore next */
    createVariableDeclaration(...args: any) { return withEmptyToString(super.createVariableDeclaration.apply(this, args)); }
    /* istanbul ignore next */
    createVariableDeclarationList(...args: any) { return withEmptyToString(super.createVariableDeclarationList.apply(this, args)); }
    /* istanbul ignore next */
    createVariableStatement(...args: any) { return withEmptyToString(super.createVariableStatement.apply(this, args)); }
    /* istanbul ignore next */
    createStringLiteral(...args: any) { return withEmptyToString(super.createStringLiteral.apply(this, args)); }
    /* istanbul ignore next */
    createBindingElement(...args: any) { return withEmptyToString(super.createBindingElement.apply(this, args)); }
    /* istanbul ignore next */
    createArrayBindingPattern(...args: any) { return withEmptyToString(super.createArrayBindingPattern.apply(this, args)); }
    /* istanbul ignore next */
    createObjectBindingPattern(...args: any) { return withEmptyToString(super.createObjectBindingPattern.apply(this, args)); }
    /* istanbul ignore next */
    createDebuggerStatement(...args: any) { return withEmptyToString(super.createDebuggerStatement.apply(this, args)); }
    /* istanbul ignore next */
    createBlock(...args: any) { return withEmptyToString(super.createBlock.apply(this, args)); }
    /* istanbul ignore next */
    createFunctionDeclaration(...args: any) { return withEmptyToString(super.createFunctionDeclaration.apply(this, args)); }
    /* istanbul ignore next */
    createFunctionExpression(...args: any) { return withEmptyToString(super.createFunctionExpression.apply(this, args)); }
    /* istanbul ignore next */
    createToken() { return ''; }
    /* istanbul ignore next */
    createCall(...args: any) { return withEmptyToString(super.createCall.apply(this, args)); }
    /* istanbul ignore next */
    createExportAssignment() { return ''; }
    /* istanbul ignore next */
    createIf(...args: any) { return withEmptyToString(super.createIf.apply(this, args)); }
    /* istanbul ignore next */
    createWhile(...args: any) { return withEmptyToString(super.createWhile.apply(this, args)); }
    /* istanbul ignore next */
    createImportDeclaration(...args: any) { return withEmptyToString(super.createImportDeclaration.apply(this, args)); }
    /* istanbul ignore next */
    createImportSpecifier(...args: any) { return withEmptyToString(super.createImportSpecifier.apply(this, args)); }
    /* istanbul ignore next */
    createNamedImports(...args: any) { return withEmptyToString(super.createNamedImports.apply(this, args)); }
    /* istanbul ignore next */
    createImportClause(...args: any) { return withEmptyToString(super.createImportClause.apply(this, args)); }
    /* istanbul ignore next */
    createDecorator(...args: any) { return withEmptyToString(super.createDecorator.apply(this, args)); }
    /* istanbul ignore next */
    createFor(...args: any) { return withEmptyToString(super.createFor.apply(this, args)); }
    /* istanbul ignore next */
    createForIn(...args: any) { return withEmptyToString(super.createForIn.apply(this, args)); }
    /* istanbul ignore next */
    createCaseClause(...args: any) { return withEmptyToString(super.createCaseClause.apply(this, args)); }
    /* istanbul ignore next */
    createDefaultClause(...args: any) { return withEmptyToString(super.createDefaultClause.apply(this, args)); }
    /* istanbul ignore next */
    createDo(...args: any) { return withEmptyToString(super.createDo.apply(this, args)); }

    // createKeywordTypeNode() { return ''; }
    // createArrayTypeNode() { return ''; }
    // createFunctionTypeNode() { return ''; }
    // createTypeLiteralNode() { return ''; }
    // createTypeAliasDeclaration() { return ''; }
    // createIntersectionTypeNode() { return ''; }
    // createTypeQueryNode() { return ''; }
    // createUnionTypeNode() { return ''; }
    // createExpressionWithTypeArguments(...args: any) { return withEmptyToString(super.createExpressionWithTypeArguments.apply(this, args)); }
    // createTypeOf(...args: any) { return withEmptyToString(super.createTypeOf.apply(this, args)); }
    // createTemplateHead() { return ''; }
    // createTemplateMiddle() { return ''; }
    // createTemplateTail() { return ''; }
    // createParameter(...args: any) { return withEmptyToString(super.createParameter.apply(this, args)); }
    // createReturn(...args: any) { return withEmptyToString(super.createReturn.apply(this, args)); }
    // createShorthandPropertyAssignment(...args: any) { return withEmptyToString(super.createShorthandPropertyAssignment.apply(this, args)); }
    // createSpreadAssignment(...args: any) { return withEmptyToString(super.createSpreadAssignment.apply(this, args)); }
    // createProperty(...args: any) { return withEmptyToString(super.createProperty.apply(this, args)); }
    // createPropertyAccess(...args: any) { return withEmptyToString(super.createPropertyAccess.apply(this, args)); }
    // createJsxExpression(...args: any) { return withEmptyToString(super.createJsxExpression.apply(this, args)); }
    // createJsxAttribute(...args: any) { return withEmptyToString(super.createJsxAttribute.apply(this, args)); }
    // createJsxSpreadAttribute(...args: any) { return withEmptyToString(super.createJsxSpreadAttribute.apply(this, args)); }
    // createJsxOpeningElement(...args: any) { return withEmptyToString(super.createJsxOpeningElement.apply(this, args)); }
    // createJsxSelfClosingElement(...args: any) { return withEmptyToString(super.createJsxSelfClosingElement.apply(this, args)); }
    // createJsxClosingElement(...args: any) { return withEmptyToString(super.createJsxClosingElement.apply(this, args)); }
    // createJsxElement(...args: any) { return withEmptyToString(super.createJsxElement.apply(this, args)); }
    // createJsxText() { return ''; }
    // createMethod(...args: any) { return withEmptyToString(super.createMethod.apply(this, args)); }
    // createGetAccessor(...args: any) { return withEmptyToString(super.createGetAccessor.apply(this, args)); }
    // createElementAccess(...args: any) { return withEmptyToString(super.createElementAccess.apply(this, args)); }
    // createCaseBlock(...args: any) { return withEmptyToString(super.createCaseBlock.apply(this, args)); }
    // createSwitch(...args: any) { return withEmptyToString(super.createSwitch.apply(this, args)); }
    // createNumericLiteral(...args: any) { return withEmptyToString(super.createNumericLiteral.apply(this, args)); }
    // createArrayLiteral(...args: any) { return withEmptyToString(super.createArrayLiteral.apply(this, args)); }
    // createObjectLiteral(...args: any) { return withEmptyToString(super.createObjectLiteral.apply(this, args)); }
    // createPropertyAssignment(...args: any) { return withEmptyToString(super.createPropertyAssignment.apply(this, args)); }
    // createFalse(...args: any) { return withEmptyToString(super.createFalse.apply(this, args)); }
    // createTrue(...args: any) { return withEmptyToString(super.createTrue.apply(this, args)); }
    // createNew(...args: any) { return withEmptyToString(super.createNew.apply(this, args)); }
    // createDelete(...args: any) { return withEmptyToString(super.createDelete.apply(this, args)); }
    // createNull(...args: any) { return withEmptyToString(super.createNull.apply(this, args)); }
    // createThis(...args: any) { return withEmptyToString(super.createThis.apply(this, args)); }
    // createBreak(...args: any) { return withEmptyToString(super.createBreak.apply(this, args)); }
    // createContinue(...args: any) { return withEmptyToString(super.createContinue.apply(this, args)); }
    // createArrowFunction(...args: any) { return withEmptyToString(super.createArrowFunction.apply(this, args)); }
    // createModifier() { return ''; }
    // createBinary(...args: any) { return withEmptyToString(super.createBinary.apply(this, args)); }
    // createParen(...args: any) { return withEmptyToString(super.createParen.apply(this, args)); }
    // createPrefix(...args: any) { return withEmptyToString(super.createPrefix.apply(this, args)); }
    // createPostfix(...args: any) { return withEmptyToString(super.createPostfix.apply(this, args)); }
    // createNonNullExpression(...args: any) { return withEmptyToString(super.createNonNullExpression.apply(this, args)); }
    // createPropertySignature(...args: any) { return withEmptyToString(super.createPropertySignature.apply(this, args)); }
    // createIndexSignature(...args: any) { return withEmptyToString(super.createIndexSignature.apply(this, args)); }
    // createConditional(...args: any) { return withEmptyToString(super.createConditional.apply(this, args)); }
    // createTemplateSpan(...args: any) { return withEmptyToString(super.createTemplateSpan.apply(this, args)); }
    // createTemplateExpression(...args: any) { return withEmptyToString(super.createTemplateExpression.apply(this, args)); }
    // createNoSubstitutionTemplateLiteral(...args: any) { return withEmptyToString(super.createNoSubstitutionTemplateLiteral.apply(this, args)); }
    // createComputedPropertyName(...args: any) { return withEmptyToString(super.createComputedPropertyName.apply(this, args)); }
    // createVoid(...args: any) { return withEmptyToString(super.createVoid.apply(this, args)); }
    // createHeritageClause(...args: any) { return withEmptyToString(super.createHeritageClause.apply(this, args)); }
    // createPropertyAccessChain(...args: any) { return withEmptyToString(super.createPropertyAccessChain.apply(this, args)); }
    // createCallChain(...args: any) { return withEmptyToString(super.createCallChain.apply(this, args)); }
    // createAsExpression(...args: any) { return withEmptyToString(super.createAsExpression.apply(this, args)); }
    // createRegularExpressionLiteral(...args: any) { return withEmptyToString(super.createRegularExpressionLiteral.apply(this, args)); }
}

export default new JQueryGenerator();
