export class ExpressionEvaluator {
  private static readonly FORBIDDEN_PATTERNS = [
    'eval', 'Function', 'constructor', 'prototype', '__proto__',
    'import', 'require', 'process', 'global', 'window', 'document'
  ];

  static evaluate(expression: string, source: any): any {
    this.validateExpression(expression);
    
    try {
      const func = new Function('source', `'use strict'; return ${expression}`);
      return func(source);
    } catch (error) {
      throw new Error(`Failed to evaluate expression "${expression}": ${(error as Error).message}`);
    }
  }

  static validateExpression(expression: string): void {
    for (const pattern of this.FORBIDDEN_PATTERNS) {
      if (expression.includes(pattern)) {
        throw new Error(`Forbidden pattern "${pattern}" found in expression`);
      }
    }

    if (expression.includes(';') || expression.includes('`')) {
      throw new Error('Suspicious characters found in expression');
    }

    if (!expression.includes('source.')) {
      throw new Error('Expression must reference source object (e.g., source.field)');
    }
  }

  static isValidExpression(expression: string): boolean {
    try {
      this.validateExpression(expression);
      new Function('source', `'use strict'; return ${expression}`);
      return true;
    } catch {
      return false;
    }
  }

  static getDependencies(expression: string): string[] {
    const dependencies: string[] = [];
    const regex = /source\.(\w+)/g;
    let match;

    while ((match = regex.exec(expression)) !== null) {
      dependencies.push(match[1]);
    }

    return Array.from(new Set(dependencies));
  }

  static safeEvaluate(expression: string, source: any): any {
    this.validateExpression(expression);

    const deps = this.getDependencies(expression);
    const values: any = {};
    
    deps.forEach(dep => {
      values[dep] = source[dep];
    });

    let safeExpr = expression;
    deps.forEach(dep => {
      safeExpr = safeExpr.replace(new RegExp(`source\\.${dep}`, 'g'), `values.${dep}`);
    });

    try {
      const func = new Function('values', `'use strict'; return ${safeExpr}`);
      return func(values);
    } catch (error) {
      throw new Error(`Failed to evaluate expression: ${(error as Error).message}`);
    }
  }
}

