
//functions related to operators, operands, and operations
var Operation = {

	//get the precedence of an operator
	getPrecedence: function(op) {
		if("*/".indexOf(op) != -1) return 2;
		if("-+".indexOf(op) != -1) return 1;
	},

	//allowed operators
	isOperator: function(op) {
		return "+-/*".indexOf(op) != -1;
	},

	//valid operands
	isOperand: function(op) {
		return !/[^0-9d]/.test(op);
	},

	//run an operation (op) from left on right
	operateOn: function(op, left, right) {
		return eval(left+op+right);
	}

};

//functions related to an expression
var Expression = {

	//turn an equation into a postfix expression
	//does not support parenthesis
	toPostfix: function (equation) {

		var stack = new Array()
		var retExpression = '';

		var tokens = Expression.getTokens(equation);

		tokens.forEach(function(token) {

			if(Operation.isOperand(token)) {

				//operand conversion from die to numeric
				if(token.indexOf('d') != -1) 
					token = Roller.roll(token);

				retExpression += token + " ";

			} else if(Operation.isOperator(token)){

				while(stack.length > 0) {
					var op = stack.pop();

					if(Operation.getPrecedence(op) >= Operation.getPrecedence(token))
						retExpression += op + " ";

					else {
						stack.push(op);
						break;
					}
				}

				stack.push(token);
			}
		});

		while(stack.length > 0) {
			var op = stack.pop();
			retExpression += op + " ";
		}

		return retExpression.trim();
	},

	//split the equation into tokens
	getTokens: function(equation) {

		//don't want to deal with spaces
		equation = equation.split(" ").join("");

		var buffer = '';
		var tokens = [];

		equation.split('').forEach(function(ch) {
			if(Operation.isOperand(ch)) {
				buffer += ch;
			} else if(Operation.isOperator(ch)) {
				tokens.push(buffer);
				tokens.push(ch);
				buffer = '';
			}
		});

		if(buffer != '') tokens.push(buffer);

		return tokens;
	},

	//evaluate a postfix expression
	evalPostfix: function (postfix) {
		var numberStack = [];

		var tokens = postfix.split(" ");

		tokens.forEach(function(token) {

			if(Operation.isOperand(token)) {
				numberStack.push(token);

			} else if(Operation.isOperator(token)){
				var right = numberStack.pop();
				var left = numberStack.pop();
				numberStack.push(Operation.operateOn(token, left, right));
			}
		});

		return numberStack.pop();
	}

};

//all functions related to rolling
var Roller = {

	//evaluate an expression
	evalExpression: function(expression) {
		var postfix = Expression.toPostfix(expression);
		return Expression.evalPostfix(postfix);
	},

	//wrapper for evalExpression
	rollExpression: function(expression) {
		return Roller.evalExpression(expression);
	},

	//roll a die
	roll: function(string) {
		var xdy = string.split("d");
		var x = parseInt(xdy[0]);
		var y = parseInt(xdy[1]);
		if(x <= 0 || y <= 0) return 0;
		return Math.round(Math.random()*((x*y)-x))+x;
	}
};





