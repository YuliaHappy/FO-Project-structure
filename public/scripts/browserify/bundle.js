(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class MilitaryFormation {
	constructor(countCombatUnits) {	
		this.countCombatUnits = countCombatUnits;
	}
	countUnits() {
		return this.countCombatUnits;
	}
	manUp(countCombatUnits) {
		this.countCombatUnits += countCombatUnits;
	}
}

/*Взвод */
class Platoon extends MilitaryFormation {
	constructor(combatUnits) {	
		let range = {from: 10, before: 50};
		let desiredTypes = [];
		let wastedTypes = ["Platoon", "Coy", "Battalion"];		
		checkCombatUnitsForInit(combatUnits, range, desiredTypes, wastedTypes);	
		super(completion(combatUnits));
		this.range = range;
		this.desiredTypes = desiredTypes;
		this.wastedTypes = wastedTypes;
	}
	manUp(combatUnits) {
		checkCombatUnitsForManUp(combatUnits, this.countCombatUnits, this.range, 
			this.desiredTypes, this.wastedTypes);
		super.manUp(completion(combatUnits));
	}
}

/*Рота*/
class Coy extends MilitaryFormation {	
	constructor(combatUnits) {	
		let range = {from: 50, before: 100};
		let desiredTypes = ["Platoon"];
		let wastedTypes = ["Coy", "Battalion"];		
		checkCombatUnitsForInit(combatUnits, range, desiredTypes, wastedTypes);	
		super(completion(combatUnits));
		this.range = range;
		this.desiredTypes = desiredTypes;
		this.wastedTypes = wastedTypes;
	}
	manUp(combatUnits) {
		checkCombatUnitsForManUp(combatUnits, this.countCombatUnits, this.range, 
			this.desiredTypes, this.wastedTypes);
		super.manUp(completion(combatUnits));
	}
}

/*Батальон*/
class Battalion extends MilitaryFormation {
	constructor(combatUnits) {	
		let range = {from: 400, before: 800};
		let desiredTypes = ["Platoon", "Coy"];
		let wastedTypes = ["Battalion"];		
		checkCombatUnitsForInit(combatUnits, range, desiredTypes, wastedTypes);	
		super(completion(combatUnits));
		this.range = range;
		this.desiredTypes = desiredTypes;
		this.wastedTypes = wastedTypes;
	}
	manUp(combatUnits) {		
		checkCombatUnitsForManUp(combatUnits, this.countCombatUnits, this.range, 
			this.desiredTypes, this.wastedTypes);
		super.manUp(completion(combatUnits));
	}
}

function checkCombatUnitsForInit(combatUnits, range, desiredTypes, wastedTypes) {		
	/*проверка на вхождение в диапозон*/
	if (range.from > completion(combatUnits) || range.before < completion(combatUnits)) {
		throw new RangeError();
	}
	/*проверка на вид боевых единиц*/
	if (!checkFormation(combatUnits, desiredTypes, wastedTypes)) {
		throw new TypeError();
	}
}

function checkCombatUnitsForManUp(combatUnits, countCombatUnits, range, desiredTypes, wastedTypes) {
	/*проверка на вид боевых единиц*/
	if (!checkFormation(combatUnits, desiredTypes, wastedTypes)) {
		throw new TypeError();
	}
	/*проверка на вхождение в диапозон при доукомплектовки*/
	if (countCombatUnits + completion(combatUnits) > range.before) {
		throw new RangeError("combat units is too large!");
	}
}

function checkFormation(combatUnits, desiredTypes, wasteTypes) {
	return combatUnits.every(function(combatUnit) {
		let isDesired = desiredTypes.length == 0 ? true : 
			desiredTypes.some(function(type) {
				return type == combatUnit.constructor.name;
		});
		let isNotWaste = wasteTypes.length == 0 ? true : 
			wasteTypes.every(function(type) {
				return type != combatUnit.constructor.name;
		});
		return isDesired && isNotWaste;
	});
}

function completion(combatUnits) {
	return combatUnits.reduce(function(prev, unit) {
		if (!(unit instanceof MilitaryFormation)) {
			return prev + 1;
		}
		return prev + unit.countUnits();
	}, 0);
}
},{}],2:[function(require,module,exports){
function hello() {
	console.log("hello");
}
},{}]},{},[1,2]);
