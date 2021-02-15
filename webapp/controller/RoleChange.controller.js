sap.ui.define([
	"../model/models",
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"../util/dataUtil",
	"sap/m/MessageBox",
	"sap/base/Log",
	"avmet/ah/util/FilterOpEnum"
], function(models, BaseController, JSONModel, ajaxutil, formatter, dataUtil, MessageBox, Log, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	//Teck Meng 13/11/2020 12:00 ah Role change fixes issue no 25,26 
	 *   Control name: RoleChange       
	 *   Purpose : Role Change
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.RoleChange", {
		formatter: formatter,
		/* ================================================================================================= */
		/* lifecycle methods                                           */
		/* =========================================================================================================== */
		onInit: function() {
			try {
				this.getRouter().getRoute("RoleChangeStations").attachPatternMatched(this._onObjectMatched, this);
				this.getView().setModel(new JSONModel({
					mode: 1,
					tsign: false,
					selTab: "rc1",
					selStn: {},
					srvid: "",
					stns: [],
					chngTab: ""
				}), "rcModel");
			} catch (e) {
				Log.error("Exception in onInit function");
			}
		},

		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onStnChange: function(oEvent) {
			try {
				var oStn = oEvent.getSource().getSelectedItem().getBindingContext("rcModel").getObject();
				this.getModel("rcModel").setProperty("/selStn", oStn);
				this.getModel("rcModel").refresh();
			} catch (e) {
				Log.error("Exception in onStnChange function");
			}
		},

		onChkBxSel: function(oEvent) {
			var sContext = oEvent.getSource().getBindingContext("rcModel");
			if (!this.fnChkEdit()) {
				this.getModel("rcModel").setProperty(sContext.getPath() + "/tstat", oEvent.getSource().getSelected() ? 0 : 1);
				oEvent.getSource().setSelected(!oEvent.getSource().getSelected());
				this.getModel("rcModel").refresh();
				return;
			}
			this.getModel("rcModel").setProperty(sContext.getPath() + "/tstat", oEvent.getSource().getSelected() ? 1 : 0);
			this.getModel("rcModel").setProperty("/chngTab", this.getModel("rcModel").getProperty("/selTab"));
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onAdapterClk: function(oEvent) {
			try {
				if (!this.fnChkEdit()) {
					return;
				}
				var sContext = oEvent.getSource().getSelectedItem().getBindingContext("rcModel");
				if (sContext.getProperty("PADPID")) {
					var sAdps = this.getModel("rcModel").getProperty("/selStn/selADP");
					var sFlag = false;
					for (var i = 0; sAdps.length > i; i++) {
						if (sAdps[i].ADPID === sContext.getProperty("PADPID")) {
							sFlag = true;
						}
					}
					if (!sFlag) {
						var oData = {
							messages: ["Please first attach " + sContext.getProperty("PADPDESC")]
						};
						this.fnShowMessage("E", oData, null, function() {});
						return;
					}

				}
				if (sContext.getProperty("ISSER") === "X") {
					this.getModel("rcModel").setProperty(sContext.getPath() + "/SGUSR", sContext.getProperty("SERNR"));
					var sMunitionDialog = this.openDialog("SLNo", ".fragments.fs.rolechange.");
					sMunitionDialog.bindElement({
						path: sContext.getPath(),
						model: "rcModel"
					});
				}
			} catch (e) {
				Log.error("Exception in onAdapterClk function");
			}
		},

		onTabChangeSel: function(oEvent) {
			// var selKey = oEvent.getSource().getSelectedKey();
			// var tSign = this.getModel("rcModel").getProperty("/tsign");
			// if(){

			// }
		},
		onCloseSLNo: function(oEvent) {
			var oDailog = this.closeDialog("SLNo");
		},
		onSaveSLNo: function(oEvent) {
			if (!this.fnChkEdit()) {
				return;
			}
			this.getModel("rcModel").setProperty("/selStn/tstat", 1);
			this.getModel("rcModel").setProperty("/chngTab", this.getModel("rcModel").getProperty("/selTab"));
			var sContext = this.closeDialog("SLNo").getBindingContext("rcModel");
			this.getModel("rcModel").setProperty(sContext.getPath() + "/SERNR", sContext.getProperty("SGUSR"));
			var sAdps = this.getModel("rcModel").getProperty("/selStn/selADP");
			var sIndex = -1;

			for (var i = 0; sAdps.length > i; i++) {
				sIndex = sAdps.indexOf(sAdps[i]);
				// if Parent same adpid the replace 
				if (sAdps[i].PADPID === sContext.getProperty("PADPID")) {
					this.fnRemoveAdapter(sIndex);
					this.getModel("rcModel").setProperty("/selStn/selADP/" + sIndex, sContext.getObject());
					this.getModel("rcModel").refresh();
					return;
				}
			}
			sAdps.push(sContext.getObject());
			this.getModel("rcModel").refresh();
		},
		onRemoveTile1Press: function(oEvent) {
			this.fnRemoveAdapter(0);
			// this.getModel("rcModel").setProperty("/selStn/ADPDESC","");
			// this.getModel("rcModel").setProperty("/selStn/ADPID","");
			// this.getModel("rcModel").setProperty("/selStn/SEQID","");
			// this.getModel("rcModel").refresh();
		},
		onRemoveTile2Press: function(oEvent) {
			this.fnRemoveAdapter(1);
		},
		onRemoveTile3Press: function(oEvent) {
			this.fnRemoveAdapter(2);
		},

		fnRemoveAdapter: function(sStart) {
			if (!this.fnChkEdit()) {
				return;
			}
			this.getModel("rcModel").setProperty("/chngTab", this.getModel("rcModel").getProperty("/selTab"));
			this.getModel("rcModel").setProperty("/selStn/tstat", 1);
			var sADPCount = this.getModel("rcModel").getProperty("/selStn/selADP").length;
			this.getModel("rcModel").getProperty("/selStn/selADP").splice(sStart, sADPCount);
			this.getModel("rcModel").refresh();
		},
		//Teck Meng 13/11/2020 12:00 ah Role change fixes issue no 25,26 
		fnChkEdit: function(bSignoff) {
			var sFlag = true;
			if (this.getModel("rcModel").getProperty("/mode") === 0) {
				sFlag = false;
			}
			var sAprNo = this.getModel("rcModel").getProperty("/stns/0/APRNO");
			var selTab = this.getModel("rcModel").getProperty("/selTab");
			var chngTab = this.getModel("rcModel").getProperty("/chngTab");
			var oSelADP = this.getModel("rcModel").getProperty("/selStn");

			if ((selTab !== chngTab) && chngTab !== "") {
				sap.m.MessageBox.error("Changes are not allowed");
				sFlag = false;
				return sFlag;
			}

			//Check if trademan signed off for supervisor to change
			//Teck Meng 13/11/2020 12:00 ah Role change fixes issue no 25,26 
			oSelADP = oSelADP ? oSelADP : {};
			if (!bSignoff && sAprNo === 1 && selTab === "rc2" && oSelADP && oSelADP.tstat !== 1) {
				sap.m.MessageBox.error("Changes are not allowed");
				sFlag = false;
				return sFlag;
			}

			// var selKey = this.getModel("rcModel").getProperty("/selTab");
			// if( this.editMode === undefined){
			// 	this.editMode = selKey;
			// 	this.getModel("rcModel").setProperty("/EditTab", selKey);
			// }

			// if(this.editMode !== selKey){
			// 	sFlag = false;
			// }
			// var ttSign = this.getModel("rcModel").getProperty("/tsign");
			// var tSign = this.getModel("rcModel").getProperty("/selStn/tsign");
			// tSign = tSign===null ? true:false;
			// if(selKey==="rc1" && ttSign){
			// 	tSign = false;
			// }
			// if(this.formatter.rcSignChange(tSign,selKey)){
			// 	sap.m.MessageBox.error("Changes are not allowed");
			// 	sFlag = false;
			// }
			return sFlag;
		},
		//SAME = UPDATE EXISTING ONE WIH SERIAL NUMBER 
		//IF THERE IS P NULL INSTALL AND TRY AGAIN INSTALL P NULL THEN REMOVE EXISTING P NULL ONE
		//

		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------

		onStationUndoSignOff: function(oEvent) {
			try {
				var sAct = "4",
					sObj = "ZRM_FS_RCT";
				var oPayloads = this.fnRoleChanegSinglePayload();
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this._getStations();
				}.bind(this);
				oParameter.activity = sAct;
				oParameter.title = "Tradesman undosign off";
				ajaxutil.fnCreate(this.getResourceBundle().getText("ROLECHANGESVC"), oParameter, oPayloads, sObj, this);
			} catch (e) {
				Log.error("Exception in onStationUndoSignOff function");
			}
		},

		onStationSignOff: function(oEvent) {
			try {
				if (!this.fnChkEdit(true)) {
					return;
				}
				var tSign = this.getModel("rcModel").getProperty("/tsign");
				var selKey = this.getModel("rcModel").getProperty("/selTab");
				var oPayloads = this.fnRoleChanegPayload();
				// var oPayloads = this.fnRoleChanegSinglePayload();
				// if (oPayloads.length === 0) {
				// 	// sap.m.MessageBox.error("Please select at least one station");
				// 	return;
				// }
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (this.fnGetApproNo() > 0) {
						this.onNavBack();
						return;
					}
					this._getStations();

				}.bind(this);
				var sAct = "4",
					sObj = "ZRM_FS_RCT",
					sTitle = "Tradesman ";
				if (this.fnGetApproNo() > 0) {
					sAct = "4";
					sObj = "ZRM_FS_WCS"; //Teck Meng change on 19/11/2020 13:00 AH Issue 1044,1043 Authorisation change for Supervisor signoff
					sTitle = "Supervisor ";
				}
				// this.formatter.rcSignChange(tSign,selKey)?"Sign off":"Undo Sign off"
				sTitle = sTitle + ("Sign off");
				oParameter.activity = sAct;
				oParameter.title = sTitle;
				ajaxutil.fnCreate(this.getResourceBundle().getText("ROLECHANGESVC"), oParameter, oPayloads, sObj, this);
			} catch (e) {
				Log.error("Exception in onStationSignOff function");
			}
		},

		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_onObjectMatched: function(oEvent) {
			try {
				//init edit mode
				this.editMode = null;
				this.getModel("rcModel").setProperty("/mode", oEvent.getParameters().arguments.mode === undefined ? 1 : 0);
				this.getModel("rcModel").setProperty("/srvid", oEvent.getParameter("arguments").srvid);
				this.getModel("rcModel").setProperty("/stns", []);
				this.getModel("rcModel").setProperty("/tsign", false);
				this.getModel("rcModel").setProperty("/selStn", {});
				this.getModel("rcModel").refresh();
				this._getStations();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_getStations: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				//	oParameter.filter = "airid eq " + this.getAircraftId() + " and" + " tailid eq " + this.getTailId();
				oParameter.filter = "airid=" + this.getAircraftId() + "&" + "tailid=" + this.getTailId();
				oParameter.success = function(oData) {
					var sTab = "rc1";
					this.editMode = null;
					this.getModel("rcModel").setProperty("/stns", oData.results);
					this.getModel("rcModel").setProperty("/selStn", oData.results.length > 0 ? oData.results[0] : {});
					sTab = oData.results.length > 0 ? (oData.results[0].APRNO === 1 ? "rc2" : "rc1") : "rc1";
					this.getModel("rcModel").setProperty("/selTab", sTab);
					this.getModel("rcModel").setProperty("/chngTab", "");
					this.getModel("rcModel").setProperty("/selStn/selADP", []);

					for (var i = 0; oData.results.length > i; i++) {
						this.fnLoadAdapter(oData.results[i]);
						if (oData.results[i].tstat === 1) {
							this.getModel("rcModel").setProperty("/tsign", true);
						}
					}
					this.getModel("rcModel").refresh();
				}.bind(this);
				//Teck Meng 13/11/2020 12:00 ah Role change fixes issue no 25,26 
				ajaxutil.fnRead(this.getResourceBundle().getText("ROLECHANGESVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getStations function");
			}
		},
		fnLoadAdapter: function(oStn) {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				// oParameter.filter = "airid eq '" + this.getAircraftId() + "' and adpflag eq 'X' and stnsid eq '" + oStn.SUBID + "'" + " and" +
				// 	" tailid eq " + this.getTailId();
				oParameter.filter = "airid=" + this.getAircraftId() + "&adpflag=X&stnsid=" + oStn.SUBID + "&" +
					"tailid=" + this.getTailId();
				oParameter.success = function(oStn, oData) {
					oStn.adapters = oData.results;
					oStn.selADP = this.fnAttachAdapter(oData.results);
					this.getModel("rcModel").refresh();
				}.bind(this, oStn);
				ajaxutil.fnRead(this.getResourceBundle().getText("ROLECHANGESVC"), oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadAdapter function");
			}
		},
		fnAttachAdapter: function(oData) {
			var sAdp = [];

			oData.forEach(function(adp) {
				if (adp.ROLEID) {
					sAdp.push(adp);
				}
			});
			return sAdp;
		},

		fnSelAdp: function(oData, oAdp, sIndex, sBottom) {
			if (oData[sIndex].ROLEID && oData[sIndex].PADPID === null) {
				// if(sBottom){
				oAdp.push(oData[sIndex]);
				return;
				// }
			}
			sIndex = sIndex + 1;
			if (oData[sIndex] === undefined) {
				sIndex = 0;
				sBottom = true;
			}
			this.fnSelAdp(oData, oAdp, sIndex, sBottom);
			var sTmpIndex = (sIndex === 0 ? (oData.length - 1) : (sIndex - 1));
			if (oAdp[oAdp.length - 1].PADPID === oData[sIndex].ADPID) {
				// if(sBottom){
				oAdp.push(oData[sTmpIndex]);
				// return ;
				// }
			}

		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------

		fnRoleChanegPayload: function() {
			var oPayloads = [],
				sSelect = false,
				sPayload = {};
			//Teck Meng 13/11/2020 12:00 ah Role change fixes issue no 25,26 
			this.getModel("rcModel").getProperty("/stns").forEach(function(stn) {
				// if (stn.tstat === 1) {
				// 	sSelect = true;
				// }
				// stn.tstat===1 && 
				//Teck Meng 16/11/2020 18:00 ah Role change fixes issue no 25,26 
				if (stn.selADP.length === 0) {
					oPayloads.push(this.fnPayload(stn, undefined, stn.tstat));
					if (stn.NUM1 === "2" && stn.APRNO === 1) {
						sPayload = this.fnPayload(stn, undefined, stn.tstat);
						sPayload.NUM1 = 2;
						oPayloads.push(sPayload);
					}

				}
				//Teck Meng 16/11/2020 18:00 ah Role change fixes issue no 25,26 
				stn.selADP.forEach(function(adp) {
					// if(stn.tstat===1){
					oPayloads.push(this.fnPayload(stn, adp, stn.tstat));
					if (stn.NUM1 === "2" && stn.APRNO === 1 && stn.selADP.length === 1) {
						sPayload = this.fnPayload(stn, undefined, stn.tstat);
						sPayload.NUM1 = 2;
						oPayloads.push(sPayload);
					}

					// }
				}.bind(this));
			}.bind(this));
			// if (!sSelect) {
			// 	sap.m.MessageBox.error("Please select at least one station");
			// }
			// else if(oPayloads.length === 0 ) {
			// var oPayload = this.getModel("rcModel").getProperty("/stns/0");
			// oPayload.ADPFLAG = "X";
			// oPayload.tstat = "1";
			// oPayload.APRNO = oPayload.APRNO > 1 ? 0 : oPayload.APRNO;
			// delete oPayload.adapters;
			// delete oPayload.selADP;
			// oPayloads.push(oPayload);
			// }
			return oPayloads;
		},

		fnRoleChanegSinglePayload: function() {
			var oPayloads = [];
			var sStation = this.getModel("rcModel").getProperty("/selStn");

			if (sStation.selADP && sStation.selADP.length > 0) {
				// if(){
				oPayloads.push(this.fnPayload(sStation, sStation.selADP[0], 0));
				// }

			}
			if (oPayloads.length === 0) {
				var oPayload = this.getModel("rcModel").getProperty("/stns/0");
				oPayload.ADPFLAG = "P";
				oPayload.tstat = "0";
				oPayload.APRNO = oPayload.APRNO > 1 ? 0 : oPayload.APRNO;
				delete oPayload.adapters;
				delete oPayload.selADP;
				oPayloads.push(oPayload);
			}
			return oPayloads;
		},

		fnPayload: function(stn, adp, tstat) {
			// var selKey = this.getModel("rcModel").getProperty("/selTab");
			// var sStat = this.getModel("rcModel").getProperty("/tsign");
			//Teck Meng 13/11/2020 12:00 ah Role change fixes issue no 25,26 
			var oPayload = JSON.parse(JSON.stringify(stn));
			oPayload.ADPID = adp === undefined ? '' : adp.ADPID;
			oPayload.ADPDESC = adp === undefined ? '' : adp.ADPDESC;
			oPayload.ADPFLAG = adp === undefined ? "P" : null;
			oPayload.AIRID = stn.AIRID;
			oPayload.APRNO = this.fnGetApproNo();
			oPayload.DDID = stn.DDID;
			oPayload.HCFLAG = "2";
			oPayload.ICART = null;
			oPayload.ISSER = null;
			oPayload.L_TXT = stn.L_TXT;
			oPayload.MAX = null;
			oPayload.NUM1 = adp === undefined ? '1' : adp.NUM1;
			oPayload.PADPDESC = null;
			oPayload.PADPID = null;
			oPayload.POT = null;
			oPayload.POTDESC = null;
			oPayload.QTYADD = null;
			oPayload.ROLEID = stn.ROLEID;
			oPayload.SEQID = adp === undefined ? '' : adp.SEQID;
			oPayload.SERNR = adp === undefined ? '' : adp.SERNR;
			oPayload.SGTIME = null;
			oPayload.SGUSR = null;
			oPayload.STNSID = stn.SUBID;
			oPayload.SUBID = stn.SUBID;
			oPayload.WEMID = null;
			oPayload.WESDESC = null;
			oPayload.WESID = null;
			oPayload.begda = null;
			oPayload.endda = stn.endda;
			oPayload.tailid = stn.tailid;
			oPayload.tstat = stn.tstat; //this.formatter.rcSignChange(sStat,selKey)?1:0;
			// oPayload.tsign = "";
			//Teck Meng 13/11/2020 12:00 ah Role change fixes issue no 25,26 
			delete oPayload.adapters;
			delete oPayload.selADP;
			return oPayload;
		},
		fnGetApproNo: function() {
				var selKey = this.getModel("rcModel").getProperty("/selTab");
				return this.formatter.rcSignAPPR(selKey);
			}
			// fnGetApproNo:function(){
			// 	var selKey = this.getModel("rcModel").getProperty("/selTab");
			// 	var sStat = this.getModel("rcModel").getProperty("/tsign");
			// 	var isUndo = this.formatter.rcSignChange(sStat,selKey);
			// 	var sApprNo = sStat?1:0;
			// 	if(!isUndo){
			// 		sApprNo = 0;
			// 	}
			// 	return sApprNo;
			// }
	});
});