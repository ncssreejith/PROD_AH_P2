sap.ui.define([
	"./BaseController",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/ui/core/Fragment",
	"../model/FieldValidations",
	"../model/formatter",
	"../util/ajaxutil",
	"sap/base/Log",
		"../util/ajaxutilNew",
	"avmet/ah/util/FilterOpEnum"
], function(BaseController, dataUtil, Fragment, FieldValidations, formatter, ajaxutil, Log, ajaxutilNew, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *     Developer : Rahul Thorat 
	 *   Control name: Limitations          
	 *   Purpose : To add limitations functionality
	 *   Functions :
	 *   1.UI Events
	 *        1.1 onInit
	 *        1.2 onAfterRendering
	 *        1.3 onExit
	 *        1.4 destroyState
	 *     2. Backend Calls
	 *        2.1 _fnADDGet
	 *        2.2 _fnLimitationsGet
	 *     3. Private calls
	 *        3.1 onADDPress
	 *        3.2 onLimitationPress
	 *        3.3 onCompletePress
	 *        3.4 onRefresh
	 *        3.5 drawCoordinates
	 *        3.6 onSelectionDefectAreaChange
	 *        3.7 resetCanvas
	 *   Note :
	 *************************************************************************** */
	return BaseController.extend("avmet.ah.controller.Limitations", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
		//-------------------------------------------------------------
		//   Function: onInit
		//   Parameter: NA 
		//   Description: Internal method to initialize View dataUtil .
		//-------------------------------------------------------------
		onInit: function() {
			try {
				var that = this,
					model = dataUtil.createJsonModel("model/limitationModel.json");
				that.getView().setModel(model, "localViewModel");
				var oMarkModel = dataUtil.createNewJsonModel();
				oMarkModel.setData({
					"Top": [],
					"Front": [],
					"Left": [],
					"Right": []
				});
				that.getView().setModel(oMarkModel, "MarkModel");
				this.getRouter().getRoute("Limitations").attachPatternMatched(this._onObjectMatched, this);
			} catch (e) {
				Log.error("Exception in Limitations:onInit function");
				
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		onAfterRendering: function() {
			try {
				var that = this;
				this.onSelectionDefectAreaChange("DEA_T");
				// Retrieve backend posting messages of dashboard status every 30 secs.
				if (!this._LoadMessageInterval) {
					this._LoadMessageInterval = setInterval(function() {
						that._fnADDGet();
						that._fnLimitationsGet();
						that._fnLimitationsCompleteGet();
					}, 300000);
				}
			} catch (e) {
				Log.error("Exception in onAfterRendering function");
			}
		},
		/** 
		 * Exit clean up.
		 */
		onExit: function() {
			try {
				// Clear off state.
				this.destroyState();
			} catch (e) {
				Log.error("Exception in onExit function");
			}
		},
		/** 
		 * Clean up state object.
		 */
		destroyState: function() {
			try {
				// Clear load message interval.
				clearInterval(this._LoadMessageInterval);
			} catch (e) {
				Log.error("Exception in destroyState function");
			}
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	
		/* Function: _fnADDGet
		 * Parameter:
		 * Description: This is called to retreive ADD records
		 */
		_fnADDGet: function() {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oViewModel = this.getView().getModel("oViewModel"),
					oPrmLimGet = {};
			//	oPrmLimGet.filter = "CAPTY eq A and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
				oPrmLimGet.filter = "CAPTY" + FilterOpEnum.EQ + "A&AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&tailid" + FilterOpEnum.EQ +
					that.getTailId();
				oPrmLimGet.error = function() {};

				oPrmLimGet.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var
							sTempChar = "A",
							oMarkModel = this.getView().getModel("MarkModel").getData();
						for (var i = 0; i < oData.results.length; i++) {
							if ((oData.results[i].CAPTY === "A" || oData.results[i].CAPTY === "B") && oData.results[i].CSTAT === "A") {
								var TempMark = {
									"XAXIS": oData.results[i].XAXIS,
									"YAXIS": oData.results[i].YAXIS,
									"NAME1": sTempChar
								};
								switch (oData.results[i].DEAID_M) {
									case "DEA_T":
										oMarkModel.Top.push(TempMark);
										break;
									case "DEA_F":
										oMarkModel.Front.push(TempMark);
										break;
									case "DEA_l":
										oMarkModel.Left.push(TempMark);
										break;
									case "DEA_R":
										oMarkModel.Right.push(TempMark);
										break;
								}
								oData.results[i].NAME1 = sTempChar;
								sTempChar = String.fromCharCode(sTempChar.charCodeAt() + 1);
							}
						}
						this.onSelectionDefectAreaChange("DEA_T");
						that.getView().getModel("MarkModel").updateBindings(true);
						// To calculate the time difference of two dates 

						oModel.setData(oData.results);

					}
					var Temp = oViewModel.getProperty("/totalCount");
					oViewModel.setProperty("/totalCount", Temp + oData.results.length);
					that.getView().setModel(oModel, "ADDLimSet");
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETADDLIMITATIONSSVC"), oPrmLimGet);
			} catch (e) {
				Log.error("Exception in Limitations:_fnADDGet function");
				
			}
		},

		/* Function: _fnLimitationsGet
		 * Parameter:
		 * Description: his is called to retreive Limitation records
		 */
		_fnLimitationsGet: function() {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oViewModel = this.getView().getModel("oViewModel"),
					oPrmLimGet = {};
			//	oPrmLimGet.filter = "CAPTY eq L and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
				oPrmLimGet.filter = "CAPTY" + FilterOpEnum.EQ + "L&AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&tailid" + FilterOpEnum.EQ +
					that.getTailId();
				oPrmLimGet.error = function() {};
				oPrmLimGet.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						oModel.setData(oData.results);
					}
					var Temp = oViewModel.getProperty("/totalCount");
					oViewModel.setProperty("/totalCount", Temp + oData.results.length);
					that.getView().setModel(oModel, "LimitationsSet");
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETADDLIMITATIONSSVC"), oPrmLimGet);
			} catch (e) {
				Log.error("Exception in Limitations:_fnLimitationsGet function");
				
			}
		},
		/* Function: _fnLimitationsCompleteGet
		 * Parameter:
		 * Description: This is called to retreive completed records
		 */
		_fnLimitationsCompleteGet: function() {
			try {
				var that = this,
					oPrmLimGet = {};
			//	oPrmLimGet.filter = "CSTAT eq X and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
					oPrmLimGet.filter = "CSTAT" + FilterOpEnum.EQ + "X&AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&tailid" + FilterOpEnum.EQ +
					that.getTailId();
				oPrmLimGet.error = function() {};

				oPrmLimGet.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "LimCompleteSet");
					}
				}.bind(this);

				ajaxutilNew.fnRead(this.getResourceBundle().getText("GETADDLIMITATIONSSVC"), oPrmLimGet);
			} catch (e) {
				Log.error("Exception in Limitations:_fnLimitationsCompleteGet function");
				
			}
		},

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************

		/* Function: onADDPress
		 * Parameter:
		 * Description: This is called to add ADD
		 */
		onADDPress: function(oEvent) {
			try {
				var oData = oEvent.getSource().getSelectedItem().getBindingContext("ADDLimSet").getObject();
				if (oData) {
					this.getRouter().navTo("LimitationsOverView", {
						"CAP": oData.CAPID,
						"JOB": oData.JOBID,
						"CAPTY": oData.CAPTY,
						"DEFID": oData.DEAID_M,
						"XMARK": oData.XAXIS,
						"YMARK": oData.YAXIS,
						"FLag": "A"
					});
				} else {
					sap.m.MessageToast.show("Something went wrong");
				}
			} catch (e) {
				Log.error("Exception in Limitations:onADDPress function");
				
			}
		},
		/* Function: onLimitationPress
		 * Parameter:
		 * Description: This is called to add Limitation
		 */
		onLimitationPress: function(oEvent) {
			try {
				var oData = oEvent.getSource().getSelectedItem().getBindingContext("LimitationsSet").getObject();
				if (oData) {
					this.getRouter().navTo("LimitationsOverView", {
						"CAP": oData.CAPID,
						"JOB": oData.JOBID,
						"CAPTY": oData.CAPTY,
						"DEFID": oData.DEAID_M,
						"XMARK": oData.XAXIS,
						"YMARK": oData.YAXIS,
						"FLag": "L"
					});
				} else {
					sap.m.MessageToast.show("Something went wrong");
				}
			} catch (e) {
				Log.error("Exception in Limitations:onLimitationPress function");
				
			}
		},
		/* Function: onCompletePress
		 * Parameter:
		 * Description: This is called to complete add/limitation
		 */
		onCompletePress: function(oEvent) {
			try {
				var oData = oEvent.getSource().getSelectedItem().getBindingContext("LimCompleteSet").getObject();
				if (oData) {
					this.getRouter().navTo("LimitationsOverView", {
						"CAP": oData.CAPID,
						"JOB": oData.JOBID,
						"CAPTY": oData.CAPTY,
						"DEFID": oData.DEAID_M,
						"XMARK": oData.XAXIS,
						"YMARK": oData.YAXIS,
						"FLag": "C"
					});
				} else {
					sap.m.MessageToast.show("Something went wrong");
				}
			} catch (e) {
				Log.error("Exception in Limitations:onCompletePress function");
				
			}
		},
		/* Function: onAddFlyingRequirements
		 * Parameter:
		 * Description: This is called refresh tables
		 */
		onRefresh: function() {
			try {
				this._fnADDGet();
				this._fnLimitationsGet();
				this._fnLimitationsCompleteGet();
			} catch (e) {
				Log.error("Exception in _fnLimitationsCompleteGet function");
			}
		},
			/* Function: drawCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: To draw coordinates on canvas image.
		 */
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		drawCoordinates: function(sDaid, oCanvas) {
			try {
				//	var oCanvas = document.getElementById("myCanvasTopLim");
				var oMarkModel = this.getView().getModel("MarkModel").getData(),
					oAppModel;
				switch (sDaid) {
					case "DEA_T":
						oAppModel = oMarkModel.Top;
						break;
					case "DEA_F":
						oAppModel = oMarkModel.Front;
						break;
					case "DEA_l":
						oAppModel = oMarkModel.Left;
						break;
					case "DEA_R":
						oAppModel = oMarkModel.Right;
						break;
				}

				for (var i = 0; i < oAppModel.length; i++) {
					var ctx = oCanvas.getContext("2d");
					var grd = ctx.createLinearGradient(0, 0, 170, 0);
					grd.addColorStop(1, "red");
					ctx.fillStyle = "red"; // Red color
					ctx.strokeStyle = "black";
					ctx.font = "15px Arial";
					ctx.beginPath();
					ctx.arc(Number(oAppModel[i].XAXIS), Number(oAppModel[i].YAXIS), 10, 0, 2 * Math.PI);
					ctx.fill();
					//To print character on point. 
					ctx.beginPath();
					ctx.fillStyle = "black";
					ctx.fillText(oAppModel[i].NAME1, Number(oAppModel[i].XAXIS) - 6.5, Number(oAppModel[i].YAXIS) + 6);
					ctx.fill();

				}
			} catch (e) {
				Log.error("Exception in Limitations:drawCoordinates function");
				
			}

		},

		/* Function: onSelectionDefectAreaChange
		 * Parameter:
		 * Description: This is called to set canvas image and marks
		 */
		onSelectionDefectAreaChange: function(sValue) {
			try {
				var that = this,
					sRootPath = jQuery.sap.getModulePath("avmet.ah"),
					oCanvas, sImagePath, oSelectedItemId, ctx,
					oSegmentedButton = this.byId("sbDfArea");
				if (sValue === "DEA_T") {
					oSelectedItemId = sValue;
				} else {
					oSelectedItemId = oSegmentedButton.getSelectedKey();
				}

				oSelectedItemId = oSegmentedButton.getSelectedKey();

				switch (oSelectedItemId) {
					case "DEA_T":
						this.getView().byId("topId").setVisible(true);
						this.getView().byId("FrontId").setVisible(false);
						this.getView().byId("LeftId").setVisible(false);
						this.getView().byId("RightId").setVisible(false);
						oCanvas = document.getElementById("myCanvasTopLim");
						sImagePath = sRootPath + "/css/img/AH/AH-Top.png";
						break;
					case "DEA_F":
						this.getView().byId("topId").setVisible(false);
						this.getView().byId("FrontId").setVisible(true);
						this.getView().byId("LeftId").setVisible(false);
						this.getView().byId("RightId").setVisible(false);
						oCanvas = document.getElementById("myCanvasFront");
						sImagePath = sRootPath + "/css/img/AH/AH-Front.png";
						break;
					case "DEA_l":
						this.getView().byId("topId").setVisible(false);
						this.getView().byId("FrontId").setVisible(false);
						this.getView().byId("LeftId").setVisible(true);
						this.getView().byId("RightId").setVisible(false);
						oCanvas = document.getElementById("myCanvasLeft");
						sImagePath = sRootPath + "/css/img/AH/AH-Left.png";
						break;
					case "DEA_R":
						this.getView().byId("topId").setVisible(false);
						this.getView().byId("FrontId").setVisible(false);
						this.getView().byId("LeftId").setVisible(false);
						this.getView().byId("RightId").setVisible(true);
						oCanvas = document.getElementById("myCanvasRight");
						sImagePath = sRootPath + "/css/img/AH/AH-Right.png";
						break;
				}
				setTimeout(function demo() {
					ctx = oCanvas.getContext("2d");
					oCanvas.style.backgroundImage = "url('" + sImagePath + "')";
					oCanvas.style.backgroundRepeat = "no-repeat";
					oCanvas.style.backgroundSize = "100%";
					that.drawCoordinates(oSelectedItemId, oCanvas);
				}, 500);
			} catch (e) {
				Log.error("Exception in Limitations:onSelectionDefectAreaChange function");
				
			}
		},
		/* Function: resetCanvas
		 * Parameter:
		 * Description: This is called to reset canvas
		 */
		resetCanvas: function() {
			try {
				var oCanvasTop = document.getElementById("myCanvasTopLim");
				if (oCanvasTop !== null) {
					var ctx = oCanvasTop.getContext('2d');
					ctx.clearRect(0, 0, oCanvasTop.width, oCanvasTop.height);
				}
				var oMyCanvasFront = document.getElementById("myCanvasFront");
				if (oMyCanvasFront !== null) {
					var ctxF = oMyCanvasFront.getContext('2d');
					ctxF.clearRect(0, 0, oMyCanvasFront.width, oMyCanvasFront.height);
				}
				var oMyCanvasLeft = document.getElementById("myCanvasLeft");
				if (oMyCanvasLeft !== null) {
					var ctxL = oMyCanvasLeft.getContext('2d');
					ctxL.clearRect(0, 0, oMyCanvasLeft.width, oMyCanvasLeft.height);
				}
				var oMyCanvasRight = document.getElementById("myCanvasRight");
				if (oMyCanvasRight !== null) {
					var ctxR = oMyCanvasRight.getContext('2d');
					ctxR.clearRect(0, 0, oMyCanvasRight.width, oMyCanvasRight.height);
				}
			} catch (e) {
				Log.error("Exception in resetCanvas function");
			}
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				this.fnCheckCapStatus();
				this.resetCanvas();
				var oModel = dataUtil.createNewJsonModel();
				oModel.setData({
					sADDCount: "",
					sLimitCount: "",
					totalCount: 0,
					SelectedKey: "ADD"

				});
				this.getView().setModel(oModel, "oViewModel");
				this._fnADDGet();
				this._fnLimitationsGet();
				this._fnLimitationsCompleteGet();

			} catch (e) {
				Log.error("Exception in Limitations:_onObjectMatched function");
				
			}
		}
	});
});