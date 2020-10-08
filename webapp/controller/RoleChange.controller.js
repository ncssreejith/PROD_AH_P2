sap.ui.define([
	"../model/models",
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../util/ajaxutil",
	"../model/formatter",
	"../model/dataUtil",
	"sap/m/MessageBox",
	"sap/base/Log"
], function(models, BaseController, JSONModel, ajaxutil, formatter, dataUtil, MessageBox, Log) {
	"use strict";
	/* ***************************************************************************
	 *   Control name=            
	 *   Purpose : 
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
					selTab: "rc1",
					selStn: {},
					stns: []
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
				Log.error("Exception in xxxxx function");
			}
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
				Log.error("Exception in xxxxx function");
			}
		},
		onCloseSLNo: function(oEvent) {
			var oDailog = this.closeDialog("SLNo");
		},
		onSaveSLNo: function(oEvent) {
			if (!this.fnChkEdit()) {
				return;
			}
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
			var sADPCount = this.getModel("rcModel").getProperty("/selStn/selADP").length;
			this.getModel("rcModel").getProperty("/selStn/selADP").splice(sStart, sADPCount);
			this.getModel("rcModel").refresh();
		},
		fnChkEdit: function() {
			var oData = {},
				sFlag = true;
			if (this.getModel("rcModel").getProperty("/mode") === 0) {
				sFlag = false;
			}
			if (this.getModel("rcModel").getProperty("/stns/0/APRNO") === 1) {
				sFlag = false;
			}
			if (!sFlag) {
				oData = {
					messages: ["Changes are not allowed"]
				};
				this.fnShowMessage("E", oData, null, function() {});
			}
			return sFlag;
		},
		//SAME = UPDATE EXISTING ONE WIH SERIAL NUMBER 
		//IF THERE IS P NULL INSTALL AND TRY AGAIN INSTALL P NULL THEN REMOVE EXISTING P NULL ONE
		//

		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		onStationSignOff: function() {
			try {
				var oPayloads = this.fnRoleChanegPayload();
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if(!this.getModel("rcModel").getProperty("/stns/0/APRNO") > 1){
						this.onNavBack();
						return;
					}
					this._getStations();	
				}.bind(this);
				var sAct = 99,
					sObj = "";
				var sCount = this.getModel("rcModel").getProperty("/stns/0/APRNO") > 1 ? 0 : 1;

				switch (sCount) {
					case 0:
						sAct = "4";
						sObj = "ZRM_FS_RCT";
						break;
					case 1:
						sAct = "4";
						sObj = "ZRM_FS_RCS";
						break;
				}
				oParameter.activity = sAct;
				ajaxutil.fnCreate("/RoleChangeSvc", oParameter, oPayloads, sObj, this);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},

		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_onObjectMatched: function(oEvent) {
			try {
				this.getModel("rcModel").setProperty("/mode", oEvent.getParameters().arguments.mode === undefined ? 1 : 0);
				this.getModel("rcModel").setProperty("/stns", []);
				this.getModel("rcModel").setProperty("/selStn", {});
				this.getModel("rcModel").refresh();
				this._getStations();
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
		_getStations: function() {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "airid eq " + this.getAircraftId() + " and" + " tailid eq " + this.getTailId();
				oParameter.success = function(oData) {
					var sTab = "rt1";
					this.getModel("rcModel").setProperty("/stns", oData.results);
					this.getModel("rcModel").setProperty("/selStn", oData.results.length > 0 ? oData.results[0] : {});
					sTab = oData.results.length > 0 ? (oData.results[0].APRNO === 1 ? "rc2" : "rc1") : "rc1";
					this.getModel("rcModel").setProperty("/selTab", sTab);
					this.getModel("rcModel").setProperty("/selStn/selADP", []);
					this.getModel("rcModel").refresh();
					for (var i = 0; oData.results.length > i; i++) {
						this.fnLoadAdapter(oData.results[i]);
					}
				}.bind(this);
				ajaxutil.fnRead("/RoleChangeSvc", oParameter);
			} catch (e) {
				Log.error("Exception in xxxxx function");
			}
		},
		fnLoadAdapter: function(oStn) {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "airid eq '" + this.getAircraftId() + "' and adpflag eq 'X' and stnsid eq '" + oStn.SUBID + "'" + " and" +
					" tailid eq " + this.getTailId();
				oParameter.success = function(oStn, oData) {
					oStn.adapters = oData.results;
					oStn.selADP = this.fnAttachAdapter(oData.results);
					this.getModel("rcModel").refresh();
				}.bind(this, oStn);
				ajaxutil.fnRead("/RoleChangeSvc", oParameter);
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
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------

		fnRoleChanegPayload: function() {
			var oPayloads = [];
			this.getModel("rcModel").getProperty("/stns").forEach(function(stn) {
				stn.selADP.forEach(function(adp) {
					oPayloads.push(this.fnPayload(stn, adp));
				}.bind(this));
			}.bind(this));
			if (oPayloads.length === 0) {
				var oPayload = this.getModel("rcModel").getProperty("/stns/0");
				oPayload.ADPFLAG = "X";
				oPayload.APRNO = oPayload.APRNO > 1 ? 0 : oPayload.APRNO;
				delete oPayload.adapters;
				delete oPayload.selADP;
				oPayloads.push(oPayload);
			}
			return oPayloads;
		},

		fnPayload: function(stn, adp) {
			var oPayload = {};
			oPayload.ADPID = adp.ADPID;
			oPayload.ADPDESC = adp.ADPDESC;
			oPayload.ADPFLAG = null;
			oPayload.AIRID = stn.AIRID;
			oPayload.APRNO = stn.APRNO > 1 ? 0 : stn.APRNO;
			oPayload.DDID = stn.DDID;
			oPayload.HCFLAG = "2";
			oPayload.ICART = null;
			oPayload.ISSER = null;
			oPayload.L_TXT = stn.L_TXT;
			oPayload.MAX = null;
			oPayload.NUM1 = adp.NUM1;
			oPayload.PADPDESC = null;
			oPayload.PADPID = null;
			oPayload.POT = null;
			oPayload.POTDESC = null;
			oPayload.QTYADD = null;
			oPayload.ROLEID = adp.ROLEID;
			oPayload.SEQID = adp.SEQID;
			oPayload.SERNR = adp.SERNR;
			oPayload.SGTIME = null;
			oPayload.SGUSR = null;
			oPayload.STNSID = stn.STNSID;
			oPayload.SUBID = stn.SUBID;
			oPayload.WEMID = null;
			oPayload.WESDESC = null;
			oPayload.WESID = null;
			oPayload.begda = null;
			oPayload.endda = stn.endda;
			oPayload.tailid = stn.tailid;
			return oPayload;
		}
	});
});