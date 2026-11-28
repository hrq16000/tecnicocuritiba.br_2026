import ts from "typescript";

const ROUTES = [
  { wrapper: "trackWaClick", kind: "whatsapp", event: "wa_click" },
  { wrapper: "trackCallClick", kind: "phone", event: "call_click" },
];

/** Inspect executable calls in the wrapper and shared helper, not comments or
 * literals in unrelated functions. Does not execute analytics or access data. */
export function checkConversionRoutes(text) {
  const source = ts.createSourceFile("funnelAnalytics.ts", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const functions = new Map();
  for (const statement of source.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) {
      functions.set(statement.name.text, statement);
    } else if (ts.isVariableStatement(statement)) {
      for (const d of statement.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer &&
            (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) {
          functions.set(d.name.text, d.initializer);
        }
      }
    }
  }
  function calls(fn) {
    const found = [];
    if (!fn?.body) return found;
    const visit = (node) => {
      if (ts.isFunctionLike(node)) return;
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) found.push(node);
      ts.forEachChild(node, visit);
    };
    visit(fn.body);
    return found;
  }
  const has = (list, name, match) => list.some(c => c.expression.text === name && match(c.arguments));
  const literal = (node, value) => !!node && ts.isStringLiteral(node) && node.text === value;
  const identifier = (node, value) => !!node && ts.isIdentifier(node) && node.text === value;

  const helper = functions.get("trackConversionClick");
  const param = helper?.parameters[1]?.name;
  const eventName = param && ts.isIdentifier(param) ? param.text : null;
  const indirect = eventName ? calls(helper) : [];
  const forwards = (target) => !!eventName && has(indirect, target, a => identifier(a[0], eventName));

  const errors = [];
  for (const { wrapper, kind, event } of ROUTES) {
    const own = calls(functions.get(wrapper));
    const delegates = has(own, "trackConversionClick", a => literal(a[0], kind) && literal(a[1], event));
    const checks = [
      ["track", `GA4 não dispara "${event}" em ${wrapper}`],
      ["persistClickEvent", `"${event}" não é persistido em click_events por ${wrapper}`],
    ];
    for (const [target, message] of checks) {
      if (!has(own, target, a => literal(a[0], event)) && !(delegates && forwards(target))) errors.push(message);
    }
  }
  return errors;
}
