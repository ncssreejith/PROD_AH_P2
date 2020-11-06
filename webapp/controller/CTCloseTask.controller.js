sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"../model/dataUtil",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, JSONModel, formatter, dataUtil, ajaxutil, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.CTCloseTask", {
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
					"ServiceType": "",
					CreateTaskMenu: [{
						"Text": "New Task",
						"Visible": true
					}, {
						"Text": "Apply Template",
						"Visible": true
					}]
				});
				this.getView().setModel(oModel, "oCTCloseTaskModel");
				this.getRouter().getRoute("CTCloseTask").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
				this.handleException(e);
			}
		},

		onCreateTaskPress: function(oEvent) {
			try {
				var that = this,
					oStatus,
					oButton, eDock, oModel, oDialogModel;
				oModel = that.getView().getModel("oCTCloseTaskModel");
				if (!that._oWCMenuFrag) {
					that._oWCMenuFrag = sap.ui.xmlfragment("WorkMenuId",
						"avmet.ah.fragments.flc.CreateTaskOptions",
						that);
					that.getView().addDependent(that._oWCMenuFrag);
				}
				//that._oWCMenuFrag.setModel(oModel, "DialogModel");
				eDock = sap.ui.core.Popup.Dock;
				oButton = oEvent.getSource();
				that._oWCMenuFrag.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
			} catch (e) {
				Log.error("Exception in onCreateTaskPress function");
				this.handleException(e);
			}
		},
		onCloseWorkCenterMenu: function() {
			try {
				if (this._oWCMenuFrag) {
					this._oWCMenuFrag.close(this);
					this._oWCMenuFrag.destroy();
					delete this._oWCMenuFrag;
				}
			} catch (e) {
				Log.error("Exception in onCloseWorkCenterMenu function");
				this.handleException(e);
			}
		},

		handleCreateTaskOptionPress: function(oEvent) {
			try {
				var that = this,
					oObj,
					sKey, oTable,
					oModel = that.getView().getModel("oCTCloseTaskModel"),
					oSelectedItem;
				oSelectedItem = oEvent.getParameter("item").getText();
				switch (oSelectedItem) {
					case "New Task":
						this.onAddCreateTask();
						break;
					case "Apply Template":
						this.getRouter().navTo("CosApplyTemplate", {
							"airid": this.getAircraftId(),
							"tailid": this.getTailId()
								//"jobid": oModel.getProperty("/sJobId"),
								//"wc": oModel.getProperty("/WorkCenterKey")
						});
						break;
				}
				oModel.updateBindings(true);
				that.onCloseWorkCenterMenu();
			} catch (e) {
				Log.error("Exception in handleCreateTaskOptionPress function");
				this.handleException(e);
			}
		},
		onAddCreateTask: function() {
			try {
				var oModel = this.getView().getModel("oCTCloseTaskModel");
				this.getOwnerComponent().getRouter().navTo("RouteCreateTask", {
					"Flag": "FS",
					"srvid": oModel.getProperty("/srvtid")
				});
			} catch (e) {
				Log.error("Exception in onAddCreateTask function");
				this.handleException(e);
			}
		},
		onFollowUpTaskTabSelect: function(oEvent) {
			try {
				var oSelectedKey = oEvent.getParameter("key"),
					outStandgTbl = this.getView().byId("outStandgTblId"),
					PendingSuperTbl = this.getView().byId("PendingSuperTblId"),
					oCTCloseTaskModel = this.getView().getModel("oCTCloseTaskModel");
				outStandgTbl.removeSelections(true);
				PendingSuperTbl.removeSelections(true);
				oCTCloseTaskModel.setProperty("/bSignoffEnable", false);
				oCTCloseTaskModel.setProperty("/bSignoffVisible", true);
				oCTCloseTaskModel.setProperty("/aSLNoCheck", []);
				if (oSelectedKey === "CM") {
					oCTCloseTaskModel.setProperty("/bSignoffVisible", false);
				}
			} catch (e) {
				Log.error("Exception in onFollowUpTaskTabSelect function");
				this.handleException(e);
			}
		},

		onOutSelectionChange: function(oEvent) {
			try {
				var oCTCloseTaskModel = this.getView().getModel("oCTCloseTaskModel"),
					sSelectedTab = oCTCloseTaskModel.getProperty("/sSelectedTab"),
					aSLNoCheck = oCTCloseTaskModel.getProperty("/aSLNoCheck"),
					aTableItems = "",
					oObj = oEvent.getParameters("selected").listItem.getBindingContext("oCTCloseTaskModel").getObject();
				if (sSelectedTab === "OT") {
					aTableItems = this.getView().byId("outStandgTblId");
				} else if (sSelectedTab === "PS") {
					aTableItems = this.getView().byId("PendingSuperTblId");
				}
				oCTCloseTaskModel.setProperty("/bSignoffEnable", false);
				if (oObj.fragid === "" || oObj.fragid === null) {
					aSLNoCheck.push(true);
				} else {
					aSLNoCheck.push(false);
				}
				oCTCloseTaskModel.setProperty("/aSLNoCheck", aSLNoCheck);
				if (aSLNoCheck.indexOf(false) === -1 && aTableItems.getSelectedItems().length) {
					oCTCloseTaskModel.setProperty("/bSignoffEnable", true);
				}
			} catch (e) {
				Log.error("Exception in onOutSelectionChange function");
				this.handleException(e);
			}
		},

		onOutstandingSelect: function(oEvent) {
			try {
				oEvent.getSource().getParent().getParent().setSelected(true);
				var oTextPath = oEvent.getSource().getParent().getParent().getBindingContext("oCTCloseTaskModel").getPath();
				var oModel = this.getModel("oCTCloseTaskModel");
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
				var oModel = this.getModel("oCTCloseTaskModel");
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
				var oModel = this.getModel("oCTCloseTaskModel"),
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
				var oModel = this.getModel("oCTCloseTaskModel"),
					sSelectedTab = oModel.getProperty("/sSelectedTab"),
					sPath = oEvent.getSource().getParent().getBindingContext("oCTCloseTaskModel").sPath,
					oSelectedObj = oEvent.getSource().getBindingContext("oCTCloseTaskModel").getObject();
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
				var oModel = this.getModel("oCTCloseTaskModel"),
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

		onNavBack: function() {
			try {
				var oCTCloseTaskModel = this.getView().getModel("oCTCloseTaskModel");
				this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing", {
					srvid: oCTCloseTaskModel.getProperty("/srvtid")
				});
			} catch (e) {
				Log.error("Exception in onNavBack function");
				this.handleException(e);
			}
		},

		onPressCloseTask: function() {
			try {
				var that = this,
					oModel = this.getModel("oCTCloseTaskModel"),
					sSelectedTab = oModel.getProperty("/sSelectedTab"),
					aOTSelected = this.getView().byId("outStandgTblId").getSelectedItems(),
					aPendingSelected = this.getView().byId("PendingSuperTblId").getSelectedItems(),
					oParameter = {},
					oPayloadPut = [],
					aTemp = [];
				if (sSelectedTab === "OT") {
					if (aOTSelected.length) {
						for (var i in aOTSelected) {
							aTemp.push(aOTSelected[i].getBindingContext("oCTCloseTaskModel").getObject());
						}
					}
					oPayloadPut = aTemp;
					for (var i in oPayloadPut) {
						//oPayloadPut[i].sg1usr = "User1";
						//oPayloadPut[i].sg2usr = null;
						oPayloadPut[i].airid = this.getAircraftId();
						//oPayloadPut[i].ddid = "HC_SG_S_FT";
						oPayloadPut[i].stepid = oModel.getProperty("/stepid");
						oPayloadPut[i].srvtid = oModel.getProperty("/srvtid");
					}
					this.getView().byId("taskTabs").setSelectedKey("PS");
				} else if (sSelectedTab === "PS") {
					if (aPendingSelected.length) {
						for (var i in aPendingSelected) {
							aTemp.push(aPendingSelected[i].getBindingContext("oCTCloseTaskModel").getObject());
						}
					}
					oPayloadPut = aTemp;
					for (var i in oPayloadPut) {
						//oPayloadPut[i].sg1usr = null;
						//oPayloadPut[i].sg2usr = "User2";
						oPayloadPut[i].airid = this.getAircraftId();
						//oPayloadPut[i].ddid = "HC_SG_S_FT";
						oPayloadPut[i].stepid = "S_CT";
						oPayloadPut[i].srvtid = this.getModel("oCTCloseTaskModel").getProperty("/srvtid");
						oPayloadPut[i].ftsernr = null;
					}
					this.getView().byId("taskTabs").setSelectedKey("CM");
				}
				//Sign Off Put Service
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					that._getTasks();
				}.bind(this);
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_CT";
				ajaxutil.fnUpdate(this.getResourceBundle().getText("GETFSTASKSVC"), oParameter, oPayloadPut, "S_CT", this);

				/*oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq S_CT";
				oParameter.success = function(oData) {
					that._putRTDetails(oPayloadPost);
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("FTSVC"), oParameter, oPayloadPost);*/
			} catch (e) {
				Log.error("Exception in onPressCloseTask function");
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
			oParameter.filter = "tailid eq TAIL_1015 and stepid eq S_CT";
			ajaxutil.fnUpdate(this.getResourceBundle().getText("FTSVC"), oParameter, oPayloadPut);
		},*/

		// onPressRTaskBack: function() {
		// 	var oCTCloseTaskModel = this.getView().getModel("oCTCloseTaskModel"),
		// 		sSelectedTab = oCTCloseTaskModel.getProperty("/sSelectedTab");
		// 	if (sSelectedTab === "OT") {
		// 		this.getOwnerComponent().getRouter().navTo("UpdateFlightServicing");
		// 	} else if (sSelectedTab === "PS") {
		// 		this.getView().byId("taskTabs").setSelectedKey("OT");
		// 	} else if (sSelectedTab === "CM") {
		// 		this.getView().byId("taskTabs").setSelectedKey("PS");
		// 		oCTCloseTaskModel.setProperty("/bSignoffVisible", false);
		// 	}
		// },

		onTableUpdateFinished: function(sValue, oEvent) {
			try {
				var oLenght = oEvent.getSource().getItems().length,
					oModel = this.getView().getModel("oCTCloseTaskModel");
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
					oModel = this.getView().getModel("oCTCloseTaskModel");
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
					oModel = this.getView().getModel("oCTCloseTaskModel");
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
				this.getModel("oCTCloseTaskModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("oCTCloseTaskModel").setProperty("/stepid", "S_CT");
				this.getModel("oCTCloseTaskModel").refresh();
				var oCTCloseTaskModel = this.getView().getModel("oCTCloseTaskModel");
				oCTCloseTaskModel.setProperty("/sPageTitle", oEvent.getParameter("arguments").srvtid.split("_")[1]);
				this.getView().getModel("oCTCloseTaskModel").setProperty("/ServiceType", this.getModel("oCTCloseTaskModel").getProperty("/srvtid"));
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
				var oCTCloseTaskModel = this.getView().getModel("oCTCloseTaskModel"),
					srvtid = oCTCloseTaskModel.getProperty("/srvtid"),
					stepid = oCTCloseTaskModel.getProperty("/stepid"),
					sSelectedTab = oCTCloseTaskModel.getProperty("/sSelectedTab"),
					OutStandingTask = [],
					PendingSupTask = [],
					CompletedTask = [],
					oParameter = {};
				oParameter.error = function() {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stepid eq " + stepid + " and srvtid eq " + srvtid;
				oParameter.success = function(oData) {
					if (oData.results.length) {
						for (var i in oData.results) {
							if (oData.results[i].ftstatus === "C") {
								OutStandingTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "P") {
								PendingSupTask.push(oData.results[i]);
							}
							if (oData.results[i].ftstatus === "X") {
								CompletedTask.push(oData.results[i]);
							}
						}
						oCTCloseTaskModel.setProperty("/OutStandingTask", OutStandingTask);
						oCTCloseTaskModel.setProperty("/PendingSupTask", PendingSupTask);
						oCTCloseTaskModel.setProperty("/CompletedTask", CompletedTask);
						/*if (srvtid === "SRVT_BF") {
							if (sSelectedTab === "CM") {
								if (OutStandingTask.length !== 0 || PendingSupTask.length !== 0) {
									oCTCloseTaskModel.setProperty("/bSignoffEnable", false);
									oCTCloseTaskModel.setProperty("/sSelectedTab", "OT");
									sap.m.MessageToast("Please close all the outstanding tasks for BF");
								} else {
									oCTCloseTaskModel.setProperty("/bSignoffEnable", true);
								}
							}
						}*/
						var signOFF = this.getView().byId("taskTabs").getSelectedKey() === "CM" ? false : true;
						oCTCloseTaskModel.setProperty("/bSignoffVisible", signOFF);
						oCTCloseTaskModel.refresh();
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("GETFSTASKSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in _getTasks function");
				this.handleException(e);
			}
		}
	});
});