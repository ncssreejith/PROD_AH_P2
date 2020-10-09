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
	 *   Control name: Limitations          
	 *   Purpose : To add limitations functionality
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
	return BaseController.extend("avmet.ah.controller.Limitations", {
		formatter: formatter,
		// ***************************************************************************
		//                 1. UI Events  
		// ***************************************************************************
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
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		onAfterRendering: function() {
			var that = this;
			this.onSelectionDefectAreaChange("DEA_T");
			// Retrieve backend posting messages of dashboard status every 30 secs.
			this._LoadMessageInterval = setInterval(function() {
				that._fnADDGet();
				that._fnLimitationsGet();
				that._fnLimitationsCompleteGet();
			}, 30000);
		},
		/** 
		 * Exit clean up.
		 */
		onExit: function() {
			// Clear off state.
			this.destroyState();
		},
		/** 
		 * Clean up state object.
		 */
		destroyState: function() {
			// Clear load message interval.
			clearInterval(this._LoadMessageInterval);
		},

		// ***************************************************************************
		//                 2. Database/Ajax/OData Calls  
		// ***************************************************************************	

		// ***************************************************************************
		//                 3.  Specific Methods  
		// ***************************************************************************
		/*	onSelectDefectArea: function(oEvent) {
				var oCreateJobModel = this.getModel("localViewModel"),
					sRootPath = jQuery.sap.getModulePath("avmet.ah"),
					sUrl = sRootPath + oEvent.getSource().getBindingContext("localViewModel").getObject().imageUrl;
				oCreateJobModel.setProperty("/sImageUrl", sUrl);

			},*/
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------	
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
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
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
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
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
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 Private Functions
		// ***************************************************************************
		_fnADDGet: function() {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oViewModel = this.getView().getModel("oViewModel"),
					oPrmLimGet = {};
				oPrmLimGet.filter = "CAPTY eq A and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
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

				ajaxutil.fnRead("/GetAddLimitationsSvc", oPrmLimGet);
			} catch (e) {
				Log.error("Exception in Limitations:_fnADDGet function");
				this.handleException(e);
			}
		},
		// ***************************************************************************
		//                 Backend Calls
		// ***************************************************************************
		_fnLimitationsGet: function() {
			try {
				var that = this,
					oModel = dataUtil.createNewJsonModel(),
					oViewModel = this.getView().getModel("oViewModel"),
					oPrmLimGet = {};
				oPrmLimGet.filter = "CAPTY eq L and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
				oPrmLimGet.error = function() {};
				oPrmLimGet.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						oModel.setData(oData.results);
					}
					var Temp = oViewModel.getProperty("/totalCount");
					oViewModel.setProperty("/totalCount", Temp + oData.results.length);
					that.getView().setModel(oModel, "LimitationsSet");
				}.bind(this);

				ajaxutil.fnRead("/GetAddLimitationsSvc", oPrmLimGet);
			} catch (e) {
				Log.error("Exception in Limitations:_fnLimitationsGet function");
				this.handleException(e);
			}
		},
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
		_fnLimitationsCompleteGet: function() {
			try {
				var that = this,
					oPrmLimGet = {};
				oPrmLimGet.filter = "CSTAT eq X and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
				oPrmLimGet.error = function() {};

				oPrmLimGet.success = function(oData) {
					if (oData !== undefined && oData.results.length > 0) {
						var oModel = dataUtil.createNewJsonModel();
						oModel.setData(oData.results);
						that.getView().setModel(oModel, "LimCompleteSet");
					}
				}.bind(this);

				ajaxutil.fnRead("/GetAddLimitationsSvc", oPrmLimGet);
			} catch (e) {
				Log.error("Exception in Limitations:_fnLimitationsCompleteGet function");
				this.handleException(e);
			}
		},

		/*	onADDUpdateFinished: function() {
				var oFilters, filterObj, oListADD, oBindingADD, oViewModel;
				oListADD = this.getView().byId("ADDId");
				oViewModel = this.getView().getModel("oViewModel");
				oBindingADD = oListADD.getBinding("items");
				oBindingADD.filter([]);

				oFilters = [new sap.ui.model.Filter("CAPTY", sap.ui.model.FilterOperator.EQ, "B"),
					new sap.ui.model.Filter("CAPTY", sap.ui.model.FilterOperator.EQ, "A")
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingADD.filter(filterObj);
				oViewModel.setProperty("/sADDCount", oListADD.getItems().length);

			},*/

		/*	onLimitationADDUpdateFinished: function() {
				var oFilters, filterObj, oListADD, oBindingADD, oViewModel;
				oListADD = this.getView().byId("LimADDId");
				oViewModel = this.getView().getModel("oViewModel");
				oBindingADD = oListADD.getBinding("items");
				oBindingADD.filter([]);

				oFilters = [new sap.ui.model.Filter("CAPTY", sap.ui.model.FilterOperator.EQ, "B"),
					new sap.ui.model.Filter("CAPTY", sap.ui.model.FilterOperator.EQ, "L")
				];

				filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingADD.filter(filterObj);
				oViewModel.setProperty("/sLimitCount", oListADD.getItems().length);
			},*/
		onRefresh: function() {
			this._fnADDGet();
			this._fnLimitationsGet();
			this._fnLimitationsCompleteGet();
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		_onObjectMatched: function(oEvent) {
			try {
				/*	var oModel = this.getView().getModel("localViewModel"),
						sPath = jQuery.sap.getModulePath("avmet.ah"),
						val = sPath + "/css/img/limHelicopcreateAircraftLeft.png";
					oModel.setProperty("/sImageUrl", val);
					oModel.updateBindings(true);*/
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
				this.handleException(e);
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
				this.handleException(e);
			}

		},

		/*	_fnRenderImage: function(sImagePath, oCanvas) {
				var that = this,
					oCanvas;
				oCanvas = document.getElementById("myCanvasTopLim");
				var ctx = oCanvas.getContext("2d");
				oCanvas.style.backgroundImage = "url('" + sImagePath + "')";
				oCanvas.style.backgroundRepeat = "no-repeat";
				oCanvas.style.backgroundSize = "100%";
				oCanvas.addEventListener('click', canvasClicked, false);

				function canvasClicked(e) {
					that.getPointPosition(e, oCanvas);
				}
			},*/
		//-------------------------------------------------------------
		//  
		//-------------------------------------------------------------
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
				this.handleException(e);
			}
		},

		resetCanvas: function() {
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
		}
	});
});