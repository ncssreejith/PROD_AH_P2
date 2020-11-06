sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../model/dataUtil",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, JSONModel, formatter, dataUtil, ajaxutil, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.Follow-UpTasks", {
		formatter: formatter,
		// ***************************************************************************
		//Developer : Priya
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {
				var oModel = new JSONModel({
					"sSelectedTab": "OT",
					"bSLNoLinkEnable": false,
					"bSignoffEnable": false,
					"bSignoffVisible": true,
					"sTask": "",
					"sTaskDesc": "",
					"dTDDate": "",
					"dSUDate": "",
					"sTDName": "",
					"sSUName": "",
					"fTDSUFlagLevel": "01",
					"sPath": "",
					"sTechOrder": "",
					"sIconTabKey": "OT",
					"OTCount": "0",
					"PSCount": "0",
					"CMCount": "0",
					"OutStandingTask": [],
					"PendingSupTask": [],
					"CompletedTask": [],
					"aSLNoCheck": [],
					"ServiceType": ""
				});
				this.getView().setModel(oModel, "oFollowUpModel");
				this.getRouter().getRoute("FollowUpTasks").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onFollowUpTaskTabSelect: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getParameter("key"),
					outStandgTbl = this.getView().byId("outStandgTblId"),
					PendingSuperTbl = this.getView().byId("PendingSuperTblId"),
					oFollowUpModel = this.getView().getModel("oFollowUpModel");
				outStandgTbl.removeSelections(true);
				PendingSuperTbl.removeSelections(true);
				oFollowUpModel.setProperty("/bSignoffEnable", false);
				oFollowUpModel.setProperty("/bSignoffVisible", true);
				oFollowUpModel.setProperty("/aSLNoCheck", []);
				if (oSelectedKey === "CM") {
					oFollowUpModel.setProperty("/bSignoffVisible", false);
				}
			} catch (e) {
				Log.error("Exception in onFollowUpTaskTabSelect function");
				this.handleException(e);
			}
		},

		onOutSelectionChange: function(oEvent) {
			try {
				var oFollowUpModel = this.getView().getModel("oFollowUpModel"),
					sSelectedTab = oFollowUpModel.getProperty("/sSelectedTab"),
					aSLNoCheck = oFollowUpModel.getProperty("/aSLNoCheck"),
					aTableItems = "",
					oObj = oEvent.getParameters("selected").listItem.getBindingContext("oFollowUpModel").getObject();
				if (sSelectedTab === "OT") {
					aTableItems = this.getView().byId("outStandgTblId");
				} else if (sSelectedTab === "PS") {
					aTableItems = this.getView().byId("PendingSuperTblId");
				}
				oFollowUpModel.setProperty("/bSignoffEnable", false);
				if (oObj.fragid === "" || oObj.fragid === null) {
					aSLNoCheck.push(true);
				} else {
					aSLNoCheck.push(false);
				}
				oFollowUpModel.setProperty("/aSLNoCheck", aSLNoCheck);
				if (aSLNoCheck.indexOf(false) === -1 && aTableItems.getSelectedItems().length) {
					oFollowUpModel.setProperty("/bSignoffEnable", true);
				}
			} catch (e) {
				Log.error("Exception in onOutSelectionChange function");
				this.handleException(e);
			}
		},

		onOutstandingSelect: function(oEvent) {
			try {
				oEvent.getSource().getParent().getParent().setSelected(true);
				var oTextPath = oEvent.getSource().getParent().getParent().getBindingContext("oFollowUpModel").getPath();
				var oModel = this.getModel("oFollowUpModel");
				oModel.setProperty("/sOutPath", oTextPath);
				if (!this._oSlNo) {
					this._oSlNo = sap.ui.xmlfragment("avmet.ah.fragments.flc.SLNo", this);
					this.getView().addDependent(this._oSlNo);
				}
				this._oSlNo.open();
			} catch (e) {
				Log.error("Exception in onOutstandingSelect function");
				this.handleException(e);
			}
		},

		onSLNoLiveChange: function(oEvent) {
			try {
				var oModel = this.getModel("oFollowUpModel");
				if (oEvent.getSource().getValue() !== "") {
					oModel.setProperty("/bSLNoLinkEnable", true);
				} else {
					oModel.setProperty("/bSLNoLinkEnable", false);
				}
			} catch (e) {
				Log.error("Exception in onSLNoLiveChange function");
				this.handleException(e);
			}
		},

		onSLNoSave: function() {
			try {
				var oModel = this.getModel("oFollowUpModel"),
					sPath;
				sPath = oModel.getProperty("/sOutPath");
				oModel.setProperty(sPath + "/ftsernr", oModel.getProperty("/sSLNo"));
				oModel.setProperty("/bSignoffEnable", true);
				this.getView().getModel("TaskModel").updateBindings(true);
				this._oSlNo.close();
			} catch (e) {
				Log.error("Exception in onSLNoSave function");
				this.handleException(e);
			}
		},
		onSLNoCancel: function() {
			try {
				this._oSlNo.close();
			} catch (e) {
				Log.error("Exception in onSLNoCancel function");
				this.handleException(e);
			}
		},

		onAfterFlightServTask: function(oEvent) {
			try {
				var oModel = this.getModel("oFollowUpModel"),
					sSelectedTab = oModel.getProperty("/sSelectedTab"),
					sPath = oEvent.getSource().getParent().getBindingContext("oFollowUpModel").sPath,
					oSelectedObj = oEvent.getSource().getBindingContext("oFollowUpModel").getObject();
				if (sSelectedTab === "OT") {
					oModel.setProperty("/sOpenedBy", "FLC Tradesman Open");
				} else if (sSelectedTab === "PS") {
					oModel.setProperty("/sOpenedBy", "FLC Supervisor Open");
				}
				oModel.setProperty("/oSelectedTask", oSelectedObj);
				oModel.setProperty("/oSelectedTaskPath", sPath);
				oModel.setProperty("/sTaskDesc", oSelectedObj.ftdesc);
				if (!this._oAftFlgServTsk) {
					this._oAftFlgServTsk = sap.ui.xmlfragment("avmet.ah.fragments.flc.AftFlgServTsk", this);
					this.getView().addDependent(this._oAftFlgServTsk);
				}
				this._oAftFlgServTsk.open();
			} catch (e) {
				Log.error("Exception in onAfterFlightServTask function");
				this.handleException(e);
			}
		},
		onSaveTaskDescEdit: function() {
			try {
				var oModel = this.getModel("oFollowUpModel"),
					oSelectedTaskPath = oModel.getProperty("/oSelectedTaskPath"),
					sTaskDesc = oModel.getProperty("/sTaskDesc");
				oModel.setProperty(oSelectedTaskPath + "/ftdesc", sTaskDesc);
				this.onCloseAftFlgServTsk();
			} catch (e) {
				Log.error("Exception in onSaveTaskDescEdit function");
				this.handleException(e);
			}
		},

		onCloseAftFlgServTsk: function() {
			try {
				this._oAftFlgServTsk.close();
			} catch (e) {
				Log.error("Exception in onCloseAftFlgServTsk function");
				this.handleException(e);
			}
		},

		onFTBack: function() {
			try {
				this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing");
			} catch (e) {
				Log.error("Exception in onFTBack function");
				this.handleException(e);
			}
		},

		onPressSignOffConfirm: function() {
			try {
				var that = this,
					oModel = this.getModel("oFollowUpModel"),
					sSelectedTab = oModel.getProperty("/sSelectedTab"),
					aOTSelected = this.getView().byId("outStandgTblId").getSelectedItems(),
					aPendingSelected = this.getView().byId("PendingSuperTblId").getSelectedItems(),
					oParameter = {},
					oPayloadPut = [],
					aTemp = [];
				if (sSelectedTab === "OT") {
					if (aOTSelected.length) {
						for (var i in aOTSelected) {
							aTemp.push(aOTSelected[i].getBindingContext("oFollowUpModel").getObject());
						}
					}
					oPayloadPut = aTemp;
					for (var i in oPayloadPut) {
						oPayloadPut[i].sg1usr = "User1";
						oPayloadPut[i].sg2usr = null;
						oPayloadPut[i].airid = this.getAircraftId();
						oPayloadPut[i].ddid = "HC_SG_S_FT";
						oPayloadPut[i].stepid = oModel.getProperty("/stepid");
						oPayloadPut[i].srvtid = oModel.getProperty("/srvtid");
					}
					this.getView().byId("followUpTabs").setSelectedKey("PS");
				} else if (sSelectedTab === "PS") {
					if (aPendingSelected.length) {
						for (var i in aPendingSelected) {
							aTemp.push(aPendingSelected[i].getBindingContext("oFollowUpModel").getObject());
						}
					}
					oPayloadPut = aTemp;
					for (var i in oPayloadPut) {
						oPayloadPut[i].sg1usr = null;
						oPayloadPut[i].sg2usr = "User2";
						oPayloadPut[i].airid = this.getAircraftId();
						oPayloadPut[i].ddid = "HC_SG_S_FT";
						oPayloadPut[i].stepid = "S_FT";
						oPayloadPut[i].srvtid = this.getModel("oFollowUpModel").getProperty("/srvtid");
						oPayloadPut[i].ftsernr = null;
					}
					this.getView().byId("followUpTabs").setSelectedKey("CM");
				}
				//Sign Off Put Service
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					that._getTasks();
				}.bind(this);
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_FT";
				ajaxutil.fnUpdate(this.getResourceBundle().getText("FTSVC"), oParameter, oPayloadPut, "S_FT", this);

				/*oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_FT";
				oParameter.success = function(oData) {
					that._putRTDetails(oPayloadPost);
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("FTSVC"), oParameter, oPayloadPost);*/

				// var FLCDetails = dataUtil.getDataSet("FLCDetails"),
				// 	oTaskModel,
				// 	oModel, oTableOutStanding, oTablePendingSuper, oTableCompleted, oSelectedItems;
				// FLCDetails.sFollowUpSignOff = "SignOff";
				// dataUtil.setDataSet("FLCDetails", FLCDetails);
				// oModel = this.getModel("oFollowUpModel");
				// oTaskModel = this.getModel("TaskModel").getData();
				// switch (oModel.getProperty("/sIconTabKey")) {
				// 	case "OT":
				// 		oTableOutStanding = this.getView().byId("outStandgTblId");
				// 		oSelectedItems = oTableOutStanding.getSelectedItems();
				// 		for (var i = 0; i < oSelectedItems.length; i++) {
				// 			oSelectedItems[i].getBindingContext("TaskModel").getObject().Status = "PS";
				// 			oSelectedItems[i].getBindingContext("TaskModel").getObject().TDDateTime = formatter.defaultDateTimeFormat(new Date());
				// 			oTaskModel.PSTasks.push(oSelectedItems[i].getBindingContext("TaskModel").getObject());
				// 		}
				// 		/*	this.getView().byId("followUpTabs").setSelectedKey("PS");*/
				// 		break;
				// 	case "PS":
				// 		oTablePendingSuper = this.getView().byId("PendingSuperTblId");
				// 		oSelectedItems = oTablePendingSuper.getSelectedItems();
				// 		for (var i = 0; i < oSelectedItems.length; i++) {
				// 			oSelectedItems[i].getBindingContext("TaskModel").getObject().Status = "CM";
				// 			oSelectedItems[i].getBindingContext("TaskModel").getObject().SUDateTime = formatter.defaultDateTimeFormat(new Date());
				// 			oTaskModel.CMTasks.push(oSelectedItems[i].getBindingContext("TaskModel").getObject());
				// 		}
				// 		/*	this.getView().byId("followUpTabs").setSelectedKey("CM");*/
				// 		break;
				// 	case "CM":
				// 		oTableCompleted = this.getView().byId("CompleteTblId");
				// 		this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing");
				// 		break;
				// }
				// this.getView().getModel("TaskModel").updateBindings(true);
				// this.getView().getModel("TaskModel").refresh();
			} catch (e) {
				Log.error("Exception in onPressSignOffConfirm function");
				this.handleException(e);
			}
		},

		/*_putRTDetails: function(oPayloadPut) {
			var that = this,
				oParameter = {};
			oParameter.error = function() {};
			oParameter.success = function(oData) {
				that._getTasks();
			}.bind(this);
			oParameter.filter = "tailid eq TAIL_1015 and stepid eq S_FT";
			ajaxutil.fnUpdate(this.getResourceBundle().getText("FTSVC"), oParameter, oPayloadPut);
		},*/

		// onPressRTaskBack: function() {
		// 	var oFollowUpModel = this.getView().getModel("oFollowUpModel"),
		// 		sSelectedTab = oFollowUpModel.getProperty("/sSelectedTab");
		// 	if (sSelectedTab === "OT") {
		// 		this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing");
		// 	} else if (sSelectedTab === "PS") {
		// 		this.getView().byId("followUpTabs").setSelectedKey("OT");
		// 	} else if (sSelectedTab === "CM") {
		// 		this.getView().byId("followUpTabs").setSelectedKey("PS");
		// 		oFollowUpModel.setProperty("/bSignoffVisible", false);
		// 	}
		// },

		onTableUpdateFinished: function(sValue, oEvent) {
			try {
				var oLenght = oEvent.getSource().getItems().length,
					oModel = this.getView().getModel("oFollowUpModel");
				switch (sValue) {
					case "OT":
						oModel.setProperty("/OTCount", oLenght);
						break;
				}
			} catch (e) {
				Log.error("Exception in onTableUpdateFinished function");
				this.handleException(e);
			}
		},
		onTableUpdateFinishedPS: function(sValue, oEvent) {
			try {
				var oLenght = oEvent.getSource().getItems().length,
					oModel = this.getView().getModel("oFollowUpModel");
				switch (sValue) {
					case "PS":
						oModel.setProperty("/PSCount", oLenght);
						break;
				}
			} catch (e) {
				Log.error("Exception in onTableUpdateFinishedPS function");
				this.handleException(e);
			}
		},
		onTableUpdateFinishedCM: function(sValue, oEvent) {
			try {
				var oLenght = oEvent.getSource().getItems().length,
					oModel = this.getView().getModel("oFollowUpModel");
				switch (sValue) {
					case "CM":
						oModel.setProperty("/CMCount", oLenght);
						break;
				}
			} catch (e) {
				Log.error("Exception in onTableUpdateFinishedCM function");
				this.handleException(e);
			}
		},

		_fnApplyFilter: function(oFilterWC) {
			try {
				var oFilters, filterObj, oBindingOutStanding, oBindingPendingSuper, oBindingCompleted,
					oTableOutStanding = this.getView().byId("outStandgTblId"),
					oTablePendingSuper = this.getView().byId("PendingSuperTblId"),
					oTableCompleted = this.getView().byId("CompleteTblId");
				oBindingOutStanding = oTableOutStanding.getBinding("items");
				oBindingPendingSuper = oTablePendingSuper.getBinding("items");
				oBindingCompleted = oTableCompleted.getBinding("items");
				oBindingOutStanding.filter([]);
				oBindingPendingSuper.filter([]);
				oBindingCompleted.filter([]);
				oFilters = [new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, oFilterWC)];
				filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingOutStanding.filter(filterObj);
				oBindingPendingSuper.filter(filterObj);
				oBindingCompleted.filter(filterObj);
			} catch (e) {
				Log.error("Exception in _fnApplyFilter function");
				this.handleException(e);
			}
		},

		_onObjectMatched: function(oEvent) {
			try {
				this.getModel("oFollowUpModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oFollowUpModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("oFollowUpModel").refresh();
				var oFollowUpModel = this.getView().getModel("oFollowUpModel");
				oFollowUpModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvtid.split("_")[1]);
				this.getView().getModel("oFollowUpModel").setProperty("/ServiceType", this.getModel("oFollowUpModel").getProperty("/srvtid"));
				this._getTasks();
				/*var that = this,
					oParameter = {},
					oPayload = {
						"sgid": "SG_20200629121214",
						"tailid": "TAIL_1510",
						"airid": "AIR_10",
						"srvid": "SRV_20200629121214"
					};
				oParameter.error = function() {};
				oParameter.filter = "";
				oParameter.success = function(oData) {
					that._getTasks();
				}.bind(this);*/
				//ajaxutil.fnCreate(this.getResourceBundle().getText("FT1SVC"), oParameter, [oPayload]);
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
				this.handleException(e);
			}
		},

		_getTasks: function() {
			try {
				var oFollowUpModel = this.getView().getModel("oFollowUpModel"),
					srvtid = oFollowUpModel.getProperty("/srvtid"),
					stepid = oFollowUpModel.getProperty("/stepid"),
					OutStandingTask = [],
					PendingSupTask = [],
					CompletedTask = [],
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq " + stepid + " and srvtid eq " + srvtid;
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].ftstatus === "Out") {
								OutStandingTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "Pend") {
								PendingSupTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "Com") {
								CompletedTask.push(oData.results[i]);
							}
						}
						oFollowUpModel.setProperty("/OutStandingTask", OutStandingTask);
						oFollowUpModel.setProperty("/PendingSupTask", PendingSupTask);
						oFollowUpModel.setProperty("/CompletedTask", CompletedTask);

						//REFRESH MODEL AMIT KUMAR
						var signOFF = this.getView().byId("followUpTabs").getSelectedKey() === "CM" ? false : true;
						oFollowUpModel.setProperty("/bSignoffVisible", signOFF);
						oFollowUpModel.refresh();
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("FTSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getTasks function");
				this.handleException(e);
			}
		}
	});
});