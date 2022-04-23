import * as _ from 'lodash';
import MagicString from 'magic-string';
import { Base54 } from './base54';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export class ES6ClassUglify {
  private mapping = new Map();
  private replaceMap = new Map();
  private varMap = new Map();
  private varID = 0;
  private exclude: string[];
  private base54 = new Base54();
  private test: (name: string) => boolean;

  constructor(test: (name: string) => boolean = (name: string) => /^_\w+$/.test(name)) {
    this.exclude = ['_blank', '__moduleExports'];
    this.test = test;
  }

  minify(code) {
    this.process(code);

    const magicCode = new MagicString(code);

    // 下面可以无脑正则替换了
    for (const [name, newName] of this.mapping) {
      const regex = new RegExp(`\\W${name}\\W`, 'g');

      while (true) {
        const match = regex.exec(code);
        if (match == null) {
          break;
        }
        magicCode.overwrite(match.index + 1, match.index + 1 + name.length, newName);
        regex.lastIndex = match.index + 1;
      }
    }

    return {
      code: magicCode.toString(),
      map: magicCode.generateMap({ hires: true }),
    };
  }

  private setReplaceMap(name: string) {
    if (this.test(name) && !this.exclude.some((e) => name.startsWith(e))) {
      this.replaceMap.set(name, (this.replaceMap.get(name) || 0) + 1);
    } else {
      this.setValueMap(name);
    }
  }

  private setValueMap(name: string) {
    if (this.replaceMap.has(name)) {
      throw new Error(`变量:${name} 不能和class 属性或方法重名`);
    }
    this.varMap.set(name, name);
  }

  private generateIdentifier() {
    const id = this.base54.identifier(this.varID++);
    if (this.varMap.has(id) || this.replaceMap.has(id)) {
      return this.generateIdentifier();
    }
    return id;
  }

  private process(code) {
    const ast = parser.parse(code, {
      plugins: [
        'typescript',
        'jsx',
        'classProperties',
        'decorators-legacy',
        'doExpressions',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'optionalChaining',
        'typescript',
        'dynamicImport',
        'classPrivateMethods',
        'classPrivateProperties',
        'asyncGenerators',
        'asyncDoExpressions',
        'objectRestSpread',
        'classStaticBlock',
      ],
      sourceType: 'module',
    });
    traverse(ast, {
      ClassMethod: ({ node }) => {
        if (t.isIdentifier(node.key)) {
          const name = node.key.name;
          this.setReplaceMap(name);
        } else {
          throw new Error('不支持 ClassMethod key为 string number 表达式类型');
        }
        node.params.forEach((n) => {
          if (t.isIdentifier(n)) {
            this.setValueMap(n.name);
          }
        });
      },
      ClassProperty: ({ node }) => {
        if (!t.isIdentifier(node)) {
          const name = (node.key as t.Identifier).name;
          this.setReplaceMap(name);
        } else {
          throw new Error('不支持 ClassProperty 为 string number 表达式类型');
        }
      },
      ClassDeclaration: ({ node }) => {
        this.setValueMap(node.id.name);
      },
      FunctionDeclaration: ({ node }) => {
        if (t.isIdentifier(node.id)) {
          const name = node.id.name;
          this.setValueMap(name);
        }
        node.params.forEach((n) => {
          if (t.isIdentifier(n)) {
            this.setValueMap(n.name);
          }
        });
      },
      VariableDeclarator: ({ node }) => {
        if (t.isIdentifier(node.id)) {
          this.setValueMap(node.id.name);
        }
      },
      FunctionExpression: ({ node }) => {
        if (t.isIdentifier(node.id)) {
          const name = node.id.name;
          this.setValueMap(name);
        }
        node.params.forEach((n) => {
          if (t.isIdentifier(n)) {
            this.setValueMap(n.name);
          }
        });
      },
      RestElement: ({ node }) => {
        if (t.isIdentifier(node.argument)) {
          this.setValueMap(node.argument.name);
        }
      },
      AssignmentPattern: ({ node }) => {
        if (t.isIdentifier(node.left)) {
          this.setValueMap(node.left.name);
        }
      },
      ArrayPattern: ({ node }) => {
        node.elements.forEach((n) => {
          if (n) {
            if (t.isIdentifier(n)) {
              this.setValueMap(n.name);
            }
          }
        });
      },
      ObjectPattern: ({ node }) => {},
      TSParameterProperty: ({ node }) => {
        if (t.isIdentifier(node.parameter)) {
          this.setValueMap(node.parameter.name);
        }
      },
      ObjectProperty: ({ node }) => {
        if (t.isIdentifier(node.key)) {
          this.setValueMap(node.key.name);
        }
      },
      ObjectMethod: ({ node }) => {
        if (t.isIdentifier(node.key)) {
          const name = node.key.name;
          this.setValueMap(name);
        }
        node.params.forEach((n) => {
          if (t.isIdentifier(n)) {
            this.setValueMap(n.name);
          } else {
            throw new Error('不支持 ObjectMethod 为 string number 表达式类型');
          }
        });
      },
    });
    const sorted = _.sortBy([...this.replaceMap.entries()], (a) => {
      return -a[1];
    });
    for (const [key] of sorted) {
      if (!this.mapping.has(key)) {
        this.mapping.set(key, this.generateIdentifier());
      }
    }
  }
}
