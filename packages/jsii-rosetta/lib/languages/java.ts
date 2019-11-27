import ts = require('typescript');
import { DefaultVisitor } from './default';
import { AstRenderer } from '../renderer';
import { OTree } from '../o-tree';
import { builtInTypeName } from '../typescript/types';
import { isReadOnly, visibility } from '../typescript/ast-utils';

interface JavaContext {
  readonly insideTypeDeclaration?: InsideTypeDeclaration;
}

interface InsideTypeDeclaration {
  readonly typeName: ts.Node | undefined;
}

type JavaRenderer = AstRenderer<JavaContext>;

export class JavaVisitor extends DefaultVisitor<JavaContext> {
  readonly defaultContext = {};

  public mergeContext(old: JavaContext, update: Partial<JavaContext>): JavaContext {
    return Object.assign({}, old, update);
  }

  public classDeclaration(node: ts.ClassDeclaration, renderer: JavaRenderer): OTree {
    return new OTree(
      [
        'public ',
        'class ',
        renderer.convert(node.name),
        ...this.typeHeritage(node, renderer),
        ' {',
      ],
      renderer
        .updateContext({ insideTypeDeclaration: { typeName: node.name } })
        .convertAll(node.members),
      {
        indent: 4,
        canBreakLine: true,
        suffix: '\n}',
      },
    );
  }

  public propertyDeclaration(node: ts.PropertyDeclaration, renderer: JavaRenderer): OTree {
    const vis = visibility(node);

    return new OTree(
      [
        vis,
        isReadOnly(node) ? ' final' : '',
        ' ',
        this.renderTypeNode(node.type, renderer),
        ' ',
        renderer.convert(node.name),
        ';',
      ],
      [],
      {
        canBreakLine: true,
      },
    );
  }

  public constructorDeclaration(node: ts.ConstructorDeclaration, renderer: JavaRenderer): OTree {
    return this.methodOrConstructor(node, renderer,
        renderer.currentContext.insideTypeDeclaration!.typeName,
        undefined);
  }

  public methodDeclaration(node: ts.MethodDeclaration, renderer: JavaRenderer): OTree {
    return this.methodOrConstructor(node, renderer,
        node.name,
        this.renderTypeNode(node.type, renderer));
  }

  public parameterDeclaration(node: ts.ParameterDeclaration, renderer: JavaRenderer): OTree {
    return new OTree([
      this.renderTypeNode(node.type, renderer),
      ' ',
      renderer.convert(node.name),
    ]);
  }

  public block(node: ts.Block, renderer: JavaRenderer): OTree {
    return new OTree(['{'], renderer.convertAll(node.statements), {
      indent: 4,
      suffix: '\n}',
    });
  }

  public expressionStatement(node: ts.ExpressionStatement, renderer: JavaRenderer): OTree {
    const inner = renderer.convert(node.expression);
    return inner.isEmpty
        ? inner
        : new OTree([inner, ';'], [], { canBreakLine: true });
  }

  public ifStatement(node: ts.IfStatement, renderer: JavaRenderer): OTree {
    const ifStmt = new OTree(
      [
        'if (',
        renderer.convert(node.expression),
        ') ',
      ],
      [
        renderer.convert(node.thenStatement),
      ],
      {
        canBreakLine: true,
      },
    );
    const elseStmt = node.elseStatement
        ? new OTree(['else '], [renderer.convert(node.elseStatement)], { canBreakLine: true })
        : undefined;

    return elseStmt
        ? new OTree(
          [],
          [ifStmt, elseStmt],
          {
            separator: ' ',
            canBreakLine: true,
          },
        )
        : ifStmt;
  }

  public printStatement(args: ts.NodeArray<ts.Expression>, renderer: JavaRenderer) {
    return new OTree([
      'System.out.println(',
      ...renderer.convertAll(args),
      ')',
    ]);
  }

  public propertyAccessExpression(node: ts.PropertyAccessExpression, renderer: JavaRenderer): OTree {
    const expressionText = renderer.textOf(node.expression);
    return new OTree(
      [
        ...(expressionText === 'this' ? ['this', '.'] : []),
        renderer.convert(node.name),
      ]
    );
  }

  private typeHeritage(node: ts.ClassDeclaration, renderer: JavaRenderer): Array<OTree | string | undefined> {
    return [
        ...this.extractSuperTypes(node, renderer, ts.SyntaxKind.ExtendsKeyword, 'extends'),
        ...this.extractSuperTypes(node, renderer, ts.SyntaxKind.ImplementsKeyword, 'implements'),
    ];
  }

  private extractSuperTypes(node: ts.ClassDeclaration, renderer: JavaRenderer, heritageKeyword: ts.SyntaxKind, outputKeyword: string): Array<OTree | string | undefined> {
    const heritageClause = (node.heritageClauses || [])
      .find(hc => hc.token === heritageKeyword);
    const superTypes = heritageClause
        ? heritageClause.types.map(t => renderer.convert(t.expression))
        : [];
    return superTypes.length > 0
        ? [
          ` ${outputKeyword} `,
          new OTree([], superTypes, { separator: ', ' }),
        ]
        : [];
  }

  private renderTypeNode(typeNode: ts.TypeNode | undefined, renderer: JavaRenderer): string {
    if (!typeNode) {
      return 'void';
    }

    const type = renderer.typeOfType(typeNode);

    const typeScriptBuiltInType = builtInTypeName(type);
    if (!typeScriptBuiltInType) {
      return '???';
    }

    switch (typeScriptBuiltInType) {
      case 'string': return 'String';
      default: return typeScriptBuiltInType;
    }
  }

  private methodOrConstructor(node: ts.ConstructorDeclaration | ts.MethodDeclaration, renderer: JavaRenderer,
                              methodOrConstructorName: ts.Node | undefined, returnType: string | undefined): OTree {
    return new OTree(
      [
        'public ',
        returnType ? `${returnType} ` : undefined,
        renderer.convert(methodOrConstructorName),
        '(',
        new OTree([], renderer.convertAll(node.parameters), { separator: ', ' }),
        ') ',
      ],
      [
        renderer.convert(node.body)
      ],
      {
        canBreakLine: true
      },
    );
  }
}