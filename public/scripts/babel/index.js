"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MilitaryFormation = function () {
	function MilitaryFormation(countCombatUnits) {
		(0, _classCallCheck3.default)(this, MilitaryFormation);

		this.countCombatUnits = countCombatUnits;
	}

	(0, _createClass3.default)(MilitaryFormation, [{
		key: "countUnits",
		value: function countUnits() {
			return this.countCombatUnits;
		}
	}, {
		key: "manUp",
		value: function manUp(countCombatUnits) {
			this.countCombatUnits += countCombatUnits;
		}
	}]);
	return MilitaryFormation;
}();

/*Взвод */


var Platoon = function (_MilitaryFormation) {
	(0, _inherits3.default)(Platoon, _MilitaryFormation);

	function Platoon(combatUnits) {
		(0, _classCallCheck3.default)(this, Platoon);

		var range = { from: 10, before: 50 };
		var desiredTypes = [];
		var wastedTypes = ["Platoon", "Coy", "Battalion"];
		checkCombatUnitsForInit(combatUnits, range, desiredTypes, wastedTypes);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Platoon).call(this, completion(combatUnits)));

		_this.range = range;
		_this.desiredTypes = desiredTypes;
		_this.wastedTypes = wastedTypes;
		return _this;
	}

	(0, _createClass3.default)(Platoon, [{
		key: "manUp",
		value: function manUp(combatUnits) {
			checkCombatUnitsForManUp(combatUnits, this.countCombatUnits, this.range, this.desiredTypes, this.wastedTypes);
			(0, _get3.default)((0, _getPrototypeOf2.default)(Platoon.prototype), "manUp", this).call(this, completion(combatUnits));
		}
	}]);
	return Platoon;
}(MilitaryFormation);

/*Рота*/


var Coy = function (_MilitaryFormation2) {
	(0, _inherits3.default)(Coy, _MilitaryFormation2);

	function Coy(combatUnits) {
		(0, _classCallCheck3.default)(this, Coy);

		var range = { from: 50, before: 100 };
		var desiredTypes = ["Platoon"];
		var wastedTypes = ["Coy", "Battalion"];
		checkCombatUnitsForInit(combatUnits, range, desiredTypes, wastedTypes);

		var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Coy).call(this, completion(combatUnits)));

		_this2.range = range;
		_this2.desiredTypes = desiredTypes;
		_this2.wastedTypes = wastedTypes;
		return _this2;
	}

	(0, _createClass3.default)(Coy, [{
		key: "manUp",
		value: function manUp(combatUnits) {
			checkCombatUnitsForManUp(combatUnits, this.countCombatUnits, this.range, this.desiredTypes, this.wastedTypes);
			(0, _get3.default)((0, _getPrototypeOf2.default)(Coy.prototype), "manUp", this).call(this, completion(combatUnits));
		}
	}]);
	return Coy;
}(MilitaryFormation);

/*Батальон*/


var Battalion = function (_MilitaryFormation3) {
	(0, _inherits3.default)(Battalion, _MilitaryFormation3);

	function Battalion(combatUnits) {
		(0, _classCallCheck3.default)(this, Battalion);

		var range = { from: 400, before: 800 };
		var desiredTypes = ["Platoon", "Coy"];
		var wastedTypes = ["Battalion"];
		checkCombatUnitsForInit(combatUnits, range, desiredTypes, wastedTypes);

		var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Battalion).call(this, completion(combatUnits)));

		_this3.range = range;
		_this3.desiredTypes = desiredTypes;
		_this3.wastedTypes = wastedTypes;
		return _this3;
	}

	(0, _createClass3.default)(Battalion, [{
		key: "manUp",
		value: function manUp(combatUnits) {
			checkCombatUnitsForManUp(combatUnits, this.countCombatUnits, this.range, this.desiredTypes, this.wastedTypes);
			(0, _get3.default)((0, _getPrototypeOf2.default)(Battalion.prototype), "manUp", this).call(this, completion(combatUnits));
		}
	}]);
	return Battalion;
}(MilitaryFormation);

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
	return combatUnits.every(function (combatUnit) {
		var isDesired = desiredTypes.length == 0 ? true : desiredTypes.some(function (type) {
			return type == combatUnit.constructor.name;
		});
		var isNotWaste = wasteTypes.length == 0 ? true : wasteTypes.every(function (type) {
			return type != combatUnit.constructor.name;
		});
		return isDesired && isNotWaste;
	});
}

function completion(combatUnits) {
	return combatUnits.reduce(function (prev, unit) {
		if (!(unit instanceof MilitaryFormation)) {
			return prev + 1;
		}
		return prev + unit.countUnits();
	}, 0);
}