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