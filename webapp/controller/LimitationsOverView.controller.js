sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAJAT GUPTA 
	 *   Control name: LimitationsOverView        
	 *   Purpose :Limitations overview functionality
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
	return BaseController.extend("avmet.ah.controller.LimitationsOverView", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		onInit: function() {
			try {

				var oAppModel = dataUtil.createNewJsonModel();
				this.sRootPath = jQuery.sap.getModulePath("avmet.ah");
				oAppModel.setData({
					"Top": [],
					"Front": [],
					"Left": [],
					"Right": []
				});
				this.getView().setModel(oAppModel, "appModel");
				this.getRouter().getRoute("LimitationsOverView").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:onInit function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		onMangeAdd: function(oEvent) {
			try {

				var oButton = oEvent.getSource();
				// create popover
				if (!this._oPopover) {
					Fragment.load({
						id: "popoverNavCon",
						name: "avmet.ah.view.ah.limitations.ManageAdd",
						controller: this
					}).then(function(oPopover) {
						this._oPopover = oPopover;
						this.getView().addDependent(this._oPopover);
						this._oPopover.openBy(oButton);
					}.bind(this));
				} else {
					this._oPopover.openBy(oButton);
				}
			} catch (e) {
				Log.error("Exception in LimitationsOverView:onMangeAdd function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		onOpenMangeLimitaionDialog: function(oEvent) {
			try {

				var that = this,
					oViewModel = this.getView().getModel("ViewModel");

				if (!this._oAddLim) {
					this._oManageLim = sap.ui.xmlfragment(this.createId("idWorkCenterDialog"),
						"avmet.ah.fragments.ManageLimitation",
						this);
					this.getView().addDependent(this._oManageLim);
				}
				this._fnCAPDataGet("O", oViewModel.getProperty("/JOB"), oViewModel.getProperty("/CAPID"));
				oViewModel.setProperty("/dialogTitle", this.getView().byId("OBId").getTitle());
				oViewModel.setProperty("/editableFlag", false);
				oViewModel.updateBindings(true);
				var sAirId = this.getAircraftId();
				this._fnPerioOfDeferCBGet(sAirId);
				this._fnReasonforADDGet(sAirId);
				this._fnUtilizationGet(sAirId);
				this._fnGetUtilisationDefaultVal(sAirId);
				this._fnUtilization2Get();
			} catch (e) {
				Log.error("Exception in LimitationsOverView:onOpenMangeLimitaionDialog function");
				this.handleException(e);
			}
		},

		onCloseMangeLimitaionDialog: function() {
			try {

				if (this._oManageLim) {
					this._oManageLim.close(this);
					this._oManageLim.destroy();
					delete this._oManageLim;
				}
			} catch (e) {
				Log.error("Exception in LimitationsOverView:onCloseMangeLimitaionDialog function");
				this.handleException(e);
			}
		},

		/* Function: onSelectionDefectAreaChange
		 * Parameter: sKey
		 * Description: To select Defected area image.
		 */
		onSelectionDefectAreaChange: function(sKey, sX, sY) {
			try {

				var that = this,
					sImagePath;

				switch (sKey) {
					case "DEA_T":
						sImagePath = this.sRootPath + "/css/img/AH/AH-Top.png";
						this.getView().byId("CanvasOverId").setVisible(true);
						break;
					case "DEA_F":
						sImagePath = this.sRootPath + "/css/img/AH/AH-Front.png";
						this.getView().byId("CanvasOverId").setVisible(true);
						break;
					case "DEA_l":
						sImagePath = this.sRootPath + "/css/img/AH/AH-Left.png";
						this.getView().byId("CanvasOverId").setVisible(true);
						break;
					case "DEA_R":
						sImagePath = this.sRootPath + "/css/img/AH/AH-Right.png";
						this.getView().byId("CanvasOverId").setVisible(true);
						break;
				}
				setTimeout(function demo() {
					that._fnRenderImage(sImagePath);
					that.drawCoordinates(sKey, sX, sY);
				}, 500);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:onSelectionDefectAreaChange function");
				this.handleException(e);
			}
		},

		/* Function: _fnRenderImage
		 * Parameter: sImagePath, sSelectedKey, oCanvas
		 * Description: To render images in to canvas on segment button selections.
		 */

		_fnRenderImage: function(sImagePath) {
			try {

				var that = this,
					oCanvas;
				oCanvas = document.getElementById("myCanvasOverTop");
				if (oCanvas) {
					var ctx = oCanvas.getContext("2d");
					oCanvas.style.backgroundImage = "url('" + sImagePath + "')";
					oCanvas.style.backgroundRepeat = "no-repeat";
					oCanvas.style.backgroundSize = "100%";
				}

			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnRenderImage function");
				this.handleException(e);
			}
		},

		/* Function: drawCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: To draw coordinates on canvas image.
		 */

		drawCoordinates: function(sDaid, sX, sY) {
			try {

				var oCanvas = document.getElementById("myCanvasOverTop");
				if (oCanvas) {
					var ctx = oCanvas.getContext("2d");
					var grd = ctx.createLinearGradient(0, 0, 170, 0);
					grd.addColorStop(1, "red");
					ctx.fillStyle = "red"; // Red color
					ctx.strokeStyle = "black";
					ctx.font = "15px Arial";
					ctx.beginPath();
					ctx.arc(Number(sX), Number(sY), 10, 0, 2 * Math.PI);
					ctx.fill();
				}

			} catch (e) {
				Log.error("Exception in LimitationsOverView:drawCoordinates function");
				this.handleException(e);
			}
		},

		onUpdateADD: function() {
			try {
				var oModel = this.getView().getModel("CapExtendSet");
				if (oModel.getProperty("/PAST_COUNT") >= "8" && oModel.getProperty("/PAST_COUNT") !== "_") {
					this.onGetRemarkDialog();
				} else {
					this.CAPDataUpdate();
				}
			} catch (e) {
				Log.error("Exception in CapExtendSet function");
			}
		},
		onSaveRemark: function() {
			this.onCloseGetRemarkDialog();
			this.CAPDataUpdate();
		},

		//-------------------------------------------------------------------------------------
		//  Private method: This will get called,to open Limitation dialog.
		// Table: 
		//--------------------------------------------------------------------------------------
		onGetRemarkDialog: function(oEvent) {
			try {
				var that = this,
					oModel;
				oModel = this.getView().getModel("CapExtendSet");
				if (!this._oAddGetRemark) {
					this._oAddGetRemark = sap.ui.xmlfragment(this.createId("idRemarksDialog"),
						"avmet.ah.fragments.RemarksDialog",
						this);
					this.getView().addDependent(this._oAddGetRemark);
				}
				that._oAddGetRemark.setModel(oModel, "ADDSet");
				this._oAddGetRemark.open(this);
			} catch (e) {
				Log.error("Exception in onGetRemarkDialog function");
			}
		},
		//-------------------------------------------------------------------------------------
		//  Private method: This will get called,to close Limitation dialog.
		// Table: 
		//--------------------------------------------------------------------------------------
		onCloseGetRemarkDialog: function() {
			try {
				if (this._oAddGetRemark) {
					this._oAddGetRemark.close(this);
					this._oAddGetRemark.destroy();
					delete this._oAddGetRemark;
				}
			} catch (e) {
				Log.error("Exception in onCloseAddLimDialog function");
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {

				var oViewModel = dataUtil.createNewJsonModel(),
					oDate = new Date();
				var sCAP = oEvent.getParameters().arguments.CAP;
				var sJob = oEvent.getParameters().arguments.JOB;
				var sCAPTY = oEvent.getParameters().arguments.CAPTY;
				var sDEFID = oEvent.getParameters().arguments.DEFID;
				var sXMARK = oEvent.getParameters().arguments.XMARK;
				var sYMARK = oEvent.getParameters().arguments.YMARK;
				var sFLag = oEvent.getParameters().arguments.FLag;

				oViewModel.setData({
					CAPID: sCAP,
					JOB: sJob,
					Date: oDate,
					CAPTY: sCAPTY,
					DEFID: sDEFID,
					FLag: sFLag,
					Time: oDate.getHours() + ":" + oDate.getMinutes(),
					flag: oEvent.getParameters().arguments.flag,
					tableFlag: false,
					dialogTitle: "",
					DatePrev: null,
					btnText: "Extend"

				});
				var oCanvas = document.getElementById("myCanvasOverTop");
				if (oCanvas !== null) {
					var ctx = oCanvas.getContext('2d');
					ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
				}

				if (sDEFID !== null && sDEFID !== "") {
					this.onSelectionDefectAreaChange(sDEFID, sXMARK, sYMARK);
				}
				this.getView().setModel(oViewModel, "ViewModel");
				//this._fnADDCapDataGet(sCAP);
				this._fnADDCapDataGet("O", sJob, sCAP);
				//this._fnADDCapDataMultipleGet("E", sJob, sCAP);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_onObjectMatched function");
				this.handleException(e);
			}
		},

		_fnCAPDataGet: function(sFlag, sJobId, sCapId) {
			try {

				var that = this,
					oViewGBModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				var oViewModel = dataUtil.createNewJsonModel();
				oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						oData.results[0].EXPDT = new Date(oData.results[0].EXPDT);
						oData.results[0].EXPTM = formatter.defaultTimeFormatDisplay(oData.results[0].EXPTM);
						oViewGBModel.setProperty("/DatePrev", oData.results[0].EXPDT);
						oViewModel.setData(oData.results[0]);
						that.getView().setModel(oViewModel, "CapExtendSet");
						this._oManageLim.open(this);
					}

				}.bind(this);

				ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnCAPDataGet function");
				this.handleException(e);
			}
		},

		CAPDataUpdate: function() {
			try {

				var that = this,
					oPayload,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				oPayload = this.getView().getModel("CapExtendSet").getData();

				if (oPayload.PAST_COUNT === null || oPayload.PAST_COUNT === '' || oPayload.PAST_COUNT === '_') {
					oPayload.PAST_COUNT = "1";
				} else {
					oPayload.PAST_COUNT = (parseInt(oPayload.PAST_COUNT) + 1).toString();
				}
				if (oPayload.OPPR === 'U' || oPayload.OPPR === 'N') {
					oPayload.EXPDT = null;
					oPayload.EXPTM = null;
				}
				if (oPayload.UTILVL) {
					var iPrecision = formatter.JobDueDecimalPrecision(oPayload.UTIL1);
					oPayload.UTILVL = parseFloat(oPayload.UTILVL, [10]).toFixed(iPrecision);
				}
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this._fnADDCapDataMultipleGet("E", oModel.getProperty("/JOB"), oModel.getProperty("/CAPID"));
						this._fnADDCapDataGet("O", oModel.getProperty("/JOB"), oModel.getProperty("/CAPID"));
						this.onCloseMangeLimitaionDialog();
						this.getRouter().navTo("DashboardInitial");
					}
				}.bind(this);
				oPrmJobDue.activity = 2;
				ajaxutil.fnUpdate("/ADDOVERVIEWSvc", oPrmJobDue, [oPayload], "ZRM_ADDL", this);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:CAPDataUpdate function");
				this.handleException(e);
			}
		},

		onStartRect: function(sValue) {
			try {

				var that = this,
					oTempFlag,
					sjobid = "",
					oModel, oModels,
					oPayload;
				var dDate = new Date();

				var oParameter = {};
				oModel = this.getView().getModel("ViewModel");
				oModels = this.getView().getModel("CapSet");
				if (oModels.getProperty("/TASKID") !== "" && oModels.getProperty("/TASKID") !== null) {
					oTempFlag = "T";
				} else {
					oTempFlag = "J";
				}
				if (oModels) {
					oPayload = {
						"TAILID": oModels.getProperty("/TAILID"),
						"AIRID": null,
						"MODID": null,
						"JOBID": oModels.getProperty("/JOBID"),
						"CAPID": oModels.getProperty("/CAPID"),
						"TASKID": oModels.getProperty("/TASKID"),
						/*"TDESC": oModels.getProperty("/TDESC"),*/
						"CAPTY": oModels.getProperty("/CAPTY"),
						"CSTAT": null,
						"RECTUSR": "Test User",
						"RECTDTM": formatter.defaultOdataDateFormat(dDate),
						"RECTUZT": dDate.getHours() + ":" + dDate.getMinutes(),
						"FLAG": oTempFlag
					};
				}

				oParameter.error = function(response) {

				};

				oParameter.success = function(oData) {
					this.getRouter().navTo("DashboardInitial");
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnUpdate("/StartRectificSvc", oParameter, [oPayload], "ZRM_ADDL", this);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:onStartRect function");
				this.handleException(e);
			}
		},
		_fnADDCapDataGet: function(sFlag, sJobId, sCapId) {
			try {

				var that = this,
					oModel = this.getView().getModel("ViewModel"),
					oPrmJobDue = {};
				var oViewModel = dataUtil.createNewJsonModel();
				oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					/*if (oData.results[0].DEAID !== '' && oData.results[0].DEAID !== null) {
						this.onSelectionDefectAreaChange(oData.results[0].DEAID, oData.results[0].JOBID, oData.results[0].TAILID);

					}*/
					if (oData && oData.results.length > 0) {
						if (oData.results[0].EXTEND !== '' || oData.results[0].EXTEND !== null) {
							this._fnADDCapDataMultipleGet("E", sJobId, sCapId);
							oModel.setProperty("/tableFlag", true);
						}
						if (oData.results[0].CLFLAG === "1") {
							this.getView().byId("VBColorId").addStyleClass("vboxOrangebgColorr");
							this.getView().byId("VBColorId1").addStyleClass("vboxOrangebgColorr");
							this.getView().byId("VBColorIdCom1").addStyleClass("vboxOrangebgColorr");
							this.getView().byId("VBColorId").removeStyleClass("vbox6BgColor");
							this.getView().byId("VBColorId1").removeStyleClass("vbox6BgColor");
							this.getView().byId("VBColorIdCom1").removeStyleClass("vbox6BgColor");
						} else {
							this.getView().byId("VBColorId").addStyleClass("vbox6BgColor");
							this.getView().byId("VBColorId1").addStyleClass("vbox6BgColor");
							this.getView().byId("VBColorIdCom1").addStyleClass("vbox6BgColor");
							this.getView().byId("VBColorId").removeStyleClass("vboxOrangebgColorr");
							this.getView().byId("VBColorId1").removeStyleClass("vboxOrangebgColorr");
							this.getView().byId("VBColorIdCom1").removeStyleClass("vboxOrangebgColorr");
						}
						oViewModel.setData(oData.results[0]);
						that.getView().setModel(oViewModel, "CapSet");
					}
				}.bind(this);

				ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnADDCapDataGet function");
				this.handleException(e);
			}
		},

		_fnGetMark: function(sjobid, sTailId, sDeaId) {
			try {

				var oPrmMark = {},
					oModel,
					that = this,
					oPayload;
				oModel = that.getView().getModel("appModel").getData();
				oPrmMark.filter = "jobid eq " + sjobid;

				oPrmMark.error = function() {

				};

				oPrmMark.success = function(oData) {
					if (oData && oData.results.length > 0) {
						switch (sDeaId) {
							case "DEA_T":
								oModel.Top.push(oData.results[0]);
								break;
							case "DEA_F":
								oModel.Front.push(oData.results[0]);
								break;
							case "DEA_l":
								oModel.Left.push(oData.results[0]);
								break;
							case "DEA_R":
								oModel.Right.push(oData.results[0]);
								break;
						}
						that.drawCoordinates(sDeaId, oData.results[0]);
					}
				}.bind(this);

				ajaxutil.fnRead("/DefectMarkSvc", oPrmMark, oPayload);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnGetMark function");
				this.handleException(e);
			}
		},

		_fnADDCapDataMultipleGet: function(sFlag, sJobId, sCapId) {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				var oViewModel = dataUtil.createNewJsonModel();
				oPrmJobDue.filter = "FLAG EQ " + sFlag + " AND CAPID EQ " + sCapId + " AND JOBID EQ " + sJobId;
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						oViewModel.setData(oData.results);
						that.getView().setModel(oViewModel, "CapExtensionSet");
					}
				}.bind(this);

				ajaxutil.fnRead("/ADDOVERVIEWSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnADDCapDataMultipleGet function");
				this.handleException(e);
			}
		},

		_fnReasonforADDGet: function(sAirId) {
			try {

				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "airid eq " + sAirId + " and ddid eq CPR_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "ReasonforADDModel");
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnReasonforADDGet function");
				this.handleException(e);
			}
		},

		_fnPerioOfDeferCBGet: function(sAirId) {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "airid eq " + sAirId + " and ddid eq 118_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "PerioOfDeferCBModel");
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnPerioOfDeferCBGet function");
				this.handleException(e);
			}
		},
		_fnUtilizationGet: function(sAirId) {
			try {

				var that = this,
					oModel = this.getView().getModel("oViewModel"),
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + sAirId + " and ddid eq UTIL1_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "UtilizationCBModel");
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in LimitationsOverView:_fnUtilizationGet function");
				this.handleException(e);
			}
		},

		_fnUtilization2Get: function() {
			try {

				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "airid eq " + this.getAircraftId() + " and ddid eq UTIL2_";
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "Utilization2CBModel");
					}
				}.bind(this);

				ajaxutil.fnRead("/MasterDDVALSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in TrasnferToADD:_fnUtilization2Get function");
				this.handleException(e);
			}
		},

		_fnGetUtilisationDefaultVal: function(sAir) {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + sAir + " and JDUID eq UTIL";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObject = {};
						for (var i in oData.results) {
							this.oObject[oData.results[i].JDUID] = oData.results[i];
						}
						var oModel = this.getView().getModel("CapExtendSet");

						if (this.oObject && this.oObject[oModel.getProperty("/UTIL1")]) {
							var minVal = parseFloat(this.oObject[oModel.getProperty("/UTIL1")].VALUE, [10]);
							oModel.setProperty("/UTILMinVL", minVal);
						}

					}
				}.bind(this);

				ajaxutil.fnRead("/UtilisationDueSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnGetUtilisationDefaultVal function");
			}
		}

	});
});