sap.ui.define([], function() {
	"use strict";
	// 1. Method for reset the state 
	function resetFieldsState(oFields) {
		try {
			if (oFields.getValueState() === "Error" || oFields.getRequired() === true) {
				oFields.setValueState("None");
			}
		} catch (e) {

		}
	}
	//2. Method for set focus on the fields which has error state
	function FocusonFields(oFieldId) {
		try {
			oFieldId.focus();
			return false;
		} catch (e) {
			return true;
		}
	}
	// 3.Method for setting value state text for the fields
	function setErrortoFields(oFieldId, that) {
		try {
			if (oFieldId.getFieldGroupIds()[0] !== "fgSGBtn") {
				oFieldId.setValueState("Error");
				if (oFieldId.getValueStateText() !== undefined && oFieldId.getValueStateText() !== "" && oFieldId.getValueStateText().length > 1) {
					oFieldId.setValueStateText(oFieldId.getValueStateText());
				}
			}
			return true;
		} catch (e) {

		}
	}

	return {
		/* ***************************************************************************
		 *   This file is for validating the fields           
		 *************************************************************************** */
		// 1. Method for validating the fields in view using field group id's

		// Added check(s) if the control is editable and visible then only control will be validated
		validateFields: function(that) {
			var bErrorState = false;
			this.resetErrorStates(that);
			// validation for date fields
			var oFieldDate = that.getView().getControlsByFieldGroupId("fgDate");
			oFieldDate.forEach(function(oFieldDat) {
				try {
					if (oFieldDat.getValueState() !== "Error" && oFieldDat.getRequired() && oFieldDate.getVisible() && oFieldDate.getEditable()) {
						if (oFieldDat.getValue() === "" || oFieldDat.getValue() === null || oFieldDat.getValue() === undefined) {
							bErrorState = setErrortoFields(oFieldDat, that);
						}
					} else if (oFieldDat.getValueState() === "Error") {
						FocusonFields(oFieldDat);
						bErrorState = true;
					}
				} catch (e) {}
			});
			// validation for Time fields
			var oFieldTime = that.getView().getControlsByFieldGroupId("fgTime");
			oFieldTime.forEach(function(oFieldTim) {
				try {
					if (oFieldTim.getValueState() !== "Error" && oFieldTim.getRequired() && oFieldTime.getVisible() && oFieldTime.getEditable()) {
						if (oFieldTim.getDateValue() === "" || oFieldTim.getDateValue() === null || oFieldTim.getDateValue() === undefined) {
							bErrorState = setErrortoFields(oFieldTim, that);
						}
					} else if (oFieldTim.getValueState() === "Error") {
						FocusonFields(oFieldTim);
						bErrorState = true;
					}
				} catch (e) {}
			});
			//validation for input field
			var oFieldInput = that.getView().getControlsByFieldGroupId("fgInput");
			oFieldInput.forEach(function(oFieldIn) {
				try {
					if (oFieldIn.getValueState() !== "Error" && oFieldIn.getRequired() && oFieldIn.getVisible() && oFieldIn.getEditable()) {
						if (oFieldIn.getValue() === "" || oFieldIn.getValue() === null || oFieldIn.getValue() === undefined) {
							bErrorState = setErrortoFields(oFieldIn, that);
						}
					} else if (oFieldIn.getValueState() === "Error") {
						FocusonFields(oFieldIn);
						bErrorState = true;
					}
				} catch (e) {}
			});
			//validation for stepInput
			var oFieldStInput = that.getView().getControlsByFieldGroupId("fgStepInput");
			oFieldStInput.forEach(function(oFieldSt) {
				try {
					if (oFieldSt.getValueState() !== "Error" && oFieldSt.getRequired() && oFieldSt.getVisible() && oFieldSt.getEditable()) {
						if (oFieldSt.getValue() === "" || oFieldSt.getValue() === 0 || oFieldSt.getValue() === null || oFieldSt.getValue() === undefined) {
							bErrorState = setErrortoFields(oFieldSt, that);
						}
					} else if (oFieldSt.getValueState() === "Error") {
						FocusonFields(oFieldSt);
						bErrorState = true;
					}
				} catch (e) {}
			});
			// validation for Segmented button fields
			var oFieldSgBtn = that.getView().getControlsByFieldGroupId("fgSGBtn");
			oFieldSgBtn.forEach(function(oFieldSgBt) {
				try {
					if (oFieldSgBt.getVisible() && oFieldSgBt.getEnabled()) {
						if (oFieldSgBt.getSelectedKey() === "" || oFieldSgBt.getSelectedKey() === null || oFieldSgBt.getSelectedKey() ===
							undefined ||
							oFieldSgBt.getSelectedKey() === "noKey" ||
							oFieldSgBt.getSelectedKey() === "NA") {
							bErrorState = setErrortoFields(oFieldSgBt, that);
							sap.m.MessageToast.show("Please fill all the required fields");
						} else if (oFieldSgBt.getValueState() === "Error") {
							FocusonFields(oFieldSgBt);
							bErrorState = true;
						}
					}

				} catch (e) {}
			});
			// validation for combobox fields
			var oFieldCMBox = that.getView().getControlsByFieldGroupId("fgCmbBox");
			oFieldCMBox.forEach(function(oFieldCB) {
				try {
					if (oFieldCB.getValueState() !== "Error" && oFieldCB.getRequired() && oFieldCB.getVisible() && oFieldCB.getEditable()) {
						if (oFieldCB.getSelectedKey() === "" || oFieldCB.getSelectedKey() === null || oFieldCB.getSelectedKey() ===
							undefined || oFieldCB.getSelectedKey() === "noKey") {
							bErrorState = setErrortoFields(oFieldCB, that);
						}
					} else if (oFieldCB.getValueState() === "Error") {
						FocusonFields(oFieldCB);
						bErrorState = true;
						oFieldCB.setValueStateText("Please fill in the required fields");
					}
				} catch (e) {}
			});
			// validation for Text area fields
			var oFieldTxtAr = that.getView().getControlsByFieldGroupId("fgTxtArea");
			oFieldTxtAr.forEach(function(oFieldTxt) {
				try {
					if (oFieldTxt.getValueState() !== "Error" && oFieldTxt.getRequired() && oFieldTxt.getVisible() && oFieldTxt.getEditable()) {
						if (oFieldTxt.getValue() === "" || oFieldTxt.getValue() === null || oFieldTxt.getValue() === undefined) {
							bErrorState = setErrortoFields(oFieldTxt, that);
						}
					} else if (oFieldTxt.getValueState() === "Error") {
						FocusonFields(oFieldTxt);
						bErrorState = true;
					}
				} catch (e) {}
			});
			// Validating entire field group id's
			if (bErrorState) {
				var oFieldIds = that.getView().getControlsByFieldGroupId("fgSGBtn");
				for (var i = 0; i < oFieldIds.length; i++) {
					if (oFieldIds[i].getFieldGroupIds()[0] !== "fgSGBtn" && oFieldIds[i].getFieldGroupIds()[0] !== "" && oFieldIds[i].getFieldGroupIds()
						.length !== 0) {
						if (oFieldIds[i].getValueState() === "Error") {
							FocusonFields(oFieldIds[i]);
							break;
						}
					}
				}
				return bErrorState;
			}
			// validation for  Redio fields
			var oFieldRadiobtn = that.getView().getControlsByFieldGroupId("fgRedioBtn");
			oFieldRadiobtn.forEach(function(oFieldTxt) {
				try {
					for (var i = 0; i < oFieldIds.length; i++) {
						if (oFieldIds[i].getFieldGroupIds()[0] !== "fgSGBtn" && oFieldIds[i].getFieldGroupIds()[0] !== "" && oFieldIds[i].getFieldGroupIds()
							.length !== 0) {
							if (oFieldIds[i].getValueState() === "Error") {
								FocusonFields(oFieldIds[i]);
								break;
							}
						}
					}
				} catch (e) {}
			});

		},
		//2. Method for reseting the error state of the fields
		resetErrorStates: function(that) {
			var oViewfields = ["fgDate", "fgTime", "fgSGBtn", "fgCmbBox", "fgTxtArea", "fgInput", "fgStepInput"];
			oViewfields.forEach(function(field) {
				var oFieldIds = that.getView().getControlsByFieldGroupId(field);
				oFieldIds.forEach(function(oFields) {
					resetFieldsState(oFields);
				});
			});
		},

	};

}, /* bExport= */ true);