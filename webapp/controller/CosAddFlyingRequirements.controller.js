sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../model/FieldValidations",
	"../util/ajaxutil",
	"../model/formatter",
	"sap/base/Log"
], function(BaseController, dataUtil, FieldValidations, ajaxutil, formatter, Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
	 *   Control name: CosAddFlyingRequirements        
	 *   Purpose : Add Flying requirements functionality
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onSignOffPress
	 *     2. Backend Calls
	 *        2.1 fnLogById
	 *     3. Private calls
	 *        3.1 _onObjectMatched
	 *        3.2 fnSetReason
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah..controller.CosAddFlyingRequirements", {
		formatter: formatter,
		onInit: function() {
			try {
				this.getRouter().getRoute("CosAddFlyingRequirements").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in CosAddFlyingRequirements:onInit function");
				this.handleException(e);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/* =========================================================== */
		/* Event Handlers                                              */
		/* =========================================================== */

		//showing the message text and validation of maxlength
		handleLiveChangeFlyingRequirements: function(oEvent) {
			try {
				var oSource = oEvent.getSource(),
					sValue = oSource.getValue(),
					iMaxLen = oSource.getMaxLength(),
					iLen = sValue.length;
				if (iLen && iMaxLen && iLen > iMaxLen) {
					sValue = sValue.substring(0, iMaxLen);
					oSource.setValue(sValue);
				}
			} catch (e) {
				Log.error("Exception in CosAddFlyingRequirements:handleLiveChangeFlyingRequirements function");
				this.handleException(e);
			}
		},

		onAddFlyingRequirements: function(oEvent) {
			try {
				var that = this,
					oView = that.getView(),
					oFLyReqModel = this.getView().getModel("FlyingRequirementsModel").getData(),
					oViewModel = this.getView().getModel("ViewModel"),
					dDate = oViewModel.getProperty("/dDate"),
					tTime = oViewModel.getProperty("/dDateTime"),
					sSR = "";
				sSR = (parseInt(oViewModel.getProperty("/SN")) + 1).toString();
				oViewModel.setProperty("/SN", sSR);

				oFLyReqModel.FlyingRequirements.push({
					"JOBID": oViewModel.getProperty("/JobId"),
					"TAILID": oViewModel.getProperty("/sTailId"),
					"FR_NO": null,
					"ENDDA": "99991231",
					"BEGDA": formatter.defaultOdataDateFormat(dDate),
					"WRCTR": oViewModel.getProperty("/sWorkKey"),
					"FR_DT": formatter.defaultOdataDateFormat(dDate),
					"FR_TM": tTime,
					"SGUSR": "Test User",
					"SGDTM": null,
					"SGUZT": null,
					"FRDESC": "",
					"FRRID": null,
					"RESDTM": null,
					"RESUZT": null,
					"RESUSR": null,
					"REASON": null,
					"SRVID": null
				});

				this.getView().getModel("FlyingRequirementsModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosAddFlyingRequirements:onAddFlyingRequirements function");
				this.handleException(e);
			}
		},

		onDeletePress: function(oEvent) {
			try {
				var sPath = oEvent.getParameter("listItem").getBindingContext("FlyingRequirementsModel").getPath().split("/")[2];
				var oModel = this.getView().getModel("FlyingRequirementsModel").getProperty("/FlyingRequirements");
				oModel.splice(sPath, 1);
				this.getView().getModel("FlyingRequirementsModel").refresh(true);
			} catch (e) {
				Log.error("Exception in CosAddFlyingRequirements:onDeletePress function");
				this.handleException(e);
			}
		},

		handleChange: function(oEvent) {
			try {
				FieldValidations.resetErrorStates(this);
			} catch (e) {
				Log.error("Exception in CosAddFlyingRequirements:handleChange function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				var that = this,
					sWrkCenter = oEvent.getParameters().arguments.WorkCenter === undefined ? null : oEvent.getParameters().arguments.WorkCenter,
					sJobId = oEvent.getParameters().arguments.JobId === undefined ? null : oEvent.getParameters().arguments.JobId,
					sAirId = oEvent.getParameters().arguments.AirId === undefined ? null : oEvent.getParameters().arguments.AirId,
					sTailId = oEvent.getParameters().arguments.TailId === undefined ? null : oEvent.getParameters().arguments.TailId,
					sWorkKey = oEvent.getParameters().arguments.WorkKey === undefined ? null : oEvent.getParameters().arguments.WorkKey,
					sFlag = oEvent.getParameters().arguments.Flag === undefined ? null : oEvent.getParameters().arguments.Flag,
					oViewModel = dataUtil.createNewJsonModel(),
					oDate = new Date(),
					oView = that.getView(),
					oFLyReqModel = dataUtil.createNewJsonModel();

				oViewModel.setData({
					"JobId": sJobId,
					"sAirId": sAirId,
					"sTailId": sTailId,
					"sWorkKey": sWorkKey,
					"WorkCenter": sWrkCenter,
					"sFlag": sFlag,
					"dDate": new Date(),
					"dDateTime": oDate.getHours() + ":" + oDate.getMinutes(),
					"SN": "1"

				});
				that.getView().setModel(oViewModel, "ViewModel");

				/*	oView.byId("DP1").setDateValue(oDate);
					oView.byId("TP1").setValue(oDate.getHours() + ":" + oDate.getMinutes());*/

				oFLyReqModel.setData({
					"FlyingRequirements": [{
						"JOBID": sJobId,
						"TAILID": sTailId,
						"FR_NO": "",
						"ENDDA": "99991231",
						"BEGDA": formatter.defaultOdataDateFormat(oDate),
						"WRCTR": sWorkKey,
						"FR_DT": formatter.defaultOdataDateFormat(oDate),
						"FR_TM": oDate.getHours() + ":" + oDate.getMinutes(),
						"SGUSR": "Test User",
						"SGDTM": null,
						"SGUZT": null,
						"FRDESC": "",
						"FRRID": null,
						"RESDTM": null,
						"RESUZT": null,
						"RESUSR": null,
						"REASON": null,
						"SRVID": null
					}]
				});
				that.getView().setModel(oFLyReqModel, "FlyingRequirementsModel");
				this._fnFlyingRequirementsGet(sJobId);
			} catch (e) {
				Log.error("Exception in _onObjectMatched function");
			}
		},

		_fnFlyingRequirementsGet: function(sJobId) {
			try {
				var that = this,
					oPrmFR = {};
				oPrmFR.filter = "jobid eq " + sJobId;
				oPrmFR.error = function() {

				};

				oPrmFR.success = function(oData) {
					this.getModel("FlyingRequirementsModel").getData().FlyingRequirements[0].FR_NO = (oData.results.length + 1).toString();
					this.getModel("ViewModel").setProperty("/SN", oData.results.length + 1);
				}.bind(this);

				ajaxutil.fnRead("/FlyingRequirementSvc", oPrmFR);
			} catch (e) {
				Log.error("Exception in CosAddFlyingRequirements:_fnFlyingRequirementsGet function");
				this.handleException(e);
			}
		},

		onSubmitFlyingRequirements: function() {
			try {
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				var oPrmFL = {},
					oDate = new Date(),
					oModel = this.getView().getModel("ViewModel"),
					oPayload = [],
					oTemp = this.getView().getModel("FlyingRequirementsModel").getData(),
					that = this;
					if (oTemp.FlyingRequirements.length < 1) {
						sap.m.MessageBox.error("Please add flying requirement to proceed");
						return;
					}
					var dDate = oModel.getProperty("/dDate"),
					tTime = oModel.getProperty("/dDateTime");
				for (var i = 0; i < oTemp.FlyingRequirements.length; i++) {
					oTemp.FlyingRequirements[i].SGDTM = formatter.defaultOdataDateFormat(oDate);
					oTemp.FlyingRequirements[i].SGUZT = oDate.getHours() + ":" + oDate.getMinutes();
					oTemp.FlyingRequirements[i].FR_DT = formatter.defaultOdataDateFormat(dDate);
					oTemp.FlyingRequirements[i].FR_TM = tTime;
					oPayload.push(oTemp.FlyingRequirements[i]);
				}
				oPrmFL.error = function() {

				};

				oPrmFL.success = function(oData) {
					if (oModel.getProperty("/sFlag") === "Y") {
						this.getRouter().navTo("CosDefectsSummary", {
							"JobId": oModel.getProperty("/JobId"),
							"Flag": "Y",
							"WcKey": oModel.getProperty("/sWorkKey"),
							"goTo": "FR"
						},true);
					} else {
						this.getRouter().navTo("FlyingRequirements");
					}
				}.bind(this);
				oPrmFL.activity = 1;
				ajaxutil.fnCreate("/FlyingRequirementSvc", oPrmFL, oPayload, "dummy", this);
			} catch (e) {
				Log.error("Exception in CosAddFlyingRequirements:onSubmitFlyingRequirements function");
				this.handleException(e);
			}
		}

	});
});