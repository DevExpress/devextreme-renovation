"use strict";
exports.__esModule = true;
var code_block_writer_1 = require("code-block-writer");
function generateFactoryCode(ts, initialNode) {
    var writer = new code_block_writer_1["default"]({ newLine: "\n", indentNumberOfSpaces: 2 });
    var syntaxKindToName = createSyntaxKindToNameMap();
    if (ts.isSourceFile(initialNode)) {
        writer.write("module.exports = (ts) => [");
        if (initialNode.statements.length > 0) {
            writer.indent(function () {
                for (var i = 0; i < initialNode.statements.length; i++) {
                    var statement = initialNode.statements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(statement);
                }
            }).newLine();
        }
        writer.write("];");
    }
    else {
        writeNodeText(initialNode);
    }
    writer.newLineIfLastNot();
    return writer.toString();
    function writeNodeText(node) {
        switch (node.kind) {
            case ts.SyntaxKind.NumericLiteral:
                createNumericLiteral(node);
                return;
            case ts.SyntaxKind.BigIntLiteral:
                createBigIntLiteral(node);
                return;
            case ts.SyntaxKind.StringLiteral:
                createStringLiteral(node);
                return;
            case ts.SyntaxKind.RegularExpressionLiteral:
                createRegularExpressionLiteral(node);
                return;
            case ts.SyntaxKind.Identifier:
                createIdentifier(node);
                return;
            case ts.SyntaxKind.SuperKeyword:
                createSuper(node);
                return;
            case ts.SyntaxKind.ThisKeyword:
                createThis(node);
                return;
            case ts.SyntaxKind.NullKeyword:
                createNull(node);
                return;
            case ts.SyntaxKind.TrueKeyword:
                createTrue(node);
                return;
            case ts.SyntaxKind.FalseKeyword:
                createFalse(node);
                return;
            case ts.SyntaxKind.QualifiedName:
                createQualifiedName(node);
                return;
            case ts.SyntaxKind.ComputedPropertyName:
                createComputedPropertyName(node);
                return;
            case ts.SyntaxKind.TypeParameter:
                createTypeParameterDeclaration(node);
                return;
            case ts.SyntaxKind.Parameter:
                createParameter(node);
                return;
            case ts.SyntaxKind.Decorator:
                createDecorator(node);
                return;
            case ts.SyntaxKind.PropertySignature:
                createPropertySignature(node);
                return;
            case ts.SyntaxKind.PropertyDeclaration:
                createProperty(node);
                return;
            case ts.SyntaxKind.MethodSignature:
                createMethodSignature(node);
                return;
            case ts.SyntaxKind.MethodDeclaration:
                createMethod(node);
                return;
            case ts.SyntaxKind.Constructor:
                createConstructor(node);
                return;
            case ts.SyntaxKind.GetAccessor:
                createGetAccessor(node);
                return;
            case ts.SyntaxKind.SetAccessor:
                createSetAccessor(node);
                return;
            case ts.SyntaxKind.CallSignature:
                createCallSignature(node);
                return;
            case ts.SyntaxKind.ConstructSignature:
                createConstructSignature(node);
                return;
            case ts.SyntaxKind.IndexSignature:
                createIndexSignature(node);
                return;
            case ts.SyntaxKind.AnyKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.BooleanKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.NeverKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.NumberKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.ObjectKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.StringKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.SymbolKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.UndefinedKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.UnknownKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.BigIntKeyword:
                createKeywordTypeNode(node);
                return;
            case ts.SyntaxKind.TypePredicate:
                createTypePredicateNodeWithModifier(node);
                return;
            case ts.SyntaxKind.TypeReference:
                createTypeReferenceNode(node);
                return;
            case ts.SyntaxKind.FunctionType:
                createFunctionTypeNode(node);
                return;
            case ts.SyntaxKind.ConstructorType:
                createConstructorTypeNode(node);
                return;
            case ts.SyntaxKind.TypeQuery:
                createTypeQueryNode(node);
                return;
            case ts.SyntaxKind.TypeLiteral:
                createTypeLiteralNode(node);
                return;
            case ts.SyntaxKind.ArrayType:
                createArrayTypeNode(node);
                return;
            case ts.SyntaxKind.TupleType:
                createTupleTypeNode(node);
                return;
            case ts.SyntaxKind.OptionalType:
                createOptionalTypeNode(node);
                return;
            case ts.SyntaxKind.RestType:
                createRestTypeNode(node);
                return;
            case ts.SyntaxKind.UnionType:
                createUnionTypeNode(node);
                return;
            case ts.SyntaxKind.IntersectionType:
                createIntersectionTypeNode(node);
                return;
            case ts.SyntaxKind.ConditionalType:
                createConditionalTypeNode(node);
                return;
            case ts.SyntaxKind.InferType:
                createInferTypeNode(node);
                return;
            case ts.SyntaxKind.ImportType:
                createImportTypeNode(node);
                return;
            case ts.SyntaxKind.ParenthesizedType:
                createParenthesizedType(node);
                return;
            case ts.SyntaxKind.ThisType:
                createThisTypeNode(node);
                return;
            case ts.SyntaxKind.TypeOperator:
                createTypeOperatorNode(node);
                return;
            case ts.SyntaxKind.IndexedAccessType:
                createIndexedAccessTypeNode(node);
                return;
            case ts.SyntaxKind.MappedType:
                createMappedTypeNode(node);
                return;
            case ts.SyntaxKind.LiteralType:
                createLiteralTypeNode(node);
                return;
            case ts.SyntaxKind.ObjectBindingPattern:
                createObjectBindingPattern(node);
                return;
            case ts.SyntaxKind.ArrayBindingPattern:
                createArrayBindingPattern(node);
                return;
            case ts.SyntaxKind.BindingElement:
                createBindingElement(node);
                return;
            case ts.SyntaxKind.ArrayLiteralExpression:
                createArrayLiteral(node);
                return;
            case ts.SyntaxKind.ObjectLiteralExpression:
                createObjectLiteral(node);
                return;
            case ts.SyntaxKind.PropertyAccessExpression:
                if (ts.isPropertyAccessChain(node)) {
                    createPropertyAccessChain(node);
                    return;
                }
                if (ts.isPropertyAccessExpression(node)) {
                    createPropertyAccess(node);
                    return;
                }
                throw new Error("Unhandled node: " + node.getText());
            case ts.SyntaxKind.ElementAccessExpression:
                if (ts.isElementAccessChain(node)) {
                    createElementAccessChain(node);
                    return;
                }
                if (ts.isElementAccessExpression(node)) {
                    createElementAccess(node);
                    return;
                }
                throw new Error("Unhandled node: " + node.getText());
            case ts.SyntaxKind.CallExpression:
                if (ts.isCallChain(node)) {
                    createCallChain(node);
                    return;
                }
                if (ts.isCallExpression(node)) {
                    createCall(node);
                    return;
                }
                throw new Error("Unhandled node: " + node.getText());
            case ts.SyntaxKind.NewExpression:
                createNew(node);
                return;
            case ts.SyntaxKind.TaggedTemplateExpression:
                createTaggedTemplate(node);
                return;
            case ts.SyntaxKind.TypeAssertionExpression:
                createTypeAssertion(node);
                return;
            case ts.SyntaxKind.ParenthesizedExpression:
                createParen(node);
                return;
            case ts.SyntaxKind.FunctionExpression:
                createFunctionExpression(node);
                return;
            case ts.SyntaxKind.ArrowFunction:
                createArrowFunction(node);
                return;
            case ts.SyntaxKind.DeleteExpression:
                createDelete(node);
                return;
            case ts.SyntaxKind.TypeOfExpression:
                createTypeOf(node);
                return;
            case ts.SyntaxKind.VoidExpression:
                createVoid(node);
                return;
            case ts.SyntaxKind.AwaitExpression:
                createAwait(node);
                return;
            case ts.SyntaxKind.PrefixUnaryExpression:
                createPrefix(node);
                return;
            case ts.SyntaxKind.PostfixUnaryExpression:
                createPostfix(node);
                return;
            case ts.SyntaxKind.BinaryExpression:
                createBinary(node);
                return;
            case ts.SyntaxKind.ConditionalExpression:
                createConditional(node);
                return;
            case ts.SyntaxKind.TemplateExpression:
                createTemplateExpression(node);
                return;
            case ts.SyntaxKind.TemplateHead:
                createTemplateHead(node);
                return;
            case ts.SyntaxKind.TemplateMiddle:
                createTemplateMiddle(node);
                return;
            case ts.SyntaxKind.TemplateTail:
                createTemplateTail(node);
                return;
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                createNoSubstitutionTemplateLiteral(node);
                return;
            case ts.SyntaxKind.YieldExpression:
                createYield(node);
                return;
            case ts.SyntaxKind.SpreadElement:
                createSpread(node);
                return;
            case ts.SyntaxKind.ClassExpression:
                createClassExpression(node);
                return;
            case ts.SyntaxKind.OmittedExpression:
                createOmittedExpression(node);
                return;
            case ts.SyntaxKind.ExpressionWithTypeArguments:
                createExpressionWithTypeArguments(node);
                return;
            case ts.SyntaxKind.AsExpression:
                createAsExpression(node);
                return;
            case ts.SyntaxKind.NonNullExpression:
                createNonNullExpression(node);
                return;
            case ts.SyntaxKind.MetaProperty:
                createMetaProperty(node);
                return;
            case ts.SyntaxKind.TemplateSpan:
                createTemplateSpan(node);
                return;
            case ts.SyntaxKind.SemicolonClassElement:
                createSemicolonClassElement(node);
                return;
            case ts.SyntaxKind.Block:
                createBlock(node);
                return;
            case ts.SyntaxKind.VariableStatement:
                createVariableStatement(node);
                return;
            case ts.SyntaxKind.EmptyStatement:
                createEmptyStatement(node);
                return;
            case ts.SyntaxKind.ExpressionStatement:
                createExpressionStatement(node);
                return;
            case ts.SyntaxKind.IfStatement:
                createIf(node);
                return;
            case ts.SyntaxKind.DoStatement:
                createDo(node);
                return;
            case ts.SyntaxKind.WhileStatement:
                createWhile(node);
                return;
            case ts.SyntaxKind.ForStatement:
                createFor(node);
                return;
            case ts.SyntaxKind.ForInStatement:
                createForIn(node);
                return;
            case ts.SyntaxKind.ForOfStatement:
                createForOf(node);
                return;
            case ts.SyntaxKind.ContinueStatement:
                createContinue(node);
                return;
            case ts.SyntaxKind.BreakStatement:
                createBreak(node);
                return;
            case ts.SyntaxKind.ReturnStatement:
                createReturn(node);
                return;
            case ts.SyntaxKind.WithStatement:
                createWith(node);
                return;
            case ts.SyntaxKind.SwitchStatement:
                createSwitch(node);
                return;
            case ts.SyntaxKind.LabeledStatement:
                createLabel(node);
                return;
            case ts.SyntaxKind.ThrowStatement:
                createThrow(node);
                return;
            case ts.SyntaxKind.TryStatement:
                createTry(node);
                return;
            case ts.SyntaxKind.DebuggerStatement:
                createDebuggerStatement(node);
                return;
            case ts.SyntaxKind.VariableDeclaration:
                createVariableDeclaration(node);
                return;
            case ts.SyntaxKind.VariableDeclarationList:
                createVariableDeclarationList(node);
                return;
            case ts.SyntaxKind.FunctionDeclaration:
                createFunctionDeclaration(node);
                return;
            case ts.SyntaxKind.ClassDeclaration:
                createClassDeclaration(node);
                return;
            case ts.SyntaxKind.InterfaceDeclaration:
                createInterfaceDeclaration(node);
                return;
            case ts.SyntaxKind.TypeAliasDeclaration:
                createTypeAliasDeclaration(node);
                return;
            case ts.SyntaxKind.EnumDeclaration:
                createEnumDeclaration(node);
                return;
            case ts.SyntaxKind.ModuleDeclaration:
                createModuleDeclaration(node);
                return;
            case ts.SyntaxKind.ModuleBlock:
                createModuleBlock(node);
                return;
            case ts.SyntaxKind.CaseBlock:
                createCaseBlock(node);
                return;
            case ts.SyntaxKind.NamespaceExportDeclaration:
                createNamespaceExportDeclaration(node);
                return;
            case ts.SyntaxKind.ImportEqualsDeclaration:
                createImportEqualsDeclaration(node);
                return;
            case ts.SyntaxKind.ImportDeclaration:
                createImportDeclaration(node);
                return;
            case ts.SyntaxKind.ImportClause:
                createImportClause(node);
                return;
            case ts.SyntaxKind.NamespaceImport:
                createNamespaceImport(node);
                return;
            case ts.SyntaxKind.NamedImports:
                createNamedImports(node);
                return;
            case ts.SyntaxKind.ImportSpecifier:
                createImportSpecifier(node);
                return;
            case ts.SyntaxKind.ExportAssignment:
                createExportAssignment(node);
                return;
            case ts.SyntaxKind.ExportDeclaration:
                createExportDeclaration(node);
                return;
            case ts.SyntaxKind.NamedExports:
                createNamedExports(node);
                return;
            case ts.SyntaxKind.ExportSpecifier:
                createExportSpecifier(node);
                return;
            case ts.SyntaxKind.ExternalModuleReference:
                createExternalModuleReference(node);
                return;
            case ts.SyntaxKind.JsxElement:
                createJsxElement(node);
                return;
            case ts.SyntaxKind.JsxSelfClosingElement:
                createJsxSelfClosingElement(node);
                return;
            case ts.SyntaxKind.JsxOpeningElement:
                createJsxOpeningElement(node);
                return;
            case ts.SyntaxKind.JsxClosingElement:
                createJsxClosingElement(node);
                return;
            case ts.SyntaxKind.JsxFragment:
                createJsxFragment(node);
                return;
            case ts.SyntaxKind.JsxText:
                createJsxText(node);
                return;
            case ts.SyntaxKind.JsxOpeningFragment:
                createJsxOpeningFragment(node);
                return;
            case ts.SyntaxKind.JsxClosingFragment:
                createJsxJsxClosingFragment(node);
                return;
            case ts.SyntaxKind.JsxAttribute:
                createJsxAttribute(node);
                return;
            case ts.SyntaxKind.JsxAttributes:
                createJsxAttributes(node);
                return;
            case ts.SyntaxKind.JsxSpreadAttribute:
                createJsxSpreadAttribute(node);
                return;
            case ts.SyntaxKind.JsxExpression:
                createJsxExpression(node);
                return;
            case ts.SyntaxKind.CaseClause:
                createCaseClause(node);
                return;
            case ts.SyntaxKind.DefaultClause:
                createDefaultClause(node);
                return;
            case ts.SyntaxKind.HeritageClause:
                createHeritageClause(node);
                return;
            case ts.SyntaxKind.CatchClause:
                createCatchClause(node);
                return;
            case ts.SyntaxKind.PropertyAssignment:
                createPropertyAssignment(node);
                return;
            case ts.SyntaxKind.ShorthandPropertyAssignment:
                createShorthandPropertyAssignment(node);
                return;
            case ts.SyntaxKind.SpreadAssignment:
                createSpreadAssignment(node);
                return;
            case ts.SyntaxKind.EnumMember:
                createEnumMember(node);
                return;
            case ts.SyntaxKind.CommaListExpression:
                createCommaList(node);
                return;
            default:
                if (node.kind >= ts.SyntaxKind.FirstToken && node.kind <= ts.SyntaxKind.LastToken) {
                    writer.write("ts.createToken(ts.SyntaxKind.").write(syntaxKindToName[node.kind]).write(")");
                    return;
                }
                writer.write("/* Unhandled node kind: ").write(syntaxKindToName[node.kind]).write(" */");
        }
    }
    function createNumericLiteral(node) {
        writer.write("ts.createNumericLiteral(");
        writer.quote(node.text.toString());
        writer.write(")");
    }
    function createBigIntLiteral(node) {
        writer.write("ts.createBigIntLiteral(");
        writer.quote(node.text.toString());
        writer.write(")");
    }
    function createStringLiteral(node) {
        writer.write("ts.createStringLiteral(");
        writer.quote(node.text.toString());
        writer.write(")");
    }
    function createRegularExpressionLiteral(node) {
        writer.write("ts.createRegularExpressionLiteral(");
        writer.quote(node.text.toString());
        writer.write(")");
    }
    function createIdentifier(node) {
        writer.write("ts.createIdentifier(");
        writer.quote(node.text.toString());
        writer.write(")");
    }
    function createSuper(node) {
        writer.write("ts.createSuper(");
        writer.write(")");
    }
    function createThis(node) {
        writer.write("ts.createThis(");
        writer.write(")");
    }
    function createNull(node) {
        writer.write("ts.createNull(");
        writer.write(")");
    }
    function createTrue(node) {
        writer.write("ts.createTrue(");
        writer.write(")");
    }
    function createFalse(node) {
        writer.write("ts.createFalse(");
        writer.write(")");
    }
    function createQualifiedName(node) {
        writer.write("ts.createQualifiedName(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.left);
            writer.write(",").newLine();
            writeNodeText(node.right);
        });
        writer.write(")");
    }
    function createComputedPropertyName(node) {
        writer.write("ts.createComputedPropertyName(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createTypeParameterDeclaration(node) {
        writer.write("ts.createTypeParameterDeclaration(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.constraint == null)
                writer.write("undefined");
            else {
                writeNodeText(node.constraint);
            }
            writer.write(",").newLine();
            if (node["default"] == null)
                writer.write("undefined");
            else {
                writeNodeText(node["default"]);
            }
        });
        writer.write(")");
    }
    function createParameter(node) {
        writer.write("ts.createParameter(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.dotDotDotToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.dotDotDotToken);
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.questionToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionToken);
            }
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
        });
        writer.write(")");
    }
    function createDecorator(node) {
        writer.write("ts.createDecorator(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createPropertySignature(node) {
        writer.write("ts.createPropertySignature(");
        writer.newLine();
        writer.indent(function () {
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.questionToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionToken);
            }
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
        });
        writer.write(")");
    }
    function createProperty(node) {
        writer.write("ts.createProperty(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.questionToken != null)
                writer.write("ts.createToken(ts.SyntaxKind.QuestionToken)");
            else if (node.exclamationToken != null)
                writer.write("ts.createToken(ts.SyntaxKind.ExclamationToken)");
            else
                writer.write("undefined");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
        });
        writer.write(")");
    }
    function createMethodSignature(node) {
        writer.write("ts.createMethodSignature(");
        writer.newLine();
        writer.indent(function () {
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.questionToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionToken);
            }
        });
        writer.write(")");
    }
    function createMethod(node) {
        writer.write("ts.createMethod(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.asteriskToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.asteriskToken);
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.questionToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionToken);
            }
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            if (node.body == null)
                writer.write("undefined");
            else {
                writeNodeText(node.body);
            }
        });
        writer.write(")");
    }
    function createConstructor(node) {
        writer.write("ts.createConstructor(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.body == null)
                writer.write("undefined");
            else {
                writeNodeText(node.body);
            }
        });
        writer.write(")");
    }
    function createGetAccessor(node) {
        writer.write("ts.createGetAccessor(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            if (node.body == null)
                writer.write("undefined");
            else {
                writeNodeText(node.body);
            }
        });
        writer.write(")");
    }
    function createSetAccessor(node) {
        writer.write("ts.createSetAccessor(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.body == null)
                writer.write("undefined");
            else {
                writeNodeText(node.body);
            }
        });
        writer.write(")");
    }
    function createCallSignature(node) {
        writer.write("ts.createCallSignature(");
        writer.newLine();
        writer.indent(function () {
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
        });
        writer.write(")");
    }
    function createConstructSignature(node) {
        writer.write("ts.createConstructSignature(");
        writer.newLine();
        writer.indent(function () {
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
        });
        writer.write(")");
    }
    function createIndexSignature(node) {
        writer.write("ts.createIndexSignature(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
        });
        writer.write(")");
    }
    function createKeywordTypeNode(node) {
        writer.write("ts.createKeywordTypeNode(");
        writer.write("ts.SyntaxKind.").write(syntaxKindToName[node.kind]);
        writer.write(")");
    }
    function createTypePredicateNodeWithModifier(node) {
        writer.write("ts.createTypePredicateNodeWithModifier(");
        writer.newLine();
        writer.indent(function () {
            if (node.assertsModifier == null)
                writer.write("undefined");
            else {
                writeNodeText(node.assertsModifier);
            }
            writer.write(",").newLine();
            writeNodeText(node.parameterName);
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
        });
        writer.write(")");
    }
    function createTypeReferenceNode(node) {
        writer.write("ts.createTypeReferenceNode(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.typeName);
            writer.write(",").newLine();
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
        });
        writer.write(")");
    }
    function createFunctionTypeNode(node) {
        writer.write("ts.createFunctionTypeNode(");
        writer.newLine();
        writer.indent(function () {
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writeNodeText(node.type);
        });
        writer.write(")");
    }
    function createConstructorTypeNode(node) {
        writer.write("ts.createConstructorTypeNode(");
        writer.newLine();
        writer.indent(function () {
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writeNodeText(node.type);
        });
        writer.write(")");
    }
    function createTypeQueryNode(node) {
        writer.write("ts.createTypeQueryNode(");
        writeNodeText(node.exprName);
        writer.write(")");
    }
    function createTypeLiteralNode(node) {
        writer.write("ts.createTypeLiteralNode(");
        writer.write("[");
        if (node.members.length === 1) {
            var item = node.members[0];
            writeNodeText(item);
        }
        else if (node.members.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.members.length; i++) {
                    var item = node.members[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createArrayTypeNode(node) {
        writer.write("ts.createArrayTypeNode(");
        writeNodeText(node.elementType);
        writer.write(")");
    }
    function createTupleTypeNode(node) {
        writer.write("ts.createTupleTypeNode(");
        writer.write("[");
        if (node.elementTypes.length === 1) {
            var item = node.elementTypes[0];
            writeNodeText(item);
        }
        else if (node.elementTypes.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.elementTypes.length; i++) {
                    var item = node.elementTypes[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createOptionalTypeNode(node) {
        writer.write("ts.createOptionalTypeNode(");
        writeNodeText(node.type);
        writer.write(")");
    }
    function createRestTypeNode(node) {
        writer.write("ts.createRestTypeNode(");
        writeNodeText(node.type);
        writer.write(")");
    }
    function createUnionTypeNode(node) {
        writer.write("ts.createUnionTypeNode(");
        writer.write("[");
        if (node.types.length === 1) {
            var item = node.types[0];
            writeNodeText(item);
        }
        else if (node.types.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.types.length; i++) {
                    var item = node.types[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createIntersectionTypeNode(node) {
        writer.write("ts.createIntersectionTypeNode(");
        writer.write("[");
        if (node.types.length === 1) {
            var item = node.types[0];
            writeNodeText(item);
        }
        else if (node.types.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.types.length; i++) {
                    var item = node.types[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createConditionalTypeNode(node) {
        writer.write("ts.createConditionalTypeNode(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.checkType);
            writer.write(",").newLine();
            writeNodeText(node.extendsType);
            writer.write(",").newLine();
            writeNodeText(node.trueType);
            writer.write(",").newLine();
            writeNodeText(node.falseType);
        });
        writer.write(")");
    }
    function createInferTypeNode(node) {
        writer.write("ts.createInferTypeNode(");
        writeNodeText(node.typeParameter);
        writer.write(")");
    }
    function createImportTypeNode(node) {
        writer.write("ts.createImportTypeNode(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.argument);
            writer.write(",").newLine();
            if (node.qualifier == null)
                writer.write("undefined");
            else {
                writeNodeText(node.qualifier);
            }
            writer.write(",").newLine();
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.isTypeOf == null)
                writer.write("undefined");
            else {
                writer.quote(node.isTypeOf.toString());
            }
        });
        writer.write(")");
    }
    function createParenthesizedType(node) {
        writer.write("ts.createParenthesizedType(");
        writeNodeText(node.type);
        writer.write(")");
    }
    function createThisTypeNode(node) {
        writer.write("ts.createThisTypeNode(");
        writer.write(")");
    }
    function createTypeOperatorNode(node) {
        writer.write("ts.createTypeOperatorNode(");
        writeNodeText(node.type);
        writer.write(")");
    }
    function createIndexedAccessTypeNode(node) {
        writer.write("ts.createIndexedAccessTypeNode(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.objectType);
            writer.write(",").newLine();
            writeNodeText(node.indexType);
        });
        writer.write(")");
    }
    function createMappedTypeNode(node) {
        writer.write("ts.createMappedTypeNode(");
        writer.newLine();
        writer.indent(function () {
            if (node.readonlyToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.readonlyToken);
            }
            writer.write(",").newLine();
            writeNodeText(node.typeParameter);
            writer.write(",").newLine();
            if (node.questionToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionToken);
            }
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
        });
        writer.write(")");
    }
    function createLiteralTypeNode(node) {
        writer.write("ts.createLiteralTypeNode(");
        writeNodeText(node.literal);
        writer.write(")");
    }
    function createObjectBindingPattern(node) {
        writer.write("ts.createObjectBindingPattern(");
        writer.write("[");
        if (node.elements.length === 1) {
            var item = node.elements[0];
            writeNodeText(item);
        }
        else if (node.elements.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.elements.length; i++) {
                    var item = node.elements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createArrayBindingPattern(node) {
        writer.write("ts.createArrayBindingPattern(");
        writer.write("[");
        if (node.elements.length === 1) {
            var item = node.elements[0];
            writeNodeText(item);
        }
        else if (node.elements.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.elements.length; i++) {
                    var item = node.elements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createBindingElement(node) {
        writer.write("ts.createBindingElement(");
        writer.newLine();
        writer.indent(function () {
            if (node.dotDotDotToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.dotDotDotToken);
            }
            writer.write(",").newLine();
            if (node.propertyName == null)
                writer.write("undefined");
            else {
                writeNodeText(node.propertyName);
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
        });
        writer.write(")");
    }
    function createArrayLiteral(node) {
        writer.write("ts.createArrayLiteral(");
        writer.newLine();
        writer.indent(function () {
            writer.write("[");
            if (node.elements.length === 1) {
                var item = node.elements[0];
                writeNodeText(item);
            }
            else if (node.elements.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.elements.length; i++) {
                        var item = node.elements[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writer.write((node.multiLine || false).toString());
        });
        writer.write(")");
    }
    function createObjectLiteral(node) {
        writer.write("ts.createObjectLiteral(");
        writer.newLine();
        writer.indent(function () {
            writer.write("[");
            if (node.properties.length === 1) {
                var item = node.properties[0];
                writeNodeText(item);
            }
            else if (node.properties.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.properties.length; i++) {
                        var item = node.properties[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writer.write((node.multiLine || false).toString());
        });
        writer.write(")");
    }
    function createPropertyAccess(node) {
        writer.write("ts.createPropertyAccess(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.name);
        });
        writer.write(")");
    }
    function createPropertyAccessChain(node) {
        writer.write("ts.createPropertyAccessChain(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            if (node.questionDotToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionDotToken);
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
        });
        writer.write(")");
    }
    function createElementAccess(node) {
        writer.write("ts.createElementAccess(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.argumentExpression);
        });
        writer.write(")");
    }
    function createElementAccessChain(node) {
        writer.write("ts.createElementAccessChain(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            if (node.questionDotToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionDotToken);
            }
            writer.write(",").newLine();
            writeNodeText(node.argumentExpression);
        });
        writer.write(")");
    }
    function createCall(node) {
        writer.write("ts.createCall(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.arguments.length === 1) {
                var item = node.arguments[0];
                writeNodeText(item);
            }
            else if (node.arguments.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.arguments.length; i++) {
                        var item = node.arguments[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createCallChain(node) {
        writer.write("ts.createCallChain(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            if (node.questionDotToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.questionDotToken);
            }
            writer.write(",").newLine();
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.arguments.length === 1) {
                var item = node.arguments[0];
                writeNodeText(item);
            }
            else if (node.arguments.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.arguments.length; i++) {
                        var item = node.arguments[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createNew(node) {
        writer.write("ts.createNew(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.arguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.arguments.length === 1) {
                    var item = node.arguments[0];
                    writeNodeText(item);
                }
                else if (node.arguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.arguments.length; i++) {
                            var item = node.arguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
        });
        writer.write(")");
    }
    function createTaggedTemplate(node) {
        writer.write("ts.createTaggedTemplate(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.tag);
            writer.write(",").newLine();
            writeNodeText(node.template);
        });
        writer.write(")");
    }
    function createTypeAssertion(node) {
        writer.write("ts.createTypeAssertion(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.type);
            writer.write(",").newLine();
            writeNodeText(node.expression);
        });
        writer.write(")");
    }
    function createParen(node) {
        writer.write("ts.createParen(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createFunctionExpression(node) {
        writer.write("ts.createFunctionExpression(");
        writer.newLine();
        writer.indent(function () {
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.asteriskToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.asteriskToken);
            }
            writer.write(",").newLine();
            if (node.name == null)
                writer.write("undefined");
            else {
                writeNodeText(node.name);
            }
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            writeNodeText(node.body);
        });
        writer.write(")");
    }
    function createArrowFunction(node) {
        writer.write("ts.createArrowFunction(");
        writer.newLine();
        writer.indent(function () {
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            writeNodeText(node.equalsGreaterThanToken);
            writer.write(",").newLine();
            writeNodeText(node.body);
        });
        writer.write(")");
    }
    function createDelete(node) {
        writer.write("ts.createDelete(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createTypeOf(node) {
        writer.write("ts.createTypeOf(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createVoid(node) {
        writer.write("ts.createVoid(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createAwait(node) {
        writer.write("ts.createAwait(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createPrefix(node) {
        writer.write("ts.createPrefix(");
        writer.newLine();
        writer.indent(function () {
            writer.write("ts.SyntaxKind.").write(syntaxKindToName[node.operator]);
            writer.write(",").newLine();
            writeNodeText(node.operand);
        });
        writer.write(")");
    }
    function createPostfix(node) {
        writer.write("ts.createPostfix(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.operand);
            writer.write(",").newLine();
            writer.write("ts.SyntaxKind.").write(syntaxKindToName[node.operator]);
        });
        writer.write(")");
    }
    function createBinary(node) {
        writer.write("ts.createBinary(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.left);
            writer.write(",").newLine();
            writeNodeText(node.operatorToken);
            writer.write(",").newLine();
            writeNodeText(node.right);
        });
        writer.write(")");
    }
    function createConditional(node) {
        writer.write("ts.createConditional(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.condition);
            writer.write(",").newLine();
            writeNodeText(node.whenTrue);
            writer.write(",").newLine();
            writeNodeText(node.whenFalse);
        });
        writer.write(")");
    }
    function createTemplateExpression(node) {
        writer.write("ts.createTemplateExpression(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.head);
            writer.write(",").newLine();
            writer.write("[");
            if (node.templateSpans.length === 1) {
                var item = node.templateSpans[0];
                writeNodeText(item);
            }
            else if (node.templateSpans.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.templateSpans.length; i++) {
                        var item = node.templateSpans[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createTemplateHead(node) {
        writer.write("ts.createTemplateHead(");
        writer.newLine();
        writer.indent(function () {
            writer.quote(node.text.toString());
            writer.write(",").newLine();
            if (node.rawText == null)
                writer.write("undefined");
            else {
                writer.quote(node.rawText.toString());
            }
        });
        writer.write(")");
    }
    function createTemplateMiddle(node) {
        writer.write("ts.createTemplateMiddle(");
        writer.newLine();
        writer.indent(function () {
            writer.quote(node.text.toString());
            writer.write(",").newLine();
            if (node.rawText == null)
                writer.write("undefined");
            else {
                writer.quote(node.rawText.toString());
            }
        });
        writer.write(")");
    }
    function createTemplateTail(node) {
        writer.write("ts.createTemplateTail(");
        writer.newLine();
        writer.indent(function () {
            writer.quote(node.text.toString());
            writer.write(",").newLine();
            if (node.rawText == null)
                writer.write("undefined");
            else {
                writer.quote(node.rawText.toString());
            }
        });
        writer.write(")");
    }
    function createNoSubstitutionTemplateLiteral(node) {
        writer.write("ts.createNoSubstitutionTemplateLiteral(");
        writer.newLine();
        writer.indent(function () {
            writer.quote(node.text.toString());
            writer.write(",").newLine();
            if (node.rawText == null)
                writer.write("undefined");
            else {
                writer.quote(node.rawText.toString());
            }
        });
        writer.write(")");
    }
    function createYield(node) {
        writer.write("ts.createYield(");
        if (node.expression == null)
            writer.write("undefined");
        else {
            writeNodeText(node.expression);
        }
        writer.write(")");
    }
    function createSpread(node) {
        writer.write("ts.createSpread(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createClassExpression(node) {
        writer.write("ts.createClassExpression(");
        writer.newLine();
        writer.indent(function () {
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.name == null)
                writer.write("undefined");
            else {
                writeNodeText(node.name);
            }
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.heritageClauses == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.heritageClauses.length === 1) {
                    var item = node.heritageClauses[0];
                    writeNodeText(item);
                }
                else if (node.heritageClauses.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.heritageClauses.length; i++) {
                            var item = node.heritageClauses[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.members.length === 1) {
                var item = node.members[0];
                writeNodeText(item);
            }
            else if (node.members.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.members.length; i++) {
                        var item = node.members[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createOmittedExpression(node) {
        writer.write("ts.createOmittedExpression(");
        writer.write(")");
    }
    function createExpressionWithTypeArguments(node) {
        writer.write("ts.createExpressionWithTypeArguments(");
        writer.newLine();
        writer.indent(function () {
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.expression);
        });
        writer.write(")");
    }
    function createAsExpression(node) {
        writer.write("ts.createAsExpression(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.type);
        });
        writer.write(")");
    }
    function createNonNullExpression(node) {
        writer.write("ts.createNonNullExpression(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createMetaProperty(node) {
        writer.write("ts.createMetaProperty(");
        writer.newLine();
        writer.indent(function () {
            writer.write("ts.SyntaxKind.").write(syntaxKindToName[node.keywordToken]);
            writer.write(",").newLine();
            writeNodeText(node.name);
        });
        writer.write(")");
    }
    function createTemplateSpan(node) {
        writer.write("ts.createTemplateSpan(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.literal);
        });
        writer.write(")");
    }
    function createSemicolonClassElement(node) {
        writer.write("ts.createSemicolonClassElement(");
        writer.write(")");
    }
    function createBlock(node) {
        writer.write("ts.createBlock(");
        writer.newLine();
        writer.indent(function () {
            writer.write("[");
            if (node.statements.length === 1) {
                var item = node.statements[0];
                writeNodeText(item);
            }
            else if (node.statements.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.statements.length; i++) {
                        var item = node.statements[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writer.write((node.multiLine || false).toString());
        });
        writer.write(")");
    }
    function createVariableStatement(node) {
        writer.write("ts.createVariableStatement(");
        writer.newLine();
        writer.indent(function () {
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.declarationList);
        });
        writer.write(")");
    }
    function createEmptyStatement(node) {
        writer.write("ts.createEmptyStatement(");
        writer.write(")");
    }
    function createExpressionStatement(node) {
        writer.write("ts.createExpressionStatement(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createIf(node) {
        writer.write("ts.createIf(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.thenStatement);
            writer.write(",").newLine();
            if (node.elseStatement == null)
                writer.write("undefined");
            else {
                writeNodeText(node.elseStatement);
            }
        });
        writer.write(")");
    }
    function createDo(node) {
        writer.write("ts.createDo(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.statement);
            writer.write(",").newLine();
            writeNodeText(node.expression);
        });
        writer.write(")");
    }
    function createWhile(node) {
        writer.write("ts.createWhile(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.statement);
        });
        writer.write(")");
    }
    function createFor(node) {
        writer.write("ts.createFor(");
        writer.newLine();
        writer.indent(function () {
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
            writer.write(",").newLine();
            if (node.condition == null)
                writer.write("undefined");
            else {
                writeNodeText(node.condition);
            }
            writer.write(",").newLine();
            if (node.incrementor == null)
                writer.write("undefined");
            else {
                writeNodeText(node.incrementor);
            }
            writer.write(",").newLine();
            writeNodeText(node.statement);
        });
        writer.write(")");
    }
    function createForIn(node) {
        writer.write("ts.createForIn(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.initializer);
            writer.write(",").newLine();
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.statement);
        });
        writer.write(")");
    }
    function createForOf(node) {
        writer.write("ts.createForOf(");
        writer.newLine();
        writer.indent(function () {
            if (node.awaitModifier == null)
                writer.write("undefined");
            else {
                writeNodeText(node.awaitModifier);
            }
            writer.write(",").newLine();
            writeNodeText(node.initializer);
            writer.write(",").newLine();
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.statement);
        });
        writer.write(")");
    }
    function createContinue(node) {
        writer.write("ts.createContinue(");
        if (node.label == null)
            writer.write("undefined");
        else {
            writeNodeText(node.label);
        }
        writer.write(")");
    }
    function createBreak(node) {
        writer.write("ts.createBreak(");
        if (node.label == null)
            writer.write("undefined");
        else {
            writeNodeText(node.label);
        }
        writer.write(")");
    }
    function createReturn(node) {
        writer.write("ts.createReturn(");
        if (node.expression == null)
            writer.write("undefined");
        else {
            writeNodeText(node.expression);
        }
        writer.write(")");
    }
    function createWith(node) {
        writer.write("ts.createWith(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.statement);
        });
        writer.write(")");
    }
    function createSwitch(node) {
        writer.write("ts.createSwitch(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writeNodeText(node.caseBlock);
        });
        writer.write(")");
    }
    function createLabel(node) {
        writer.write("ts.createLabel(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.label);
            writer.write(",").newLine();
            writeNodeText(node.statement);
        });
        writer.write(")");
    }
    function createThrow(node) {
        writer.write("ts.createThrow(");
        if (node.expression == null)
            writer.write("undefined");
        else {
            writeNodeText(node.expression);
        }
        writer.write(")");
    }
    function createTry(node) {
        writer.write("ts.createTry(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.tryBlock);
            writer.write(",").newLine();
            if (node.catchClause == null)
                writer.write("undefined");
            else {
                writeNodeText(node.catchClause);
            }
            writer.write(",").newLine();
            if (node.finallyBlock == null)
                writer.write("undefined");
            else {
                writeNodeText(node.finallyBlock);
            }
        });
        writer.write(")");
    }
    function createDebuggerStatement(node) {
        writer.write("ts.createDebuggerStatement(");
        writer.write(")");
    }
    function createVariableDeclaration(node) {
        writer.write("ts.createVariableDeclaration(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
        });
        writer.write(")");
    }
    function createVariableDeclarationList(node) {
        writer.write("ts.createVariableDeclarationList(");
        writer.newLine();
        writer.indent(function () {
            writer.write("[");
            if (node.declarations.length === 1) {
                var item = node.declarations[0];
                writeNodeText(item);
            }
            else if (node.declarations.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.declarations.length; i++) {
                        var item = node.declarations[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writer.write(getNodeFlagValues(node.flags || 0));
        });
        writer.write(")");
    }
    function createFunctionDeclaration(node) {
        writer.write("ts.createFunctionDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.asteriskToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.asteriskToken);
            }
            writer.write(",").newLine();
            if (node.name == null)
                writer.write("undefined");
            else {
                writeNodeText(node.name);
            }
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.parameters.length === 1) {
                var item = node.parameters[0];
                writeNodeText(item);
            }
            else if (node.parameters.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.parameters.length; i++) {
                        var item = node.parameters[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            if (node.type == null)
                writer.write("undefined");
            else {
                writeNodeText(node.type);
            }
            writer.write(",").newLine();
            if (node.body == null)
                writer.write("undefined");
            else {
                writeNodeText(node.body);
            }
        });
        writer.write(")");
    }
    function createClassDeclaration(node) {
        writer.write("ts.createClassDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.name == null)
                writer.write("undefined");
            else {
                writeNodeText(node.name);
            }
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.heritageClauses == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.heritageClauses.length === 1) {
                    var item = node.heritageClauses[0];
                    writeNodeText(item);
                }
                else if (node.heritageClauses.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.heritageClauses.length; i++) {
                            var item = node.heritageClauses[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.members.length === 1) {
                var item = node.members[0];
                writeNodeText(item);
            }
            else if (node.members.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.members.length; i++) {
                        var item = node.members[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createInterfaceDeclaration(node) {
        writer.write("ts.createInterfaceDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.heritageClauses == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.heritageClauses.length === 1) {
                    var item = node.heritageClauses[0];
                    writeNodeText(item);
                }
                else if (node.heritageClauses.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.heritageClauses.length; i++) {
                            var item = node.heritageClauses[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writer.write("[");
            if (node.members.length === 1) {
                var item = node.members[0];
                writeNodeText(item);
            }
            else if (node.members.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.members.length; i++) {
                        var item = node.members[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createTypeAliasDeclaration(node) {
        writer.write("ts.createTypeAliasDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.typeParameters == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeParameters.length === 1) {
                    var item = node.typeParameters[0];
                    writeNodeText(item);
                }
                else if (node.typeParameters.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeParameters.length; i++) {
                            var item = node.typeParameters[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.type);
        });
        writer.write(")");
    }
    function createEnumDeclaration(node) {
        writer.write("ts.createEnumDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            writer.write("[");
            if (node.members.length === 1) {
                var item = node.members[0];
                writeNodeText(item);
            }
            else if (node.members.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.members.length; i++) {
                        var item = node.members[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createModuleDeclaration(node) {
        writer.write("ts.createModuleDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.body == null)
                writer.write("undefined");
            else {
                writeNodeText(node.body);
            }
            writer.write(",").newLine();
            writer.write(getNodeFlagValues(node.flags || 0));
        });
        writer.write(")");
    }
    function createModuleBlock(node) {
        writer.write("ts.createModuleBlock(");
        writer.write("[");
        if (node.statements.length === 1) {
            var item = node.statements[0];
            writeNodeText(item);
        }
        else if (node.statements.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.statements.length; i++) {
                    var item = node.statements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createCaseBlock(node) {
        writer.write("ts.createCaseBlock(");
        writer.write("[");
        if (node.clauses.length === 1) {
            var item = node.clauses[0];
            writeNodeText(item);
        }
        else if (node.clauses.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.clauses.length; i++) {
                    var item = node.clauses[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createNamespaceExportDeclaration(node) {
        writer.write("ts.createNamespaceExportDeclaration(");
        writeNodeText(node.name);
        writer.write(")");
    }
    function createImportEqualsDeclaration(node) {
        writer.write("ts.createImportEqualsDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
            writer.write(",").newLine();
            writeNodeText(node.moduleReference);
        });
        writer.write(")");
    }
    function createImportDeclaration(node) {
        writer.write("ts.createImportDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.importClause == null)
                writer.write("undefined");
            else {
                writeNodeText(node.importClause);
            }
            writer.write(",").newLine();
            writeNodeText(node.moduleSpecifier);
        });
        writer.write(")");
    }
    function createImportClause(node) {
        writer.write("ts.createImportClause(");
        writer.newLine();
        writer.indent(function () {
            if (node.name == null)
                writer.write("undefined");
            else {
                writeNodeText(node.name);
            }
            writer.write(",").newLine();
            if (node.namedBindings == null)
                writer.write("undefined");
            else {
                writeNodeText(node.namedBindings);
            }
        });
        writer.write(")");
    }
    function createNamespaceImport(node) {
        writer.write("ts.createNamespaceImport(");
        writeNodeText(node.name);
        writer.write(")");
    }
    function createNamedImports(node) {
        writer.write("ts.createNamedImports(");
        writer.write("[");
        if (node.elements.length === 1) {
            var item = node.elements[0];
            writeNodeText(item);
        }
        else if (node.elements.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.elements.length; i++) {
                    var item = node.elements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createImportSpecifier(node) {
        writer.write("ts.createImportSpecifier(");
        writer.newLine();
        writer.indent(function () {
            if (node.propertyName == null)
                writer.write("undefined");
            else {
                writeNodeText(node.propertyName);
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
        });
        writer.write(")");
    }
    function createExportAssignment(node) {
        writer.write("ts.createExportAssignment(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.isExportEquals == null)
                writer.write("undefined");
            else {
                writer.quote(node.isExportEquals.toString());
            }
            writer.write(",").newLine();
            writeNodeText(node.expression);
        });
        writer.write(")");
    }
    function createExportDeclaration(node) {
        writer.write("ts.createExportDeclaration(");
        writer.newLine();
        writer.indent(function () {
            if (node.decorators == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.decorators.length === 1) {
                    var item = node.decorators[0];
                    writeNodeText(item);
                }
                else if (node.decorators.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.decorators.length; i++) {
                            var item = node.decorators[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.modifiers == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.modifiers.length === 1) {
                    var item = node.modifiers[0];
                    writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                }
                else if (node.modifiers.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.modifiers.length; i++) {
                            var item = node.modifiers[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writer.write("ts.createModifier(ts.SyntaxKind." + syntaxKindToName[item.kind] + ")");
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            if (node.exportClause == null)
                writer.write("undefined");
            else {
                writeNodeText(node.exportClause);
            }
            writer.write(",").newLine();
            if (node.moduleSpecifier == null)
                writer.write("undefined");
            else {
                writeNodeText(node.moduleSpecifier);
            }
        });
        writer.write(")");
    }
    function createNamedExports(node) {
        writer.write("ts.createNamedExports(");
        writer.write("[");
        if (node.elements.length === 1) {
            var item = node.elements[0];
            writeNodeText(item);
        }
        else if (node.elements.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.elements.length; i++) {
                    var item = node.elements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createExportSpecifier(node) {
        writer.write("ts.createExportSpecifier(");
        writer.newLine();
        writer.indent(function () {
            if (node.propertyName == null)
                writer.write("undefined");
            else {
                writeNodeText(node.propertyName);
            }
            writer.write(",").newLine();
            writeNodeText(node.name);
        });
        writer.write(")");
    }
    function createExternalModuleReference(node) {
        writer.write("ts.createExternalModuleReference(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createJsxElement(node) {
        writer.write("ts.createJsxElement(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.openingElement);
            writer.write(",").newLine();
            writer.write("[");
            if (node.children.length === 1) {
                var item = node.children[0];
                writeNodeText(item);
            }
            else if (node.children.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.children.length; i++) {
                        var item = node.children[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writeNodeText(node.closingElement);
        });
        writer.write(")");
    }
    function createJsxSelfClosingElement(node) {
        writer.write("ts.createJsxSelfClosingElement(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.tagName);
            writer.write(",").newLine();
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.attributes);
        });
        writer.write(")");
    }
    function createJsxOpeningElement(node) {
        writer.write("ts.createJsxOpeningElement(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.tagName);
            writer.write(",").newLine();
            if (node.typeArguments == null)
                writer.write("undefined");
            else {
                writer.write("[");
                if (node.typeArguments.length === 1) {
                    var item = node.typeArguments[0];
                    writeNodeText(item);
                }
                else if (node.typeArguments.length > 1) {
                    writer.indent(function () {
                        for (var i = 0; i < node.typeArguments.length; i++) {
                            var item = node.typeArguments[i];
                            if (i > 0)
                                writer.write(",").newLine();
                            writeNodeText(item);
                        }
                    });
                }
                writer.write("]");
            }
            writer.write(",").newLine();
            writeNodeText(node.attributes);
        });
        writer.write(")");
    }
    function createJsxClosingElement(node) {
        writer.write("ts.createJsxClosingElement(");
        writeNodeText(node.tagName);
        writer.write(")");
    }
    function createJsxFragment(node) {
        writer.write("ts.createJsxFragment(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.openingFragment);
            writer.write(",").newLine();
            writer.write("[");
            if (node.children.length === 1) {
                var item = node.children[0];
                writeNodeText(item);
            }
            else if (node.children.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.children.length; i++) {
                        var item = node.children[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
            writer.write(",").newLine();
            writeNodeText(node.closingFragment);
        });
        writer.write(")");
    }
    function createJsxText(node) {
        writer.write("ts.createJsxText(");
        writer.newLine();
        writer.indent(function () {
            writer.quote(node.text.toString());
            writer.write(",").newLine();
            writer.quote(node.containsOnlyTriviaWhiteSpaces.toString());
        });
        writer.write(")");
    }
    function createJsxOpeningFragment(node) {
        writer.write("ts.createJsxOpeningFragment(");
        writer.write(")");
    }
    function createJsxJsxClosingFragment(node) {
        writer.write("ts.createJsxJsxClosingFragment(");
        writer.write(")");
    }
    function createJsxAttribute(node) {
        writer.write("ts.createJsxAttribute(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
        });
        writer.write(")");
    }
    function createJsxAttributes(node) {
        writer.write("ts.createJsxAttributes(");
        writer.write("[");
        if (node.properties.length === 1) {
            var item = node.properties[0];
            writeNodeText(item);
        }
        else if (node.properties.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.properties.length; i++) {
                    var item = node.properties[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createJsxSpreadAttribute(node) {
        writer.write("ts.createJsxSpreadAttribute(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createJsxExpression(node) {
        writer.write("ts.createJsxExpression(");
        writer.newLine();
        writer.indent(function () {
            if (node.dotDotDotToken == null)
                writer.write("undefined");
            else {
                writeNodeText(node.dotDotDotToken);
            }
            writer.write(",").newLine();
            if (node.expression == null)
                writer.write("undefined");
            else {
                writeNodeText(node.expression);
            }
        });
        writer.write(")");
    }
    function createCaseClause(node) {
        writer.write("ts.createCaseClause(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.expression);
            writer.write(",").newLine();
            writer.write("[");
            if (node.statements.length === 1) {
                var item = node.statements[0];
                writeNodeText(item);
            }
            else if (node.statements.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.statements.length; i++) {
                        var item = node.statements[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createDefaultClause(node) {
        writer.write("ts.createDefaultClause(");
        writer.write("[");
        if (node.statements.length === 1) {
            var item = node.statements[0];
            writeNodeText(item);
        }
        else if (node.statements.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.statements.length; i++) {
                    var item = node.statements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createHeritageClause(node) {
        writer.write("ts.createHeritageClause(");
        writer.newLine();
        writer.indent(function () {
            writer.write("ts.SyntaxKind.").write(syntaxKindToName[node.token]);
            writer.write(",").newLine();
            writer.write("[");
            if (node.types.length === 1) {
                var item = node.types[0];
                writeNodeText(item);
            }
            else if (node.types.length > 1) {
                writer.indent(function () {
                    for (var i = 0; i < node.types.length; i++) {
                        var item = node.types[i];
                        if (i > 0)
                            writer.write(",").newLine();
                        writeNodeText(item);
                    }
                });
            }
            writer.write("]");
        });
        writer.write(")");
    }
    function createCatchClause(node) {
        writer.write("ts.createCatchClause(");
        writer.newLine();
        writer.indent(function () {
            if (node.variableDeclaration == null)
                writer.write("undefined");
            else {
                writeNodeText(node.variableDeclaration);
            }
            writer.write(",").newLine();
            writeNodeText(node.block);
        });
        writer.write(")");
    }
    function createPropertyAssignment(node) {
        writer.write("ts.createPropertyAssignment(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.name);
            writer.write(",").newLine();
            writeNodeText(node.initializer);
        });
        writer.write(")");
    }
    function createShorthandPropertyAssignment(node) {
        writer.write("ts.createShorthandPropertyAssignment(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.objectAssignmentInitializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.objectAssignmentInitializer);
            }
        });
        writer.write(")");
    }
    function createSpreadAssignment(node) {
        writer.write("ts.createSpreadAssignment(");
        writeNodeText(node.expression);
        writer.write(")");
    }
    function createEnumMember(node) {
        writer.write("ts.createEnumMember(");
        writer.newLine();
        writer.indent(function () {
            writeNodeText(node.name);
            writer.write(",").newLine();
            if (node.initializer == null)
                writer.write("undefined");
            else {
                writeNodeText(node.initializer);
            }
        });
        writer.write(")");
    }
    function createCommaList(node) {
        writer.write("ts.createCommaList(");
        writer.write("[");
        if (node.elements.length === 1) {
            var item = node.elements[0];
            writeNodeText(item);
        }
        else if (node.elements.length > 1) {
            writer.indent(function () {
                for (var i = 0; i < node.elements.length; i++) {
                    var item = node.elements[i];
                    if (i > 0)
                        writer.write(",").newLine();
                    writeNodeText(item);
                }
            });
        }
        writer.write("]");
        writer.write(")");
    }
    function createSyntaxKindToNameMap() {
        var map = {};
        for (var _i = 0, _a = Object.keys(ts.SyntaxKind).filter(function (k) { return isNaN(parseInt(k, 10)); }); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var value = ts.SyntaxKind[name_1];
            if (map[value] == null)
                map[value] = name_1;
        }
        return map;
    }
    function getNodeFlagValues(value) {
        // ignore the BlockScoped node flag
        return getFlagValuesAsString(ts.NodeFlags, "ts.NodeFlags", value || 0, "None", getFlagValues(ts.NodeFlags, value).filter(function (v) { return v !== ts.NodeFlags.BlockScoped; }));
    }
    function getFlagValuesAsString(enumObj, enumName, value, defaultName, flagValues) {
        flagValues = flagValues || getFlagValues(enumObj, value);
        var members = [];
        for (var _i = 0, flagValues_1 = flagValues; _i < flagValues_1.length; _i++) {
            var flagValue = flagValues_1[_i];
            members.push(enumName + "." + enumObj[flagValue]);
        }
        if (members.length === 0)
            members.push(enumName + "." + defaultName);
        return members.join(" | ");
    }
    function getFlagValues(enumObj, value) {
        var members = [];
        for (var prop in enumObj) {
            if (typeof enumObj[prop] === "string")
                continue;
            if ((enumObj[prop] & value) !== 0)
                members.push(enumObj[prop]);
        }
        return members;
    }
}
exports.generateFactoryCode = generateFactoryCode;
