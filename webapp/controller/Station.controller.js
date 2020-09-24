sap.ui.define([
	"../model/models",
	"./BaseController",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/base/Log"
], function(models, BaseController, ajaxutil, formatter, JSONModel, MessageBox, Log) {
	"use strict";
	/* ***************************************************************************
	 *	 Developer : AMIT KUMAR	
	 *   Control name: Station           
	 *   Purpose : Attach and display weapon to stations
	 *   Functions : 
	 *   1.UI Events
	 *		1.1 onInit
	 *		1.2 onSignOffPress
	 *	 2. Backend Calls
	 *		2.1 fnLogById
	 *	 3. Private calls
	 *		3.1 _onObjectMatched
	 *		3.2 fnSetReason
	 *   Note : 
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Station", {
		/* ================================================================================================= */
		/* lifecycle methods                                           */
		/* =========================================================================================================== */
		formatter: formatter,
		onInit: function() {
			try {
				this.getRouter().getRoute("Station").attachPatternMatched(this._onObjectMatched, this);
				var oData = {};
				oData.header = {
					isCnt: "",
					serlNo: 1,
					selStnPath: ""
				};
				this.setModel(new JSONModel(oData), "configModel");
				this.setModel(new JSONModel({
					busy: true,
					delay: 0
				}), "viewModel");

			} catch (e) {
				Log.error("Exception in Station:onInit function");
				this.handleException(e);
			}
		},

		/* =========================================================================================================== */
		/* event handlers                                              */
		/* ========================================================================================================== */

		onSelectionChange: function(oEvent) {
			try {
				var oContext = oEvent.getSource().getSelectedItem().getBindingContext("configModel");
				if (oContext.getObject().STNMID === "STNM_O" && oContext.getObject().STNSID === "STNS_102") {
					if (oContext.getObject().HCFLAG === "" || oContext.getObject().HCFLAG === null || oContext.getObject().HCFLAG === undefined) {
						oContext.getObject().HCFLAG = "";
					}
				}
				this.getModel("configModel").setProperty("/selStn", oContext.getObject());
				this.getModel("configModel").refresh();
				// if (oContext.getObject().adapter) {
				// 	return;
				// }
				// this.fnLoadAdapter();
			} catch (e) {
				Log.error("Exception in Station:onSelectionChange function");
				this.handleException(e);
			}
		},

		onWeaponTileClk: function(oEvent) {
			try {
				if (this.getModel("configModel").getProperty("/selStn/selADP/selWpn/ICART") === "X") {
					return;
				}
				this.getModel("configModel").setProperty("/selStn/selADP/selWpn", undefined);
				this.getModel("configModel").refresh();
			} catch (e) {
				Log.error("Exception in Station:onWeaponTileClk function");
				this.handleException(e);
			}
		},
		onSerialNoPress: function(oEvent) {

		},
		onHotColdSelect: function(oEvent) {
			try {
				this.getModel("configModel").setProperty("/selStn/HCFLAG", oEvent.getSource().getSelectedIndex() === 0 ? "H" : "C");
				this.getModel("configModel").refresh();
			} catch (e) {
				Log.error("Exception in Station:onHotColdSelect function");
				this.handleException(e);
			}
		},

		onUpdateFinished: function(oEvent) {},

		onConnecterPress: function(oEvent) {
			try {
				var oSelWpn = this.getModel("configModel").getProperty("/selStn/selADP/selWpn");
				if (!oSelWpn) {
					MessageBox.error("Please select weapon");
					return;
				}

				if (oSelWpn.CONTOR === "") {
					MessageBox.error("No connector found");
					return;
				}
				this.getModel("configModel").setProperty("/selStn/selADP/selWpn/CONECT", (oSelWpn.CONECT === null || oSelWpn.CONECT === "D") ? "C" :
					"D");
				this.getModel("configModel").refresh();
				this.fnSetArrowColor(oSelWpn.CONECT === null || oSelWpn.CONECT === "D");
			} catch (e) {
				Log.error("Exception in onConnecterPress function");
			}

		},
		//on click of missile list items

		onMissileSelectChange: function(oEvent) {
			try {
				var sSelWpn = oEvent.getParameter("listItem").getBindingContext("configModel").getObject();
				if (sSelWpn.ISSER !== "X") {
					sSelWpn.serialNos = [];
					sSelWpn.cserialNos = [];
				}

				var oSelWpn = this.getModel("configModel").getProperty("/selStn/selADP/selWpn");
				if (oSelWpn && sSelWpn.WESID === oSelWpn.WESID && sSelWpn.WEMID === oSelWpn.WEMID) {
					sSelWpn = oSelWpn;
					if (sSelWpn.serialNos === undefined) {
						this.onReadSNoPress(sSelWpn);
						return;
					}

				} else {
					sSelWpn.serialNos = [{
						srno: "",
						dlt: false,
						delimit: false
					}];
					sSelWpn.cserialNos = [{
						srno: "",
						dlt: false,
						delimit: false
					}];
				}
				sSelWpn.srcount = sSelWpn.srcount === undefined ? sSelWpn.serialNos.length : sSelWpn.srcount;
				var oDailog = this.openDialog("Munition", ".fragments.fs.wlcdetails.");
				oDailog.setModel(new JSONModel(sSelWpn), "oMunitionDialogModel");
			} catch (e) {
				Log.error("Exception in Station:onMissileSelectChange function");
				this.handleException(e);
			}
		},
		// below code is to close the munition fragment
		onCloseMunition: function(oEvent) {
			try {
				this.closeDialog("Munition");
				var oSrnNos = [];
				oEvent.getSource().getModel("oMunitionDialogModel").getProperty("/cserialNos").forEach(function(oItem) {
					oItem.delimit = false;
					oSrnNos.push(oItem);
				});
				this.getModel("configModel").setProperty("/selStn/selADP/selWpn/srno", oSrnNos);
				// this.getModel("configModel").setProperty("/selStn/selADP/selWpn/srno", oSrnNos);
				this.getModel("configModel").refresh();
			} catch (e) {
				Log.error("Exception in Station:onCloseMunition function");
				this.handleException(e);
			}
		},
		onSaveMunition: function(oEvent) {
			try {
				this.closeDialog("Munition");
				var oSelWpn = oEvent.getSource().getModel("oMunitionDialogModel").getData();
				oSelWpn.serialNos.forEach(function(oSelWpns, oItem, sIndex) {
					if (oItem.delimit) {
						oSelWpns.serialNos.splice(sIndex, 1);
					}
				}.bind(this, oSelWpn));
				this.getModel("configModel").setProperty("/selStn/selADP/selWpn", oSelWpn);
				this.getModel("configModel").setProperty("/selStn/TOTQTY", oSelWpn.srcount);
				this.getModel("configModel").refresh();
			} catch (e) {
				Log.error("Exception in Station:onSaveMunition function");
				this.handleException(e);
			}

		},
		onAddSNClk: function(oEvent) {
			try {
				var oSrnNos = oEvent.getSource().getModel("oMunitionDialogModel").getProperty("/serialNos");
				var sCount = oEvent.getSource().getModel("oMunitionDialogModel").getProperty("/srcount");
				oSrnNos.push({
					srno: "",
					dlt: true,
					delimit: false
				});
				oEvent.getSource().getModel("oMunitionDialogModel").setProperty("/srcount", sCount + 1);
				oEvent.getSource().getModel("oMunitionDialogModel").refresh();
			} catch (e) {
				Log.error("Exception in Station:onAddSNClk function");
				this.handleException(e);
			}
		},
		onDeleteSrnClk: function(oEvent) {
			try {
				var oSelObject = oEvent.getSource().getBindingContext("oMunitionDialogModel").getObject();
				oSelObject.delimit = true;
				var oCount = oEvent.getSource().getModel("oMunitionDialogModel").getProperty("/srcount");
				oEvent.getSource().getModel("oMunitionDialogModel").setProperty("/srcount", oCount - 1);
				oEvent.getSource().getBindingContext("oMunitionDialogModel").getModel().refresh();
			} catch (e) {
				Log.error("Exception in Station:onDeleteSrnClk function");
				this.handleException(e);
			}

		},
		/* ========================================================================================================================= */
		/* internal methods  Section 1 : Sub functions                 */
		/* ========================================================================================================================== */

		_onObjectMatched: function(oEvent) {
			try {
				this.updateModel({
					busy: true
				}, "viewModel");
				this.getModel("configModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("configModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("configModel").setProperty("/STNSID", oEvent.getParameter("arguments").stns);
				this.getModel("configModel").setProperty("/STNMID", oEvent.getParameter("arguments").stnmid);
				this.getModel("configModel").refresh();
				this.fnLoadStation();
			} catch (e) {
				Log.error("Exception in Station:_onObjectMatched function");
				this.handleException(e);
			}
		},
		fnLoadStation: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel("configModel").getProperty("/srvtid") +
					" and airid eq " + this.getAircraftId();
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(oData) {
					this.getModel("configModel").setProperty("/stns", oData.results);
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].STNSID === this.getModel("configModel").getProperty("/STNSID") && oData.results[i].STNMID === this.getModel(
								"configModel").getProperty("/STNMID")) {
							this.getModel("configModel").setProperty("/selStn", oData.results[i]);
							//	break;
						}
						if (oData.results[i].STNMID === "STNM_S") {
							this.fnLoadAdapter(oData.results[i]);
						}
					}
					this.getModel("configModel").refresh();
				}.bind(this);
				ajaxutil.fnRead("/WeaponSvc", oParameter);
			} catch (e) {
				Log.error("Exception in Station:fnLoadStation function");
				this.handleException(e);
			}
		},
		fnLoadAdapter: function(sStation) {
			try {
				var sStatnId = sStation.STNSID;
				var sStnmId = sStation.STNMID;
				var oParameter = {};
				// oParameter.filter = "refid eq '" + this.getAircraftId() + "' and stnsid eq '" + sStatnId + "' and adpflag eq 'X'";
				oParameter.filter = "tailid eq " + this.getTailId() + " and stnsid eq '" + sStatnId + "' and adpflag eq 'X' and stnmid eq '" +
					sStnmId + "'";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this);
				oParameter.success = function(sStn, oData) {
					sStn.adapter = oData.results.length > 0 ? oData.results : [];
					sStn.selADP = oData.results.length > 0 ? oData.results[0] : "";
					this.getModel("configModel").refresh();
					this.fnCheckForImpulsCart(sStn);
					if (sStn.selADP !== "" && sStn.selADP.POT !== "T") {
						this.fnLoadMissile(sStn);
					}
					this.updateModel({
						busy: false
					}, "viewModel");
				}.bind(this, sStation);
				ajaxutil.fnRead("/WeaponSernrSvc", oParameter);
			} catch (e) {
				Log.error("Exception in Station:fnLoadAdapter function");
				this.handleException(e);
			}
		},
		fnLoadMissile: function(sStation) {
			try {
				var sAdapId = sStation.selADP.ADPID;
				var sDDID = sStation.selADP.STNSID;
				var sSUBID = sStation.selADP.STNMID;
				var oParameter = {};
				// oParameter.filter = "stnsid eq '" + sDDID + "' and stnmid eq '" + sDDID + "' and ADPID eq '" + sAdapId + "' and tailid eq '" +
				oParameter.filter = "stnsid eq " + sDDID + " and stnmid eq " + sSUBID + " and ADPID eq " + sAdapId + " and airid eq " +
					this.getAircraftId();
				// oParameter.filter = "tailid eq '" + this.getTailId() + "' and adpid eq '" + sAdapId + "'";
				oParameter.error = function() {
					this.updateModel({
						busy: false
					}, "viewModel");
				};
				oParameter.success = function(sStn, oData) {
					sStn.selADP.wpn = oData.results;
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].WEMID === sStn.WEMID && oData.results[i].WESID === sStn.WESID) {
							oData.results[i].CONECT = sStn.CONECT;
							sStn.selADP.selWpn = oData.results[i];
							this.fnSetArrowColor(oData.results[i].CONECT === "C");
							this.fnLoadSerialNumber(sStn);
							break;
						}
					}
					this.updateModel({
						busy: false
					}, "viewModel");
					this.getModel("configModel").refresh();
				}.bind(this, sStation);
				ajaxutil.fnRead("/WeaponConfigSvc", oParameter);
			} catch (e) {
				Log.error("Exception in Station:fnLoadMissile function");
				this.handleException(e);
			}
		},

		fnLoadSerialNumber: function(sStation) {
			var sStatnId = sStation.STNSID;
			var sStnmId = sStation.STNMID;
			var oParameter = {};
			// oParameter.filter = "refid eq '" + this.getAircraftId() + "' and stnsid eq '" + sStatnId + "' and adpflag eq 'X'";
			oParameter.filter = "tailid eq " + this.getTailId() + " and stnmid eq " + sStnmId + " and stnsid eq " + sStatnId;
			oParameter.error = function() {};
			oParameter.success = function(sStn, oData) {
				var sSrlNo = this.fnCreateSerialNo(oData);
				sStn.selADP.selWpn.srcount = sSrlNo.length;
				sStn.selADP.selWpn.serialNos = sSrlNo;
				sStn.selADP.selWpn.cserialNos = sSrlNo;
				this.getModel("configModel").refresh();
			}.bind(this, sStation);
			ajaxutil.fnRead("/WeaponSernrSvc", oParameter);
		},

		fnCreateSerialNo: function(oData) {
			var sSerilNo = [];
			oData.results.forEach(function(srno, sIndex) {
				var srNo = {};
				srNo.srno = srno.SERNR;
				srNo.dlt = sIndex === 0 ? false : true;
				srNo.delimit = false;
				sSerilNo.push(srNo);
			}.bind(this));
			return sSerilNo;
		},

		onStationSignOff: function() {
			try {
				var sMsg = this.fnValidOther();
				if(sMsg !== ""){
					var oData = {messages:[sMsg]};
					this.fnShowMessage("E", oData,null, function(){
						
					});
					return ;
				}
				var oSerialNumberPayload = [];
				var oPayloads = [];
				this.getModel("configModel").getProperty("/stns").forEach(function(oItem) {
					var oPayload = {};
					oPayload.ROLEID = oItem.ROLEID !== undefined ? oItem.ROLEID : "";
					oPayload.STNMID = oItem.STNMID !== undefined ? oItem.STNMID : "";
					oPayload.STNSID = oItem.STNSID !== undefined ? oItem.STNSID : "";
					oPayload.NUM1 = oItem.NUM1 !== undefined ? oItem.NUM1 : "";
					oPayload.begda = formatter.defaultOdataDateFormat(new Date(), "yyyyMMdd");
					oPayload.TAILID = this.getTailId();
					oPayload.AIRID = this.getAircraftId();
					oPayload.SRVTID = this.getModel("configModel").getProperty("/srvtid");
					oPayload.STEPID = this.getModel("configModel").getProperty("/stepid");
					oPayload.HCFLAG = oItem.HCFLAG !== undefined ? oItem.HCFLAG : "";
					oPayload.APPRCOUNT = 0;
					oPayload.TLSERNR = null;
					oPayload.EXPAND = null;
					oPayload.endda = "99991231";
					oPayload.SUBID = null;
					oPayload.L_TXT = null;
					oPayload.ADPDESC = null;
					oPayload.ISSER = null;
					oPayload.SRVID = "";
					oPayload.TOTQTY = isNaN(parseInt(oItem.TOTQTY, 0)) ? 0 : parseInt(oItem.TOTQTY, 0);
					if (oItem.selADP && oItem.selADP.selWpn) {
						oPayload.WEMDESC = oItem.selADP.selWpn.WEMDESC !== undefined ? oItem.selADP.selWpn.WEMDESC : "";
						oPayload.WESDESC = oItem.selADP.selWpn.WESDESC !== undefined ? oItem.selADP.selWpn.WESDESC : "";
						oPayload.SERNR = oItem.selADP.selWpn.srlno === undefined ? 0 : oItem.selADP.selWpn.srlno;
						oPayload.TOTQTY = oItem.selADP.selWpn.srcount === undefined ? 0 : oItem.selADP.selWpn.srcount;
						oPayload.CONECT = oItem.selADP.selWpn.CONTOR === "C" ? "X" : "";
						oPayload.CONTOR = oItem.selADP.selWpn.CONTOR;
						oPayload.WEMID = oItem.selADP.selWpn.WEMID !== undefined ? oItem.selADP.selWpn.WEMID : "";
						oPayload.WESID = oItem.selADP.selWpn.WESID !== undefined ? oItem.selADP.selWpn.WESID : "";
						oPayload.ADPID = oItem.selADP.ADPID !== undefined ? oItem.selADP.ADPID : "";
						if (oItem.selADP.selWpn.ICART === "X") {
							oPayload.ADPID = oItem.selADP.selWpn.ADPID;
						}
						if (oItem.selADP.selWpn.ISSER === 'X' && oItem.selADP.selWpn.serialNos) {
							oSerialNumberPayload = oSerialNumberPayload.concat(this.onCreateMissile(oItem));
						}
						oPayloads.push(oPayload);
					} else {
						oPayload.WEMDESC = "";
						oPayload.WESDESC = ""; //oItem.selADP.selWpn.WESDESC !== undefined ? oItem.selADP.selWpn.WESDESC : "";
						oPayload.SERNR = ""; //oItem.selADP.selWpn.srlno === undefined ? 0 : oItem.selADP.selWpn.srlno;
						oPayload.CONECT = ""; //oItem.selADP.selWpn.connect === true ? "X" : "";
						oPayload.CONTOR = "";
						oPayload.WEMID = ""; //oItem.selADP.selWpn.WEMID !== undefined ? oItem.selADP.selWpn.WEMID : "";
						oPayload.WESID = ""; //oItem.selADP.selWpn.WESID !== undefined ? oItem.selADP.selWpn.WESID : "";
						oPayload.ADPID = ""; //oItem.selADP.ADPID !== undefined ? oItem.selADP.ADPID : "";
						// oPayload.TOTQTY = 0; //oItem.selADP.selWpn.qnt === undefined ? 0 : oItem.selADP.selWpn.qnt;
					}

					if (oPayload.STNMID === "STNM_O" && oPayload.TOTQTY >= 0) {
						oPayloads.push(oPayload);
					}
					// oPayloads.push(oPayload);
				}.bind(this));
				if (oPayloads.length <= 0) {
					oPayloads = this._fnCreateEmptyPayloadSignOff();
				}
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oSerialNumberPayload, oData) {
					if (oSerialNumberPayload.length > 0) {
						this.fnCreateMissileSerialNumber(oSerialNumberPayload);
						return;
					}
					this.onNavBack();
				}.bind(this, oSerialNumberPayload);
				// this.getModel("configModel").getProperty("/stepid")
				oParameter.activity = 4;
				ajaxutil.fnCreate("/WeaponConfigSvc", oParameter, oPayloads, "ZRM_FS_WCT", this);
			} catch (e) {
				Log.error("Exception in Station:onStationSignOff function");
				this.handleException(e);
			}
		},
		onCreateMissile: function(oItem) {
			try {
				var oPayloads = [];
				oItem.selADP.selWpn.serialNos.forEach(function(srNo, sIndex) {
					if (srNo.srno) {
						var oPayload = {};
						oPayload.STNMID = oItem.selADP.selWpn.STNMID; //STNM_S;
						oPayload.STNSID = oItem.selADP.selWpn.STNSID; //STNS_101;
						oPayload.airid = this.getAircraftId();
						oPayload.WEMID = oItem.selADP.selWpn.WEMID;
						oPayload.WESID = oItem.selADP.selWpn.WESID;
						oPayload.TAILID = this.getTailId();
						oPayload.SRVID = "";
						oPayload.NUM1 = (oItem.selADP.NUM1 === null || oItem.selADP.NUM1 === 0) ? 1 : oItem.selADP.NUM1;
						oPayload.NUM2 = (sIndex + 1);
						oPayload.SERNR = srNo.srno;
						oPayload.endda = null;
						oPayload.begda = null;
						oPayload.ADPFLAG = "";
						oPayload.POT = null;
						oPayload.ADPID = oItem.selADP.ADPID;
						oPayload.ADPDESC = oItem.selADP.ADPDESC;
						oPayload.ROLEID = oItem.selADP.ROLEID;
						oPayload.SEQID = oItem.selADP.SEQID;
						oPayload.ICART = null;
						oPayload.CONTOR = null;
						oPayload.ISSER = oItem.selADP.ISSER;

						oPayloads.push(oPayload);
					}
				}.bind(this));
			} catch (e) {
				Log.error("Exception in Station:onCreateMissile function");
				this.handleException(e);
			}
			return oPayloads;
		},

		fnCreateMissileSerialNumber: function(oPayloads) {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnCreate("/WeaponSernrSvc", oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in Station:onInit function");
				this.handleException(e);
			}
		},
		fnSetArrowColor: function(isConnected) {
			try {
				this.getView().byId("ptUpArrowId")._cssFillColor = (isConnected ? "Blue" : "Green");
				this.getView().byId("ptDownArrowId")._cssFillColor = (isConnected ? "Blue" : "Green");
			} catch (e) {
				Log.error("Exception in Station:fnCreateMissileSerialNumber function");
				this.handleException(e);
			}
		},
		onOtherCountChange: function(oEvent) {
			try {
				var sLastValue = oEvent.getSource().getLastValue();
				var oValue = oEvent.getSource().getValue();
				var oMax = oEvent.getSource().getMaxLength();
				var sMsgText = "";
				if (isNaN(oValue)) {
					sMsgText = "Quantity must be numeric";
				} else if (oValue > oMax) {
					sMsgText = "Quantity must be smaller than " + oMax;
				}
				oEvent.getSource().setValueState(sMsgText === "" ? "None" : "Error");
				oEvent.getSource().setValueStateText(sMsgText);
			} catch (e) {
				Log.error("Exception in Station:onOtherCountChange function");
				this.handleException(e);
			}
		},
		fnCheckForImpulsCart: function(sStation) {
			try {
				var sAdapterList = sStation.adapter;
				if (!sAdapterList || sAdapterList.length === 0) {
					return;
				}

				// if (sAdapterList[0].ICART === "X") {
				if (sAdapterList[0].POT === "T") {
					var sWep = sAdapterList[0];
					sWep.CONTOR = sWep.ICART==="X"?"C":"N";
					sStation.selADP = sAdapterList[1] === undefined ? {} : sAdapterList[1];
					sStation.selADP.selWpn = sWep;
					sStation.selADP.selWpn.CONECT = this.getModel("configModel").getProperty("/selStn/CONECT");
					sAdapterList.splice(0, 1);
					sStation.adapter = sAdapterList;
					this.getModel("configModel").refresh();
				}
			} catch (e) {
				Log.error("Exception in Station:fnCheckForImpulsCart function");
				this.handleException(e);
			}

		},

		onReadSNoPress: function(sSelWpn) {
			try {
				var oStation = this.getModel("configModel").getProperty("/selStn");
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and stnmid eq " + oStation.STNMID + " and stnsid eq " + oStation.STNSID;
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// var sSelWpn = this.getModel("configModel").setProperty("/selStn/selADP/selWpn");
					var sSrNo = [];
					oData.results.forEach(function(oItem, sIndex) {
						var oSrNo = {};
						oSrNo.srno = oItem.SERNR;
						oSrNo.dlt = sIndex > 0 ? true : false;
						oSrNo.delimit = false;
						sSrNo.push(oSrNo);
					}.bind(this));
					sSelWpn.serialNos = sSrNo;
					sSelWpn.cserialNos = sSrNo;
					sSelWpn.srcount = sSrNo.length;
					this.getModel("configModel").refresh();
					var oDailog = this.openDialog("Munition", ".fragments.fs.wlcdetails.");
					oDailog.setModel(new JSONModel(sSelWpn), "oMunitionDialogModel");
				}.bind(this);
				ajaxutil.fnRead("/WeaponSernrSvc", oParameter);
			} catch (e) {
				Log.error("Exception in WeaponConfig:onSerialNoPress function");
				this.handleException(e);
			}
		},
		
			fnValidOther:function(){
			var sMsg = "";
			this.getModel("configModel").getProperty("/stns").forEach(function(oItem) {
				if(oItem.STNMID === "STNM_O"){
					var sQty = parseInt(oItem.TOTQTY);
					if(isNaN(sQty) || sQty > oItem.MAX){
						sMsg = "Invalid value for "+oItem.LTXT;	
					}
				}
			});
			return sMsg;
		},
		

		_fnCreateEmptyPayloadSignOff: function() {
			// var oPayloads = [];
			// this.getModel("configModel").getProperty("/stns").forEach(function(oItem) {
				var oPaylod = {
					"AIRID": this.getAircraftId(),
					"ROLEID": null,
					"SUBID": null,
					"STNMID": null,
					"L_TXT": null,
					"WEMID": null,
					"WESID": null,
					"ADPID": null,
					"ADPDESC": null,
					"WEMDESC": null,
					"WESDESC": null,
					"STNSID": null,
					"CONTOR": null,
					"ISSER": null,
					"TAILID": this.getTailId(),
					"SRVID": null,
					"NUM1": null,
					"SRVTID": this.getModel("configModel").getProperty("/srvtid"),
					"SERNR": null,
					"endda": "99991231",
					"begda": null,
					"TOTQTY": null,
					"CONECT": null,
					"HCFLAG": null,
					"STEPID": this.getModel("configModel").getProperty("/stepid"),
					"EXPAND": null,
					"TLSERNR": null,
					"APPRCOUNT": null
				};
		//		oPayloads.push(oPaylod);
		//	}.bind(this));
			return oPaylod;
		}
	});

});