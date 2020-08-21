sap.ui.define([], function () {
	"use strict";
	var isError = false,
		isRest = false,
		isChange = false,
		ref = null,
		fieldGroupIndex = 1,
		minDate = new Date("01.01.1800"),
		maxDate = new Date("31.12.9999"),
		currentDate = new Date(),
		lblCurrentDate = "Today date",
		sScale = 3, // Included .
		sMaxDec = 255,
		fieldGroups = ["fgInput", "fgString", "fgNString", "fgNumber", "fgDecimal", "fgEmail", "fgDesc", "fgFDate", "fgPDate", "fgDR",
			"fgCombo"
		];

	//Live change validation 
	function _fnFormateDate(value, pattern) {
		return sap.ui.core.format.DateFormat.getDateInstance({
			pattern: pattern
		}).format(value);
	}

	function _fnUpdateValueState(oControl, sMsg) {
		isError = (isError ? true : sMsg === "") ? false : true;
		oControl.setValueState(sMsg ? "Error" : "None");
		oControl.setValueStateText(sMsg ? sMsg : "");
		return sMsg === "" ? true : false;
	}

	function _fnValidateNumber(value, minValue, maxValue, sLabel) {
		// Check for numeric only 
		if (!value.match("^[0-9]+$")) {
			return sLabel + " number must be numeric only";
		}
		// Check for length
		if (!value.match("^[0-9]{" + minValue + "," + maxValue + "}$")) {
			if (minValue === maxValue && value.length < maxValue) {
				return sLabel + " number must be " + maxValue + " digit.";
			}
			return sLabel + " must be between " + minValue + "-" + maxValue + " characters";
		}
		return "";
	}

	function _fnValidateDecimal(value, minValue, maxValue, sLabel) {
		var sRegex = new RegExp("^\\d{1," + (maxValue - sScale) + "}(\\.\\d{1," + sScale + "})?$");
		if (!value.match(sRegex)) {
			return sLabel + " should be " + ("0".repeat(maxValue - sScale) + "." + "0".repeat(sScale) + " formate.");
		}

		if (parseFloat(value).toFixed(sScale) <= minValue) {
			return sLabel + " should be greater then " + minValue + ".";
		}
		return "";
	}

	function _fnValidateString(value, minValue, maxValue, sLabel) {
		if (!value.match("^[a-z A-Z]+$")) {
			return sLabel + " should be character only";
		}
		if (!value.match("^[a-z A-Z]{" + minValue + "," + maxValue + "}$")) {
			return sLabel + " must be between " + minValue + "-" + maxValue + " characters";
		}
		return "";
	}

	function _fnValidateNumberString(value, minValue, maxValue, sLabel) {
		if (!value.match("^[a-z A-Z0-9]+$")) {
			return sLabel + " should be character only";
		}
		if (!value.match("^[a-z A-Z0-9]{" + minValue + "," + maxValue + "}$")) {
			return sLabel + " must be between " + minValue + "-" + maxValue + " characters";
		}
		return "";
	}

	function _createDate(value) {
		var sSplitedDate = value.split(".");
		var ssDate = parseInt(sSplitedDate[0]);
		var sMonth = parseInt(sSplitedDate[1]) - 1;
		var sYear = parseInt(sSplitedDate[2]);
		var sDate = new Date();
		sDate.setHours(0, 0, 0, 0);
		sDate.setDate(ssDate);
		sDate.setMonth(sMonth);
		sDate.setYear(sYear);
		return sDate;
	}

	function _fnValidateDate(value, minValue, maxValue, sLabel) {
		if (!value.match(/^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/)) {
			return sLabel + " should be dd.mm.yyyy format";
		}
		// minValue.setMinutes("00");
		minValue.setHours(0, 0, 0, 0);
		maxValue.setHours(0, 0, 0, 0);
		// minValue.setSeconds("00");
		// maxValue.setMinutes("00");
		// maxValue.setSeconds("00");

		value = _createDate(value);
		if (minValue > value || value > maxValue) {
			return sLabel + " should be between " + _fnFormateDate(minValue) + "-" + _fnFormateDate(maxValue) + " ";
		}
		return "";

	}

	function _fnValidateEmail(value, minValue, maxValue, sLabel) {
		this.emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (!value.match(this.emailPattern)) {
			return "Please enter the valid " + sLabel + " id";
		}
		return "";
	}

	function _fnNumberValidation(oControl) {
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var maxValue = 20,
			minValue = 0;
		var sMsg = _fnValidateNumber(value, minValue, maxValue, sLabel);
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnStringValidation(oControl) {
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var maxValue = 40,
			minValue = 0;
		var sMsg = _fnValidateString(value, minValue, maxValue, sLabel);
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnNumberStringValidation(oControl) {
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var maxValue = 40,
			minValue = 0;
		var sMsg = _fnValidateNumberString(value, minValue, maxValue, sLabel);
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnMobileNumberValidation(oControl, reset) {
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var maxValue = 10,
			minValue = 0;
		var sMsg = _fnValidateNumber(value, minValue, maxValue, sLabel);
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnDecimalValidation(oControl, reset) {
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var maxValue = oControl.getMaxLength() > (sScale + 1) ? oControl.getMaxLength() : 5,
			minValue = 0;
		var sMsg = _fnValidateDecimal(value, minValue, maxValue, sLabel);
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnDescriptionValidation(oControl, reset) {
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var maxValue = oControl.getMaxLength() > 0 ? oControl.getMaxLength() : sMaxDec,
			minValue = 0;
		if (value.length > maxValue) {
			oControl.setValue(oControl.getValue().slice(0, maxValue));
		}

		return _fnUpdateValueState(oControl, "");
	}

	function _fnEmailValidation(oControl) {
		var sMsg = "",
			value = oControl.getValue();
		var sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var maxValue = oControl.getMaxLength() > 0 ? oControl.getMaxLength() : sMaxDec,
			minValue = 0;
		sMsg = _fnValidateEmail(value, minValue, maxValue, sLabel);
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnDateValidation(oControl, reset) {
		var maxValue = oControl.getMaxDate() ? oControl.getMaxDate() : maxDate;
		var minValue = oControl.getMinDate() ? oControl.getMinDate() : minDate;
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var sMsg = _fnValidateDate(value, minValue, maxValue, sLabel);
		if (sMsg === "") {
			value = _createDate(value);
			value = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: oControl.getDisplayFormat()
			}).format(value);
			oControl.setValue(value);
		}
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnFuturDateValidation(oControl, reset) {
		var maxValue = oControl.getMaxDate() ? oControl.getMaxDate() : maxDate;
		var minValue = oControl.getMinDate() ? oControl.getMinDate() : currentDate;
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var sMsg = _fnValidateDate(value, minValue, maxValue, sLabel);
		if (sMsg === "") {
			value = _createDate(value);
			value = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: oControl.getDisplayFormat()
			}).format(value);
			oControl.setValue(value);
		}
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnPastDateValidation(oControl, reset) {
		var maxValue = oControl.getMaxDate() ? oControl.getMaxDate() : currentDate;
		var minValue = oControl.getMinDate() ? oControl.getMinDate() : minDate;
		var value = oControl.getValue(),
			sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		var sMsg = _fnValidateDate(value, minValue, maxValue, sLabel);
		if (sMsg === "") {
			value = _createDate(value);
			value = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: oControl.getDisplayFormat()
			}).format(value);
			oControl.setValue(value);
		}
		return _fnUpdateValueState(oControl, sMsg);
	}

	function getParentNode(oControl) {
		if (oControl.getControlsByFieldGroupId()) {
			return oControl.getParent().getParent().getParent();
		}
		return getParentNode(oControl.getParent());
	}

	/*	function _fnDateRangeValidation(oControl, reset) {
			var maxValue = oControl.getMaxDate() ? oControl.getMaxDate() : new Date("3999");
			var minValue = oControl.getMinDate() ? oControl.getMinDate() : new Date();
			var value = oControl.getValue(),
				sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
			var sMsg = _fnValidateDate(value, minValue, maxValue, sLabel);
			if (sMsg === "") {
				value = _createDate(value);
				value = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: oControl.getDisplayFormat()
				}).format(value);
				oControl.setValue(value);
			}
			return _fnUpdateValueState(oControl, sMsg);
		}*/

	function _fnValidateComboBox(oControl) {
		var sMsg = "";
		var sLabel = oControl.getLabels().length > 0 ? oControl.getLabels()[0].getText() : "";
		if (oControl.getKeys().indexOf(oControl.getSelectedKey()) < 0) {
			sMsg = "Please select valid " + sLabel;
		}
		return _fnUpdateValueState(oControl, sMsg);
	}

	function _fnDateComparetor(sDate1, sDate2, sLabel1, sLabel2, isEndDate, isFuture) {
		var sMsg = "";
		if (sDate1 > sDate2) {
			sMsg = sLabel1 + " should be equal or smaller than " + sLabel2;
			if (!isEndDate) {
				sMsg = sLabel2 + " should be equal or greater than " + sLabel1;
			}
		}
		return sMsg;
	}

	function _fnDateRangeValidation(oControl, reset) {
		var groupId = oControl.getFieldGroupIds()[fieldGroupIndex];
		var sSplitedGp = groupId.split("_");
		var sDate1 = groupId;
		var sDate2 = "";
		var isEndDate = true;
		if (sSplitedGp.length <= 1) {
			return;
		}
		sDate2 = "fgDR_" + (parseInt(sSplitedGp[1], 0) + 1);
		if ((sSplitedGp[1] % 2) === 0) {
			isEndDate = false;
			sDate1 = "fgDR_" + (parseInt(sSplitedGp[1], 0) - 1);
			sDate2 = groupId;
		}
		var oDate1 = getParentNode(oControl).getControlsByFieldGroupId(sDate1)[0];
		var oDate2 = getParentNode(oControl).getControlsByFieldGroupId(sDate2)[0];

		var isDate1Val = false,
			isDate2Val = false,
			sLabel1 = "",
			sLabel2 = "";
		if (oDate1) {
			sLabel1 = oDate1.getLabels().length > 0 ? oDate1.getLabels()[0].getText() : "";
			isDate1Val = _fnDateValidation(oDate1, reset);
			sDate1 = _createDate(oDate1.getValue());
		}

		if (oDate2) {
			sLabel2 = oDate2.getLabels().length > 0 ? oDate2.getLabels()[0].getText() : "";
			isDate2Val = _fnDateValidation(oDate2, reset);
			sDate2 = _createDate(oDate2.getValue());
		}

		if (isDate1Val && isDate2Val) {
			var sMsg = _fnDateComparetor(sDate1, sDate2, sLabel1, sLabel2, isEndDate, true);
			_fnUpdateValueState(oControl, sMsg);
		}
	}

	function _fnBasicValidation(oControl) {
		var fieldGroupId = oControl.getFieldGroupIds()[fieldGroupIndex];
		if (!fieldGroupId) {
			return true;
		}
		var isRequired = oControl.getRequired();
		var value = oControl.getValue();

		var sLen = oControl.getLabels().length;
		var sLabel = "";
		if (sLen > 1) {
			sLabel = oControl.getLabels()[1].getText();
		} else {
			sLabel = sLen > 0 ? oControl.getLabels()[0].getText() : "";
		}
		var sMsg = "";

		if (!isRequired && value === "") {
			return false;
		}
		if (isRequired && value === "") {
			sMsg = sLabel + " can't be empty";
		}
		return _fnUpdateValueState(oControl, sMsg);

	}

	function _fnChangeValidation(oControl, reset) {
		if (!_fnBasicValidation(oControl)) {
			return;
		}

		var fieldGroupId = oControl.getFieldGroupIds()[fieldGroupIndex];
		if (fieldGroupId && fieldGroupId.indexOf("fgDR") >= 0) {
			fieldGroupId = "fgDR";
		}

		switch (fieldGroupId) {
		case "fgString":
			_fnStringValidation(oControl, reset);
			break;
		case "fgNString":
			_fnNumberStringValidation(oControl, reset);
			break;
		case "fgNumber":
			_fnNumberValidation(oControl, reset);
		case "fgDecimal":
			_fnDecimalValidation(oControl, reset);
			break;
		case "fgEmail":
			_fnEmailValidation(oControl, reset);
			break;
		case "fgDesc":
			_fnDescriptionValidation(oControl, reset);
			break;
		case "fgDate":
			_fnDateValidation(oControl, reset);
			break;
		case "fgFDate":
			_fnFuturDateValidation(oControl, reset);
			break;
		case "fgPDate":
			_fnPastDateValidation(oControl, reset);
		case "fgDR":
			_fnDateRangeValidation(oControl, reset);
			break;
		case "fgCombo":
			_fnValidateComboBox(oControl, reset);
			break;
		default:
			// _fnDateRangeValidation(oControl, reset);
			break;
		}
	}

	function validForm(parentControl) {
		fieldGroups.forEach(function (oItem) {
			parentControl.getControlsByFieldGroupId(oItem).forEach(function (oControl) {
				_fnChangeValidation(oControl);
			});
		});
	}

	function resetValidation(parentControl) {
		fieldGroups.forEach(function (oItem) {
			parentControl.getControlsByFieldGroupId(oItem).forEach(function (oControl) {
				_fnResetControl(oControl);
			});
		});
	}

	function _fnResetControl(oControl) {
		try {
			if (oControl.getValueState() === "Error" && oControl.getVisible() && oControl.getEnabled()) {
				oControl.setValueState("None");
				oControl.setValueStateText("");
			}
		} catch (e) {}
	}

	return {
		setRef: function (sRef) {
			this.ref = sRef;
			this.isChange = false;
			this.isError = false;
			this.isRest = false;
		},
		setChanges: function (isChange) {
			this.isChange = isChange;
		},
		getChanges: function () {
			return this.isChange;
		},

		onLiveChange: function (oEvent, reset) {
			this.isChange = true;
			_fnChangeValidation(oEvent.getSource(), reset);
		},

		resetForm: function (oParentControl) {
			isRest = false;
			isChange = false;
			isError = false;
			validForm(oParentControl);
			return !isRest;
		},

		validateForm: function (oParentControl) {
			isError = false;
			validForm(oParentControl);
			return !isError;
		},
		createFilter: function (filters) {
			var aFilter = [];
			filters.filters.mult.forEach(function (oItem) {
				var oFilter = [];
				oItem.vals1.forEach(function (val, index) {
					oFilter.push(new sap.ui.model.Filter(oItem.key, oItem.op, val, oItem.vals2[index]));
				});
				if (oFilter.length > 0) {
					aFilter.push(new sap.ui.model.Filter(oFilter, false));
				}
			});
			filters.filters.sing.forEach(function (oItem) {
				aFilter.push(new sap.ui.model.Filter(oItem.key, oItem.op, oItem.val1, oItem.val2));
			});
			return aFilter;
		},

		resetFilter: function (filters) {
			filters.filters.mult.forEach(function (oItem) {
				oItem.vals1 = [];
				oItem.vals2 = [];
			});
			filters.filters.sing.forEach(function (oItem) {
				oItem.val1 = "";
				oItem.val2 = "";
			});
			return filters;
		}
	};
}, true); // <-- Enables accessing this module via global name "path.to.my.formatter"