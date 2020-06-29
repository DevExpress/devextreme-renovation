import { Class, Heritable, inheritMembers, HeritageClause } from "./class";
import { Parameter } from "./functions";
import { SimpleTypeExpression, FunctionTypeNode, TypeExpression } from "./type";
import { Property, Method, BaseClassMember } from "./class-members";
import { Identifier, Call } from "./common";
import SyntaxKind from "../syntaxKind";
import { SimpleExpression, Expression } from "./base";
import { capitalizeFirstLetter } from "../utils/string";
import { Decorator } from "./decorator";
import { warn } from "../../utils/messages";
import { getProps } from "./component";
import { GeneratorContext } from "../types";
import { Decorators } from "../../component_declaration/decorators";

const RESERVED_NAMES = [
    "class",
    "key",
    "ref",
    "style",
    "class",
];

export class ComponentInput extends Class implements Heritable {
    constructor(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, typeParameters: any[], heritageClauses: HeritageClause[] = [], members: Array<Property | Method>) {
        super(
            decorators,
            modifiers,
            name,
            typeParameters,
            heritageClauses.filter(h => h.token === SyntaxKind.ExtendsKeyword),
            members
        );
    }

    get baseTypes() { 
        return this.heritageClauses.reduce((t: string[], h) => t.concat(h.typeNodes.map(t => t.toString())), []);
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: string | TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createDecorator(expression: Call, context: GeneratorContext) {
        return new Decorator(expression, context);
    }

    buildChangeStateType(stateMember: Property) {
        return new FunctionTypeNode(
            undefined,
            [
                new Parameter(
                    [],
                    [],
                    undefined,
                    stateMember._name,
                    undefined,
                    stateMember.type
                )
            ],
            new SimpleTypeExpression("void")
        );
    }

    buildChangeState(stateMember: Property, stateName: Identifier) { 
        return this.createProperty(
            [this.createDecorator(new Call(new Identifier("Event"), undefined, []), {})],
            [],
            stateName,
            SyntaxKind.QuestionToken,
            this.buildChangeStateType(stateMember),
            new SimpleExpression("()=>{}")
        );
    }

    buildDefaultStateProperty(stateMember: Property): Property|null { 
        return this.createProperty(
            [this.createDecorator(new Call(new Identifier("OneWay"), undefined, []), {})],
            [],
            new Identifier(`default${capitalizeFirstLetter(stateMember._name)}`),
            SyntaxKind.QuestionToken,
            stateMember.type,
            stateMember.initializer
        )
    }

    buildStateProperties(stateMember: Property, members: BaseClassMember[]) { 
        const props:Property[] = []
        const defaultStateProperty = this.buildDefaultStateProperty(stateMember);
        
        if(defaultStateProperty){
            props.push(defaultStateProperty);
        }

        const stateName = `${stateMember._name}Change`;

        if (!members.find(m=>m._name.toString()===stateName)) { 
            props.push(this.buildChangeState(stateMember, new Identifier(stateName)));
        }

        return props;
    }

    buildTemplateProperties(templateMember: Property, members: BaseClassMember[]): Property[] { 
        return [];
    }

    processMembers(members: Array<Property | Method>) {
        members.forEach(m => {     
            const refIndex = m.decorators.findIndex(d => d.name === Decorators.Ref);
            if (refIndex > -1) { 
                m.decorators[refIndex] = this.createDecorator(new Call(new Identifier(Decorators.RefProp), undefined, []), {});
            }

            const forwardRefIndex = m.decorators.findIndex(d => d.name === "ForwardRef");
            if (forwardRefIndex > -1) { 
                m.decorators[forwardRefIndex] = this.createDecorator(new Call(new Identifier(Decorators.ForwardRefProp), undefined, []), {});
            }
        });

        members.forEach(m => {     
            if (!(m instanceof Property)) {
                warn(`${this.name} ComponentBindings has non-property member: ${m._name}`);
                return;
            }
            if (m.decorators.length !== 1) { 
                if (m.decorators.length === 0) {
                    warn(`${this.name} ComponentBindings has property without decorator: ${m._name}`);
                } else { 
                    warn(`${this.name} ComponentBindings has property with multiple decorators: ${m._name}`);
                }
            } else if (getProps([m]).length === 0 && !m.isNestedComp) {
                warn(`${this.name} ComponentBindings has property "${m._name}" with incorrect decorator: ${m.decorators[0].name}`);
            }

            if (RESERVED_NAMES.some(n => n === m._name.toString())) { 
                warn(`${this.name} ComponentBindings has property with reserved name: ${m._name}`);
            }
        });

        return inheritMembers(this.heritageClauses, super.processMembers(members.concat(
            members.filter(m => m.isState).reduce((properties: Property[], p) => {
                return properties.concat(this.buildStateProperties(p as Property, members))

            }, []),
            members.filter(m => m.isTemplate).reduce((properties: Property[], p) => {
                return properties.concat(this.buildTemplateProperties(p as Property, members))
            }, [])
        )));
    }

    get heritageProperties() {
        return (this.members.filter(m => m instanceof Property) as Property[]).map(p => p.inherit());
    }

    compileDefaultProps() {
        return this.name.toString();
    }

    defaultPropsDest() {
        return this.name.toString();
    }
}
