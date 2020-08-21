sap.ui.define(["jquery.sap.global", "sap/ui/core/Control"], function (e, t) {
	"use strict";
	return {
		DateFormat: function (e) {
			return new Date((new Date).toString().split("GMT")[0] + " UTC").toISOString().split(".")[0]
		},
		ValidateForm: function (e, t) {
			var u = t !== undefined ? true : false;
			var a = true;
			this.resetValidStates(e);
			var c = false;
			var s = e.getView().getControlsByFieldGroupId("fgInput");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgInput")) {
						if (r(i, "fgInputEntry")) {
							c = l(i, e)
						}
					}
				} catch (e) {}
			});
			var s = e.getView().getControlsByFieldGroupId("fgRichText");
			s.forEach(function (e) {
				try {
					if (u && e._textAreaId !== undefined && e.getId().indexOf(t) === -1) {
						return
					}
					if (e._textAreaId !== undefined && r(e, "fgRichText")) {
						c = true
					}
				} catch (e) {}
			});
			var s = e.getView().getControlsByFieldGroupId("fgFileUploader");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgFileUploaderEntry")) {
						c = l(i, e)
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgSelect");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgSelect")) {
						if (r(i, "fgSelectEntry")) {
							c = g(i, e)
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgSelectValue");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgSelectValue")) {
						if (r(i, "fgSelectValueEntry")) {
							c = l(i, e)
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgCheckBox");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgCheckBoxEntry")) {
						c = o(i, e)
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgRadioButton");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgRadioButtonEntry")) {
						c = o(i, e)
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgRadioButtonGroup");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgRadioButtonGroupEntry")) {
						c = o(i, e)
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgMultiSelect");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgSelect")) {
						if (r(i, "fgMultiSelectEntry")) {
							c = l(i, e)
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgDate");
			s.forEach(function (r) {
				try {
					if (u && r.getId().indexOf(t) === -1) {
						return
					}
					if (r.getVisible() && r.getEnabled() && r.getValueState() !== "Error" && r.getRequired()) {
						if (r.getDateValue() === "" || r.getDateValue() === null || r.getDateValue() === undefined) {
							c = l(r, e)
						}
					} else if (r.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgTime");
			s.forEach(function (r) {
				try {
					if (u && r.getId().indexOf(t) === -1) {
						return
					}
					if (r.getVisible() && r.getEnabled() && r.getValueState() !== "Error" && r.getRequired()) {
						if (r.getValue() === "" || r.getValue() === null || r.getValue() === undefined) {
							c = l(r, e)
						}
					} else if (r.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgEmail");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgEmail")) {
						if (i.getRequired()) {
							if (r(i, "fgEmailEntryReq")) {
								c = l(i, e)
							}
						} else if (i.getValue().length > 0) {
							if (r(i, "fgEmailEntry")) {
								c = l(i, e)
							}
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			var s = e.getView().getControlsByFieldGroupId("fgDateRange");
			for (var E in s) {
				try {
					if (u && s[E].getId().indexOf(t) === -1) {
						break
					}
					if (i(s[E]) && n(s[E], "Start") && s[E].getRequired()) {
						if (s[E].getDateValue() === null) {
							d(s[E], "EMPTY");
							c = true;
							break
						}
						var y = s[E].getId().split("dpStart");
						var V;
						for (var S in s) {
							if (i(s[S]) && n(s[E], "Start") && s[S].getId() === y[0] + "dpEnd" + y[1] && s[S].getRequired()) {
								if (s[S].getDateValue() === null) {
									d(s[S], "EMPTY");
									c = true;
									break
								}
								V = s[E].getDateValue() > s[S].getDateValue();
								break
							}
						}
						if (V) {
							d(s[E], "SG");
							d(s[S], "EL");
							c = true
						}
					}
				} catch (e) {}
			}
			s = e.getView().getControlsByFieldGroupId("fgMobile");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgMobile")) {
						if (i.getRequired()) {
							if (r(i, "fgMobileEntryReq")) {
								c = l(i, e)
							}
						} else if (i.getValue().length > 0) {
							if (r(i, "fgMobileEntry")) {
								c = l(i, e)
							}
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgCurrency");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgCurrency")) {
						if (i.getValue().length > 0) {
							if (r(i, "fgCurrencyEntry")) {
								c = l(i, e)
							}
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgNumber");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgNumber")) {
						if (i.getRequired()) {
							if (r(i, "fgNumberEntryReq")) {
								c = l(i, e)
							}
						} else if (i.getValue().length > 0) {
							if (r(i, "fgNumberEntry")) {
								c = l(i, e)
							}
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			s = e.getView().getControlsByFieldGroupId("fgMultiComboBox");
			s.forEach(function (i) {
				try {
					if (u && i.getId().indexOf(t) === -1) {
						return
					}
					if (r(i, "fgMultiComboBox")) {
						if (r(i, "fgMultiComboBoxEntry")) {
							c = l(i, e)
						}
					} else if (i.getValueState() === "Error") {
						c = true
					}
				} catch (e) {}
			});
			var h = true;
			if (c) {
				s = e.getView().getControlsByFieldGroupId();
				for (var I = 0; I < s.length; I++) {
					try {
						if (s[I].getValueState() === "Error") {
							f(s[I]);
							break
						}
					} catch (e) {}
				}
			}
			return c
		},
		resetValidStates: function (e) {
			var t = ["fgInput", "fgSelect", "fgDate", "fgTime", "fgEmail", "fgSelectValue", "fgNumber", "fgMobile", "fgCheckBox", "fgMultiSelect",
				"fgRadioButtonGroup", "fgRadioButton", "fgCurrency", "fgDateRange", "fgFileUploader", "fgMultiComboBox"
			];
			t.forEach(function (t) {
				var r = e.getView().getControlsByFieldGroupId(t);
				r.forEach(function (e) {
					c(e)
				})
			})
		}
	};

	function r(e, t) {
		if (t === "fgInput" && i(e)) {
			return e.getRequired() && e.getValueState() !== "Error"
		} else if (t === "fgRichText" && e.getVisible() && e.getEditable() && e.getRequired()) {
			return e.getValue() === undefined || e.getValue().trim() === ""
		} else if ((t === "fgSelect" || t === "fgMultiComboBox" || t === "fgSelectValue" || t === "fgMobile" || t === "fgEmail" || t ===
				"fgNumber" || t === "fgCurrency" || t === "fgDate" || t === "fgTime") && i(e)) {
			return e.getValueState() !== "Error"
		} else if (t === "fgFileUploaderEntry" && i(e)) {
			return e.getValue() === undefined || e.getValue().trim() === ""
		} else if (t === "fgInputEntry" && i(e)) {
			return e.getValue() === undefined || e.getValue().trim() === ""
		} else if (t === "fgSelectEntry" && i(e)) {
			return e.getSelectedItemId() === "" || e.getSelectedKey() === "" || e.getSelectedKey() === undefined
		} else if (t === "fgSelectValueEntry" && i(e)) {
			return e.getValue() === "" || e.getValue() === undefined
		} else if (t === "fgMultiSelectEntry" && i(e)) {
			return e.getSelectedKeys() === "" || e.getSelectedKeys() === undefined
		} else if (t === "fgCheckBoxEntry" && i(e)) {
			return e.getSelected() === false
		} else if (t === "fgRadioButtonEntry" && i(e)) {
			return e.getSelected() === false
		} else if (t === "fgRadioButtonGroupEntry" && i(e)) {
			return e.getSelectedIndex() === -1
		} else if (t === "fgMobileEntryReq" && i(e)) {
			return u(e, "mobile")
		} else if (t === "fgMobileEntry" && i(e)) {
			return !s("mobile").test(e.getValue())
		} else if (t === "fgEmailEntryReq" && i(e)) {
			return u(e, "email")
		} else if (t === "fgEmailEntry" && i(e)) {
			return !s("email").test(e.getValue())
		} else if (t === "fgNumberEntryReq" && i(e)) {
			return u(e, "Numaric")
		} else if (t === "fgNumberEntry" && i(e)) {
			return !s("Numaric").test(e.getValue())
		} else if (t === "fgMultiComboBoxEntry" && i(e)) {
			return e.getSelectedItems().length === 0 || e.getSelectedKeys().length === 0 || e.getSelectedKeys() === undefined
		} else if (t === "fgDateEntry" && i(e)) {
			return e.getValue() === undefined || e.getDateValue().trim() === "" || e.getDateValue() === null || e.getDateValue() === undefined
		}
	}

	function i(e) {
		try {
			return e.getVisible() ? e.getEnabled() && e.getEditable() : false
		} catch (e) {
			return true
		}
	}

	function n(e, t) {
		try {
			if (t === "Start") {
				return i(e) && e.getId().indexOf("dpStart") !== -1 && e.getMetadata().getElementName() === "sap.m.DatePicker"
			} else if (t === "End") {
				return i(e) && e.getMetadata().getElementName() === "sap.m.DatePicker"
			}
		} catch (e) {
			return true
		}
	}

	function u(e, t) {
		try {
			return e.getValue() === undefined || e.getValue().trim() === "" || !s(t).test(e.getValue())
		} catch (e) {
			return false
		}
	}

	function f(e) {
		try {
			e.focus();
			return false
		} catch (e) {
			return true
		}
	}

	function a(e, t) {
		try {
			var r = "ERROR_";
			if (e !== null && e !== undefined) {
				var i = e.split("--")[e.split("--").length - 1];
				r += i
			}
			r = t.getResourceBundle().getText(r);
			r = r.indexOf("ERROR_") === 0 ? t.getResourceBundle().getText("ERROR_GENERIC") : r;
			r = r.indexOf("ERROR_") === 0 ? "Invalid Entry" : r;
			return r
		} catch (e) {
			return "Invalid Entry"
		}
	}

	function l(e, t) {
		try {
			e.setValueState("Error");
			if (e.getValueStateText() !== undefined && e.getValueStateText() !== "" && e.getValueStateText().length > 1) {
				e.setValueStateText(e.getValueStateText())
			} else {
				e.setValueStateText(a(e.getId(), t))
			}
			return true
		} catch (e) {}
	}

	function g(e, t) {
		var r = e.getSelectedKey();
		var i = e.getValue();
		try {
			e.setValueState("Error");
			if (e.getValueStateText() !== undefined && e.getValueStateText() !== "" && e.getValueStateText().length > 1 && !r && i !== "") {
				e.setValueStateText(e.getValueStateText())
			} else {
				e.setValueStateText(a(e.getId(), t))
			}
			return true
		} catch (e) {}
	}

	function o(e, t) {
		try {
			e.setValueState("Error");
			return true
		} catch (e) {}
	}

	function d(e, t) {
		try {
			var r = "";
			if (t === "SG") {
				r = "Start date is greater than End date"
			} else if (t === "EL") {
				r = "End date is lower than Start date"
			} else {
				r = "Invalid date"
			}
			e.setValueState("Error");
			e.setValueStateText(r);
			return true
		} catch (e) {}
	}

	function c(e) {
		try {
			if (e.getValueState() === "Error" && e.getVisible() && e.getEnabled()) {
				e.setValueState("None")
			}
		} catch (e) {}
	}

	function s(e) {
		if (e === "Numaric") {
			return /^\d+$/
		} else if (e === "email") {
			return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		} else if (e === "mobile") {
			return /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]{8,10}$/g
		} else if (e === "Empty") {
			return /\S+/
		} else if (e === "Decimal") {
			return /\S+/
		}
	}
}, true);