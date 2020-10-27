sap.ui.define([
	"./BaseController",
	"../model/dataUtil",
	"../model/FieldValidations",
	"../model/AvMetInitialRecord",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log"
], function(BaseController, dataUtil, FieldValidations, AvMetInitialRecord, formatter, ajaxutil, Log) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : RAHUL THORAT  Change
	 *   Control name: Create Job        
	 *   Purpose : Create new Jobs
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onExit
	 *     2. Backend Calls
	 *        2.1 onCreateJob
	 2.2 _fnUpdateJob
	 2.3 _fnCreateMark
	 2.4 _fnUpdateMark
	 2.5 _fnGetMark
	 2.6 _fnPhotoUploadGet
	 2.7 _fnJobDueGet
	 2.8 _fnFoundDuringGet
	 2.9 _fnWorkCenterGet
	 2.10 _fnPhotoUploadCreate
	 2.11 _fnDefectWorkCenterCreate
	 2.12 _fnDefectWorkCenterUpdate
	 2.13 _fnJobDetailsGet
	 *     3. Private calls
	 *        3.1 getPointPosition
	 *        3.2 handleLiveChangeRemarks
	          3.3 onSelectionNatureofJobChange
	          3.4 onSelectionDefectAreaChange
	          3.5 _fnRestMarkArea
	          3.6 onAddDefectImage
	          3.7 onDueSelectChange
	          3.8 onSymbolChange
	          3.9 onFoundDuringChange
	          3.10 onWorkCenterChange
	          3.11 onAddMinusPress
	          3.12 onScheduledJobDescChange
	          3.13 _fnRenderImage
	          3.14 drawCoordinates
	          3.15 drawTextAlongArc
	          3.16 removeCoordinates
	          3.17 onRefresh
	          3.18 _handleRouteMatched
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.CosCreateJob", {
		formatter: formatter,
		//*************************************************************************************************************
		//           1. UI Events
		//*************************************************************************************************************

		/* Function: onInit
		 * Parameter: NA 
		 * Description: Internal method to initialize View dataUtil .
		 */
		onInit: function() {
			try {
				var that = this;
				window.onbeforeunload = function() {
					that._fnDeleteUnusedDocs();
				};

				window.onhashchange = function() {
					that._fnDeleteUnusedDocs();
				};
				this.getRouter().getRoute("CosCreateJob").attachPatternMatched(this._handleRouteMatched, this);
			} catch (e) {
				Log.error("Exception in CosCreateJob:onInit function");
				this.handleException(e);
			}
		},
		/* Function: onAfterRendering
		 * Parameter
		 * Description: TO Display Defected area segment button initially (01).
		 */
		onExit: function() {
			window.location.reload(); // Reason for this code????????????
		},

		handleChangeSche: function(oEvent) {
			var aData = this.getModel("appModel").getData();
			this.getView().getModel("oViewCreateModel").setProperty("/jduvl", oEvent.getSource().getDateValue());
			//return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorUpdateJobPast", "errorCreateJobFuture", aData.backDt, aData.backTm);
		},

		handleChange: function() {
			var aData = this.getModel("appModel").getData();
			return formatter.validDateTimeChecker(this, "DP1", "TP1", "errorUpdateJobPast", "errorCreateJobFuture", aData.backDt, aData.backTm);
		},

		onTypeMissmatch: function(oEvent) {
			sap.m.MessageBox.error("Selected file type not allowed");
		},

		onFileSizeExceed: function() {
			sap.m.MessageBox.error("File size exceeded maximum allowed file size 5 MB");
		},

		//------------------------------------------------------------------
		// Function: onNavBackJob
		// Parameter: oEvt
		// Description: To nav back and Delete uploaded images.
		//------------------------------------------------------------------
		onNavBackJob: function(oEvent) {
			try {
				this._fnDeleteUnusedDocs();
				this.onNavBack(oEvent);
			} catch (e) {
				Log.error("Exception in onNavBackJob function");
			}
		},

		/* Function: getPointPosition
		 * Parameter: oEvent, oCanvas
		 * Description: To get cordinates of the X and Y on click event of canvas.
		 */

		getPointPosition: function(oEvent, oCanvas) {
			try {

				var that = this,
					oTemp, sNewChar,
					oFlagTurn = true,
					oModel, oAppModel,
					canvas, curOffsetX = 0,
					oModelMain = this.getView().getModel("oViewCreateModel"),
					curOffsetY = 0;
				var oModel = that.getView().getModel("appModel").getData();
				var dDate = new Date();
				oModelMain.setProperty("/mark", 1);
				oModelMain.setProperty("/deaid", oModel.SelectedKey);

				if (oModel.DefectNameChar === "") {
					oModel.DefectNameChar = "A";
					sNewChar = oModel.DefectNameChar;
				} else {
					sNewChar = String.fromCharCode(oModel.DefectNameChar.charCodeAt() + 1);
				}
				switch (oModel.SelectedKey) {
					case "DEA_T":
						oAppModel = oModel.Top;
						oModel.Front = [];
						oModel.Left = [];
						oModel.Right = [];
						break;
					case "DEA_F":
						oAppModel = oModel.Front;
						oModel.Top = [];
						oModel.Left = [];
						oModel.Right = [];
						break;
					case "DEA_l":
						oAppModel = oModel.Left;
						oModel.Top = [];
						oModel.Front = [];
						oModel.Right = [];
						break;
					case "DEA_R":
						oAppModel = oModel.Right;
						oModel.Top = [];
						oModel.Front = [];
						oModel.Left = [];
						break;
				}
				var ctx = oCanvas.getContext("2d");
				curOffsetX = oEvent.offsetX;
				curOffsetY = oEvent.offsetY;
				if (oAppModel.length < 1) {
					oAppModel.push({
						"jobid": "",
						"tailid": oModel.sTailId,
						"deadid": oModel.SelectedKey,
						"num2": (parseInt(oAppModel.length) + 1).toString(),
						"endda": "99991231",
						"begda": formatter.defaultOdataDateFormat(dDate),
						"name": sNewChar,
						"xaxis": oEvent.offsetX,
						"yaxis": oEvent.offsetY
					});
					oModel.XCor = oEvent.offsetX;
					oModel.YCor = oEvent.offsetY;
					this.drawCoordinates(curOffsetX, curOffsetY, oCanvas);
				}
			} catch (e) {
				Log.error("Exception in CosCreateJob:getPointPosition function");
				this.handleException(e);
			}
		},

		/* Function: handleLiveChangeRemarks
		 * Parameter: oEvent
		 * Description: To showing the message text and validation of maxlength
		 */
		handleLiveChangeRemarks: function(oEvent) {
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
				Log.error("Exception in CosCreateJob:handleLiveChangeRemarks function");
				this.handleException(e);
			}
		},

		/* Function: onSelectionNatureofJobChange
		 * Parameter: sValue
		 * Description: To select Nature of Job segments.
		 */
		onSelectionNatureofJobChange: function(oEvent, sValue) {
			try {

				var oSegmentedButton, oSelectedItemId, that = this,
					oModel = this.getView().getModel("oViewCreateModel"),
					oAppModel = that.getView().getModel("appModel");
				oSegmentedButton = this.byId('SB1');
				oSelectedItemId = oSegmentedButton.getSelectedKey();
				oModel.setProperty("/jobty", oSelectedItemId);
				if (oEvent) {
					this._fnSetInitialModel();
					oModel.setProperty("/jobty", oSelectedItemId);
					this.onRefersh();
				}
				switch (oSelectedItemId) {
					case "D":
						that.getView().byId("defectId").setVisible(true);
						that.getView().byId("scheduledId").setVisible(false);
						that.getView().byId("unscheduledId").setVisible(false);
						that.getView().getModel("appModel").setProperty("/visibleDefect", true);
						oModel.setProperty("/jobty", oSelectedItemId);
						if (typeof sValue === "string") {
							that.onSelectionDefectAreaChange("X", sValue);
						} else {
							that.onSelectionDefectAreaChange("X", "DEA_T");
						}
						break;
					case "S":
						that.getView().byId("scheduledId").setVisible(true);
						that.getView().byId("defectId").setVisible(false);
						that.getView().byId("unscheduledId").setVisible(false);
						break;
					case "U":
						that.getView().byId("unscheduledId").setVisible(true);
						that.getView().byId("defectId").setVisible(false);
						that.getView().byId("scheduledId").setVisible(false);
						break;
				}
				FieldValidations.resetErrorStates(this);
			} catch (e) {
				Log.error("Exception in CosCreateJob:onSelectionNatureofJobChange function");
				this.handleException(e);
			}
		},

		/* Function: onSelectionDefectAreaChange
		 * Parameter: sKey
		 * Description: To select Defected area image.
		 */
		onSelectionDefectAreaChange: function(oEvent, sKey) {
			try {

				var oSegmentedButton, oSelectedItemId, that = this,
					sRootPath, sImagePath, oCanvas,
					oModel = this.getView().getModel("oViewCreateModel");
				sRootPath = jQuery.sap.getModulePath("avmet.ah");
				oSegmentedButton = this.byId("sbDfArea");
				var oAppModel = that.getView().getModel("appModel");
				var sType = "Top";
				if (sKey !== undefined) {
					oSelectedItemId = sKey;
				} else {
					oSelectedItemId = oSegmentedButton.getSelectedKey();
				}
				oModel.setProperty("/deadid", oSelectedItemId);
				oCanvas = document.getElementById("myCanvasTopDefect");

				//that._fnRestMarkArea();
				that.removeCoordinates(oAppModel.getProperty("/XCor"), oAppModel.getProperty("/YCor"), oCanvas);

				switch (oSelectedItemId) {
					case "DEA_T":
						sImagePath = sRootPath + "/css/img/AH/AH-Top.png";
						oSegmentedButton.setSelectedKey(sKey);
						this.getView().byId("topId").setVisible(true);
						oAppModel.setProperty("/SelectedKey", oSelectedItemId);
						sType = "Top";
						break;
					case "DEA_F":
						sImagePath = sRootPath + "/css/img/AH/AH-Front.png";
						this.getView().byId("topId").setVisible(true);
						oAppModel.setProperty("/SelectedKey", oSelectedItemId);
						sType = "Front";
						break;
					case "DEA_l":
						sImagePath = sRootPath + "/css/img/AH/AH-Left.png";
						this.getView().byId("topId").setVisible(true);
						oAppModel.setProperty("/SelectedKey", oSelectedItemId);
						sType = "Left";
						break;
					case "DEA_R":
						sImagePath = sRootPath + "/css/img/AH/AH-Right.png";
						this.getView().byId("topId").setVisible(true);
						oAppModel.setProperty("/SelectedKey", oSelectedItemId);
						sType = "Right";
						break;
				}

				// if (oAppModel.getProperty("/oFlagEdit")) {
				// 	that.onRefersh();
				// }
				setTimeout(function demo() {
					that._fnRenderImage(sImagePath, oCanvas);
				}, 500);
				var coordinates = oAppModel.getProperty("/" + sType);
				if (coordinates && coordinates.length > 0) {
					setTimeout(function demo() {
						that.drawCoordinates(coordinates[0].xaxis, coordinates[0].yaxis);
					}, 600);
				}
			} catch (e) {
				Log.error("Exception in CosCreateJob:onSelectionDefectAreaChange function");
				this.handleException(e);
			}
		},

		_fnRestMarkArea: function() {
			try {
				var oAppModel = this.getView().getModel("appModel").getData();
				oAppModel.Top = [];
				oAppModel.Front = [];
				oAppModel.Left = [];
				oAppModel.Right = [];
				this.getView().getModel("appModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnRestMarkArea function");
				this.handleException(e);
			}
		},

		/* Function: onAddDefectImage
		 * Parameter: oEvt
		 * Description: To show upoaded photo of defect on screen.
		 */

		onAddDefectImage: function(oEvt) {
			try {
				var oFiles = oEvt.getParameter("files"),
					oPrmPhoto = {},
					that = this,
					oModel = this.getView().getModel("oViewCreateModel");
				var oAppModel = this.getView().getModel("appModel");
				var sDefectImageSrc = [];
				oModel.setProperty("/photo", 1);
				if (oFiles && oFiles[0]) {
					this.getView().byId("photoUpload").setBusy(true);
					var fileReader = new FileReader();
					fileReader.readAsDataURL(oFiles[0]);
					var bFlag = false;
					fileReader.onloadend = function(e) {
						var src = e.target.result;
						bFlag = dataUtil._fileMimeVerification(e);
						if (bFlag) {
							sDefectImageSrc.push({
								"docid": "",
								"jobid": "",
								"tailid": oAppModel.getProperty("/sTailId"),
								"fname": oFiles[0].name,
								"dvalue": src,
								"flag": "",
								"rawbase": "",
								"DOCREFID": that.docRefId === undefined ? "" : that.docRefId
							});
							oPrmPhoto.filter = "";
							oPrmPhoto.error = function(Response) {
								that.getView().byId("photoUpload").setBusy(false);
							};
							oPrmPhoto.success = function(oData) {
								that.getView().byId("photoUpload").setBusy(false);
								that.docRefId = oData.results[0].DOCREFID;
								that._fnPhotoUploadGet(that.docRefId);
							}.bind(this);
							ajaxutil.fnCreate("/DefectPhotosSvc", oPrmPhoto, sDefectImageSrc);
						} else {
							that.onTypeMissmatch();
							that.getView().byId("photoUpload").setBusy(false);
							if (that.docRefId) {
								that.getView().byId("photoUpload").setBusy(false);
								that._fnPhotoUploadGet(that.docRefId);
							} else {
								oAppModel.setProperty("/DefectImageSrc", []);
								oAppModel.refresh(true);
							}
						}
						that.getView().byId("photoUpload").setBusy(false);
					};
				}
			} catch (e) {
				this.getView().byId("photoUpload").setBusy(false);
				Log.error("Exception in onAddDefectImage function");
			}
		},

		onUploadedImagePress: function(oEvent) {
			try {
				var obj = oEvent.getSource().getBindingContext("appModel").getObject();
				this.getView().byId("fbImageId").setVisible(true);
				this.getView().byId("iImageTicket").setSrc(obj.RAWBASE);
			} catch (e) {
				Log.error("Exception in onUploadedImagePress function");
			}
		},

		/* Function: onDueSelectChange
		 * Parameter: oEvent
		 * Description: To  sheduled defect on change of due type.
		 */
		onDueSelectChange: function(oEvent) {
			try {
				var sDue = oEvent.getSource().getSelectedKey();
				var oModel = this.getView().getModel("oViewCreateModel");
				this.getView().byId("SchJobDueId").setVisible(true);
				oModel.setProperty("/jduid", sDue);
				if (sDue.length > 0) {
					if (this.oObject && this.oObject[sDue] && this.oObject[sDue].VALUE) {
						var minVal = parseFloat(this.oObject[sDue].VALUE, [10]);
						oModel.setProperty("/minValue", minVal);
						var sVal = oModel.getProperty("/jduvl") ? oModel.getProperty("/jduvl") : 0;
						sVal = parseFloat(sVal, [10]);
						var iPrec = formatter.JobDueDecimalPrecision(sDue);
						oModel.setProperty("/jduvl", parseFloat(minVal, [10]).toFixed(iPrec));

					}

				}
				oModel.updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCreateJob:onDueSelectChange function");
				this.handleException(e);
			}
		},

		/* Function: onSymbolChange
		 * Parameter: oEvent
		 * Description: To select symbol.
		 */
		onSymbolChange: function(sValue, oEvent) {
			try {
				var sSelectKey = oEvent.getSource().getSelectedKey();
				var oModel = this.getView().getModel("oViewCreateModel");
				if (sValue === "DEF") {
					oModel.setProperty("/symbol", sSelectKey);
				} else {
					oModel.setProperty("/symbol", sSelectKey);
				}
				this.getView().getModel("oViewCreateModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCreateJob:onSymbolChange function");
				this.handleException(e);
			}
		},

		/* Function: onDefectFoundDuringChange
		 * Parameter: oEvent
		 * Description: To select Found During.
		 */
		onFoundDuringChange: function(sValue, oEvent) {
			try {
				var sSelectKey = oEvent.getSource().getSelectedKey();
				var oModel = this.getView().getModel("oViewCreateModel");
				if (sValue === "DEF") {
					oModel.setProperty("/fndid", sSelectKey);
				} else {
					oModel.setProperty("/fndid", sSelectKey);
				}
				this.getView().getModel("oViewCreateModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCreateJob:onFoundDuringChange function");
				this.handleException(e);
			}
		},

		/* Function: onWorkCenterChange
		 * Parameter: oEvent
		 * Description: To select Work center.
		 */
		// onWorkCenterChange: function(sValue, oEvent) {
		// 	try {
		// 		var sSelectText = oEvent.getSource().getSelectedKey();
		// 	} catch (e) {
		// 		Log.error("Exception in CosCreateJob:onWorkCenterChange function");
		// 		this.handleException(e);
		// 	}
		// },

		/* Function: onAddMinusPress
		 * Parameter: sValue, oEvent
		 * Description: To add and remove count added for Air frame Hours and TAC in scheduled Job due.
		 */

		onAddMinusPress: function(sValue, oEvent) {
			try {
				var oInput, oInputValue;
				var oCreateJobLocalModel = this.getView().getModel("CreateJobLocalModel").getData();
				if (oCreateJobLocalModel.CreateJob.ScheJobDue === "01") {
					oInputValue = oCreateJobLocalModel.CreateJob.ScheJobDueAFH;
					oCreateJobLocalModel.CreateJob.ScheJobDueTac = "0";
				} else {
					oInputValue = oCreateJobLocalModel.CreateJob.ScheJobDueTac;
					oCreateJobLocalModel.CreateJob.ScheJobDueAFH = "0";
				}
				if (sValue === 'MIN') {
					if (oInputValue !== "0") {
						oInputValue = parseInt(oInputValue) - 1;
					}
				} else {
					oInputValue = parseInt(oInputValue) + 1;

				}
				if (oCreateJobLocalModel.CreateJob.ScheJobDue === "01") {
					oCreateJobLocalModel.CreateJob.ScheJobDueAFH = oInputValue;
				} else {
					oCreateJobLocalModel.CreateJob.ScheJobDueTac = oInputValue;
				}
				this.getView().getModel("CreateJobLocalModel").updateBindings(true);
			} catch (e) {
				Log.error("Exception in CosCreateJob:onAddMinusPress function");
				this.handleException(e);
			}
		},

		onDeleteImagePress: function(oEvent) {
			try {
				var obj = oEvent.getSource().getBindingContext("appModel").getObject();
				var sPath = "/DefectPhotosSvc(" +
					"DOCID=" + obj.DOCID +
					",JOBID=A)";
				this.getView().byId("photoUpload").setBusy(true);
				var oPrmMark = {};
				oPrmMark.error = function() {
					this.getView().byId("photoUpload").setBusy(false);
				}.bind(this);
				oPrmMark.success = function() {
					this.getView().byId("photoUpload").setBusy(false);
					this.getView().byId("iImageTicket").setSrc(null);
					this._fnPhotoUploadGet(this.docRefId);
				}.bind(this);

				ajaxutil.fnDelete(sPath, oPrmMark);
			} catch (e) {
				Log.error("Exception in onDeleteImagePress function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnDeleteUnusedDocs
		// Parameter: oEvt
		// Description: To delete All uploaded image from backend .
		//Table: PHOTO
		//------------------------------------------------------------------
		_fnDeleteUnusedDocs: function() {
			try {
				if (this.docRefId) {
					var sPath = "/DefectPhotosSvc(" +
						"DOCID=" + this.docRefId +
						",JOBID=P)";
					var oPrmMark = {};
					oPrmMark.error = function() {};
					oPrmMark.success = function(oData) {}.bind(this);
					ajaxutil.fnDelete(sPath, oPrmMark);
				}
			} catch (e) {
				Log.error("Exception in _fnDeleteUnusedDocs function");
			}
		},

		/* Function: onCreateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		onCreateJob: function(oEvent) {
			try {
				var that = this,
					sjobid = "",
					oPayload, oModel;
				var dDate = new Date();
				var oParameter = {};
				oModel = that.getModel("appModel");
				if (!this.handleChange()) {
					return;
				}
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}
				oPayload = this.getView().getModel("oViewCreateModel").getData();
				oPayload.DOCREFID = this.docRefId;
				if (oModel.getProperty("/sRJobIdFlag") === "Y" || oModel.getProperty("/sRJobIdFlag") === "T" || oModel.getProperty("/sRJobIdFlag") ===
					undefined) {
					oPayload.jobid = sjobid.concat("JOB_", dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), dDate.getHours(), dDate.getMinutes(),
						dDate.getSeconds());
					oPayload.endda = formatter.defaultOdataDateFormat(oPayload.credt);
					oPayload.begda = formatter.defaultOdataDateFormat(oPayload.credt);
					oPayload.etrdt = formatter.defaultOdataDateFormat(oPayload.credt);
					oPayload.credtm = formatter.defaultOdataDateFormat(oPayload.credt);
					if (oPayload.jobty === "S") {
						oPayload.symbol = "3";
					}
					oPayload.jstat = "C";
					if (oModel.getProperty("/sRJobIdFlag") === "Y" || oModel.getProperty("/sRJobIdFlag") === "T") {
						oPayload.rjobid = oModel.getProperty("/sRJobId");
					}

					oParameter.error = function(response) {};

					oParameter.success = function(oData) {
						if (oData.results[0].mark !== "") {
							that._fnCreateMark(oData.results[0].jobid);
						}
						if (oData.results[0].prime !== "") {
							that._fnDefectWorkCenterCreate(oData.results[0].jobid, oData.results[0].tailid, oData.results[0].prime);
						}
						that.getView().byId("defectId").setVisible(false);
						that.getView().byId("scheduledId").setVisible(false);
						that.getView().byId("unscheduledId").setVisible(false);
						var ViewGlobalModel = this.getModel("oViewCreateModel");
						ViewGlobalModel.setData(null);
						if (oModel.getProperty("/sRJobIdFlag") === "T") {
							/*that.onNavBack();*/
							window.history.go(-1);
						} else {
							this.getRouter().navTo("CosDefectsSummary", {
								"JobId": oData.results[0].jobid,
								"Flag": "Y"
							}, true);
						}
						this.getView().byId("topId").setVisible(false);

					}.bind(this);
					oParameter.activity = 1;
					ajaxutil.fnCreate("/DefectJobSvc", oParameter, [oPayload], "ZRM_COS_JB", this);

				} else {
					that._fnUpdateJob(oPayload);
				}
			} catch (e) {
				Log.error("Exception in CosCreateJob:onCreateJob function");
				this.handleException(e);
			}
		},
		/* Function: onESJobCreate
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */

		onESJobCreate: function() {
			try {
				var that = this,
					oPayload, oJobModel = this.getView().getModel("oViewCreateModel"),
					oPrmTD = {};
				FieldValidations.resetErrorStates(this);
				if (FieldValidations.validateFields(this)) {
					return;
				}

				if (oModel.getProperty("/sRJobIdFlag") !== "N") {
					oPayload = AvMetInitialRecord.createInitialBlankRecord("SCHJob")[0];

					oPayload.CREDT = formatter.defaultOdataDateFormat(oJobModel.getProperty("/credt"));
					oPayload.CRETM = oJobModel.getProperty("/cretm");
					oPayload.J_FLAG = "N";
					oPayload.FLAG = "ES";
					oPayload.SYMBOL = "0";
					oPayload.CTYPE = "AIRCRAFT";
					oPayload.TAILID = this.getTailId();
					oPayload.AIRID = this.getAircraftId();
					oPayload.MODID = this.getModelId();
					oPayload.JOBDESC = oJobModel.getProperty("/jobdesc");
					oPayload.JOBTY = "ZA";
					if (oJobModel.getProperty("/jduid") === 'JDU_10') {
						oPayload.SERVDT = oJobModel.getProperty("/jdudt");
					} else {
						oPayload.SERVDUE = oJobModel.getProperty("/jduvl");
					}
					oPayload.UMKEY = oJobModel.getProperty("/jduid");
					oPayload.PRIME = oJobModel.getProperty("/prime");
					oPrmTD.error = function() {};
					oPrmTD.success = function(oData) {
						this.getRouter().navTo("Cosjobs");
					}.bind(this);
					oPrmTD.activity = 1;
					ajaxutil.fnCreate("/GetSerLogSvc", oPrmTD, [oPayload], "ZRM_SCH", this);
				} else {
					oPayload = this.getView().getModel("oViewCreateModel").getData();
					that._fnUpdateJob(oPayload);
				}
			} catch (e) {
				Log.error("Exception in onESJobCreate function");
			}
		},

		/* Function: onUpdateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		_fnUpdateJob: function(oPayload) {
			try {
				var that = this,
					sjobid = "",
					oModel;
				var dDate = new Date();
				oModel = that.getView().getModel("appModel");
				var oParameter = {};
				var oldWrkctr = oPayload.LASTWC;
				delete oPayload.LASTWC;
				oPayload.endda = formatter.defaultOdataDateFormat(oPayload.credt);
				oPayload.begda = formatter.defaultOdataDateFormat(oPayload.credt);
				oPayload.etrdt = formatter.defaultOdataDateFormat(oPayload.credt);
				oPayload.credtm = formatter.defaultOdataDateFormat(oPayload.credt);

				oParameter.error = function(response) {};
				oParameter.success = function(oData) {
					if (oData.results[0].mark !== "") {
						that._fnUpdateMark(oData.results[0].jobid);
					}
					if (oData.results[0].prime !== "" && oModel.getProperty("/PrimeStatus")) {
						if (oModel.getProperty("/isWrctr")) {
							that._fnDefectWorkCenterUpdate(oData.results[0].jobid, oData.results[0].tailid, oData.results[0].prime, oldWrkctr);
						} else {
							that._fnDefectWorkCenterCreate(oData.results[0].jobid, oData.results[0].tailid, oData.results[0].prime);
						}
					}
					that.getView().byId("defectId").setVisible(false);
					that.getView().byId("scheduledId").setVisible(false);
					that.getView().byId("unscheduledId").setVisible(false);
					var ViewGlobalModel = this.getModel("oViewCreateModel");
					ViewGlobalModel.setData(null);
					this.getRouter().navTo("CosDefectsSummary", {
						"JobId": oData.results[0].jobid,
						"Flag": "Y"
					});
					this.getView().byId("topId").setVisible(false);
				}.bind(this);
				oParameter.activity = 2;
				ajaxutil.fnUpdate("/DefectJobSvc", oParameter, [oPayload], "ZRM_COS_JB", this);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnUpdateJob function");
				this.handleException(e);
			}
		},

		/* Function: onCreateJob
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		onScheduledJobDescChange: function(oEvent) {
			try {
				var sValue = oEvent.getParameter("value"),
					oCreateJobLocalModel = this.getView().getModel("CreateJobLocalModel").getData();
				oCreateJobLocalModel.CreateJob.ScheJobDesc = sValue;
			} catch (e) {
				Log.error("Exception in CosCreateJob:onScheduledJobDescChange function");
				this.handleException(e);
			}
		},

		//*************************************************************************************************************
		//           2. Database/Ajax/OData Calls
		//*************************************************************************************************************
		_fnCreateMark: function(sjobid) {
			try {
				var oPrmMark = {},
					oModel,
					that = this,
					oPayload;
				oModel = that.getModel("appModel").getData();

				switch (oModel.SelectedKey) {
					case "DEA_T":
						oPayload = oModel.Top;
						break;
					case "DEA_F":
						oPayload = oModel.Front;
						break;
					case "DEA_l":
						oPayload = oModel.Left;
						break;
					case "DEA_R":
						oPayload = oModel.Right;
						break;
				}
				for (var i = 0; i < oPayload.length; i++) {
					oPayload[i].jobid = sjobid;
				}
				oPrmMark.error = function() {};
				oPrmMark.success = function(oData) {
					var oCanvas = document.getElementById("myCanvasTopDefect");
					if (oModel.XCor !== "") {
						that.removeCoordinates(oModel.XCor, oModel.YCor, oCanvas);
					}
				}.bind(this);
				ajaxutil.fnCreate("/DefectMarkSvc", oPrmMark, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnCreateMark function");
				this.handleException(e);
			}
		},

		_fnUpdateMark: function(sjobid) {
			try {
				var oPrmMark = {},
					oModel,
					that = this,
					oPayload;
				oModel = that.getModel("appModel").getData();

				switch (oModel.SelectedKey) {
					case "DEA_T":
						oPayload = oModel.Top;
						break;
					case "DEA_F":
						oPayload = oModel.Front;
						break;
					case "DEA_l":
						oPayload = oModel.Left;
						break;
					case "DEA_R":
						oPayload = oModel.Right;
						break;
				}
				for (var i = 0; i < oPayload.length; i++) {
					oPayload[i].jobid = sjobid;
				}
				oPrmMark.error = function() {};
				oPrmMark.success = function(oData) {
					var oCanvas = document.getElementById("myCanvasTopDefect");
					if (oModel.XCor !== "") {
						that.removeCoordinates(oModel.XCor, oModel.YCor, oCanvas);
					}
				}.bind(this);
				ajaxutil.fnUpdate("/DefectMarkSvc", oPrmMark, oPayload);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnUpdateMark function");
				this.handleException(e);
			}
		},

		_fnGetMark: function(sjobid, sTailId, sDeaId) {
			try {
				var oPrmMark = {},
					oModel, oCanvas,
					that = this,
					oPayload;
				oModel = that.getModel("appModel").getData();
				oPrmMark.filter = "jobid eq " + sjobid + " and tailid eq " + sTailId;
				oPrmMark.error = function() {};
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
						that.drawCoordinates(oData.results[0].xaxis, oData.results[0].yaxis);
					}

				}.bind(this);
				ajaxutil.fnRead("/DefectMarkSvc", oPrmMark);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnGetMark function");
				this.handleException(e);
			}
		},

		_fnPhotoUploadGet: function(sDOCREFID) {
			try {
				var oPrmPhoto = {},
					oAppModel = this.getView().getModel("appModel"),
					sDefectImageSrc = oAppModel.getProperty("/DefectImageSrc");
				oAppModel.updateBindings(true);
				oPrmPhoto.filter = "DOCREFID eq " + sDOCREFID;
				oPrmPhoto.error = function() {};
				oPrmPhoto.success = function(oData) {
					oAppModel.setProperty("/DefectImageSrc", []);
					oAppModel.setProperty("/DefectImageSrc", oData.results);
				}.bind(this);

				ajaxutil.fnRead("/DefectPhotosSvc", oPrmPhoto, sDefectImageSrc);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnPhotoUploadGet function");
				this.handleException(e);
			}
		},

		_fnJobDueGet: function() {
			try {
				var that = this,
					oPrmJobDue = {};
				oPrmJobDue.filter = "refid eq " + that.getAircraftId() + " and ddid eq JDU";
				oPrmJobDue.error = function() {};
				oPrmJobDue.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.getView().setModel(oModel, "JobDueSet");
				}.bind(this);
				ajaxutil.fnRead("/MasterDDREFSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnJobDueGet function");
				this.handleException(e);
			}
		},
		_fnGetUtilisation: function(sAir) {
			try {
				var oPrmJobDue = {};
				oPrmJobDue.filter = "TAILID eq " + this.getTailId() + " and refid eq " + sAir + " and JDUID eq JDU";
				oPrmJobDue.error = function() {};

				oPrmJobDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.oObject = {};
						for (var i in oData.results) {
							this.oObject[oData.results[i].JDUID] = oData.results[i];
						}
					}
				}.bind(this);

				ajaxutil.fnRead("/UtilisationDueSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in _fnGetUtilisation function");
			}
		},
		_fnWorkCenterGet: function(sAirId) {
			try {
				var that = this,
					oPrmWorkCen = {};
				oPrmWorkCen.filter = "REFID eq " + sAirId;
				oPrmWorkCen.error = function() {};
				oPrmWorkCen.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.setModel(oModel, "WorkCenterSet");
				}.bind(this);
				ajaxutil.fnRead("/GetWorkCenterSvc", oPrmWorkCen);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnWorkCenterGet function");
				this.handleException(e);
			}
		},

		_fnDefectWorkCenterCreate: function(sJobId, sTailId, sWorkCenter) {
			try {
				var that = this,
					oPayload,
					oPrmWorkCenter = {};
				oPayload = {
						"jobid": sJobId,
						"tailid": sTailId,
						"wrctr": sWorkCenter,
						"isprime": "",
						"wrctrtx": "",
						"count": null,
						"PrimeCount": null
					},

					oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {

				}.bind(this);

				ajaxutil.fnCreate("/DefectWorkcenterSvc", oPrmWorkCenter, [oPayload]);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnDefectWorkCenterCreate function");
				this.handleException(e);
			}
		},

		_fnDefectWorkCenterUpdate: function(sJobId, sTailId, sWorkCenter, sOldWorkCenter) {
			try {
				var that = this,
					oPayload,
					oPrmWorkCenter = {};
				oPayload = {
						"jobid": sJobId,
						"tailid": sTailId,
						"wrctr": sWorkCenter,
						"isprime": "X",
						"wrctrtx": sOldWorkCenter ? sOldWorkCenter : "",
						"count": null,
						"PrimeCount": null
					},

					oPrmWorkCenter.error = function() {};
				oPrmWorkCenter.success = function(oData) {

				}.bind(this);

				ajaxutil.fnUpdate("/DefectWorkcenterSvc", oPrmWorkCenter, [oPayload]);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnDefectWorkCenterUpdate function");
				this.handleException(e);
			}
		},

		_fnJobDetailsGet: function(sJobId, sAirId) {
			try {
				var that = this,
					oViewModel = this.getView().getModel("appModel"),
					oPrmJobDue = {};
				oViewModel.setProperty("/isEnabledNatureJob", false);
				oPrmJobDue.filter = "jobid eq " + sJobId;
				oPrmJobDue.error = function() {

				};

				oPrmJobDue.success = function(oData) {
					oViewModel.setProperty("/editMode", true);
					var oModel = this.getView().getModel("oViewCreateModel");
					this.getModel("appModel").setProperty("/backDt", oData.results[0].credt);
					this.getModel("appModel").setProperty("/backTm", oData.results[0].cretm);
					this.removeCoordinates();
					if (oData.results.length !== 0) {
						try {
							oViewModel.setProperty("/creDt", oData.results[0].credt);
							oData.results[0].credt = new Date(oData.results[0].credt);
						} catch (e) {
							oData.results[0].credt = oData.results[0].credt;
						}
						try {
							oViewModel.setProperty("/cretm", oData.results[0].cretm);
							oData.results[0].cretm = formatter.defaultTimeFormatDisplay(oData.results[0].cretm);
						} catch (e) {
							oData.results[0].cretm = oData.results[0].cretm;
						}
						oViewModel.setProperty("/oFlagEdit", false);
						//
						that.onSelectionNatureofJobChange(null, oData.results[0].deaid);
						if (oData.results[0].jduid === "JDU_10") {
							oData.results[0].jduvl = new Date(oData.results[0].jduvl);

						}
						if (oData.results[0].mark !== "") {
							that._fnGetMark(oData.results[0].jobid, oData.results[0].tailid, oData.results[0].deaid);
						}
						if (oData.results[0].DOCREFID) {
							this.docRefId = oData.results[0].DOCREFID;
							that._fnPhotoUploadGet(oData.results[0].DOCREFID);
						} else {
							oViewModel.setProperty("/DefectImageSrc", []);
						}
						if (oData.results[0].prime !== "" || oData.results[0].prime !== null) {
							oViewModel.setProperty("/isWrctr", true);
							that._fnTaskStatusGet(sJobId, oData.results[0].prime);
						} else {
							oViewModel.setProperty("/isWrctr", false);
						}
						oData.results[0].LASTWC = oData.results[0].prime;
						oModel.setData(oData.results[0]);
						oModel.updateBindings(true);

					}
				}.bind(this);
				ajaxutil.fnRead("/DefectJobSvc", oPrmJobDue);
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnJobDetailsGet function");
				this.handleException(e);
			}
		},

		_fnGetDateValidation: function() {
			try {
				var oPrmTaskDue = {};
				oPrmTaskDue.filter = "TAILID eq " + this.getTailId() + " and JFLAG eq J and AFLAG eq I";
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					if (oData && oData.results.length > 0) {
						this.getModel("appModel").setProperty("/backDt", oData.results[0].VDATE);
						this.getModel("appModel").setProperty("/backTm", oData.results[0].VTIME);
					}
				}.bind(this);
				ajaxutil.fnRead("/JobsDateValidSvc", oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnGetDateValidation function");
			}
		},

		//------------------------------------------------------------------
		// Function: _fnTaskStatusGet
		// Parameter: sJobId
		// Description: This will get called, when to get Outstanding and Pending Supervisor tasks count.
		//Table: TASK
		//------------------------------------------------------------------
		_fnTaskStatusGet: function(sJobId, sPrime) {
			try {
				var that = this,
					oModel = this.getView().getModel("appModel"),
					oPrmTaskDue = {};
				oPrmTaskDue.filter = "JOBID eq " + sJobId + " and wrctr eq " + sPrime;
				oPrmTaskDue.error = function() {};
				oPrmTaskDue.success = function(oData) {
					if (oData.results[0].COUNT !== "0") {
						oModel.setProperty("/PrimeStatus", false);
						oModel.updateBindings(true);
					} else {
						oModel.setProperty("/PrimeStatus", true);
						oModel.updateBindings(true);
					}
				}.bind(this);
				ajaxutil.fnRead("/GetJobTaskstatSvc", oPrmTaskDue);
			} catch (e) {
				Log.error("Exception in _fnTaskStatusGet function");
			}
		},

		//*************************************************************************************************************
		//           3. Private Methods
		//*************************************************************************************************************
		/* Function: _fnRenderImage
		 * Parameter: sImagePath, sSelectedKey, oCanvas
		 * Description: To render images in to canvas on segment button selections.
		 */

		_fnRenderImage: function(sImagePath, oCanvas) {
			try {
				var that = this,
					oAppModel,
					oModel = this.getView().getModel("appModel").getData(),
					oCanvas;
				oCanvas = document.getElementById("myCanvasTopDefect");
				var ctx = oCanvas.getContext("2d");
				oCanvas.style.backgroundImage = "url('" + sImagePath + "')";
				oCanvas.style.backgroundRepeat = "no-repeat";
				oCanvas.style.backgroundSize = "100%";
				oCanvas.addEventListener('click', canvasClicked, true);
				document.getElementById("myCanvasTopDefect").innerHTML.reload;

				function canvasClicked(e) {
					that.getPointPosition(e, oCanvas);
					oCanvas.removeEventListener('click', canvasClicked, true);
				}
			} catch (e) {
				Log.error("Exception in CosCreateJob:_fnRenderImage function");
				this.handleException(e);
			}
		},

		/* Function: drawCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: To draw coordinates on canvas image.
		 */

		drawCoordinates: function(x, y, oCanvas) {
			try {
				var oCanvas = document.getElementById("myCanvasTopDefect");
				var ctx = oCanvas.getContext("2d");
				var grd = ctx.createLinearGradient(0, 0, 170, 0);
				grd.addColorStop(1, "red");
				ctx.fillStyle = "red"; // Red color
				ctx.strokeStyle = "black";
				ctx.font = "15px Arial";
				ctx.beginPath();
				ctx.arc(Number(x), Number(y), 10, 0, 2 * Math.PI);
				ctx.fill();
			} catch (e) {
				Log.error("Exception in CosCreateJob:drawCoordinates function");
				this.handleException(e);
			}
		},
		drawTextAlongArc: function(context, str, centerX, centerY, radius, angle) {
			try {
				var len = str.length,
					s;
				context.save();
				context.translate(centerX, centerY);
				context.rotate(-1 * angle / 2);
				context.rotate(-1 * (angle / len) / 2);
				for (var n = 0; n < len; n++) {
					context.rotate(angle / len);
					context.save();
					context.translate(0, -1 * radius);
					s = str[n];
					context.fillText(s, 0, 0);
					context.restore();
				}
				context.restore();
			} catch (e) {
				Log.error("Exception in CosCreateJob:drawTextAlongArc function");
				this.handleException(e);
			}
		},

		/* Function: removeCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: To remove drawn coordinates on canvas image.
		 */

		removeCoordinates: function(x, y, oCanvas) {
			try {
				var oCanvas = document.getElementById("myCanvasTopDefect");
				if (oCanvas !== null) {
					var ctx = oCanvas.getContext('2d');
					ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
				}
			} catch (e) {
				Log.error("Exception in CosCreateJob:removeCoordinates function");
				this.handleException(e);
			}
		},

		onRefersh: function() {
			try {
				var oModel = this.getView().getModel("oViewCreateModel"),
					oCanvas = document.getElementById("myCanvasTopDefect"),
					oAppModel = this.getView().getModel("appModel"),
					sImagePath, sRootPath;
				var that = this;
				this.removeCoordinates(oAppModel.getProperty("/XCor"), oAppModel.getProperty("/YCor"), oCanvas);
				this._fnRestMarkArea();
				if (oCanvas) {
					var image = oCanvas.style.backgroundImage;
					image = image.split("\"");
					if (image[1]) {
						setTimeout(function demo() {
							that._fnRenderImage(image[1], oCanvas);
						}, 500);
					}
				}
				sRootPath = jQuery.sap.getModulePath("avmet.ah");
			} catch (e) {
				Log.error("Exception in CosCreateJob:onRefersh function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//   4. Private Function   
		// ***************************************************************************
		//	4.1 First level Private functions
		_handleRouteMatched: function(oEvent) {
			try {
				var sTailId, sJobId, sSqnId, oGBModel, sRJobId, sRJobIdFlag,
					sModId, oTempData,
					sAirId;
				this.getView().setModel(dataUtil.createNewJsonModel(), "oViewCreateModel");
				sTailId = this.getTailId();
				sAirId = this.getAircraftId();
				sSqnId = this.getSqunId();
				sModId = this.getModelId();
				this.docRefId = "";
				sRJobId = oEvent.getParameters("").arguments.JobId;
				sRJobIdFlag = oEvent.getParameters("").arguments.RJobId;
				var oAppModel = dataUtil.createNewJsonModel();
				oAppModel.setData({
					"Top": [],
					"Front": [],
					"Left": [],
					"Right": [],
					"DefectImageSrc": [],
					"SelectedKey": "",
					"NatureofJobKey": "",
					"ScheduleJobDueKey": "",
					"visibleDefect": false,
					"sTailId": sTailId,
					"sModId": sModId,
					"sAirId": sAirId,
					"sSqnId": sSqnId,
					"sRJobId": sRJobId,
					"sRJobIdFlag": sRJobIdFlag,
					"ImageSrc": [],
					"DefectNameChar": "",
					"XCor": "",
					"YCor": "",
					"DefectArea": "",
					"oFlagEdit": true,
					"editMode": false,
					"isWrctr": true

				});
				this.getView().setModel(oAppModel, "appModel");
				sTailId = this.getTailId();
				sAirId = this.getAircraftId();
				sSqnId = this.getSqunId();
				sModId = this.getModelId();
				if (sRJobId) {
					if (sRJobIdFlag !== "Y" && sRJobIdFlag !== "T") {
						this._fnJobDetailsGet(sRJobId, sAirId);
					} else {
						this._fnSetInitialModel();
					}
				} else {
					this._fnSetInitialModel();
				}
				this._fnJobDueGet();
				this._fnGetUtilisation(sAirId);
				this._fnWorkCenterGet(sAirId);
				this._fnFoundDuringGet();
			} catch (e) {
				Log.error("Exception in CosCreateJob:_handleRouteMatched function");
				this.handleException(e);
			}
		},

		_fnSetInitialModel: function() {
			var oTempData = AvMetInitialRecord.createInitialBlankRecord("CREATEJOB");
			this.getModel("oViewCreateModel").setData(oTempData[0]);
			this.getModel("oViewCreateModel").setProperty("/cretm", new Date().getHours() + ":" + new Date().getMinutes());
			this.getModel("oViewCreateModel").setProperty("/credt", new Date());
			this.getModel("oViewCreateModel").setProperty("/airid", this.getAircraftId());
			this.getModel("oViewCreateModel").setProperty("/tailid", this.getTailId());
			this.getModel("oViewCreateModel").setProperty("/modid", this.getModelId());
			this._fnGetDateValidation();
		}

	});
});