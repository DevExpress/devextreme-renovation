import { Class, Heritable, HeritageClause, inheritMembers } from "./class";
import { Parameter } from "./functions";
import { SimpleTypeExpression, FunctionTypeNode } from "./type";
import { Property, Method, BaseClassMember } from "./class-members";
import { Identifier, Call } from "./common";
import SyntaxKind from "../syntaxKind";
import { SimpleExpression } from "./base";
import { capitalizeFirstLetter } from "../utils/string";
import { Decorator } from "./decorator";

export class ComponentInput extends Class implements Heritable {

    get baseTypes() { 
        return this.heritageClauses.reduce((t: string[], h) => t.concat(h.typeNodes.map(t => t.toString())), []);
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
        return new Property(
            [new Decorator(new Call(new Identifier("Event"), undefined, []), {})],
            [],
            stateName,
            SyntaxKind.QuestionToken,
            this.buildChangeStateType(stateMember),
            new SimpleExpression("()=>{}")
        );
    }

    buildDefaultStateProperty(stateMember: Property): Property|null { 
        return new Property(
            [new Decorator(new Call(new Identifier("OneWay"), undefined, []), {})],
            [],
            new Identifier(`default${capitalizeFirstLetter(stateMember._name)}`),
            SyntaxKind.QuestionToken,
            stateMember.type
        )
    }

    buildStateProperies(stateMember: Property, members: BaseClassMember[]) { 
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

    processMembers(members: Array<Property | Method>, heritageClauses: HeritageClause[]) { 
        return inheritMembers(heritageClauses, super.processMembers(members.concat(
            members.filter(m => m.decorators.find(d => d.name === "TwoWay")).reduce((properies: Property[], p) => {
                return properies.concat(this.buildStateProperies(p as Property, members))
            }, [])
        ), heritageClauses));
    }

    get heritageProperies() {
        return (this.members.filter(m => m instanceof Property) as Property[]).map(p => p.inherit());
    }

    compileDefaultProps() {
        return this.name.toString();
    }

    defaultPropsDest() {
        return this.name.toString();
    }
}
