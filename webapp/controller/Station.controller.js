sap.ui.define([
	"../model/models",
	"./BaseController",
	"../util/ajaxutil",
	"../model/formatter",
	"../model/FieldValidations",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/base/Log"
], function(models, BaseController, ajaxutil, formatter, FieldValidations, JSONModel, MessageBox, Log) {
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
				var oData = {
					srvid: "",
					path:""
				};
				oData.header = {
					isCnt: "",
					serlNo: 1,
					selStnPath: ""
				};
				this.setModel(new JSONModel(oData), "configModel");

				this.getRouter().getRoute("Station").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in onInit function");
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
						oContext.getObject().HCFLAG = "H";
					}
				}
				this.getModel("configModel").setProperty("/selStn", oContext.getObject());
				this.getModel("configModel").refresh(true);
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
				this.getModel("configModel").setProperty("/selStn/TSTAT", 1);
				this.getModel("configModel").setProperty("/selStn/selADP/selWpn", undefined);
				this.getModel("configModel").setProperty("/selStn/TOTQTY", "");

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
				this.getModel("configModel").setProperty("/selStn/TSTAT", 1);
				this.getModel("configModel").refresh();
			} catch (e) {
				Log.error("Exception in Station:onHotColdSelect function");
				this.handleException(e);
			}
		},

		onUpdateFinished: function(oEvent) {},

		onConnecterPress: function(oEvent) {
			try {
				if(!this.fnOnValidate()){
					MessageBox.error("You can remove weapon only ");
					return;
				}
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
				this.getModel("configModel").setProperty("/selStn/TSTAT", 1);
				this.getModel("configModel").refresh();
				this.fnSetArrowColor(oSelWpn.CONECT === null || oSelWpn.CONECT === "D");
			} catch (e) {
				Log.error("Exception in onConnecterPress function");
			}

		},
		//on click of missile list items

		onMissileSelectChange: function(oEvent) {
			try {
				if(!this.fnOnValidate()){
					MessageBox.error("You can remove weapon only ");
					return;
				}
				var sSelWpn = oEvent.getParameter("listItem").getBindingContext("configModel").getObject();
				if (sSelWpn.ISSER !== "X") {
					sSelWpn.serialNos = [];
					sSelWpn.cserialNos = [];
				}

				var oSelWpn = this.getModel("configModel").getProperty("/selStn/selADP/selWpn");
				if (oSelWpn && sSelWpn.WESID === oSelWpn.WESID && sSelWpn.WEMID === oSelWpn.WEMID) {
					sSelWpn = oSelWpn;
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
				sSelWpn.mxval = this.getModel("configModel").getProperty("/selStn/selADP/MXVAL");
				var oDailog = this.openDialog("Munition", ".fragments.fs.wlc.wlcdetails.");
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
				Log.error("Exception in onCloseMunition function");
			}
		},
		onChkBxSel: function(oEvent) {
			var sContext = oEvent.getSource().getBindingContext("configModel");
			this.getModel("configModel").setProperty(sContext.getPath() + "/TSTAT", oEvent.getSource().getSelected() ? 1 : 0);
			this.getModel("configModel").refresh();
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		onOtherCountChange: function(oEvent) {
			try {
				if (FieldValidations.validateFields(this)) {
					var oValue = oEvent.getSource().getValue();
					var oMax = oEvent.getSource().getMax();
					var sMsgText = "";
					if (isNaN(oValue)) {
						sMsgText = "Quantity must be numeric";
					} else if (oValue > oMax) {
						sMsgText = "Quantity must be smaller than " + oMax;
					}
					oEvent.getSource().setValueState(sMsgText === "" ? "None" : "Error");
					oEvent.getSource().setValueStateText(sMsgText);
				}

			} catch (e) {
				Log.error("Exception in onOtherCountChange function");
			}
		},
		onSaveMunition: function(oEvent) {
			try {
				if (this.cvutil.validateForm(oEvent.getSource().getParent())) {
					return;
				}
				this.closeDialog("Munition");
				var oSelWpn = oEvent.getSource().getModel("oMunitionDialogModel").getData();
				oSelWpn.serialNos.forEach(function(oSelWpns, oItem, sIndex) {
					if (oItem.delimit) {
						oSelWpns.serialNos.splice(sIndex, 1);
					}
				}.bind(this, oSelWpn));
				this.getModel("configModel").setProperty("/selStn/selADP/selWpn/srcount", 1);
				this.getModel("configModel").setProperty("/selStn/selADP/selWpn", oSelWpn);
				this.getModel("configModel").setProperty("/selStn/TOTQTY", oSelWpn.srcount);
				this.getModel("configModel").setProperty("/selStn/TSTAT", 1);
				this.getModel("configModel").refresh();
			} catch (e) {
				this.closeDialog("Munition");
				Log.error("Exception in onSaveMunition function");
			}
		},
		//-------------------------------------------------------------
		// 
		//-------------------------------------------------------------
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
				// var oMunitionDialogModel =  oEvent.getSource().getModel("oMunitionDialogModel");
				// var sIndex = oMunitionDialogModel.getProperty("/serialNos").indexOf(oSelObject);
				// oMunitionDialogModel.getProperty("/serialNos").splice(sIndex,1);
				// oMunitionDialogModel.refresh();
			} catch (e) {
				Log.error("Exception in onDeleteSrnClk function");
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		onStationSignOff: function(oEvent) {
			this.fnOpenCloseConfirmationDialog(oEvent, "OPN");
		},
		onStationUndoSignOff: function(oEvent) {
			try {
				var oItem = this.getModel("configModel").getProperty("/selStn");
				oItem.TSTAT = 0;
				var txtSrno = this.getModel("configModel").getProperty("/stns/0/TLSERNR");
				var oSerialNumberPayload = [];
				var oPayloads = [];
				var oPayload = {};
				oPayload.ROLEID = oItem.ROLEID !== undefined ? oItem.ROLEID : "";
				oPayload.STNMID = oItem.STNMID !== undefined ? oItem.STNMID : "";
				oPayload.STNSID = oItem.STNSID !== undefined ? oItem.STNSID : "";
				oPayload.NUM1 = oItem.NUM1 !== undefined ? oItem.NUM1 : "";
				oPayload.begda = formatter.defaultOdataDateFormat(new Date(), "yyyyMMdd");
				oPayload.TAILID = this.getTailId();
				oPayload.airid = this.getAircraftId();
				oPayload.SRVTID = this.getModel("configModel").getProperty("/srvtid");
				oPayload.STEPID = this.getModel("configModel").getProperty("/stepid");
				oPayload.HCFLAG = oItem.HCFLAG !== undefined ? oItem.HCFLAG : "";
				oPayload.APPRCOUNT = 0; // trasman sign off 
				oPayload.TLSERNR = txtSrno;
				oPayload.EXPAND = null;
				oPayload.endda = "99991231";
				oPayload.SUBID = null;
				oPayload.L_TXT = oItem.L_TXT;
				oPayload.ADPDESC = null;
				oPayload.ISSER = null;
				oPayload.SRVID = "";
				oPayload.TOTQTY = isNaN(parseInt(oItem.TOTQTY, 0)) ? 0 : parseInt(oItem.TOTQTY, 0);
				oPayload.ttlrnd = oItem.ttlrnd !== undefined ? oItem.ttlrnd : "";
				oPayload.ISPOST = null;
				oPayload.WEMDESC = oItem.WEMDESC;
				oPayload.WESDESC = oItem.WESDESC;
				oPayload.TSTAT = oItem.TSTAT;
				oPayload.TSIGN = null;
				oPayload.S_TXT = oItem.S_TXT;
				oPayload.QTYADD = oItem.QTYADD;
				oPayload.MAX = oItem.MAX;
				oPayload.EFLAG = "";
				if (oItem.selADP && oItem.selADP.selWpn) {
					oPayload.WEMDESC = oItem.selADP.selWpn.WEMDESC !== undefined ? oItem.selADP.selWpn.WEMDESC : "";
					oPayload.WESDESC = oItem.selADP.selWpn.WESDESC !== undefined ? oItem.selADP.selWpn.WESDESC : "";
					// oPayload.SERNR = oItem.selADP.selWpn.srlno === undefined ? 0 : oItem.selADP.selWpn.srlno;
					oPayload.SERNR = oItem.selADP.SERNR === undefined ? 0 : oItem.selADP.SERNR;
					oPayload.TOTQTY = oItem.selADP.selWpn.srcount === undefined ? 0 : oItem.selADP.selWpn.srcount;
					oPayload.CONECT = this.getConnectConnector(oItem.selADP);
					oPayload.CONTOR = oItem.selADP.selWpn.CONTOR;
					oPayload.WEMID = oItem.selADP.selWpn.WEMID !== undefined ? oItem.selADP.selWpn.WEMID : "";
					oPayload.WESID = oItem.selADP.selWpn.WESID !== undefined ? oItem.selADP.selWpn.WESID : "";
					oPayload.ADPID = oItem.selADP.ADPID !== undefined ? oItem.selADP.ADPID : "";
					if (oItem.selADP.selWpn.ICART === "X") {
						oPayload.ADPID = oItem.selADP.selWpn.ADPID;
					}
					if (oItem.selADP.selWpn.serialNos) {
						oSerialNumberPayload = oSerialNumberPayload.concat(this.onCreateMissile(oItem));
					}
					if (oPayload.TSTAT === 0 || oPayload.TSTAT === 1) {
						oPayloads.push(oPayload);
					}
				} else {
					oPayload.WEDESC = "";
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

				if (oPayload.STNMID === "STNM_O" && oPayload.TOTQTY > 0 && (oPayload.TSTAT === 0 || oPayload.TSTAT === 1)) {
					oPayloads.push(oPayload);
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
				oParameter.activity = "4";
				ajaxutil.fnCreate(this.getResourceBundle().getText("WEAPONSVC"), oParameter, oPayloads, "dummy", this);
			} catch (e) {
				Log.error("Exception in onStationUndoSignOff function");
			}
		},
		onStationToolChkSignOff: function(oEvent) {
			try {
				var txtSrno = this.getModel("configModel").getProperty("/stns/0/TLSERNR");
				var oSerialNumberPayload = [];
				var oPayloads = [];
				this.getModel("configModel").getProperty("/stns").forEach(function(oItem) {
					// if (!oItem.selected) {
					// 	return;
					// }
					var oPayload = JSON.parse(JSON.stringify(oItem));
					delete oPayload.adapter;
					delete oPayload.selADP;
					oPayload.ROLEID = oItem.ROLEID !== undefined ? oItem.ROLEID : "";
					oPayload.STNMID = oItem.STNMID !== undefined ? oItem.STNMID : "";
					oPayload.STNSID = oItem.STNSID !== undefined ? oItem.STNSID : "";
					oPayload.NUM1 = oItem.NUM1 !== undefined ? oItem.NUM1 : "";
					oPayload.begda = formatter.defaultOdataDateFormat(new Date(), "yyyyMMdd");
					oPayload.TAILID = this.getTailId();
					oPayload.airid = this.getAircraftId();
					oPayload.SRVTID = this.getModel("configModel").getProperty("/srvtid");
					oPayload.STEPID = this.getModel("configModel").getProperty("/stepid");
					oPayload.HCFLAG = oItem.HCFLAG !== undefined ? oItem.HCFLAG : "";
					oPayload.APPRCOUNT = 0; //oItem.APPRCOUNT;
					oPayload.TLSERNR = txtSrno;
					oPayload.EXPAND = null;
					oPayload.endda = "99991231";
					oPayload.SUBID = null;
					oPayload.L_TXT = oItem.L_TXT;
					oPayload.ADPDESC = null;
					oPayload.ISSER = null;
					oPayload.SRVID = "";
					oPayload.TOTQTY = isNaN(parseInt(oItem.TOTQTY, 0)) ? 0 : parseInt(oItem.TOTQTY, 0);
					oPayload.ttlrnd = oItem.ttlrnd !== undefined ? oItem.ttlrnd : "";
					oPayload.ISPOST = null;

					// oPayload.WEDESC = null;
					oPayload.CONTOR = null;
					// oPayload.WEMDESC = oItem.WEMDESC;
					oPayload.WESDESC = oItem.WESDESC;
					//oPayload.TSTAT = 1;
					//oPayload.TSIGN = null;
					// oPayload.L_TXT = oItem.L_TXT;
					oPayload.S_TXT = oItem.S_TXT;
					oPayload.QTYADD = oItem.QTYADD;
					oPayload.MAX = oItem.MAX;
					// oPayload.ISPOST = null;
					oPayload.EFLAG = "";
					if(oItem.selADP){
						oPayload.ADPID = oItem.selADP.ADPID !== undefined ? oItem.selADP.ADPID : "";
					}

					if (oItem.selADP && oItem.selADP.selWpn) {
						// oPayload.WEMDESC = oItem.selADP.selWpn.WEMDESC !== undefined ? oItem.selADP.selWpn.WEMDESC : "";
						oPayload.WESDESC = oItem.selADP.selWpn.WESDESC !== undefined ? oItem.selADP.selWpn.WESDESC : "";
						// oPayload.SERNR = oItem.selADP.selWpn.srlno === undefined ? 0 : oItem.selADP.selWpn.srlno;
						oPayload.SERNR = oItem.selADP.SERNR === undefined ? 0 : oItem.selADP.SERNR;
						oPayload.TOTQTY = oItem.selADP.selWpn.srcount === undefined ? 0 : oItem.selADP.selWpn.srcount;
						oPayload.CONECT = this.getConnectConnector(oItem.selADP);
						oPayload.CONTOR = oItem.selADP.selWpn.CONTOR;
						oPayload.WEMID = oItem.selADP.selWpn.WEMID !== undefined ? oItem.selADP.selWpn.WEMID : "";
						oPayload.WESID = oItem.selADP.selWpn.WESID !== undefined ? oItem.selADP.selWpn.WESID : "";
						oPayload.ADPID = oItem.selADP.ADPID !== undefined ? oItem.selADP.ADPID : "";
						if (oItem.selADP.selWpn.ICART === "X") {
							oPayload.ADPID = oItem.selADP.selWpn.ADPID;
							oPayload.TOTQTY = 1;
						}
						if (oItem.selADP.selWpn.serialNos) {
							oSerialNumberPayload = oSerialNumberPayload.concat(this.onCreateMissile(oItem));
						}
						// if (oPayload.TSTAT === 0 || oPayload.TSTAT === 1) {
						// 	oPayloads.push(oPayload);
						// }
					} else {
						// oPayload.WEDESC = "";
						// oPayload.WEMDESC = "";
						oPayload.WESDESC = ""; //oItem.selADP.selWpn.WESDESC !== undefined ? oItem.selADP.selWpn.WESDESC : "";
						oPayload.SERNR = ""; //oItem.selADP.selWpn.srlno === undefined ? 0 : oItem.selADP.selWpn.srlno;
						oPayload.CONECT = ""; //oItem.selADP.selWpn.connect === true ? "X" : "";
						oPayload.CONTOR = "";
						oPayload.WEMID = ""; //oItem.selADP.selWpn.WEMID !== undefined ? oItem.selADP.selWpn.WEMID : "";
						oPayload.WESID = ""; //oItem.selADP.selWpn.WESID !== undefined ? oItem.selADP.selWpn.WESID : "";
					//	oPayload.ADPID = ""; //oItem.selADP.ADPID !== undefined ? oItem.selADP.ADPID : "";
						// oPayload.TOTQTY = 0; //oItem.selADP.selWpn.qnt === undefined ? 0 : oItem.selADP.selWpn.qnt;
					}
					// if (oPayload.STNMID === "STNM_O" && oPayload.TOTQTY > 0 && (oPayload.TSTAT === 0 || oPayload.TSTAT === 1)) {
					// 	oPayloads.push(oPayload);
					// }
					oPayloads.push(oPayload);
				}.bind(this));
				if (oPayloads.length <= 0) {
					sap.m.MessageToast.show("Select and configure at least one for sign off first");
					return;
					// oPayloads = this._fnCreateEmptyPayloadSignOff();
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
				oParameter.activity = "4";
				ajaxutil.fnCreate(this.getResourceBundle().getText("WEAPONCONFIGSVC"), oParameter, oPayloads, "dummy", this);
			} catch (e) {
				Log.error("Exception in onStationToolChkSignOff function");
			}
		},
		getConnectConnector: function(aAdp) {
			if (aAdp.selWpn.CONTOR === null || aAdp.selWpn.CONTOR === '') {
				return "C";
			}
			if (aAdp.selWpn.CONECT === "C") {
				return "C";
			}
			return "";
			// oItem.selADP.selWpn.CONECT === "C" ? "C" : "";
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
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
						oPayload.MXVAL = oItem.selADP.MXVAL;

						// oPayload.WEDESC = null;
						oPayload.WEMDESC = null;
						oPayload.WESDESC = null;
						oPayload.TSTAT = oItem.TSTAT;
						oPayload.TSIGN = null;
						oPayload.L_TXT = oItem.L_TXT;
						oPayload.S_TXT = oItem.S_TXT;
						oPayload.QTYADD = null;
						oPayload.MAX = null;
						oPayload.EFLAG = "";

						oPayloads.push(oPayload);
					}
				}.bind(this));
				return oPayloads;
			} catch (e) {
				Log.error("Exception in onCreateMissile function");
			}
		},
		//-------------------------------------------------------------
		// internal methods  Section 1 : Sub functions 
		//-------------------------------------------------------------
		_onObjectMatched: function(oEvent) {
			try {
				this.getModel("configModel").setProperty("/srvtid", oEvent.getParameter("arguments").srvtid);
				this.getModel("configModel").setProperty("/stepid", oEvent.getParameter("arguments").stepid);
				this.getModel("configModel").setProperty("/STNSID", oEvent.getParameter("arguments").stns);
				this.getModel("configModel").setProperty("/STNMID", oEvent.getParameter("arguments").stnmid);
				this.getModel("configModel").setProperty("/srvid", oEvent.getParameter("arguments").srvid);
				this.getModel("configModel").setProperty("/path", oEvent.getParameter("arguments").path);
				this.getModel("configModel").refresh();
				this.fnLoadStation();
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		fnLoadStation: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and srvtid eq " + this.getModel("configModel").getProperty("/srvtid") +
					" and airid eq " + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					// oData.results[0].APPRCOUNT = 0;
					this.getModel("configModel").setProperty("/stns", oData.results);
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].STNSID === this.getModel("configModel").getProperty("/STNSID") && oData.results[i].STNMID === this.getModel(
								"configModel").getProperty("/STNMID")) {
							this.getModel("configModel").setProperty("/selStn", oData.results[i]);

						}
						if (oData.results[i].STNMID === "STNM_S") {
							this.fnLoadAdapter(oData.results[i]);
						}
					}
					this.getModel("configModel").refresh();
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("WEAPONSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadStation function");
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		fnLoadAdapter: function(sStation) {
			try {
				var sStatnId = sStation.STNSID;
				var sStnmId = sStation.STNMID;
				var oParameter = {};
				// oParameter.filter = "refid eq '" + this.getAircraftId() + "' and stnsid eq '" + sStatnId + "' and adpflag eq 'X'";
				oParameter.filter = "tailid eq " + this.getTailId() + " and stnsid eq " + sStatnId + " and adpflag eq A and stnmid eq " +
					sStnmId; // + "'";
				oParameter.error = function() {};
				oParameter.success = function(sStns, oData) {
					sStns.adapter = oData.results;
					sStns.selADP = oData.results.length > 0 ? oData.results[0] : "";
					this.fnCheckForImpulsCart(sStns);
					this.fnSetArrowColor(sStns.CONECT === "C");
					//sStns.selADP.POT &&  ||  sStns.selWpn.POT !== "T"
					if (sStns.selADP !== "" && (sStns.selADP.POT !== "T")) {
						this.fnLoadMissile(sStns);
					}
					this.getModel("configModel").refresh();
				}.bind(this, sStation);
				ajaxutil.fnRead(this.getResourceBundle().getText("WEAPONSERNRSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadAdapter function");
			}
		},

		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		fnLoadMissile: function(sStatation) {
			try {
				var sAdapId = sStatation.selADP.ADPID ? sStatation.selADP.ADPID : sStatation.selADP.selWpn.ADPID;
				var sDDID = sStatation.selADP.STNSID ? sStatation.selADP.STNSID : sStatation.selADP.selWpn.STNSID;
				var sSUBID = sStatation.selADP.STNMID ? sStatation.selADP.STNMID : sStatation.selADP.selWpn.STNMID;
				var oParameter = {};
				oParameter.filter = "stnsid eq " + sDDID + " and stnmid eq " + sSUBID + " and ADPID eq " + sAdapId + " and airid eq " +
					this.getAircraftId() + " and ADPFLAG eq W";
				// oParameter.filter = "tailid eq '" + this.getTailId() + "' and adpid eq '" + sAdapId + "'";
				oParameter.error = function() {};
				oParameter.success = function(sStns, oData) {
					sStns.selADP.wpn = oData.results;
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].WEMID === sStns.WEMID && oData.results[i].WESID === sStns.WESID) {
							oData.results[i].WESDESC = sStns.WESDESC;
							oData.results[i].CONECT = sStns.CONECT;
							sStns.selADP.selWpn = oData.results[i];
							// sStns.selADP.selWpn.WEDESC = sStns.WEDESC;
							this.fnSetArrowColor(oData.results[i].CONECT === "C");
							this.fnLoadSerialNumber(sStns);
							break;
						}
					}
					this.getModel("configModel").refresh();
				}.bind(this, sStatation);
				ajaxutil.fnRead(this.getResourceBundle().getText("WEAPONSERNRSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadMissile function");
			}
		},

		fnLoadSerialNumber: function(sStation) {
			var sStatnId = sStation.STNSID;
			var sStnmId = sStation.STNMID;
			var sAdpid = sStation.ADPID;

			var oParameter = {};
			// oParameter.filter = "refid eq '" + this.getAircraftId() + "' and stnsid eq '" + sStatnId + "' and adpflag eq 'X'";
			oParameter.filter = "tailid eq " + this.getTailId() + " and stnmid eq " + sStnmId + " and stnsid eq " + sStatnId +
				" and adpflag eq S" + " and adpid eq " + sAdpid;
			oParameter.error = function() {};
			oParameter.success = function(sStns, oData) {
				var sSerlNo = this.fnCreateSerialNo(oData);
				sStns.selADP.selWpn.srcount = sSerlNo.length;
				sStns.selADP.selWpn.serialNos = sSerlNo;
				sStns.selADP.selWpn.cserialNos = sSerlNo;
				this.getModel("configModel").refresh();
			}.bind(this, sStation);
			ajaxutil.fnRead(this.getResourceBundle().getText("WEAPONSERNRSVC"), oParameter);
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

		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		fnCreateMissileSerialNumber: function(oPayloads) {
			try {
				var oParameter = {};
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					this.onNavBack();
				}.bind(this);
				ajaxutil.fnCreate(this.getResourceBundle().getText("WEAPONSERNRSVC"), oParameter, oPayloads);
			} catch (e) {
				Log.error("Exception in fnCreateMissileSerialNumber function");
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		fnSetArrowColor: function(isConnected) {
			try {
				this.getView().byId("ptUpArrowId")._cssFillColor = (isConnected ? "Blue" : "Blue");
				this.getView().byId("ptDownArrowId")._cssFillColor = (isConnected ? "Blue" : "Blue");
			} catch (e) {
				Log.error("Exception in fnSetArrowColor function");
			}
		},

		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		fnCheckForImpulsCart: function(sStns) {
			try {
				var sAdapterList = sStns.adapter;
				if (sAdapterList.length === 0) {
					return;
				}
				// if (sAdapterList[0].ICART === "X") {
				if (sAdapterList[0].POT === "T") {
					var sWep = sAdapterList[0];
					sStns.selADP = sAdapterList[1] === undefined ? {} : sAdapterList[1];
					sWep.CONTOR = sWep.ICART === "X" ? "C" : "N";
					sStns.selADP.selWpn = sWep;
					sStns.selADP.selWpn.CONECT = sStns.CONECT;
					sAdapterList.splice(0, 1);
					sStns.adapter = sAdapterList;
				}
			} catch (e) {
				Log.error("Exception in fnCheckForImpulsCart function");
			}
		},

		fnValidOther: function() {
			var sMsg = "";
			this.getModel("configModel").getProperty("/stns").forEach(function(oItem) {
				if (oItem.STNMID === "STNM_O" && oItem.STNSID !== "STNS_102") {
					var sQty = parseInt(oItem.TOTQTY);
					if (isNaN(sQty) || sQty > oItem.MAX) {
						sMsg = "Invalid value for " + oItem.L_TXT;
					}
				}
			});
			return sMsg;
		},

		// CNL = Cancel , OK = SAVE , OPN = OPEN
		// fnOpenCloseConfirmationDialog($event,'OPN') 
		fnOpenCloseConfirmationDialog: function(oEvent, opType) {
			try {
				var sOpenFrag = "FOToolsCheck";
				var oDialog = null;
				var oDialogData = {
					TLSERNR: "",
					SIGNOFF: false,
					ISSERIAL: true
				};
				var sApprCount = this.getModel("configModel").getProperty("/stns/0/APPRCOUNT");
				switch (sApprCount) {
					case 1:
						sOpenFrag = "FOToolsCheck";
						oDialogData.TLSERNR = this.getModel("configModel").getProperty("/stns/0/TLSERNR");
						oDialogData.ISSERIAL = true;
						this.getModel("configModel").setProperty("/rl", "ZRM_FS_WCT");
						
						break;
				}
				if (opType === "OPN") {
					oDialog = this.openDialog(sOpenFrag, ".fragments.fs.wlc.");
					oDialog.setModel(new JSONModel(oDialogData), "oDialogModel");
					var sFlag = oDialogData.TLSERNR.length > 0;
					oDialog.getButtons()[1].setEnabled(sFlag);
				
				}
				if (opType === "CNL") {
					oDialog = this.closeDialog(sOpenFrag, ".fragments.wlc.");
				}
				if (opType === "OK") {
					oDialog = this.closeDialog(sOpenFrag, ".fragments.wlc.");
					this.getModel("configModel").setProperty("/stns/0/TLSERNR", oDialog.getModel("oDialogModel").getProperty("/TLSERNR"));
					this.getModel("configModel").refresh();
					this.onStationToolChkSignOff();
				}
			} catch (e) {
				Log.error("Exception in fnOpenCloseConfirmationDialog function");
			}

		},

		onSLNoLiveChange1: function(oEvent) {
			var sFlag = oEvent.getSource().getValue().length > 0;
			oEvent.getSource().getParent().getParent().getParent().getParent().getButtons()[1].setEnabled(sFlag);
		},
		onSLNoLiveChange: function(oEvent) {
			var sFlag = oEvent.getSource().getValue().length > 0;
			oEvent.getSource().getParent().getParent().getParent().getButtons()[1].setEnabled(sFlag);
		},
		onSelectedToolChk: function(oEvent) {
			if (oEvent.getSource().getSelected()) {
				oEvent.getSource().getModel("oDialogModel").setProperty("/SIGNOFF", false);
				oEvent.getSource().getModel("oDialogModel").refresh();
				return;
			}
			oEvent.getSource().getModel("oDialogModel").setProperty("/TLSERNR", "");
			oEvent.getSource().getModel("oDialogModel").setProperty("/SIGNOFF", true);
			oEvent.getSource().getModel("oDialogModel").refresh();
		},
		
		fnOnValidate:function(){
			var sPath = this.getModel("configModel").getProperty("/path");
			if(sPath){
				return false;
			}
			return true;
		},
		_fnCreateEmptyPayloadSignOff: function() {
			var srno = this.getModel("configModel").getProperty("/stns/0/TLSERNR");
			var oPayloads = [{
				"airid": this.getAircraftId(),
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
				"endda": null,
				"begda": null,
				"TOTQTY": null,
				"CONECT": null,
				"HCFLAG": null,
				"STEPID": this.getModel("configModel").getProperty("/stepid"),
				"EXPAND": null,
				"TLSERNR": srno !== '' ? srno : '',
				"APPRCOUNT": 0,
				"ttlrnd": null,
				"ISPOST": null,
				// WEDESC = null;
				// WEMDESC : null,
				// WESDESC : null,
				TSTAT: 1,
				TSIGN: null,
				// L_TXT : oItem.L_TXT,
				S_TXT: null,
				QTYADD: null,
				MAX: null,
				// ISPOST: null,
				EFLAG: ""
			}];
			return oPayloads;
		}

	});

});