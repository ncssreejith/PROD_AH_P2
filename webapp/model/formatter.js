sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function(DateFormat) {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */

		//return new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0];
		/*defaultDateTimeFormat: function(dDate, sFormat) {
			if (!dDate) {
				dDate = new Date();
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy HH:mm"
			});
			if (dDate instanceof Date) {
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} else {
				sDate = fnDateFormatter.format(new Date(dDate));
				return sDate;
			}
		},
*/
		defaultDateTimeFormat: function(dDate, sFormat) {
			if (!dDate) {
				dDate = new Date();
				return "";
			}
			if (dDate !== "") {
				dDate = new Date(dDate);
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy HH:mm" //Teck Meng 30/11/2020 17:40
			});
			if (dDate instanceof Date) {
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} else {
				try {
					return dDate;
					// sDate = new Date(dDate);
					// if (sDate.toDateString() === "Invalid Date") {
					// 	return dDate;
					// }
					// sDate = fnDateFormatter.format(sDate);
					// return sDate;
				} catch (e) {
					return dDate;
				}
			}
		},
		oDataDateTimeFormat: function(dDate, sFormat) {
			if (!dDate) {
				dDate = new Date();
				// return "";
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy HH:mm" //Teck Meng 30/11/2020 17:40
			});
			if (dDate instanceof Date) {
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} else {
				try {
					// return dDate;
					sDate = new Date(dDate);
					if (sDate.toDateString() === "Invalid Date") {
						return dDate;
					}
					sDate = fnDateFormatter.format(sDate);
					return sDate;
				} catch (e) {
					return dDate;
				}
			}
		},
		defaultDateFormat: function(dDate, sFormat) {
			if (!dDate || typeof dDate.getMonth !== "function") {
				return "";
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(dDate);
			return sDate;
		},

		defaultTimeFormat: function(dDate, sFormat) {
			if (!dDate || typeof dDate.getMonth !== "function") {
				return "";
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(dDate);
			return sDate;
		},

		/*defaultOdataDateFormat: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "yyyy-MM-dd"
			});
			var sDate = fnDateFormatter.format(dDate);
			return sDate;
		},*/
		defaultOdataDateFormat: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			try {
				var fnDateFormatter = DateFormat.getDateInstance({
					pattern: sFormat !== undefined ? sFormat : "yyyy-MM-dd"
				});
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} catch (e) {
				return dDate;
			}

		},
		defaultOdataDateTimeFormat: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			try {
				var fnDateFormatter = DateFormat.getDateInstance({
					pattern: sFormat !== undefined ? sFormat : "yyyy-MM-dd HH:mm"
				});
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} catch (e) {
				return dDate;
			}

		},
		roleChOtherEditableStatus: function(sVal) {
			if (sVal === 'TO' || sVal === 'LO' || sVal === 'PO') {
				return true;
			} else {
				return false;
			}
		},

		defaultDateFormatDisplay: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var res, Temp;
			try {
				res = dDate.split("-");
				Temp = res[2].concat("/", res[1], "/", res[0]);
			} catch (e) {
				Temp = dDate;
			}

			return Temp;
		},

		esOperDateFormatter: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var res, Temp, res2, res3;

			try {
				res2 = dDate.split(" ");
				res = res2[0].split("-");
				res3 = res2[1].split(":");
				Temp = res[2].concat("/", res[1], "/", res[0], " ", res3[0], ":", res3[1]);
			} catch (e) {
				Temp = dDate;
			}

			return Temp;
		},

		defaultDateFormatLimDisplay: function(dDate, sFormat) {
			if (dDate === "-" || dDate === "_" || dDate === null || dDate === "") {
				return "_";
			}
			/*var nDate=new Date(dDate);
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(nDate);*/
			var res = dDate.split("-");
			var Temp = res[2].concat("/", res[1], "/", res[0]);

			return Temp;
		},

		defaultDatetoDateFormatDisplay: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var nDate = new Date(dDate);
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "dd/MM/yyyy"
			});
			var sDate = fnDateFormatter.format(nDate);

			return sDate;
		},

		defaultTimeFormatDisplay: function(dDate, sFormat) {
			if (!dDate) {
				return "";
			}
			var oResTemp = "0",
				oResTempHr = "0";
			var res = dDate.split(":");
			if (res[1].length === 1) {
				oResTemp = oResTemp.concat(res[1]);
				res[1] = oResTemp;
			}
			if (res[0].length === 1) {
				oResTempHr = oResTempHr.concat(res[0]);
				res[0] = oResTempHr;
			}
			var Temp = res[0].concat(":", res[1]);

			//return " " + Temp;
			return Temp;
		},

		approvalText: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
					oTemp = "ADD Information";
					break;
				case "B":
					oTemp = "ADD & Limitation Information";
					break;
				case "L":
					oTemp = "Limitation Information";
					break;
				case "W":
					oTemp = "Weight and Balance Information";
					break;
				case "TM":
					oTemp = "Trial Modification";
					break;
			}
			return oTemp;
		},

		////Rahul : change on 28/12/2020 : Start
		MinuteToHoursConversion: function(sDate, eDate) {

			var diffDate = Math.abs(new Date(eDate) - new Date(sDate));
			var sMinutes = Math.floor((diffDate / 1000) / 60);
			var sHours = 0,
				sOneMin = 60,
				sRem = 0,
				sQue = 0,
				sResult = 0.0;
			sQue = Math.floor(sMinutes / sOneMin);
			sRem = (sMinutes % sOneMin);
			if (sRem > 1) {
				sMinutes = sRem;
			}

			sResult = sResult + sQue;

			switch (true) {
				case sMinutes <= 3:
					sHours = 0.0;
					break;
				case 3 <= sMinutes && sMinutes < 9:
					sHours = 0.1;
					break;
				case 9 <= sMinutes && sMinutes < 15:
					sHours = 0.2;
					break;
				case 15 <= sMinutes && sMinutes < 21:
					sHours = 0.3;
					break;
				case 21 <= sMinutes && sMinutes < 27:
					sHours = 0.4;
					break;
				case 27 <= sMinutes && sMinutes < 33:
					sHours = 0.5;
					break;
				case 33 <= sMinutes && sMinutes < 39:
					sHours = 0.6;
					break;
				case 39 <= sMinutes && sMinutes < 45:
					sHours = 0.7;
					break;
				case 45 <= sMinutes && sMinutes < 51:
					sHours = 0.8;
					break;
				case 51 <= sMinutes && sMinutes < 57:
					sHours = 0.9;
					break;
				case 57 <= sMinutes && sMinutes < 60:
					sHours = 1.0;
					break;
			}
			sResult = sResult + sHours;
			return sResult;
		},
		////Rahul : change on 28/12/2020 : End

		LimOverViewText: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
					oTemp = "Acceptable Deferred Defects";
					break;
				case "B":
					oTemp = "ADD & Limitation Information";
					break;
				case "L":
					oTemp = "Limitation";
					break;
			}
			return oTemp;
		},

		approvalMasterText: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
					oTemp = "Acceptable Deferred Defect";
					break;
				case "B":
					oTemp = "Acceptable Deferred Defect & Limitation";
					break;
				case "L":
					oTemp = "Limitation";
					break;
				case "W":
					oTemp = "Weight and Balance";
					break;
				case "LP":
					oTemp = "Leading Particulars";
					break;
				case "TM":
					oTemp = "Trial Mod";
			}
			return oTemp;
		},

		FormattBlank: function(sValue) {
			if (sValue === "" || sValue === null) {
				return "_";
			} else {
				return sValue;
			}
		},

		defaultJobType: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "D":
					oTemp = "Defect";
					break;
				case "S":
				case "ZQ":
					oTemp = "Scheduled";
					break;
				case "U":
					oTemp = "Unscheduled";
					break;
			}
			return oTemp;
		},

		fndIdFormatterModel: function(stTask1, stTask2) {
			/*var stTask1, stTask2;*/
			if (stTask2 && stTask1!=="") {
				for (var i in stTask2) {
					if (stTask2[i].ddid === stTask1) {
						return stTask2[i].description;
					}
				}
				return stTask2;
			} else {
				return "";
			}
		},

		fndIdFormatter: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "FND_10":
					oTemp = "BF";
					break;
				case "FND_11":
					oTemp = "PR";
					break;
				case "FND_12":
					oTemp = "TH";
					break;
				case "FND_13":
					oTemp = "QTR";
					break;
				case "FND_14":
					oTemp = "BPO";
					break;
				case "FND_15":
					oTemp = "PR/BPO";
					break;
				case "FND_16":
					oTemp = "AF";
					break;
				case "FND_17":
					oTemp = "WAI";
					break;
				case "FND_18":
					oTemp = "PTR TAXI";
					break;
				case "FND_19":
					oTemp = "PTR";
					break;
				case "FND_20":
					oTemp = "ICT";
					break;
				case "FND_21":
					oTemp = "HOT ICT";
					break;
				case "FND_22":
					oTemp = "TR";
					break;
				case "FND_23":
					oTemp = "WPT";
					break;
				case "FND_24":
					oTemp = "PMS FLIGHT";
					break;
				case "FND_25":
					oTemp = "PMS NON-FLIGHT";
					break;
				case "FND_26":
					oTemp = "ARMING";
					break;
				case "FND_27":
					oTemp = "DISARMING";
					break;
				case "FND_28":
					oTemp = "POST THUNDERSTORM CHECK";
					break;
				case "FND_29":
					oTemp = "SCHEDULE";
					break;
				case "FND_30":
					oTemp = "IN FLIGHT";
					break;
				case "FND_31":
					oTemp = "RECTIFICATION";
					break;
				case "FND_32":
					oTemp = "START-UP";
					break;
				case "FND_33":
					oTemp = "RED-BALL";
					break;
				case "FND_34":
					oTemp = "ON GROUND";
					break;
				case "FND_35":
					oTemp = "FAIR";
					break;
				case "FND_36":
					oTemp = "POST FLIGHT";
					break;

			}
			return oTemp;
		},

		sumAmount: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		numberUnit: function(sValue) {
			if (!sValue) {
				return "0"; //Teck Meng 27/11/2020 15:30
			}
			return parseFloat(sValue).toFixed(2);
		},
		decimal1Unit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(1);
		},
		integerUnit: function(sValue) {
			if (!sValue) {
				return 0;
			}
			return parseInt(sValue);
		},
		// From BF
		SignoffEnable: function(bAllToolsAcc, bCerfify) {
			if (bAllToolsAcc && bCerfify) {
				return true;
			} else {
				return false;
			}
		},

		taskFF3Visible: function(stTask1) {
			if (stTask1 === "TT1_14" || stTask1 === "TT1_15" || stTask1 === "TT1_17" || stTask1 === "TT1_18") {
				return true;
			} else {
				return false;
			}
		},

		taskFF2Visible: function(stTask1) {
			if (stTask1 === "TT1_11") {
				return true;
			} else {
				return false;
			}
		},

		taskContentVisibleToolCheck: function(stTask1) {
			if (stTask1 === "TT1_13") {
				return true;
			} else {
				return false;
			}
		},

		taskFF21Visible: function(stTask1) {
			if ((stTask1 !== "TT1_11") || (stTask1 !== "TT1_14") || (stTask1 === "TT1_15") || (stTask1 === "TT1_17") || (stTask1 === "TT1_18")) {
				return true;
			} else {
				return false;
			}
		},

		taskContentVisible: function(stTask1, stTask2) { /*(stTask1 === "TT1_14") || (stTask1 === "TT1_10" && stTask2 === "TT2_13") ||*/
			if ((stTask1 === "TT1_10" && stTask2 === "TT2_10") || (stTask1 === "TT1_10" && stTask2 === "TT2_15") || (stTask1 === "TT1_10" &&
					stTask2 === "TT2_12")) {
				return true;
			} else {
				return false;
			}
		},
		taskContentVisible1: function(stTask1, stTask2) {
			if (stTask1 !== "TT1_99") {
				if ((stTask1 === "TT1_14" && (stTask2 === "" || stTask2 === null)) || (stTask1 === "TT1_11" && (stTask2 === "" || stTask2 === null)) ||
					(stTask1 === "TT1_15" && (stTask2 === "" || stTask2 === null)) || (stTask1 === "TT1_18" && (stTask2 === "" || stTask2 === null)) ||
					(stTask1 === "TT1_17" && (stTask2 === "" || stTask2 === null))) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		taskContentVisible2: function(stTask1, stTask2, stTask3) {
			if ((stTask1 === "TT1_11" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" && stTask2 === "TT2_12" && (stTask3 ===
					"" || stTask3 === null))) {
				return true;
			} else {
				return false;
			}
		},
		taskContentTitle: function(stTask1, stTask2, stTask3) {
			if (stTask1 === "TT1_10" && stTask2 === "TT2_12" && (stTask3 === "" || stTask3 === null)) {
				return "Follow-Up Task/Findings";
			} else {
				return "Follow-Up Task";
			}
		},

		taskContentVisible3: function(stTask1, stTask2, stTask3, stTask4) {
			if (((stTask1 === "TT1_14" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_11" && (stTask3 === "" || stTask3 === null)) ||
					(stTask1 === "TT1_12" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" && stTask2 ===
						"TT2_13" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" &&
						stTask2 === "TT2_14" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" &&
						stTask2 === "TT2_10" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" &&
						stTask2 === "TT2_12" && (stTask3 === "" || stTask3 === null)) || (stTask1 ===
						"TT1_10" && stTask2 === "TT2_11" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_15" && (stTask3 === "" || stTask3 ===
						null)) || (stTask1 === "TT1_16" &&
						(stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_17" &&
						(stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_18" && (stTask3 === "" || stTask3 === null)) ||
					(stTask1 === "TT1_19" && (stTask3 === "" || stTask3 === null))) && (stTask4 === "" || stTask4 === null)) {
				return true;
			} else {
				return false;
			}
		},

		/*	taskContentVisibleTB: function(stTask1, stTask2, stTask3, stTask4) {
				if (stTask1 !== "TT1_99") {
					if (((stTask1 === "TT1_14" && stTask3 === "") || (stTask1 === "TT1_10" && stTask2 ===
								"TT2_13" && stTask3 === "") || (stTask1 === "TT1_10" &&
								stTask2 === "TT2_14" && stTask3 === "") || (stTask1 === "TT1_10" &&
								stTask2 === "TT2_10" && stTask3 === "") || (stTask1 === "TT1_10" &&
								stTask2 === "TT2_12" && stTask3 === "") || (stTask1 ===
								"TT1_10" && stTask2 === "TT2_11" && stTask3 === "") || (stTask1 === "TT1_11" && stTask3 === "") || (stTask1 === "" &&
								stTask2 === "" && stTask3 === "") || (stTask1 ===
								"TT1_16" && stTask3 === "") ||
							(stTask1 === "TT1_19" && stTask3 === "")) && (stTask4 === '' || stTask4 === "")) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			},*/
		taskContentVisibleTB: function(stTask1, stTask2, stTask3, stTask4) {
			if (stTask1 !== "TT1_99") {
				if (((stTask1 === "TT1_14" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" && stTask2 ===
							"TT2_13" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" &&
							stTask2 === "TT2_14" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" &&
							stTask2 === "TT2_10" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_10" &&
							stTask2 === "TT2_12" && (stTask3 === "" || stTask3 === null)) || (stTask1 ===
							"TT1_10" && stTask2 === "TT2_11" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_11" && (stTask3 === "" || stTask3 ===
							null)) || ((stTask1 === "" || stTask1 === null) &&
							(stTask2 === "" || stTask2 === null) && (stTask3 === "" || stTask3 === null) && (stTask4 === "" || stTask4 === null)) || (stTask1 ===
							"TT1_16" && (stTask3 === "" || stTask3 === null)) ||
						(stTask1 === "TT1_19" && (stTask3 === "" || stTask3 === null))) && (stTask4 === null || stTask4 === "")) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		taskContentVisible4: function(stTask1, stTask2, stTask3) {
			if ((stTask1 === "TT1_10" && stTask2 === "TT2_10" && (stTask3 === "" || stTask3 === null)) || (stTask1 === "TT1_14" && (stTask3 ===
					"" || stTask3 === null)) || (stTask1 ===
					"TT1_10" && stTask2 ===
					"TT2_13" && (stTask3 === "" || stTask3 === null))) {
				/*	|| (stTask1 === "TT1_10" && stTask2 === "TT2_12" && stTask3 === "")*/
				return true;
			} else {
				return false;
			}
		},
		taskWorkCenterText: function(stTask1, stTask2) {
			/*var stTask1, stTask2;*/
			if (stTask2) {
				for (var i in stTask2) {
					if (stTask2[i].wrctr === stTask1) {
						return stTask2[i].wrctrtx;
					}
				}
				return stTask2;
			}
		},
		taskNameText: function(stTask1, stTask2) {

			if (stTask2) {
				for (var i in stTask2) {
					if (stTask2[i].ttid === stTask1) {
						return stTask2[i].ttype;
					}
				}
				return stTask2;
			}
		},

		FoundDuringText: function(stFndId, stModel) {
			if (stModel) {
				for (var i in stModel) {
					if (stModel[i].ddid === stFndId) {
						return stModel[i].description;
					}
				}
				return null;
			}
		},

		serialNoInputVisible: function(engFlag, isser, tTask2) {
			if ((engFlag === "NE" && isser === "Serial No. (S/N)") || (engFlag === "NA" && isser ===
					"Serial No. (S/N)") || (engFlag === "NA" && isser ===
					"Batch No.") || (engFlag === "NE" && isser ===
					"Batch No.")) {
				if (tTask2 !== "TT2_14" && tTask2 !== "TT2_13") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		serialNoInputRequired: function(engFlag, isser, tTask2, tTask1) {
			if ((engFlag === "NE" && isser === "Serial No. (S/N)" && tTask1 !== "TT1_99") || (engFlag === "NA" && isser ===
					"Serial No. (S/N)" && tTask1 !== "TT1_99")) {
				if (tTask2 !== "TT2_14" && tTask2 !== "TT2_13" && tTask1 !== "TT1_99") {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		setItemVisible: function(stTask2, stTask1) {
			if ((stTask2 === "TT2_11" && stTask1 === "TT4_11") || (stTask2 === "TT2_11" && stTask1 === "TT4_14") || (stTask2 === "TT2_11" &&
					stTask1 === "TT4_15") || (stTask2 === "TT2_11" && stTask1 === "TT4_16") || (
					stTask2 === "TT2_11" && stTask1 === "TT4_10")) {
				return true;
			} else {
				return false;
			}
		},
		serialNoInputGroupVisible: function(engFlag, isser, tTask2) {
			if ((engFlag === "NE" && isser === "Serial No. (S/N)") || (engFlag === "NA" && isser === "Serial No. (S/N)") || (engFlag === "NA" &&
					isser ===
					"Batch No.") || (engFlag === "NE" && isser ===
					"Batch No.")) {
				if (tTask2 !== "TT2_14" && tTask2 !== "TT2_13") {
					return "fgInput";
				} else {
					return "";
				}
			} else {
				return "";
			}
		},
		serialNoCBVisible: function(engFlag, isser, tTask1) {
			if (engFlag === "EG" && isser === "Serial No. (S/N)" && tTask1 !== "TT1_99") {
				return true;
			} else {
				return false;
			}
		},
		serialNoCBGroupVisible: function(engFlag, isser) {
			if (engFlag === "EG" && isser === "Serial No. (S/N)") {
				return "fgCmbBox";
			} else {
				return "";
			}
		},
		taskTextDisplay: function(stTask1) {
			var sImageSrc = "";
			switch (stTask1) {
				case "TT1_15":
					sImageSrc = "Warning Message";
					break;
				case "TT1_17":
					sImageSrc = "QA Task";
					break;
				case "TT1_18":
					sImageSrc = "Independent Checker Task";
					break;
				default:
					sImageSrc = "";
			}
			return sImageSrc;

		},

		FLCTaskTitle: function(sViewName) {
			if (sViewName === "PDS") {
				return "FLC Tasks & Replenishment";
			} else {
				return "Replenishment";
			}
		},

		OutstandingSNDialog: function(sType) {
			if (sType === "Remove and/or Installation" || sType === "Ops Check" || sType === "Visual Inspection" || sType ===
				"Remove and/or Installation" || sType === "Others") {
				return true;
			} else {
				return false;
			}
		},

		EnablePilotAccSingOff: function(sRep, sFly, sADD, sLim, sWeap) {
			if (sRep === "Reviewed" && sFly === "Reviewed" && sADD === "Reviewed" && sLim === "Reviewed" && sWeap === "Reviewed") {
				return true;
			} else {
				return false;
			}
		},
		ManageFRVisibility: function(AirFlightStatus) {
			if (AirFlightStatus !== "NF") {
				return true;
			} else {
				return false;
			}
		},

		ManageSortieMonitoringVisible: function(sFlyReq) {
			if (sFlyReq === "NCO") {
				return true;
			} else {
				return false;
			}
		},

		ManageStatusTestVisible: function(sFlyReq) {
			if (sFlyReq === "Fail" || sFlyReq === "NCO") {
				return true;
			} else {
				return false;
			}
		},
		DBSchedule: function(iPercentage) {
			if (iPercentage < 40 && iPercentage !== 0) {
				return "Critical";
			} else {
				return "Good";
			}
		},
		DBFuelPercentage: function(iPercentage) {
			if (iPercentage < 40) {
				return "Critical";
			} else {
				return "Good";
			}
		},

		WeaponConfigSignOff: function(bSignOff) {
			if (bSignOff) {
				return "#0a6cd6";
			} else {
				return "#EEF1F8";
			}
		},

		FaitrStat: function(sValue) {
			if (sValue === 'R') {
				return "Release for Rectification";
			} else if (sValue === 'A') {
				return "FAIR";
			} else if (sValue === 'C') {
				return "FAIR Closed";
			}
		},

		checkboxDispatch: function(sDispatch) {
			return (sDispatch === "Yes");
		},
		TradesmanStatus: function(sDone, sNA) {
			if (sDone === null && (sNA === null || sNA === "")) {
				return "noKey";
			} else if (sDone === "" && (sNA === null || sNA === "")) {
				return "noKey";
			} else if (sDone === null && sNA === "") {
				return "noKey";
			} else if (sDone === "X" && (sNA === null || sNA === "")) {
				return "NA";
			} else if ((sNA === null || sNA === "") && sDone === "Y") {
				return "Done";
			} else {
				return "noKey";
			}
		},

		///////////////////////////////////////////////////AMIT KUMAR //////////////////////////////////////////////
		//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		rtTabEnable: function(sTab, sApprno, sSRVTID) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
			switch (sTab) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
				case 'rt1':
					if (sApprno === 0) {
						return true;
					}
					break;
				case 'rt2':
					if (sApprno === 1) {
						return true;
					}
					break;
				case 'rt3':
					if (sApprno === 2) {
						return true;
					}
					break;
				case 'rt4':
					if (sApprno >= 3 && this.formatter.srvTOFACheck(sSRVTID)) {
						return true;
					}
					if (!this.formatter.srvTOFACheck(sSRVTID) && sApprno >= 2) {
						return true;
					}
					break;
			}
			return false; //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		}, //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		rtSignOffVisible: function(sTab, sApprno, sSRVTID) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
			switch (sTab) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
				case 'rt1':
					if (sApprno === 0) {
						return true;
					}
					break;
				case 'rt2':
					if (sApprno === 1) {
						return true;
					}
					break;
				case 'rt3':
					if (sApprno === 2) {
						return true;
					}
					break;
				case 'rt4':
					if (sApprno === 3 && this.formatter.srvTOFACheck(sSRVTID)) {
						return true;
					}
					if (!this.formatter.srvTOFACheck(sSRVTID) && sApprno === 2) {
						return true;
					}
					break;
			}
			return false; //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		}, //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		stnsQty: function(isSer, srCount, sTotQty) {
			var sQty = 0;
			if (isSer === "X") {
				sQty = srCount;
			}
			sQty = sTotQty;
			if (sQty === 0) {
				sQty = "";
			}
			return sQty;
		},

		fnFuelMaxAmt: function(srvtId, maxAmt, orgAmt) {
			if (srvtId === "SRVT_DE") {
				return parseInt(orgAmt);
			}
			return parseInt(maxAmt - orgAmt);
		},
		reviewedStatus: function(sStatus) {
			var sTxt = "None";
			if (sStatus) {
				sTxt = "Success";
			}
			return sTxt;
		},
		reviewedStatusTxt: function(sStatus) {
			var sTxt = "To be reviewed";
			if (sStatus) {
				sTxt = "Reviewed";
			}
			return sTxt;
		},

		jdsDueInFormat: function(duein, uom) {
			if (!duein || !uom) {
				return 0;
			}
			// if (uom === "AFH") {
			// 	return duein;
			// }
			return parseFloat(duein);
		},
		sortieMonitoringFormat: function(sValue, sKey) {
			if (sValue && sKey) {
				var temp = null;
				var i = sKey === "SORTI_5" ? 1 : 0;
				temp = sValue.split("@");
				return temp[i];
			}
		},

		fnTimeFormat: function(dDate, sFormat) {
			if (!dDate) {
				dDate = new Date();
			}
			var fnDateFormatter = DateFormat.getDateInstance({
				pattern: sFormat !== undefined ? sFormat : "HH:mm"
			});
			if (dDate instanceof Date) {
				var sDate = fnDateFormatter.format(dDate);
				return sDate;
			} else {
				return dDate;
			}
		},
		fnRTDeleteBtn: function(sTotalLeng) {
			var srNo = parseInt(this.getId().split("-")[this.getId().split("-").length - 1], 0) + 1;
			if (srNo > sTotalLeng) {
				return true;
			}
			return false;
		},
		fnDateDiff: function(oDate) {
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "text";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");
			//{path:'avmetModel>/airutil/COL_13'
			switch (resId) {
				case "RES_105":
					break;
				case "RES_106":
					break;
					// case "RES_107": //Issue 826
					// 	break;
					// case "RES_108":
					// 	break;
				default:
					return "";
			}

			var sDiff = 0;
			if (!oDate) {
				return sDiff + " hrs";
			}
			var sCurrentDate = new Date();
			sDiff = Math.abs(sCurrentDate - new Date(oDate)) / 36e5;
			return "Top up " + parseFloat(sDiff).toFixed(2) + "hrs ago";
		},
		//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
		fnEngHrsDiff: function(sHrsince, sEngineHrs1, sEngineHrs2) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "text";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");

			switch (resId) {
				case "RES_105":
					// var sDiff = parseFloat(sEngineHrs1) - parseFloat(sHrsince); //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->//Teck Meng change on 23/11/2020 13:00 AH Issue 1044,1043-->
					var sDiff = sHrsince; //Teck Meng change on 23/11/2020 13:00 AH Issue 1044,1043-->
					break; //Teck Meng change on 23/11/2020 13:00 AH Issue 1044,1043-->
				case "RES_106":
					// sDiff = parseFloat(sEngineHrs2) - parseFloat(sHrsince); //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->//Teck Meng change on 23/11/2020 13:00 AH Issue 1044,1043-->
					sDiff = sHrsince; //Teck Meng change on 23/11/2020 13:00 AH Issue 1044,1043-->
					break; //Teck Meng change on 23/11/2020 13:00 AH Issue 1044,1043-->
					// case "RES_107": //Issue 826
					// 	break;
					// case "RES_108":
					// 	break;
				default:
					return "";
			}
			//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
			if (!sDiff) {
				return "";
			}
			return "Top up " + parseFloat(sDiff).toFixed(1) + " engine hours ago";
		},
		//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
		fnDateEngineHrsInfoDiff: function(sHrsince, sEngineHrs1, sEngineHrs2) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "visible";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");
			switch (resId) {
				case "RES_105": //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					var sDiff = parseFloat(sEngineHrs1) - parseFloat(sHrsince); //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					break;
				case "RES_106": //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					sDiff = parseFloat(sEngineHrs2) - parseFloat(sHrsince); //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
					break;
				default:
					return false;
			}
			//Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043-->
			if (!sDiff) {
				return false;
			}
			return (sDiff < 10);
		},
		fnDateTimeDiff: function(sDate, sTime) {
			var sDiff = 0;
			if (!sDate) {
				return "";
			}
			if (!sTime) {
				return "";
			}
			var sCurrentDate = new Date();
			sDiff = Math.abs(sCurrentDate - new Date(sDate + " " + sTime)) / 36e5;
			return parseFloat(sDiff).toFixed(2); // + " hrs";
		},
		fnDateEngineHrsDiff: function(sDate) {
			var sBindInfo = this.getBindingInfo("footerRightInfo") ? "footerRightInfo" : "visible";

			var sModel = this.getBindingInfo(sBindInfo).parts[0].model;
			var resId = this.getBindingContext(sModel).getProperty("resid");
			switch (resId) {
				case "RES_105":
					break;
				case "RES_106":
					break;
				default:
					return false;
			}
			var sDiff = 0;
			if (!sDate) {
				return false;
			}

			var sCurrentDate = new Date();
			sDiff = Math.abs(sCurrentDate - new Date(sDate)) / 36e5;
			return (sDiff < 10); // + " hrs";
		},
		fnEnginEnableChk: function(sSign, sEngId, sResId) {
			// var sFlag = false;
			if (sSign) {
				return false;
			}
			if (!sEngId && sResId === "RES_119") {
				return false;
			}
			return true;
		},
		fnEngineEnableHit: function(sReasonCheck, sLock) {
			if (sLock === "99" || sLock === undefined || sLock === null || sLock === "") {
				return true;
			}
			// 
			switch (sReasonCheck) {
				case "0":
					if (sLock === "0") {
						return true;
					}
					break;
				case "1":
					if (sLock === "1" || sLock === "2" || sLock === "3") {
						return true;
					}
					break;
				case "2":
					if (sLock === "1" || sLock === "2" || sLock === "3") {
						return true;
					}
					break;
			}
			return false;
		},
		serviceIdExist: function(srvId) {
			if (srvId === "" || srvId === null || srvId === undefined) {
				return false;
			}
			return true;
		},
		serviceIdNotExist: function(srvId) {
			if (srvId === "" || srvId === null || srvId === undefined) {
				return true;
			}
			return false;
		},
		srvIdExistEnable: function(srvId) {
			if (srvId === "" || srvId === null || srvId === undefined) {
				return true;
			}
			return false;
		},
		FuelMCState1: function(sValue, iMax) {
			// if(this.getId() && document.querySelector("#"+this.getId()+" > div > div > div")){
			// 	document.querySelector("#"+this.getId()+" > div > div > div").textContent="";
			// }
			var iValue = 0;
			if ((sValue === null || iMax === null) || (sValue === "" || iMax === "")) {
				return "Neutral";
			} else if ((parseInt(sValue) < parseInt(iMax))) {
				return "Critical";
			} else if ((parseInt(sValue) === parseInt(iMax))) {
				return "Good";
			}
		},
		fsWCSignOff: function(tstat) {
			if (tstat === "" || tstat === null) {
				return true;
			}
			return false;
		},
		fsRCSignOff: function(selTab, tsign) {
			if (selTab === "rc1") {
				if (tsign === "" || tsign === null) {
					return true;
				}
				return false;
			}
			if (selTab === "rc2") {
				if (tsign === "" || tsign === null) {
					return false;
				}
				return true;
			}
			return true;
		},

		//Teck Meng 13/11/2020 12:00 F16 Role change fixes issue no 25,26 
		fsRCUnSignOff: function(selTab, tsign) {
			if (selTab === "rc2") {
				if (tsign === "" || tsign === null) {
					return false;
				}
				return true;
			}
			if (selTab === "rc1") {
				if (tsign === "" || tsign === null) {
					return false;
				}
				return true;
			}
			return true;
		},
		fsWCUnSignOff: function(tstat) {
			if (tstat === "" || tstat === null) {
				return false;
			}
			return true;
		},

		wcQuanty: function(TOTQTY, SERNR) {
			if (TOTQTY !== null || TOTQTY !== "" || TOTQTY !== undefined || TOTQTY >= 0) {
				return "Qty " + TOTQTY;
			}
			if (SERNR) {
				return "Qty " + 1;
			}
			return "Qty " + 0;
		},
		//Rahul Code changes 30/10/2020: to check table check box selection logic
		fnRTTaskEnableChk: function(sSign, sEngId, sResId) {
			// var sFlag = false;
			if (sSign) {
				return false;
			}
			if (!sEngId && sResId === "RTASK_9004") {
				return true;
			}
			return false;
		},
		rcSignBtn: function(tsgn, ttab) {
			if (tsgn && ttab === "rc1") {
				return "Undo SignOff";
			}
			return "Sign off";
		},

		rcSignChange: function(tsgn, ttab) {
			if (!tsgn && ttab === "rc1") {
				return true;
			}
			if (tsgn && ttab === "rc2") {
				return true;
			}
			return false;
		},
		rcSignAPPR: function(ttab) {
			if (ttab === "rc1") {
				return 0;
			}
			if (ttab === "rc2") {
				return 1;
			}
			return 0;
		},

		fnfinalWcSignOffTxt: function(oSrvtId) {
			switch (oSrvtId) {
				case "SRVT_AF":
				case "SRVT_BPO":
					return false;
				default:
					return true;
			}
		},
		wcViewSNVisible: function(sPot, sQty, sAdp, sWesId) {
			if (sWesId) {
				if (sQty > 0) {
					return "View S/N";
				}
				return "";
			}
			if (sAdp) {
				return "View S/N";
			}
			return "";
		},
		wcQty: function(sPot, sQty, sAdp, sWesId) {
			if (sWesId) {
				if (sQty > 0) {
					return "Qty " + sQty;
				}
				return "Qty 0";
			}
			if (sAdp) {
				return "Qty 1";
			}
			return "Qty 0";
		},
		ADDLimitColorByDay: function(sValue) {
			this.removeStyleClass("vboxOrangebgColorr");
			this.removeStyleClass("vbox6BgColor");
			if (sValue === "1") {
				this.addStyleClass("vboxOrangebgColorr");
			} else {
				this.addStyleClass("vbox6BgColor");
			}
			return "13%";
		},
		fnLblAddLimit: function(sValue) {
			var oTemp = "";
			switch (sValue) {
				case "A":
				case "B":
					oTemp = "Acceptable Deferred Defects";
					break;
				case "L":
					oTemp = "Limitation";
					break;
			}
			return oTemp;
		},
		wConnect: function(sState, isCart) {
			var sCText = "";
			if (sState === "C") {
				sCText = "Disconnect \n connector";
				if (isCart === 'X') {
					sCText = "Uninstall \n impulse cart";
				}
				return sCText;
			}
			sCText = "Connect \n connector";
			if (isCart === "X") {
				sCText = "Install \n impulse cart";
			}
			return sCText;
		},
		wConnectColor: function(sState) {
			// CONTOR ICART
			if (sState) {
				return sap.m.ValueColor.Error;
			}
			return sap.m.ValueColor.Critical;
		},
		srvWeaponImage: function(oStationId) {
			var oSrvImg = "";
			switch (oStationId) {
				case "STNS_100":
					oSrvImg = "css/img/Section-1.png";
					break;
				case "STNS_101":
					oSrvImg = "css/img/Section-2.png";
					break;
				case "STNS_102":
					oSrvImg = "css/img/Section-3.png";
					break;
				case "STNS_103":
					oSrvImg = "css/img/Section-4.png";
					break;
				case "STNS_104":
					oSrvImg = "css/img/Section-5.png";
					break;
				case "STNS_105":
					oSrvImg = "css/img/Section-6.png";
					break;
				case "STNS_106":
					oSrvImg = "css/img/Section-7.png";
					break;
				case "STNS_107":
					oSrvImg = "css/img/Section-8.png";
					break;
				case "STNS_108":
					oSrvImg = "css/img/Section-9.png";
					break;
				case "STNS_109":
					oSrvImg = "css/img/Section-10.png";
					break;
				case "STNS_110":
					oSrvImg = "css/img/Section-1.png";
					break;
			}
			return oSrvImg;
		},

		srvWeaponAHImage: function(oStationId) {
			var oSrvImg = "";
			switch (oStationId) {
				case "STNS_100":
					oSrvImg = "css/img/ConfigCHAFF.png"; // CHAFF
					break;
				case "STNS_101":
					oSrvImg = "css/img/ConfigFLARE.png"; //FLARE
					break;
				case "STNS_102":
					oSrvImg = "css/img/ConfigGUN.png";
					break;
				case "STNS_109":
					oSrvImg = "css/img/ConfigLOB.png";
					break;
				case "STNS_110":
					oSrvImg = "css/img/ConfigLIB.png";
					break;
				case "STNS_111":
					oSrvImg = "css/img/ConfigRIB.png";
					break;
				case "STNS_112":
					oSrvImg = "css/img/ConfigROB.png";
					break;
			}
			return oSrvImg;
		},

		wcStationColor: function(oTotal) {
			// if (oTotal === undefined || oTotal === '' || oTotal === null || oTotal === 0) {
			if (oTotal === undefined || oTotal === '' || oTotal === null || oTotal === 0) {
				return "#e8e4e4";
			}
			return "#0a6cd6";
		},
		/** 
		 * AVMET frame button status color
		 * @param oSt
		 * @param sSttxt
		 * @returns
		 */
		statusColor: function(oSt, sSttxt) {
			switch (oSt) {
				case "AST_S":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_FS":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greybtn");
					break;
				case "AST_FFF":
				case "AST_FFF0":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_RFF":
				case "AST_RFF0":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_US":
				case "AST_US0":
				case "AST_US1":
				case "AST_US2":
				case "AST_RC":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("yellowbtn");
					break;
				case "AST_RECT":
				case "AST_RECT1":
				case "AST_RECT2":
				case "AST_FAIR":
				case "AST_FAIR0":
				case "AST_FAIR1":
				case "AST_FAIR2":
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("redbtn");
					break;
				case "AST_FFC":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_FFG":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("yellowbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("greenbtn");
					break;
				case "AST_REC":
					this.removeStyleClass("redbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("infobtn");
					this.addStyleClass("yellowbtn");
					break;
				default:
					this.removeStyleClass("redbtn");
					this.removeStyleClass("greenbtn");
					this.removeStyleClass("greybtn");
					this.removeStyleClass("yellowbtn");
					this.addStyleClass("infobtn");
					break;
			}

			return sSttxt;
		},
		statusFlightColor: function(oSt) {
			switch (oSt) {
				case "AST_RFF":
					this.addStyleClass("dashButtonRole");
					return "Transparent";

				default:
					this.addStyleClass("sapMBtnInner");
					return "Emphasized";

			}

			return "Emphasized";
		},
		srvImage: function(statusId) {
			var sImageSrc = "";
			switch (statusId) {
				case "SRVT_AF":
					sImageSrc = "css/img/BFFlight.JPG";
					break;
				case "SRVT_BF":
					sImageSrc = "css/img/BFFlight.JPG";
					break;
				case "SRVT_BPO":
					sImageSrc = "css/img/BFFlight.JPG";
					break;
				case "SRVT_HCT":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_ICT":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PO":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PRO":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PTR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_PTX":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_QT":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_QTR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_TH":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_TR":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_WA":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_WAI":
					sImageSrc = "css/img/BFFlight.jpg";
					break;
				case "SRVT_DE":
					sImageSrc = "css/img/Defuel.jpg";
					break;
				case "SRVT_RE":
					sImageSrc = "css/img/Refuel.jpg";
					break;
				default:
					sImageSrc = "css/img/BFFlight.jpg";
			}
			return sImageSrc;
		},
		srvImageHover: function(statusId) {
			var sImageSrc = "";
			switch (statusId) {
				case "SRVT_AF":
					sImageSrc = "css/img/BFFlightBlu.JPG";
					break;
				case "SRVT_BF":
					sImageSrc = "css/img/BFFlightBlu.JPG";
					break;
				case "SRVT_BPO":
					sImageSrc = "css/img/BFFlightBlu.JPG";
					break;
				case "SRVT_HCT":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_ICT":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PO":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PRO":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PTR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_PTX":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_QT":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_QTR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_TH":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_TR":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_WA":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_WAI":
					sImageSrc = "css/img/BFFlightBlu.jpg";
					break;
				case "SRVT_DE":
					sImageSrc = "css/img/DefuelBlu.jpg";
					break;
				case "SRVT_RE":
					sImageSrc = "css/img/RefuelBlu.jpg";
					break;
				default:
					sImageSrc = "css/img/BFFlightBlu.jpg";
			}
			return sImageSrc;
		},

		srvLbl: function(srvId) {
			var sSrvTitle = "";
			switch (srvId) {
				case "SRVT_ARM":
					sSrvTitle = "ARM";
					break;
				case "SRVT_DARM":
					sSrvTitle = "DARM";
					break;
				case "SRVT_AF":
					sSrvTitle = "AF";
					break;
				case "SRVT_BF":
					sSrvTitle = "BF";
					break;
				case "SRVT_BPO":
					sSrvTitle = "BPO";
					break;
				case "SRVT_HCT":
					sSrvTitle = "HCT";
					break;
				case "SRVT_ICT":
					sSrvTitle = "ICT";
					break;
				case "SRVT_PO":
					sSrvTitle = "PO";
					break;
				case "SRVT_PR":
					sSrvTitle = "PR";
					break;
				case "SRVT_PRO":
					sSrvTitle = "PR/BPO";
					break;
				case "SRVT_PTR":
					sSrvTitle = "PTR";
					break;
				case "SRVT_PTX":
					sSrvTitle = "PTX";
					break;
				case "SRVT_QT":
					sSrvTitle = "QT";
					break;
				case "SRVT_QTR":
					sSrvTitle = "QTR";
					break;
				case "SRVT_TH":
					sSrvTitle = "TH";
					break;
				case "SRVT_TR":
					sSrvTitle = "TR";
					break;
				case "SRVT_WA":
					sSrvTitle = "WA";
					break;
				case "SRVT_WAI":
					sSrvTitle = "WAI";
					break;
				case "SRVT_DE":
					sSrvTitle = "Defuel";
					break;
				case "SRVT_RE":
					sSrvTitle = "Refuel";
					break;
				case "SRVT_PMSF":
					sSrvTitle = "PMSF";
					break;
				case "SRVT_HICT":
					sSrvTitle = "HOT ICT";
					break;
				case "SRVT_OSC":
					sSrvTitle = "Outstation checks";
					break;
				case "SRVT_PTRT":
					sSrvTitle = "PTR-Taxi";
					break;
				case "SRVT_PMSN":
					sSrvTitle = "PMS Non-Flight";
					break;
				case "SRVT_PTC":
					sSrvTitle = "Post Thunderstorm Check";
					break;
				case "SRVT_WPT":
					sSrvTitle = "WPT";
					break;

			}
			return sSrvTitle;
		},
		/** //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		 * Routine tasks stepid TOFA valid check
		 * @param srvId
		 * @returns
		 */
		srvPostFlightFlownCheck: function(srvId) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
			switch (srvId) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
				case "SRVT_AF":
					return false;
				case "SRVT_ARM":
					return false;
				case "SRVT_PMSN":
					return false;
				case "SRVT_PTC":
					return false;
				case "SRVT_WPT":
					return false;
				case "SRVT_DARM":
					return false;
				default:
					return true;
			} //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
			return true;
		}, //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		/** //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		 * Routine tasks stepid TOFA valid check
		 * @param srvId
		 * @returns
		 */
		srvTOFACheck: function(srvId) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
			switch (srvId) { //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
				case "SRVT_AF":
					return false;
				case "SRVT_ARM":
					return false;
				case "SRVT_PMSN":
					return false;
				case "SRVT_PTC":
					return false;
				case "SRVT_WPT":
					return false;
				case "SRVT_DARM":
					return false;
				default:
					return true;
			} //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
			return true;
		}, //Teck Meng change on 18/11/2020 13:00 AH Issue 1044,1043
		serialNumber: function(oItem) {
			var srNo = parseInt(this.getId().split("-")[this.getId().split("-").length - 1], 0) + 1;
			// var oModel = this.getBindingInfo("text").parts[0].model;
			if (this.getBindingContext("oPilotUpdatesViewModel")) {
				this.getBindingContext("oPilotUpdatesViewModel").getObject().num2 = srNo;
			}

			return srNo;
		},
		/** //Teck Meng change on 27/11/2020 13:00 AH Issue 1044,1043 start ======================
		 * visible if it is the first Item in table
		 * @param oItem
		 * @returns
		 */
		visibleIfFirstItem: function() {
			return parseInt(this.getId().split("-")[this.getId().split("-").length - 1], 0) === 0;
		}, //Teck Meng change on 27/11/2020 13:00 AH Issue 1044,1043 end ======================
		formatMaxValue: function(oMax) {
			if (!oMax) {
				oMax = 0.00; //Change by Teck Meng 20/11/2020 10:15
			}
			oMax = parseFloat(oMax, 0); //Change by Teck Meng 20/11/2020 10:15
			if (isNaN(oMax)) {
				return 0.00; //Change by Teck Meng 20/11/2020 10:15
			}
			return oMax;
		},

		/** 
		 *  //Change by Teck Meng 20/11/2020 10:15
		 * @param oMax
		 * @returns
		 */
		formatOilValue: function(fValue) { //Change by Teck Meng 20/11/2020 10:15
			if (!fValue || fValue === "0" || fValue === "0.00") { //Change by Teck Meng 20/11/2020 10:15
				fValue = "-";
			}
			fValue = parseFloat(fValue);
			if (isNaN(fValue)) {
				return "-";
			}
			return fValue; //Change by Teck Meng 20/11/2020 10:15
		}, //Change by Teck Meng 20/11/2020 10:15
		percentAge: function(oState, sState1) {
			var sPercentAge = 0;
			if (oState === undefined || oState === null || oState === "" || oState === 0) {
				return sPercentAge;
			}
			sPercentAge = ((oState * 100) / sState1);
			if (sPercentAge > 100) {
				sPercentAge = 100;
			}
			return sPercentAge;
		},
		fuelMC: function(oState, sState1) {
			if (!oState || !sState1) {
				return 0;
			}
			var sPercentAge = 0;
			if (oState === undefined || oState === null || oState === "") {
				return sPercentAge;
			}
			sPercentAge = ((oState * 100) / sState1);
			return sPercentAge;
		},
		fnMarkLable: function(sNumber) {
			// var sNumber = parseInt(this.getId().split("-")[this.getId().split("-").length - 1], 0) + 1;
			var sChar = "A";
			switch (sNumber) {
				case 0:
					sChar = "A";
					break;
				case 1:
					sChar = "B";
					break;
				case 2:
					sChar = "C";
					break;
				case 3:
					sChar = "D";
					break;
				case 4:
					sChar = "E";
					break;
				case 5:
					sChar = "F";
					break;
				case 6:
					sChar = "G";
					break;
				case 7:
					sChar = "H";
					break;
				case 8:
					sChar = "I";
					break;
			}
			return sChar;
		},
		fnOrgSrvAmt: function(orgAmt, srvAmt) {
			if (!orgAmt) {
				orgAmt = 0;
			}
			if (srvAmt) {
				srvAmt = 0;
			}
			return parseInt(orgAmt) + parseInt(srvAmt);
		},
		///////////////////////////////////////////////////AMIT KUMAR //////////////////////////////////////////////

		//////////////////////********************    PRIYA - STARTS   *****************************///////////////

		FormatMaxValue: function(sValue, max) {
			if (!isNaN(sValue) && sValue !== null && sValue !== 0) {
				return parseInt(sValue);
			} else if (!isNaN(max) && max !== null) {
				return parseInt(max);
			}
		},

		FormatMaxValueText: function(srvamt, totamt) {
			if (totamt !== 0 && srvamt > totamt) {
				return "test123";
			} else {
				return "";
			}
		},

		FormatRoleMaxValue: function(sMax) {
			if (!isNaN(sMax) && sMax !== null && sMax !== 0) {
				return parseFloat(sMax);
			}

		},

		FormatMaxValueState: function(srvamt, totamt) {
			if (totamt !== 0 && srvamt > totamt) {
				return "Error";
			} else {
				return "None";
			}
		},

		FormatMaxValueFloat: function(sValue, max) {
			if (!isNaN(sValue) && sValue !== null && sValue !== "" && sValue !== 0) {
				return parseFloat(sValue);
			} else if (!isNaN(max) && max !== null && max !== "") {
				return parseFloat(max);
			}
		},
		FormatDeFuel: function(sValue) {
			if (sValue === "X") {
				return true;
			} else {
				return false;
			}
		},
		FuelMC: function(sValue, iMax) {
			if (!sValue || !iMax) {
				return 0;
			}
			var iValue = 0;
			if ((sValue === null && sValue === "") || (iMax === null && iMax === "")) {
				return iValue;
			} else {
				iValue = ((parseFloat(sValue) / parseInt(iMax))) * 100;
				return iValue;
			}
		},
		FuelMCState: function(sValue, iMax) {
			var iValue = 0;
			if ((sValue === null || iMax === null) || (sValue === "" || iMax === "")) {
				return "Neutral";
			} else if ((parseInt(sValue) < parseInt(iMax))) {
				return "Critical";
			} else if ((parseInt(sValue) === parseInt(iMax))) {
				return "Good";
			}
		},
		formatDecimalOil: function(sValue) {
			if (sValue === "LOX") {
				return 1;
			}
			if (sValue === "Eng Oil #1") {
				return 2;
			}
			if (sValue === "Eng Oil #2") {
				return 2;
			}
			return 2; //Teck Meng change on 20/11/2020 13:00 AH Issue
		},

		formatStepOil: function(sValue) {
			switch (sValue) {
				case "LOX":
				case "Eng Oil #1":
				case "Eng Oil #2":
					return 0.1;
			}
		},
		ImpulseCart: function(bTanks) {
			if (bTanks) {
				return false;
			} else {
				return true;
			}
		},
		EnablePDSSignOff: function(bOutSignOffEnable, bFinalSignOffEnable) {
			if (bOutSignOffEnable && bFinalSignOffEnable) {
				return true;
			} else {
				return false;
			}
		},

		ShowTire: function(sSrvtId) {
			if (sSrvtId === "SRVT_BF" || sSrvtId === "SRVT_PR" || sSrvtId === "SRVT_WAI") {
				return true;
			} else {
				return false;
			}
		},
		PageTitle: function(sPageTitle) {
			if (sPageTitle === "PTRT") {
				return "PTR-Taxi";
			} else if (sPageTitle === "HICT") {
				return "HOT ICT";
			} else if (sPageTitle === "PRO") {
				return "PR/BPO";
			} else if (!isNaN(sPageTitle)) {
				return "";
			} else {
				return sPageTitle;
			}
		},
		TradesmanStatusDisplay: function(sDone, sNA) {
			if (sDone === null && sNA === null) {
				return "";
			} else if (sDone === "" && sNA === null) {
				return "";
			} else if (sDone === null && sNA === "") {
				return "";
			} else if (sDone === "" && sNA === "") {
				return "";
			} else if (sDone === "X" && sNA === null) {
				return "NA";
			} else if (sNA === null && sDone === "Y") {
				return "Done";
			} else {
				return "";
			}
		},
		CheckTailStatus: function(aState) {
			switch (aState) {
				case "AST_FAIR":
				case "AST_FAIR0":
				case "AST_FFC":
				case "AST_FFF":
				case "AST_FFG":
				case "AST_GN":
				case "AST_PF":
				case "AST_RCG":
				case "AST_REC":
				case "AST_RFF":
				case "AST_FAIR1":
				case "AST_FAIR2":
				case "AST_THR":
				case "AST_THR1":
					return false;
				default:
					return true;
			}
		},

		/**  //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043 start
		 * Release for retification check
		 * @param aState
		 * @param sSrvid
		 * @returns
		 */ //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043 start
		checkFairStatus: function(aState, sSrvid) { //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043 start
			if (!sSrvid) { //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043 start
				return false; //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043 start
			} //Teck Meng change on 02/12/2020 13:00 AH Issue 1044,1043 end
			switch (aState) {
				case "AST_FAIR":
				case "AST_FAIR0":
				case "AST_FAIR1":
				case "AST_FAIR2":
					return true;
				default:
					return false;
			}
		},

		//Rahul change on 25/01/2021: Start
		CloseJobBtnStatus: function(sStatus1, sStatus2) {
			if ((sStatus1 === true && sStatus2 === true)) {
				return true;
			} else {
				return false;
			}
		},
		//Rahul change on 25/01/2021: End
		FormatRoleChangeSLNo: function(sSlNo) {
			if (sSlNo !== "") {
				return "S/N: " + sSlNo;
			} else {
				return sSlNo;
			}
		},
		//////////////////////********************    PRIYA - ENDS   *****************************///////////////
		fnEditableCol: function(iColId) {
			var bEditable = true;
			var oRow = this.getBindingContext("oWDNSDataModel").getObject();
			// iColId === oRow.COL_15 &&
			if (oRow && (oRow.COL_12 === "GUN DH" || (iColId && iColId.toUpperCase() === "N/A"))) {
				bEditable = false;
			}
			return bEditable;
		},
		fnWDNSEditableCol: function(iColId) {
			var bEditable = true;
			if (iColId && iColId.toUpperCase() === "N/A") {
				bEditable = false;
			}
			return bEditable;
		},
		fnWDNSVisibleRow: function(iColId) {
			var bVisible = false;
			var oRow = this.getBindingContext("oWDNSDataModel").getObject();
			if (oRow && (oRow.COL_12 === "GUN DH" && oRow.bPilot)) {
				bVisible = true;
			}
			if (oRow && (oRow.COL_12 !== "GUN DH" && !oRow.bPilot)) {
				bVisible = true;
			}
			return bVisible;
		},

		intFormat: function(sValue) {
			if (sValue) {
				return parseInt(sValue, 10);
			}
			return sValue;
		},

		PDSICJobDueDecimalPrecision: function(sValue, sKey) {
			var iPrec;
			if (sKey === "JDU_11" || sKey === "JDU_18" || sKey === "JDU_19" || sKey === "JDU_20" || sKey === "SORTI_2" || sKey === "SORTI_3" ||
				sKey === "SORTI_6" || sKey === "UTIL1_10" || sKey === "UTIL1_16" || sKey === "UTIL1_17" || sKey === "UTIL1_18") {
				iPrec = 1;
			} else {
				iPrec = 0;
			}
			var iVal = parseFloat(sValue).toFixed(iPrec);
			return parseFloat(iVal);
		},

		JobDueDecimalPrecision: function(sKey) {
			if (sKey === "JDU_11" || sKey === "JDU_18" || sKey === "JDU_19" || sKey === "JDU_20" || sKey === "SORTI_2" || sKey === "SORTI_3" ||
				sKey === "SORTI_6" || sKey === "UTIL1_10" || sKey === "UTIL1_16" || sKey === "UTIL1_17" || sKey === "UTIL1_18") {
				return 1;
			} else {
				return 0;
			}
		},

		decimalForTableFormatter: function(sValue) {
			if (sValue) {
				return sValue;
			}
		},
		validDateTimeChecker: function(that, idDate, idTime, errorMessagePast, errorMessageFuture, prevDate, prevTime, futureCheck, fragmentId) {
			var maxDt = new Date(),
				oDatePicker = fragmentId ? sap.ui.core.Fragment.byId(fragmentId, idDate) : that.getView().byId(idDate),
				creDt = oDatePicker.getDateValue(),
				oTimePick = fragmentId ? sap.ui.core.Fragment.byId(fragmentId, idTime) : that.getView().byId(idTime),
				creTm = oTimePick.getValue();

			if (!creDt) {
				creDt = oDatePicker.getValue();
				var splitDt = creDt.split("/");
				creDt = new Date(splitDt[2], splitDt[1] - 1, splitDt[0]);
			}
			//Rahul: 07/12/2020: 05:25PM: New date validation check added.-Start
			if (!isNaN(creDt.getDate()) === false) {
				oDatePicker.setValueState("Error");
				oTimePick.setValueState("Error");
				return false;
			}
			//Rahul: 07/12/2020: 05:25PM: New date validation check added.-End
			var date = creDt.getDate(),
				year = creDt.getFullYear(),
				month = creDt.getMonth() + 1;
			var dateString = '' + year + '-' + month + '-' + date;
			var timeString = creTm + ':00';
			//Rahul: COS: 16/11/2020: 11:26Am: Code added for date concatination.
			//var crDtTime = new Date(dateString + ' ' + timeString);
			var datec, crDtTime; //Rahul: COS: 20/11/2020: 09:16Am: Veriable declaration changed.
			datec = dateString + ' ' + timeString; //Rahul: COS: 19/11/2020: 10:04Am: "T" removed
			crDtTime = new Date(datec);
			// Rahul: COS: 20/11/2020: 09:16Am: new if condition added.
			if (!isNaN(crDtTime.getDate()) === false) {
				datec = dateString + 'T' + timeString; //Rahul: COS: 19/11/2020: 10:04Am: "T" Added
				crDtTime = new Date(dateString);
				var TempCreTime = timeString.split(":"); //Rahul: COS: 25/11/2020: 04:16pm: code Added
				crDtTime.setHours(TempCreTime[0], TempCreTime[1], "00");
			}
			// Rahul: COS: 20/11/2020: 09:16Am: new if condition End.
			////////////// Rahul: COS: 16/11/2020: 11:26Am: /////////////////////////////

			var minDate = "";
			if (prevDate) {
				var dateParts = prevDate.split("-");
				minDate = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
				var timeParts = prevTime.split(":");
				minDate.setHours(timeParts[0]);
				minDate.setMinutes(timeParts[1]);
			} else {
				minDate = new Date();
				minDate.setDate(minDate.getDate() - 1);
				minDate.setMinutes(minDate.getMinutes() - 1);
				minDate.setSeconds(0);
			}

			futureCheck = futureCheck !== null && futureCheck !== undefined ? futureCheck : true;

			if (crDtTime.getTime() <= maxDt.getTime()) {
				if (crDtTime.getTime() >= minDate.getTime()) {
					oDatePicker.setValueState("None");
					oTimePick.setValueState("None");
					return true;
				} else {
					oDatePicker.setValueState("Error");
					oTimePick.setValueState("Error");
					var dt = this.defaultDatetoDateFormatDisplay(prevDate);
					var tm = this.defaultTimeFormatDisplay(prevTime).trim();
					sap.m.MessageBox.error(that.getResourceBundle().getText(errorMessagePast, [dt + " " + tm]));
					return false;
				}
			} else {
				if (!futureCheck) {
					oDatePicker.setValueState("None");
					oTimePick.setValueState("None");
					return true;
				}
				oDatePicker.setValueState("Error");
				oTimePick.setValueState("Error");
				sap.m.MessageBox.error(that.getResourceBundle().getText(errorMessageFuture));
				return false;
			}
		},

		validDateTimeCloseTaskChecker: function(that, currDate, currTime, errorMessagePast, errorMessageFuture, prevDate, prevTime) {
			var maxDt = new Date(),
				creDt = new Date(currDate),
				creTm = currTime,
				date = creDt.getDate(),
				year = creDt.getFullYear(),
				month = creDt.getMonth() + 1;
			var dateString = '' + year + '-' + month + '-' + date;
			var timeString = creTm + ':00';
			//Rahul: COS: 16/11/2020: 11:26Am: Code added for date concatination.
			//var crDtTime = new Date(dateString + ' ' + timeString);
			var datec, crDtTime; //Rahul: COS: 20/11/2020: 09:16Am: Veriable declaration changed.
			datec = dateString + ' ' + timeString; //Rahul: COS: 19/11/2020: 10:04Am: "T" removed
			crDtTime = new Date(datec);
			// Rahul: COS: 20/11/2020: 09:16Am: new if condition added.
			if (!isNaN(crDtTime.getDate()) === false) {
				datec = dateString + 'T' + timeString; //Rahul: COS: 19/11/2020: 10:04Am: "T" Added
				crDtTime = new Date(dateString);
				var TempCreTime = timeString.split(":"); //Rahul: COS: 25/11/2020: 04:16pm: code Added
				crDtTime.setHours(TempCreTime[0], TempCreTime[1], "00");
			}
			// Rahul: COS: 20/11/2020: 09:16Am: new if condition End.
			////////////// Rahul: COS: 16/11/2020: 11:26Am: /////////////////////////////
			var minDate = "";
			if (prevDate) {
				var dateParts = prevDate.split("-");
				minDate = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
				var timeParts = prevTime.split(":");
				minDate.setHours(timeParts[0]);
				minDate.setMinutes(timeParts[1]);
			} else {
				minDate = new Date();
				minDate.setDate(minDate.getDate() - 1);
				minDate.setMinutes(minDate.getMinutes() - 1);
				minDate.setSeconds(0);
			}

			if (crDtTime.getTime() <= maxDt.getTime()) {
				if (crDtTime.getTime() >= minDate.getTime()) {
					return "C";
				} else {
					return "L";
				}
			} else {
				return "G";
			}
		},

		serialTemplateBtnVisibility: function(stt1, stt2) {
			if (stt1 === "TT1_10" && (stt2 === "TT2_10" || stt2 === "TT2_12" || stt2 === "TT2_13" || stt2 === "TT2_14")) {
				return true;
			}
			return false;
		},

		batchTemplateBtnVisibility: function(stt1, stt2) {
			if (stt1 === "TT1_10" && stt2 === "TT2_15") {
				return true;
			}
			return false;
		},

		getTimeValueForDate: function(aData, datePath, timePath) {
			if (aData && datePath && timePath && aData[datePath] && aData[timePath]) {
				var obj = JSON.parse(JSON.stringify(aData));
				var date = obj[datePath],
					time = obj[timePath],
					dateParts = date.split("-"),
					timeParts = time.split(":");
				var newDate = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
				newDate.setHours(timeParts[0]);
				newDate.setMinutes(timeParts[1]);
				newDate.setSeconds(timeParts[2].split(".")[0], [timeParts[2].split(".")[1]]);
				return newDate.getTime();
			}

		},

		formatUtilValApproval: function(sVal, sKey) {
			if (sVal && sKey) {
				var sParts = sVal.split("@");
				if (sKey === "UTIL1_20") {
					return sParts[1];
				} else {
					return sParts[0];
				}
			}
			return sVal;
		},

		jobAction: function(sStatus) {
			if (sStatus) {
				var sText = "-";
				switch (sStatus) {
					case "A":
						sText = "FAIR";
						break;
				}
				return sText;
			}
		},

		jobESStatusAction: function(sStatus) {
			if (sStatus) {
				var sText = "None";
				switch (sStatus) {
					case "Posted Successfully":
						sText = "Success";
						break;
					case "Pending":
						sText = "Warning";
						break;
					case "Posting Error":
						sText = "Error";
						break;
				}
				return sText;
			}
		},

		textAreaRequiredFUTask: function(sTmpId, sTT1Id) {
			if (sTmpId) {
				return true;
			}
			if (sTT1Id !== "TT1_11" && sTT1Id !== "TT1_14" && sTT1Id !== "TT1_15" && sTT1Id !== "TT1_16" && sTT1Id !== "TT1_19") {
				return true;
			}
			return false;
		},

		textAreaFieldGrpFUTask: function(sTmpId, sTT1Id) {
			if (sTmpId) {
				return "fgTxtArea";
			}
			if (sTT1Id !== "TT1_11" && sTT1Id !== "TT1_14" && sTT1Id !== "TT1_15" && sTT1Id !== "TT1_16" && sTT1Id !== "TT1_19") {
				return "fgTxtArea";
			}
			return "";
		},

		AddRemarkDialog: function(sCount, cState) {

			if ((sCount >= 8 && cState === "A") || (sCount >= 8 && cState === "B")) {
				return true;
			} else {
				return false;
			}
		},

		taskTemplateCheck: function(sVal) {
			if (sVal) {
				return "Template";
			} else {
				return "Manual";
			}
		},
		/** Teck Meng 30/11/2020 10:30 start
		 * 
		 * @param sVal
		 * @param sFlown
		 * @returns
		 */
		adtEditVisible: function(sVal, sFlown) {
			var sDiff = 1440; // 24 hourse in minutes 
			var rowDate = new Date(sVal); // your date object
			var sToday = new Date();
			var diffMs = (sToday - rowDate);
			var diffMins = Math.floor((diffMs / 1000) / 60);
			if (diffMins > sDiff) {
				return false;
			}
			if (sFlown === "RSN_998") {
				return false;
			}
			return true;
		}, // Teck Meng 30/11/2020 10:30 end

		EditBtnVisibility: function(sVal, hrs) {
			var sDiff = hrs ? hrs : 1440; // 24 hourse in minutes 
			var rowDate = new Date(sVal); // your date object
			var sToday = new Date();
			var diffMs = (sToday - rowDate);
			var diffMins = Math.floor((diffMs / 1000) / 60);
			if (sDiff >= diffMins) {
				return true;
			}
			return false;
		}, // Teck Meng 30/11/2020 10:30 end
		/** Teck Meng 30/11/2020 10:30 start
		 * 
		 * @param sVal
		 * @param sFlown
		 * @returns
		 */
		engineCycLogtEditVisible: function(sDate) {

				var maxDt = new Date(),
					creDt = new Date();

				// Set DateTime 
				// var dateString = sVal.split(" "),
				var date = sDate,
					time = sTime;

				var dateParts = date.split("-");
				var timeParts = time.split(":");
				creDt.setFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]); //(dateParts[0]);
				creDt.setHours(timeParts[0]);
				creDt.setMinutes(timeParts[1]);
				creDt.setSeconds(0);

				var diff = maxDt.getTime() - creDt.getTime();
				var daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);
				if (daysDifference >= 1) {
					return false;
				} else {
					return true;
				}
			} // Teck Meng 30/11/2020 10:30 end

	};

}, true);