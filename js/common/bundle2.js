(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
const evaluatex = require("evaluatex");

global.window.evaluatex = evaluatex;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"evaluatex":10}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Node represents a node in an abstract syntax tree. Nodes have the following properties:
 *  - A type, which determines how it is evaluated;
 *  - A value, such as a number or function; and
 *  - An ordered list of children.
 */
var Node = function () {
    function Node(type) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        _classCallCheck(this, Node);

        this.type = type;
        this.value = value;
        this.name = null; // Used in function and command nodes to retain the fn name when minified
        this.children = [];
    }

    /**
     * Adds a node to the list of children and returns this Node.
     * @param node Child node to addChild.
     * @returns {Node} This node.
     */


    _createClass(Node, [{
        key: "addChild",
        value: function addChild(node) {
            this.children.push(node);
            return this;
        }

        /**
         * Returns this Node's first child.
         */

    }, {
        key: "evaluate",


        /**
         * Evaluates this Node and all child nodes recursively, returning the numerical result of this Node.
         */
        value: function evaluate(vars) {
            var result = 0;

            switch (this.type) {
                case Node.TYPE_FUNCTION:
                    var evaluatedChildren = this.children.map(function (childNode) {
                        return childNode.evaluate(vars);
                    });
                    result = this.value.apply(this, evaluatedChildren);
                    break;
                case Node.TYPE_INVERSE:
                    result = 1.0 / this.child.evaluate(vars);
                    break;
                case Node.TYPE_NEGATE:
                    result = -this.child.evaluate(vars);
                    break;
                case Node.TYPE_NUMBER:
                    result = this.value;
                    break;
                case Node.TYPE_POWER:
                    result = Math.pow(this.children[0].evaluate(vars), this.children[1].evaluate(vars));
                    break;
                case Node.TYPE_PRODUCT:
                    result = this.children.reduce(function (product, child) {
                        return product * child.evaluate(vars);
                    }, 1);
                    break;
                case Node.TYPE_SUM:
                    result = this.children.reduce(function (sum, child) {
                        return sum + child.evaluate(vars);
                    }, 0);
                    break;
                case Node.TYPE_SYMBOL:
                    if (isFinite(vars[this.value])) {
                        return vars[this.value];
                    }
                    throw new Error("Symbol " + this.value + " is undefined or not a number");
            }

            return result;
        }

        /**
         * Determines whether this Node is unary, i.e., whether it can have only one child.
         * @returns {boolean}
         */

    }, {
        key: "isUnary",
        value: function isUnary() {
            return UNARY_NODES.indexOf(this.type) >= 0;
        }
    }, {
        key: "printTree",


        /**
         * Prints a tree-like representation of this Node and all child Nodes to the console.
         * Useful for debugging parser problems.
         * If printTree() is called on the root node, it prints the whole AST!
         * @param level (Integer, Optional) Initial level of indentation. You shouldn't need to use this.
         */
        value: function printTree() {
            var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            // Generate the indent string from the current `level`.
            // Child nodes will have a greater `level` and will appear indented.
            var indent = "";
            var indentString = "  ";
            for (var i = 0; i < level; i++) {
                indent += indentString;
            }

            console.log(indent + this.toString());

            // Print each child.
            for (var _i in this.children) {
                this.children[_i].printTree(level + 1);
            }
        }
    }, {
        key: "simplify",
        value: function simplify() {
            if (this.children.length > 1 || this.isUnary()) {
                // Node can't be simplified.
                // Clone this Node and simplify its children.
                var newNode = new Node(this.type, this.value);
                for (var i in this.children) {
                    newNode.addChild(this.children[i].simplify());
                }
                return newNode;
            } else if (this.children.length === 1) {
                // A non-unary node with no children has no function.
                return this.children[0].simplify();
            } else {
                // A node with no children is a terminal.
                return this;
            }
        }
    }, {
        key: "toString",
        value: function toString() {
            var val = typeof this.value === "function" ? this.name : this.value;
            return this.children.length + " " + this.type + " [" + val + "]";
        }
    }, {
        key: "child",
        get: function get() {
            return this.children[0];
        }
    }, {
        key: "nodeCount",
        get: function get() {
            var count = 1;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    count += i.nodeCount;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return count;
        }
    }]);

    return Node;
}();

Node.TYPE_FUNCTION = "FUNCTION";
Node.TYPE_INVERSE = "INVERSE";
Node.TYPE_NEGATE = "NEGATE";
Node.TYPE_NUMBER = "NUMBER";
Node.TYPE_POWER = "POWER";
Node.TYPE_PRODUCT = "PRODUCT";
Node.TYPE_SUM = "SUM";
Node.TYPE_SYMBOL = "SYMBOL";
exports.default = Node;


var UNARY_NODES = ["FACTORIAL", "FUNCTION", "INVERSE", "NEGATE"];
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Token represents a lexical token. It has a type and a value.
 * @param type (String) Token type. A list of types is found in "utils/tokens.js".
 * @param value Value of the token.
 */
var Token = function () {
    function Token(type) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        _classCallCheck(this, Token);

        this.type = type;
        this.value = value;
        this.name = null; // Used in function and command tokens to retain the fn name when minified
    }

    _createClass(Token, [{
        key: "equals",
        value: function equals(token) {
            return this.type === token.type && this.value === token.value;
        }
    }, {
        key: "toString",
        value: function toString() {
            if (TRIVIAL_TOKENS.indexOf(this.type) >= 0) {
                return this.type;
            }

            var val = typeof this.value === "function" ? this.name : this.value;

            return this.type + "[" + val + "]";
        }
    }]);

    return Token;
}();

Token.TYPE_LPAREN = "LPAREN";
Token.TYPE_RPAREN = "RPAREN";
Token.TYPE_PLUS = "PLUS";
Token.TYPE_MINUS = "MINUS";
Token.TYPE_TIMES = "TIMES";
Token.TYPE_DIVIDE = "DIVIDE";
Token.TYPE_COMMAND = "COMMAND";
Token.TYPE_SYMBOL = "SYMBOL";
Token.TYPE_WHITESPACE = "WHITESPACE";
Token.TYPE_ABS = "ABSOLUTEVAL";
Token.TYPE_BANG = "BANG";
Token.TYPE_COMMA = "COMMA";
Token.TYPE_POWER = "POWER";
Token.TYPE_NUMBER = "NUMBER";
Token.patterns = new Map([[Token.TYPE_LPAREN, /(\(|\[|{|\\left\(|\\left\[)/], // Match (, [, {, \left(, \left[
[Token.TYPE_RPAREN, /(\)|]|}|\\right\)|\\right])/], // Match ), ], }, \right), \right]
[Token.TYPE_PLUS, /\+/], [Token.TYPE_MINUS, /-/], [Token.TYPE_TIMES, /\*/], [Token.TYPE_DIVIDE, /\//], [Token.TYPE_COMMAND, /\\[A-Za-z]+/], [Token.TYPE_SYMBOL, /[A-Za-z_][A-Za-z_0-9]*/], [Token.TYPE_WHITESPACE, /\s+/], // Whitespace
[Token.TYPE_ABS, /\|/], [Token.TYPE_BANG, /!/], [Token.TYPE_COMMA, /,/], [Token.TYPE_POWER, /\^/], [Token.TYPE_NUMBER, /\d+(\.\d+)?/]]);
exports.default = Token;
;

/**
 * Trivial tokens are those that can only have a single value, so printing their value is unnecessary.
 */
var TRIVIAL_TOKENS = ["TPLUS", "TMINUS", "TTIMES", "TDIVIDE", "TWS", "TABS", "TBANG", "TCOMMA", "TPOWER"];
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = evaluatex;

var _lexer = require("./lexer");

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parses a given math expression and returns a function that computes the result.
 * @param {String} expression Math expression to parse.
 * @param {Object} constants A map of constants that will be compiled into the resulting function.
 * @param {Object} options Options to Evaluatex.
 * @returns {fn} A function that takes an optional map of variables. When invoked, this function computes the math expression and returns the result. The function has fields `ast` and `expression`, which respectively hold the AST and original math expression.
 */
function evaluatex(expression) {
    var constants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var tokens = (0, _lexer2.default)(expression, constants, options);
    var ast = (0, _parser2.default)(tokens).simplify();
    var fn = function fn() {
        var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return ast.evaluate(variables);
    };
    fn.ast = ast;
    fn.expression = expression;
    fn.tokens = tokens;
    return fn;
}
},{"./lexer":5,"./parser":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = lexer;

var _Token = require("./Token");

var _Token2 = _interopRequireDefault(_Token);

var _arities = require("./util/arities");

var _arities2 = _interopRequireDefault(_arities);

var _localFunctions = require("./util/localFunctions");

var _localFunctions2 = _interopRequireDefault(_localFunctions);

var _replaceToken = require("./util/replaceToken");

var _replaceToken2 = _interopRequireDefault(_replaceToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Single-arg tokens are those that, when in LaTeX mode, read only one character as their argument OR a block delimited by { }. For example, `x ^ 24` would be read as `SYMBOL(x) POWER NUMBER(2) NUMBER(4).
var CHAR_ARG_TOKENS = [_Token2.default.TYPE_POWER, _Token2.default.TYPE_COMMAND];

var DEFAULT_OPTS = {
    latex: false
};

/**
 * The lexer reads a math expression and breaks it down into easily-digestible Tokens.
 * A list of valid tokens can be found lower in this file.
 * @param equation (String) The equation to lex.
 * @param constants (Object) An object of functions and variables.
 * @param opts Options.
 * @returns {Array} An array of Tokens.
 */
function lexer(equation) {
    var constants = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTS;

    var l = new Lexer(equation, constants, opts);
    l.lex();

    // toString() each token and concatenate into a big string. Useful for debugging.
    l.tokens.toString = function () {
        return l.tokens.map(function (token) {
            return token.toString();
        }).join(" ");
    };

    return l.tokens;
}

var Lexer = function () {
    function Lexer(buffer, constants, opts) {
        _classCallCheck(this, Lexer);

        this.buffer = buffer;
        this.constants = Object.assign({}, constants, _localFunctions2.default);
        this.opts = opts;
        this.tokens = [];
    }

    _createClass(Lexer, [{
        key: "lex",
        value: function lex() {
            this.lexExpression();
            this.replaceConstants();
            this.replaceCommands();
        }

        /**
         * Lexes an expression or sub-expression.
         */

    }, {
        key: "lexExpression",
        value: function lexExpression() {
            var charMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            while (this.hasNext()) {
                var token = charMode ? this.nextCharToken() : this.next();
                this.tokens.push((0, _replaceToken2.default)(token));

                if (this.opts.latex && isCharArgToken(token)) {
                    var arity = 1;
                    if (token.type === _Token2.default.TYPE_COMMAND) {
                        arity = _arities2.default[token.value.substr(1).toLowerCase()];
                    }
                    for (var i = 0; i < arity; i++) {
                        this.lexExpression(true);
                    }
                } else if (isStartGroupToken(token)) {
                    this.lexExpression(false);
                }

                if (charMode || isEndGroupToken(token)) {
                    return;
                }
            }
        }
    }, {
        key: "hasNext",
        value: function hasNext() {
            return this.buffer.length > 0;
        }

        /**
         * Retrieves the next non-whitespace token from the buffer.
         * @param len
         * @returns {Token}
         */

    }, {
        key: "next",
        value: function next() {
            var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

            this.skipWhitespace();

            if (!this.hasNext()) {
                throw "Lexer error: reached end of stream";
            }

            // Try to match each pattern in tokenPatterns to the remaining buffer
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _Token2.default.patterns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var type = _ref2[0];
                    var regex = _ref2[1];

                    // Force the regex to match only at the beginning of the string
                    var regexFromStart = new RegExp(/^/.source + regex.source);

                    // When `len` is undefined, substr reads to the end
                    var match = regexFromStart.exec(this.buffer.substr(0, len));
                    if (match) {
                        this.buffer = this.buffer.substr(match[0].length);
                        return new _Token2.default(type, match[0]);
                    }
                }

                // TODO: Meaningful error
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            throw "Lexer error: can't match any token";
        }

        /**
         * Tokenizes the next single character of the buffer, unless the following token is a LaTeX command, in which case the entire command is tokenized.
         */

    }, {
        key: "nextCharToken",
        value: function nextCharToken() {
            this.skipWhitespace();
            if (this.buffer.charAt(0) === "\\") {
                return this.next();
            }
            return this.next(1);
        }
    }, {
        key: "replaceCommands",
        value: function replaceCommands() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.tokens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var token = _step2.value;

                    if (token.type === _Token2.default.TYPE_COMMAND) {
                        token.value = token.value.substr(1).toLowerCase();
                        token.name = token.value; // Save name of function for debugging later
                        token.value = this.constants[token.name];
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "replaceConstants",
        value: function replaceConstants() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.tokens[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var token = _step3.value;

                    if (token.type === _Token2.default.TYPE_SYMBOL) {
                        // Symbols will need to be looked up during the evaluation phase.
                        // If the symbol refers to things defined in either Math or
                        // the locals, compile them, to prevent slow lookups later.
                        if (typeof this.constants[token.value] === "function") {
                            token.type = _Token2.default.TYPE_FUNCTION;
                            token.name = token.value; // Save name of function for debugging later
                            token.value = this.constants[token.value];
                        } else if (typeof this.constants[token.value] === "number") {
                            token.type = _Token2.default.TYPE_NUMBER;
                            token.value = token.fn = this.constants[token.value];
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        /**
         * Removes whitespace from the beginning of the buffer.
         */

    }, {
        key: "skipWhitespace",
        value: function skipWhitespace() {
            var regex = new RegExp(/^/.source + _Token2.default.patterns.get(_Token2.default.TYPE_WHITESPACE).source);
            this.buffer = this.buffer.replace(regex, "");
        }
    }]);

    return Lexer;
}();

function isCharArgToken(token) {
    return CHAR_ARG_TOKENS.indexOf(token.type) !== -1;
}

function isStartGroupToken(token) {
    return token.type === _Token2.default.TYPE_LPAREN && token.value === "{";
}

function isEndGroupToken(token) {
    return token.type === _Token2.default.TYPE_RPAREN && token.value === "}";
}
},{"./Token":3,"./util/arities":7,"./util/localFunctions":8,"./util/replaceToken":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = parser;

var _Node = require("./Node");

var _Node2 = _interopRequireDefault(_Node);

var _Token = require("./Token");

var _Token2 = _interopRequireDefault(_Token);

var _arities = require("./util/arities");

var _arities2 = _interopRequireDefault(_arities);

var _localFunctions = require("./util/localFunctions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Parser
// ======

// The parser takes a list of Token objects and tries to construct a syntax
// tree that represents the math to be evaluated, taking into account the
// correct order of operations.
// This is a simple recursive-descent parser based on [Wikipedia's example](https://en.wikipedia.org/wiki/Recursive_descent_parser).

function parser(tokens) {
    var p = new Parser(tokens);
    return p.parse();
};

var Parser = function () {
    function Parser() {
        var tokens = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Parser);

        this.cursor = 0;
        this.tokens = tokens;
    }

    _createClass(Parser, [{
        key: "parse",
        value: function parse() {
            //this.preprocess();
            var ast = this.sum();
            ast = ast.simplify();

            // Throw an exception if there are still tokens remaining after parsing
            if (this.currentToken !== undefined) {
                console.log(ast.printTree());
                throw "Parsing error: Expected end of input, but got " + this.currentToken.type + " " + this.currentToken.value;
            }

            return ast;
        }

        //preprocess() {
        // This function used to contain procedures to remove whitespace
        // tokens and replace symbol tokens with functions, but that work
        // has been moved to the lexer in order to keep the parser more
        // lightweight.
        //}

        /**
         * Accepts the current token if it matches the given type.
         * If it does, the cursor is incremented and this method returns true.
         * If it doesn't, the cursor stays where it is and this method returns false.
         * @param type Type of token to accept.
         * @returns {boolean} True if the token was accepted.
         */

    }, {
        key: "accept",
        value: function accept(type) {
            if (this.currentToken && this.currentToken.type === type) {
                this.cursor++;
                return true;
            }
            return false;
        }

        /**
         * Accepts the current token if it matches the given type.
         * If it does, the cursor is incremented.
         * If it doesn't, an exception is raised.
         * @param type
         */

    }, {
        key: "expect",
        value: function expect(type) {
            if (!this.accept(type)) {
                throw "Expected " + type + " but got " + (this.currentToken ? this.currentToken.toString() : "end of input.");
            }
        }

        // Rules
        // -----

        /**
         * Parses a math expression with
         */

    }, {
        key: "sum",
        value: function sum() {
            var node = new _Node2.default(_Node2.default.TYPE_SUM);
            node.addChild(this.product());

            while (true) {
                // Continue to accept chained addends
                if (this.accept(_Token2.default.TYPE_PLUS)) {
                    node.addChild(this.product());
                } else if (this.accept(_Token2.default.TYPE_MINUS)) {
                    node.addChild(new _Node2.default(_Node2.default.TYPE_NEGATE).addChild(this.product()));
                } else {
                    break;
                }
            }

            return node;
        }
    }, {
        key: "product",
        value: function product() {
            var node = new _Node2.default(_Node2.default.TYPE_PRODUCT);
            node.addChild(this.power());

            while (true) {
                // Continue to accept chained multiplicands

                if (this.accept(_Token2.default.TYPE_TIMES)) {
                    node.addChild(this.power());
                } else if (this.accept(_Token2.default.TYPE_DIVIDE)) {
                    node.addChild(new _Node2.default(_Node2.default.TYPE_INVERSE).addChild(this.power()));
                } else if (this.accept(_Token2.default.TYPE_LPAREN)) {
                    this.cursor--;
                    node.addChild(this.power());
                } else if (this.accept(_Token2.default.TYPE_SYMBOL) || this.accept(_Token2.default.TYPE_NUMBER) || this.accept(_Token2.default.TYPE_FUNCTION)) {
                    this.cursor--;
                    node.addChild(this.power());
                } else {
                    break;
                }
            }

            return node;
        }
    }, {
        key: "power",
        value: function power() {
            var node = new _Node2.default(_Node2.default.TYPE_POWER);
            node.addChild(this.val());

            // If a chained power is encountered (e.g. a ^ b ^ c), treat it like
            // a ^ (b ^ c)
            if (this.accept(_Token2.default.TYPE_POWER)) {
                node.addChild(this.power());
            }

            return node;
        }
    }, {
        key: "val",
        value: function val() {
            // Don't create a new node immediately, since we need to parse postfix
            // operators like factorials, which come after a value.
            var node = {};

            if (this.accept(_Token2.default.TYPE_SYMBOL)) {
                node = new _Node2.default(_Node2.default.TYPE_SYMBOL, this.prevToken.value);
            } else if (this.accept(_Token2.default.TYPE_NUMBER)) {
                node = new _Node2.default(_Node2.default.TYPE_NUMBER, parseFloat(this.prevToken.value));
            } else if (this.accept(_Token2.default.TYPE_COMMAND)) {
                var cmdToken = this.prevToken;
                node = new _Node2.default(_Node2.default.TYPE_FUNCTION, cmdToken.value);
                node.name = cmdToken.name;

                for (var i = 0; i < _arities2.default[cmdToken.name]; i++) {
                    node.addChild(this.val());
                }
            } else if (this.accept(_Token2.default.TYPE_FUNCTION)) {
                node = new _Node2.default(_Node2.default.TYPE_FUNCTION, this.prevToken.value);
                node.name = this.prevToken.name;

                // Multi-param functions require parens and have commas
                if (this.accept(_Token2.default.TYPE_LPAREN)) {
                    node.addChild(this.sum());

                    while (this.accept(_Token2.default.TYPE_COMMA)) {
                        node.addChild(this.sum());
                    }

                    this.expect(_Token2.default.TYPE_RPAREN);
                }

                // Single-parameter functions don't need parens
                else {
                        node.addChild(this.power());
                    }
            } else if (this.accept(_Token2.default.TYPE_MINUS)) {
                node = new _Node2.default(_Node2.default.TYPE_NEGATE).addChild(this.power());
            } else if (this.accept(_Token2.default.TYPE_LPAREN)) {
                node = this.sum();
                this.expect(_Token2.default.TYPE_RPAREN);
            } else if (this.accept(_Token2.default.TYPE_ABS)) {
                node = new _Node2.default(_Node2.default.TYPE_FUNCTION, Math.abs);
                node.addChild(this.sum());
                this.expect(_Token2.default.TYPE_ABS);
            } else {
                throw "Unexpected " + this.currentToken.toString() + " at token " + this.cursor;
            }

            if (this.accept(_Token2.default.TYPE_BANG)) {
                var factNode = new _Node2.default(_Node2.default.TYPE_FUNCTION, _localFunctions.fact);
                factNode.addChild(node);
                return factNode;
            }

            return node;
        }
    }, {
        key: "currentToken",
        get: function get() {
            return this.tokens[this.cursor];
        }
    }, {
        key: "prevToken",
        get: function get() {
            return this.tokens[this.cursor - 1];
        }
    }]);

    return Parser;
}();

/*
// Non-terminal rules
// ------------------

// The following parser functions match certain motifs that are called
// "non-terminals" in parsing lingo.
// Essentially, they implement a sort of finite state automaton.
// You should read the [Wikipedia article](https://en.wikipedia.org/wiki/Recursive_descent_parser) on recursive-descent parsing if you want to know more about how these work.

// ### Grammar:
// ```
// orderExpression : sum
// sum : product { ('+'|'-') product }
// product : power { ('*'|'/') power }
//         | power '(' orderExpression ')'
// power : TODO power
// val : SYMBOL
//     | NUMBER
//     | FUNCTION '(' orderExpression { ',' orderExpression } ')'
//     | '-' val
//     | '(' orderExpression ')'
//     | '{' orderExpression '}'
//     | '|' orderExpression '|'
//     | val '!'
// ```
*/

// Parses values or nested expressions.
//Parser.prototype.val = function() {
// Don't return new nodes immediately, since we need to parse
// factorials, which come at the END of values.
//var node = {};


// Parse negative values like -42.
// The lexer can't differentiate between a difference and a negative,
// so that distinction is done here.
// Notice the `power()` rule that comes after a negative sign so that
// expressions like `-4^2` return -16 instead of 16.


// Parse nested expression with parentheses.
// Notice that the parser expects an RPAREN token after the expression.


// Parse absolute value.
// Absolute values are contained in pipes (`|`) and are treated quite
// like parens.


// All parsing rules should have terminated or recursed by now.
// Throw an exception if this is not the case.


// Process postfix operations like factorials.

// Parse factorial.


//return node;
//};
},{"./Node":2,"./Token":3,"./util/arities":7,"./util/localFunctions":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// List of arities for LaTeX commands. Since LaTeX command arguments aren't delimited by parens, we'll cheat a bit and provide a bit of context to the parser about how to parse each command.

/**
 * List of arities for LaTeX commands. Arguments for LaTeX commands aren't delimited by parens, so the compiler needs to know how many arguments to expect for each function.
 */
exports.default = {
    "frac": 2,
    "sqrt": 1,
    "sin": 1,
    "cos": 1,
    "tan": 1,
    "asin": 1,
    "acos": 1,
    "atan": 1,
    "sec": 1,
    "csc": 1,
    "cot": 1,
    "asec": 1,
    "acsc": 1,
    "acot": 1
};
},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
Javascript's Math API omits some important mathematical functions. These are included here.
 */

var fact = exports.fact = function fact(a) {
    a = Math.round(a);
    var result = 1;

    if (a < 0) {
        throw "Can't factorial a negative.";
    }

    for (a; a > 1; a--) {
        result *= a;
    }
    return result;
};

var frac = exports.frac = function frac(a, b) {
    return a / b;
};

var logn = exports.logn = function logn(x, b) {
    return Math.log(x) / Math.log(b);
};

var rootn = exports.rootn = function rootn(x, n) {
    return Math.pow(x, 1 / n);
};

var sec = exports.sec = function src(x) {
    return 1 / Math.cos(x);
};

var csc = exports.csc = function csc(x) {
    return 1 / Math.sin(x);
};

var cot = exports.cot = function cot(x) {
    return 1 / Math.tan(x);
};

var locals = { fact: fact, frac: frac, logn: logn, rootn: rootn, sec: sec, csc: csc, cot: cot };

// Copy things from Math. Can't use Object.assign since Math has non-enumerable properties.
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = Object.getOwnPropertyNames(Math)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var k = _step.value;

        locals[k] = Math[k];
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

exports.default = locals;
},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = replaceToken;

var _Token = require("../Token");

var _Token2 = _interopRequireDefault(_Token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This table lists tokens that should be replaced by other tokens before parsing.
// The key has format "{token type}:{token value}"

/**
 * Replaces a token according to a set of replacement rules. This simplifies parsing and makes LaTeX work better.
 * @param token
 * @returns {*}
 */
function replaceToken(token) {
    // if (token.type === Token.TYPE_COMMAND && token.value === "\\left(") {
    //     return new Token(Token.TYPE_LPAREN, "(");
    // }
    // else if (token.type === Token.TYPE_COMMAND && token.value === "\\right(") {
    //     return new Token(Token.TYPE_RPAREN, "(");
    // }
    // else if (token.type === Token.TYPE_COMMAND && token.value === "\\left[") {
    //     return new Token(Token.TYPE_LPAREN, "[");
    // }
    // else if (token.type === Token.TYPE_COMMAND && token.value === "\\right]") {
    //     return new Token(Token.TYPE_RPAREN, "]");
    // }
    if (token.type === _Token2.default.TYPE_COMMAND && ["\\cdot", "\\times"].includes(token.value)) {
        return new _Token2.default(_Token2.default.TYPE_TIMES, "*");
    }
    return token;
};
},{"../Token":3}],10:[function(require,module,exports){
'use strict';

let entry;

    entry = require('./dist/evaluatex').default;


module.exports = entry;
},{"./dist/evaluatex":4}]},{},[1]);
