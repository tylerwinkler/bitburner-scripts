// More Colors at colors.js (https://gist.github.com/Spartelfant/63c9ec615a21a06723a08082041a924b)
export const GREEN = "\u001b[32m";
export const YELLOW = "\u001b[33m";
export const RED = "\u001b[31m";
const DEFAULT_TEXT = "\u001b[0m";

export function colorString(str, color) {
	return color + str + DEFAULT_TEXT;
}

export function moneyString(ns, money, shorthand) {
	if (shorthand === undefined) {
		shorthand = false;
	}

	if (shorthand) {
		return shortHandMoneyString(money);
	}
	else {
		return colorString(ns.nFormat(money, "$0,0.00"), GREEN);
	}
}

export function percentString(ns, percent) {
	let color = GREEN;

	if (percent < 0.70) color = YELLOW;
	if (percent < 0.30) color = RED;
	if (percent >= 0.70) color = GREEN;

	return colorString(ns.nFormat(percent, "0.00 %"), color);
}

export function booleanString(bool, strs) {
	if (strs === undefined) {
		strs = {true: "true", false: "false"};
	}
	
	let color = bool ? GREEN : RED;

	return colorString(strs[bool], color);
}

// 5 sig figs
function shortHandMoneyString(money) {
	const SIG_FIGS = 5;
	money = parseInt(money);

	let denominator = [" "," ","m","b","t","q"];
	let denominatorIndex = 0;

	while (money >= 1000) {
		money /= 1000;
		++denominatorIndex;
	}

	let leftSideLength = ("" + parseInt(money)).length;
	let rightSideLength = SIG_FIGS - leftSideLength;

	let moneyStr = "" + parseInt(money * 10 ** rightSideLength) / 10 ** rightSideLength;
	if (moneyStr.length < SIG_FIGS + 1 && moneyStr.indexOf(".") == -1) {
		moneyStr += ".";
	}
	while (moneyStr.length < SIG_FIGS + 1) {
		moneyStr += "0";
	}

	return colorString("$" + moneyStr + denominator[denominatorIndex], GREEN);
}

export function fuckedString(str, colors) {
	let newStr = "";
	for (var i = 0; i < str.length; ++i) {
		newStr += colorString(str[i], colors[i % colors.length]);
	}

	return newStr;
}

class ColoredText {
	constructor(text) {
		this.text = text;
	}

	toString() {
		return this.text + "\u001b[0m";
	}

	textColor = "\u001b[0m";
}
export class GreenText extends ColoredText {
	constructor(text) {
		super(text);
	}

	toString() {
		return "\u001b[32m" + super.toString();
	}

	textColor = "\u001b[32m";
}