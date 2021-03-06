/* eslint no-console: "error" */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"../util/dataUtil", //Rahul: 23/11/2020: 12:47PM: dataUtil Path changed.
	"sap/base/Log",
	"../util/html2pdfbundle",
	"avmet/ah/util/ajaxutil",
	"avmet/ah/util/cvUtil",
	"../model/AvMetInitialRecord",
	"sap/m/MessageBox",
	"avmet/ah/util/FilterOpEnum"
], function(Controller, JSONModel, MessageToast, Fragment, dataUtil, Log, html2pdfbundle, ajaxutil, cvUtil, AvMetInitialRecord,
	MessageBox, FilterOpEnum) {
	"use strict";
	/* ***************************************************************************
	 *   This file is for Managing generic function across the project               
	 *   Available Functions are Exception Handling, Dialog Handling  
	 *************************************************************************** */
	return Controller.extend("avmet.ah.controller.BaseController", {

		/** 
		 * Function : getRouter
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		cvutil: cvUtil,
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		reasonForAU: function() {
			var sData = [{
				key: "RSN_100",
				text: "#1 Engine Change"
			}, {
				key: "RSN_101",
				text: "#2 Engine Change"
			}, {
				key: "RSN_102",
				text: "APU Change"
			}, {
				key: "RSN_103",
				text: "APU Run"
			}, {
				key: "RSN_104",
				text: "Update ALQ144"
			}, {
				key: "RSN_105",
				text: "Others"
			}];
			return sData;
		},

		/** 
		 * Function : getModel
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/** 
		 * Function : setModel
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getAircraftId: function() {
			//dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.tailid
			return dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.airid;
		},
		getModelId: function() {
			return dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.modid;
		},
		getTailId: function() {
			return dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.tailid;
		},
		getSqunId: function() {
			return dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.sqnid;
		},
		getWC: function() {
			return dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.wcid;
		},
		getEngine: function() {
			return dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.engid;
		},

		/** 
		 * Function : passSignOff
		 * Getter for Sign off parameter
		 * @public
		 * 
		 */
		passSignOff: function(obj, act) {
			try {
				this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
				var oDataSet = this._storage.get(vDataSetName);
				oDataSet.object = obj;
				oDataSet.activity = act;
				this._storage.put(vDataSetName, oDataSet);
			} catch (e) {
				Log.error("Exception in passSignOff function");
			}
		},

		/** 
		 * Function : getResourceBundle
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		/** 
		 * Function : closeoDialog
		 * This will destroy the dialog instance 
		 * @param {function} oDialog 
		 * @public
		 */
		closeoDialog: function(oDialog) {
			try {
				oDialog = oDialog !== undefined ? oDialog : this._oDialog;
				oDialog.close();
				oDialog.destroy();
				oDialog = undefined;
				return;
			} catch (e) {
				this.handleException(e);
			}
		},

		/** 
		 * Function :
		 * @param {function} oDialog 
		 * @public
		 */
		createoDialog: function(that, fragId, fragName) {
			try {
				if (fragId !== null && fragId !== "" && fragId !== undefined && fragId.length > 1) {
					if (!that._oDialog) {
						fragName = "avmet.ah.fragments." + fragName;
						that._oDialog = sap.ui.xmlfragment(that.createId(fragId), fragName, that);
						that.getView().addDependent(that._oDialog);
					}
					return that._oDialog;
				} else {
					that.getView().addDependent(that._oDialog);
					MessageToast.show("No ID have given to Fragment");
				}
				return null;
			} catch (e) {
				this.handleException(e);
			}
		},
		updateModel: function(oData, sName) {
			var oModel = this.getModel(sName);
			Object.keys(oData).forEach(function(key, keyIndex) {
				oModel.setProperty("/" + key, oData[key]);
			});
			oModel.refresh();
		},
		/**
		 * Function handleException
		 * This will destroy the elements which cause duplication
		 * @return {} 
		 * @public
		 */
		handleException: function(e) {
			try {
				if (e.message.indexOf("adding element with duplicate id") !== -1) {
					if (sap.ui.getCore().byId(e.message.split("'")[1]) !== undefined) {
						sap.ui.getCore().byId(e.message.split("'")[1]).destroy();
					}
					MessageToast.show("An error occurred, Please try again");
				} else {
					MessageToast.show("Error !!!" + e.message);
				}
			} catch (ex) {
				var Console = Console;
				Console.log(ex);
			}
		},
		/* Function: onNavBack
		 * Parameter: oEvent
		 * Description: To Create new Job.
		 */
		// navButtonPress: function(oEvent) {
		// 	var oHistory, sPreviousHash;
		// 	oHistory = History.getInstance();
		// 	sPreviousHash = oHistory.getPreviousHash();

		// 	if (sPreviousHash !== undefined) {
		// 		window.history.go(-1);
		// 	} else {
		// 		this.getRouter().navTo("Overview", {}, true /*no history*/ );
		// 	}
		// },
		onNavBack: function(oEvent, viewName) {

			if (viewName !== undefined && viewName !== null && viewName !== "") {
				if (this.fnCheckTailAvail()) {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo(viewName);
				} else { //If no tailid
					window.history.go(-1);
				}

			} else {

				var oHistory, sPreviousHash;
				oHistory = sap.ui.core.routing.History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					if (this.fnCheckTailAvail()) {
						this.getRouter().navTo("DashboardInitial", {}, true /*no history*/ );
					} else { //If no tailid
						this.getRouter().navTo("AircraftSelection", {}, true /*no history*/ );
					}
				}
			}
		},
		getFragmentControl: function(sFragId, sControlId) {
			var sId = Fragment.createId(sFragId, sControlId);
			return this.byId(sId);
		},

		///////////////////// ********************   PRIYA - STARTS  ************************/////////////////////

		/* Function: onSelectionDefectAreaChange
		 * Parameter: sKey,sSource
		 * Description: To select Defected area image.
		 */
		onSelectionDefectAreaChange: function(sKey, sSource) {
			var oSegmentedButton, oSelectedItemId, sCanvasName,
				sRootPath, sImagePath,
				sRootPath = jQuery.sap.getModulePath("avmet.ah");

			if (sSource === "FLCTask") {
				oSegmentedButton = sap.ui.getCore().byId("sbFLC");
				sCanvasName = "myFLCCanvas";
			} else if (sSource === "ADD") {
				oSegmentedButton = sap.ui.getCore().byId("sbDfArea");
				if (oSegmentedButton === undefined) {
					oSegmentedButton = this.getView().byId("addFlightImgId");
				}
				sCanvasName = "myADDCanvas";
			}

			if (sKey !== "Top" || sKey !== "FLCTop" || sKey !== "") {
				oSelectedItemId = oSegmentedButton.getSelectedKey();
			} else {
				oSelectedItemId = sKey;
			}
			if (oSelectedItemId === "") {
				oSelectedItemId = "Top";
			}
			switch (oSelectedItemId) {
				case "Top":
					sImagePath = sRootPath + "/css/img/AH/AH-Top.png";
					break;
				case "Bottom":
					sImagePath = sRootPath + "/css/img/AH/AH-Front.png";
					break;
				case "Left":
					sImagePath = sRootPath + "/css/img/AH/AH-Left.png";
					break;
				case "Right":
					sImagePath = sRootPath + "/css/img/AH/AH-Right.png";
					break;
				case "FLCTop":
					sImagePath = sRootPath + "/css/img/FLCTaskTop.JPG";
					break;
				case "FLCLeft":
					sImagePath = sRootPath + "/css/img/FLCTaskLeft.JPG";
					break;
				case "FLCRight":
					sImagePath = sRootPath + "/css/img/FLCTaskRight.JPG";
					break;
			}
			this._fnRenderImage(sImagePath, sCanvasName);
		},
		/** 
		 * Load dashboard data
		 */
		/*fnLoadSrv1Dashboard: function() {
			try {
				this.fnSaveHistory();
				var oParameter = {};
				//	oParameter.filter = "tailid eq " + this.getTailId() + " and REFID eq " + this.getAircraftId();
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + "&REFID" + FilterOpEnum.EQ + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results.length && oData.results.length > 0) {
						oData.results[0].txt3 = this.fnReplaceString(oData.results[0].txt3);
						oData.results[0].txt2 = this.fnReplaceString(oData.results[0].txt2);
						if (!this.getModel("avmetModel")) {
							return;
						}
						this.getModel("avmetModel").setProperty("/dash", oData.results.length > 0 ? oData.results[0] : {});
						var oDash = this.getModel("avmetModel").getProperty("/dash");
						var oModel = this.getView().getModel("avmetModel");
						// oModel.setProperty("/UnlockAVMET", this.fnCheckLockStatus(oDash.astid)); // Change by Teck Meng 25/11/2020 10:15
						oModel.setProperty("/UnlockAVMET", oDash.alock === 1); // Change by Teck Meng 25/11/2020 10:15
						if (this.fnOverwriteStatus(oDash.astid)) {
							oModel.setProperty("/dash/TBTN3", true);
						}
						// oModel.setProperty("/UnlockRec", this.fnCheckRecLockStatus(oDash.astid));
						this.fnSetMenuVisible(oDash.TBTN1, this.fnFindRoleChangeStations);
						this.fnSetMenuVisible(oDash.TBTN2, this.fnFindCreateFlightService);
						this.fnSetMenuVisible(oDash.TBTN3, this.fnFindCosjobs);
						this.fnRestoreHistory();
						this.getModel("menuModel").refresh();
						this.getModel("avmetModel").refresh();
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("DASHBOARDCOUNTSSVC"), oParameter);
			} catch (e) {
				this.fnRestoreHistory();
				Log.error("Exception in fnLoadSrv1Dashboard function");
			}
		},*/
		fnLoadSrv1Dashboard: function() {
			try {
				var oParameter = {};
				//	oParameter.filter = "tailid eq " + this.getTailId() + " and REFID eq " + this.getAircraftId();
				oParameter.filter = "tailid=" + this.getTailId() + "&REFID=" + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results.length && oData.results.length > 0) {
						oData.results[0].txt3 = this.fnReplaceString(oData.results[0].txt3);
						oData.results[0].txt2 = this.fnReplaceString(oData.results[0].txt2);
						this.getModel("avmetModel").setProperty("/dash", oData.results.length > 0 ? oData.results[0] : {});
						var oModel = this.getView().getModel("avmetModel");
						var oDash = oModel.getProperty("/dash");
						// oModel.setProperty("/UnlockAVMET", this.fnCheckLockStatus(oDash.astid)); // Change by Teck Meng 25/11/2020 10:15
						oModel.setProperty("/UnlockAVMET", oDash.alock === 1); // Change by Teck Meng 25/11/2020 10:15
						if (this.fnOverwriteStatus(oDash.astid)) {
							oModel.setProperty("/dash/TBTN3", true);
						}
						oModel.setProperty("/UnlockRec", this.fnCheckRecLockStatus(oDash.astid));
						this.fnSetMenuVisible(oDash.TBTN1, this.fnFindRoleChangeStations);
						this.fnSetMenuVisible(oDash.TBTN2, this.fnFindCreateFlightService);
						this.fnSetMenuVisible(oDash.TBTN3, this.fnFindCosjobs);
						if (oData.results[0].WFLAG === "X") {
							oModel.setProperty("/WarningFlag", true);
							this._fnSetWarningMessage(oData.results[0]);
						} else {
							oModel.setProperty("/WarningFlag", false);
						}
						this.getModel("menuModel").refresh();
						this.getModel("avmetModel").refresh(true);
						// this.fnCreateTableFromData();
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("DASHBOARDCOUNTSSVC"), oParameter);
			} catch (e) {
				this.Log.error("Exception in fnLoadSrv1Dashboard function");
				this.handleException(e);
			}
		},
		/** 
		 * Load running changes data
		 */
		fnLoadRunningChange: function() {
			try {
				var aPilot = [];
				var oParameter = {};
				//	oParameter.filter = "tailid eq " + this.getTailId() + " and REFID eq " + this.getAircraftId();
				oParameter.filter = "tailid" + FilterOpEnum.EQ + this.getTailId() + FilterOpEnum.AND + "REFID" + FilterOpEnum.EQ + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results && oData.results.length) {
						this.getModel("avmetModel").setProperty("/runningChange", oData.results.length > 0 ? oData.results : []);
						this.getModel("avmetModel").refresh();
					} else {
						this.getModel("avmetModel").setProperty("/runningChange", []);
					}

				}.bind(this);
				this.getModel("avmetModel").setProperty("/runningChange", []);
				ajaxutil.fnRead(this.getResourceBundle().getText("PILOTINVOLVEDLSVC"), oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadRunningChange function");
			}
		},
		/** 
		 *  Save and clear history
		 */
		fnSaveHistory: function() {
			this.aHistory = JSON.parse(JSON.stringify(sap.ui.core.routing.History.getInstance().aHistory));
			sap.ui.core.routing.History.getInstance().aHistory = [];
		},
		/** 
		 * Restore history and clear CreateFlightService if FS in progress
		 */
		fnRestoreHistory: function() {
			if (this.aHistory) {
				var that = this; //Teck Meng change on 26/11/2020 13:00 AH Issue 1044,1043
				var oDash = this.getModel("avmetModel").getProperty("/dash");
				this.aHistory.forEach(function(oHistory, i) {
					if (oHistory && oHistory.startsWith && oHistory.startsWith("CreateFlightService") && oDash.TBTN2 !== "X") {
						that.aHistory.splice(i, 1); //Teck Meng change on 26/11/2020 13:00 AH Issue 1044,1043
						// this.aHistory.splice(i, 1);//Teck Meng change on 26/11/2020 13:00 AH Issue 1044,1043
					}
				});
				sap.ui.core.routing.History.getInstance().aHistory = this.aHistory;
			}
		},
		fnSetMenuVisible: function(oFlag, fnCallBack) {
			var aMenu = this.getModel("menuModel").getData();
			var oFound = {};
			if (oFlag === "X" || oFlag) {
				oFound = aMenu.find(fnCallBack);
				oFound.visible = true;
			} else {
				oFound = aMenu.find(fnCallBack);
				oFound.visible = false;
			}
		},

		fnFindRoleChangeStations: function(oMenu) {
			return oMenu.pattern === "RoleChangeStations";
		},
		fnFindCreateFlightService: function(oMenu) {
			return oMenu.pattern === "CreateFlightService";
		},
		fnFindCosjobs: function(oMenu) {
			return oMenu.pattern === "Cosjobs";
		},

		// ***************************************************************************
		//                 4. Private Methods   
		// ***************************************************************************
		/* Function: _fnRenderImage
		 * Parameter: sImagePath, sSelectedKey, oCanvas
		 * Description: To render images in to canvas on segment button selections.
		 */
		_fnRenderImage: function(sImagePath, oCanvas) {
			var that = this;
			var canvas = document.getElementById(oCanvas);
			var ctx = canvas.getContext("2d");
			canvas.style.backgroundImage = "url('" + sImagePath + "')";
			canvas.style.backgroundRepeat = "no-repeat";
			canvas.style.backgroundSize = "100%";
		},

		///////////////////// ********************   PRIYA - ENDS  ************************/////////////////////

		/* Function: drawCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: To draw coordinates on canvas image.
		 */
		/*	drawCoordinates: function(x, y, oCanvas) {
				var ctx = oCanvas.getContext("2d");
				var grd = ctx.createLinearGradient(0, 0, 170, 0);
				grd.addColorStop(1, "red");
				ctx.fillStyle = grd; // Red color
				ctx.beginPath();
				ctx.arc(Number(x), Number(y), 10, 0, 2 * Math.PI);
				ctx.fill();
			},*/

		/* Function: removeCoordinates
		 * Parameter: x, y, oCanvas
		 * Description: To remove drawn coordinates on canvas image.
		 */
		/*removeCoordinates: function(x, y, oCanvas) {
			var ctx = oCanvas.getContext("2d");
			for (var i = 0; i < Math.round(Math.PI * 12); i++) {
				var angle = (i / Math.round(Math.PI * 12)) * 360;
				ctx.clearRect(x, y, Math.sin(angle * (Math.PI / 180)) * 12, Math.cos(angle * (Math.PI / 180)) * 12);
			}
		},*/

		/////////////////////////////////////////////////////////DIALOG CREATION AND CLOSE //////////////////////////////////////////////
		openDialog: function(oDialogName, sPath) {
			var oDailog = this.fnLoadFragment(oDialogName, sPath, true);
			if (oDailog) {
				oDailog.open();
			}
			return oDailog;
		},
		getDialog: function(oDialogName) {
			try {
				return this[oDialogName];
			} catch (e) {
				Log.error("Exception in closeDialog function");
			}
		},
		onClose: function(oEvent) {
			this.closeoDialog(this._oDialog);
		},
		closeDialog: function(oDialogName) {
			if (this[oDialogName]) {
				this[oDialogName].close();
				// this[oDialogName].destroy();
				// this[oDialogName] = undefined;
			}
			return this[oDialogName];
		},

		fnLoadFragment: function(oFragmentName, sPath, isDependend) {
			if (!sPath) {
				sPath = ".fragments.";
			}
			if (!this[oFragmentName]) {
				var sProjectId = this.getOwnerComponent().getMetadata().getManifestEntry("sap.app").id;
				this[oFragmentName] = sap.ui.xmlfragment(this.createId(oFragmentName + "Id"), sProjectId + sPath + oFragmentName, this);
				if (isDependend) {
					this.getView().addDependent(this[oFragmentName]);
				}

			}
			return this[oFragmentName];
		},

		fnCreateRow: function(tblRef, oModel, sClmPath, oDataModel, isEdit) {
			if (isEdit === undefined) {
				isEdit = false;
			}
			var oCells = [];
			this.getModel(oModel).getProperty("/" + sClmPath).forEach(function(oItem) {
				var sText = new sap.m.Text({
					text: "{" + oDataModel + ">" + oItem.colid + "}"
				});
				if (oItem.edtb === "X" && isEdit) {
					sText = new sap.m.Input({
						value: "{" + oDataModel + ">" + oItem.colid + "}"
					});
				}
				oCells.push(sText);
			});
			if (oCells.length === 0) {
				tblRef.setVisible(false);
			}
			var sColum = new sap.m.ColumnListItem({
				cells: oCells
			});
			tblRef.bindAggregation("items", oDataModel + ">/" + sClmPath, sColum);
		},
		deleteColumn: function(oData) {
			if (!oData || !oData.results || oData.results.length < 3) {
				return "";
			}
			oData.results.splice(oData.results.length - 2, 2);
		},
		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onSort: function(oEvent, sFieldName) {
			var aSorters = [];
			// var oTable = this.byId("AllJobId");
			var oBinding = oEvent.getSource().getParent().getParent().getParent().getBinding("items"); //oTable.getBinding("items");
			var sPath = sFieldName; // mParams.sortItem.getKey();
			var bDescending = true;
			if (oBinding && oBinding.aSorters && oBinding.aSorters.length && oBinding.aSorters.length > 0 && oBinding.aSorters[0].sPath ===
				sFieldName) {
				bDescending = !oBinding.aSorters[0].bDescending;
			}

			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},
		onSearch: function(oEvent, sTableId, sModel, sPath, sFilter) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh(sTableId);
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					if (sFilter) {
						aTableSearchState = [new sap.ui.model.Filter(sPath, sFilter, sQuery)];
					} else {
						aTableSearchState = [new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.Contains, sQuery)];
					}

				}
				this._applySearch(aTableSearchState, sTableId, sModel);
			}

		},

		onStepChange: function(oEvent) {
			var oSrc = oEvent.getSource(),
				sVal = oSrc.getValue(),
				sMinVal = oSrc.getMin();
			if (sMinVal > sVal) {
				oSrc.setValue(sMinVal);
				sap.m.MessageBox.error("Value should be greater than " + sMinVal);
			} else {
				oSrc.setValueState("None");
			}
		},
		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function(sTableId) {
			var oTable = this.byId(sTableId);
			oTable.getBinding("items").refresh();
		},
		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState, sTableId, sModel) {
			var oTable = this.byId(sTableId),
				oViewModel = this.getModel(sModel);
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			// if (aTableSearchState.length !== 0) {
			// 	oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			// }
		},

		onLogoffPress: function(oEvent) {
			try {
				var that = this;
				MessageBox.confirm("Do you want to log off?", {
					actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function(sAction) {
						if (sAction === "YES") {
							that._fnInvalidateSession();
						}
					}
				});

			} catch (e) {
				Log.error("Exception in onLogoffPress function");
			}
		},

		_fnInvalidateSession: function() {

			try {
			
				$.ajax({
					type: 'GET',
					url: "/ws_eslm_authenticate",
					headers: {
						"state": "delete"
					},
					error: function(xhrx) {
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
						sap.m.URLHelper.redirect(xhrx.getResponseHeader("Location"), false);
					},
					success: function(oData, status, xhrx) {
						dataUtil.setDataSet("oUserSession", null);
						dataUtil.setDataSet("AirCraftSelectionGBModel", null);
						sap.m.URLHelper.redirect(xhrx.getResponseHeader("Location"), false);
					}
				});
			} catch (e) {
				Log.error("Exception in _fnAirOverViewItemGet function");
			}
		},

		//showing the message text and validation of maxlength
		handleLiveChangeFlyingRequirements: function(oEvent) {
			var oSource = oEvent.getSource(),
				sValue = oSource.getValue(),
				iMaxLen = oSource.getMaxLength(),
				iLen = sValue.length;
			if (iLen && iMaxLen && iLen > iMaxLen) {
				sValue = sValue.substring(0, iMaxLen);
				oSource.setValue(sValue);
			}

			if (sValue.length > 0) {
				oSource.setValueState("None");
			}
		},
		/** 
		 * Check whether to lock AVMET
		 * @param sStatus
		 * @returns
		 */
		fnCheckLockStatus: function(sStatus) {
			try {
				switch (sStatus) {
					// case "AST_FAIR":
					// case "AST_FAIR0":
					// case "AST_FAIR1":
					// case "AST_FAIR2":
					case "AST_FFF":
					case "AST_RFF":
						return true;
					default:
						return false;
				}
			} catch (e) {
				Log.error("Exception in DashboardInitial:fnCheckLockStatus function");
				this.handleException(e);
			}
		},
		/** 
		 * Check whether to unlock AVMET
		 * @param sStatus
		 * @returns
		 */
		fnOverwriteStatus: function(sStatus) {
			try {
				switch (sStatus) {
					case "AST_FFF0":
					case "AST_RFF0":
						return true;
					default:
						return false;
				}
			} catch (e) {
				Log.error("Exception in DashboardInitial:fnCheckLockStatus function");
				this.handleException(e);
			}
		},
		/** 
		 * Check whether to unlock for RECT
		 * @param sStatus
		 * @returns
		 */
		fnOverwriteFSStatus: function(sStatus) {
			try {
				switch (sStatus) {
					case "AST_RECT":
					case "AST_RECT1":
						return true;
					default:
						return false;
				}
			} catch (e) {
				Log.error("Exception in DashboardInitial:fnOverwriteFSStatus function");
				this.handleException(e);
			}
		},
		/** 
		 *  Check whether to lock Jobs
		 * @param sStatus
		 * @returns
		 */
		fnCheckRecLockStatus: function(sStatus) {
			try {
				switch (sStatus) {
					case "AST_FAIR":
						// case "AST_FAIR0":
						// case "AST_RECT1":
						// case "AST_FAIR1":
						// case "AST_FAIR2":
						// return true;
					default:
						return false;
				}
			} catch (e) {
				Log.error("Exception in DashboardInitial:fnCheckLockStatus function");
				this.handleException(e);
			}
		},
		_fnSetWarningMessage: function(aData) {
			try {
				aData = aData.WTEXT.split("@");
				this.getModel("avmetModel").setProperty("/WarningIndex", 0);
				this.getModel("avmetModel").setProperty("/WarningText", aData);
				this.getModel("avmetModel").setProperty("/WarningIndexText", aData[0]);
				this.getModel("avmetModel").setProperty("/WarningLeftBtn", false);
				var bFlag = aData.length > 1 ? true : false;
				this.getModel("avmetModel").setProperty("/WarningRightBtn", bFlag);
			} catch (e) {
				Log.error("Exception in DashboardInitial:_fnSetWarningMessage function");
				this.handleException(e);
			}
		},
		fnReplaceString: function(subTxt) {
			try {
				if (subTxt === undefined || subTxt === null || subTxt === "") {
					return;
				}
				var sReplaceText = this.getModel("avmetModel").getProperty("/login/air") +
					" " + this.getModel("avmetModel").getProperty("/airSel/modidtx") +
					" " + this.getModel("avmetModel").getProperty("/airSel/tailno");
				return subTxt.replace("&AMT&", sReplaceText);
			} catch (e) {
				Log.error("Exception in DashboardInitial:fnReplaceString function");
				this.handleException(e);
			}
		},
		fnCheckCapStatus: function() {
			try {
				var that = this,
					oPrmCAPStatus = {};
				//	oPrmCAPStatus.filter = "airid eq " + that.getAircraftId() + " and Tailid eq " + that.getTailId();
				oPrmCAPStatus.filter = "airid" + FilterOpEnum.EQ + that.getAircraftId() + FilterOpEnum.AND + "Tailid" + FilterOpEnum.EQ + that.getTailId();
				oPrmCAPStatus.error = function() {};

				oPrmCAPStatus.success = function(oData) {}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("CHECKCAPSTATUSSVC"), oPrmCAPStatus);
			} catch (e) {
				Log.error("Exception in fnCheckCapStatus function");
			}
		},
		//------------------------------------------------------------------
		// Function: handlePressToolTipMenu
		// Parameter: 
		// Description: Generic: This will get called, when open tooltip menu fragment.
		//Table: 
		//------------------------------------------------------------------

		handlePressToolTipMenu: function(sText, oEvent) {
			try {
				var that = this,
					oStatus, oTextdata, oResouceData,
					oButton, eDock, oModel, oDialogModel;
				oModel = AvMetInitialRecord.createInitialBlankRecord("ToolTip")[0];
				oResouceData = this.getView().getModel("i18n").getResourceBundle();
				oDialogModel = dataUtil.createNewJsonModel();
				if (!that._oToolTipFrag) {
					that._oToolTipFrag = sap.ui.xmlfragment("ToolTipId",
						"avmet.ah.fragments.ToolTipFragmentMenu",
						that);
					that.getView().addDependent(that._oToolTipFrag);
				}
				for (var i = 0; i < oModel.length; i++) {
					if (oModel[i].id === sText) {
						oDialogModel.setData([{
							"Text": oResouceData.getText(oModel[i].TTi18N)
						}]);

					}
				}
				that._oToolTipFrag.setModel(oDialogModel, "ToolTipModel");
				eDock = sap.ui.core.Popup.Dock;
				oButton = oEvent.getSource();
				that._oToolTipFrag.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);

			} catch (e) {
				Log.error("Exception in handlePressToolTipMenu function");
			}
		},
		////////////////////////////////////////////////////END DIALOG CREATION////////////////////////////////////
		_fnConvertCurrentTime: function(sValue) {
			var currDate = new Date();
			sValue.setSeconds(currDate.getSeconds());
			sValue.setDate(currDate.getDate());
			sValue.setMonth(currDate.getMonth());
			sValue.setFullYear(currDate.getFullYear());
			return sValue;
		},
		_fnDateTimeValid: function(sValue, minTime, maxTime, Lable) {

			if (!sValue) {
				return "";
			}
			var currDate = new Date();
			minTime.setSeconds(currDate.getSeconds());
			maxTime.setSeconds(currDate.getSeconds());
			sValue.setSeconds(currDate.getSeconds());
			minTime.setMilliseconds(currDate.getMilliseconds());
			maxTime.setMilliseconds(currDate.getMilliseconds());
			sValue.setMilliseconds(currDate.getMilliseconds());
			//sValue = this._fnConvertCurrentTime(sValue);
			if (sValue < minTime || sValue > maxTime) {
				return Lable + " can be " + this.formatter.defaultDateTimeFormat(minTime) + " - " + this.formatter.defaultDateTimeFormat(maxTime);
			}
			return "";
		},
		/** 
		 * If tailid is available
		 * @returns
		 */
		fnCheckTailAvail: function() {
			return (this.getTailId() !== "NA");
		},
		//AMIT KUMAR CHANGES 31082020 0207 
		fnRemovePerFromRadial: function(oEvent) {
			oEvent.getSource().onAfterRendering = function(oEvt) {
				oEvt.srcControl.getItems().forEach(function(oItem) {
					if (document.querySelector("#" + oItem.getId() + ">div>div>div>div>div>div>div")) {
						document.querySelector("#" + oItem.getId() + ">div>div>div>div>div>div>div").textContent = "";
					}
				}.bind(this));
			};
		},
		// S=SUCCESS, E=ERROR, I=INFORMATION,W=Warning
		fnShowMessage: function(sType, oData, hrex, callBack) {
			var sTitle = "";
			var sMsg = "";
			switch (sType) {
				case "S":
					sTitle = "Success";
					break;
				case "E":
					sTitle = "Error";
					break;
				case "I":
					sTitle = "Information";
					break;
				case "W":
					sTitle = "Warning";
					break;
			}
			sMsg = (!hrex ? "" : hrex.responseJSON.sortmessage);
			sMsg = (sMsg === "") ? oData.messages[0] : sMsg;
			sap.m.MessageBox.show(sTitle + ":" + sMsg);
		},
		handleBusyDialogOpen: function() {
			if (!this._oBusyFrag) {
				this._oBusyFrag = sap.ui.xmlfragment("BusyIndiId",
					"avmet.ah.fragments.BusyIndicatorDialog",
					this);
				this._oBusyFrag.open();
			}
		},
		handleBusyDialogClose: function() {
			this._oBusyFrag.close(this);
			this._oBusyFrag.destroy();
			delete this._oBusyFrag;

		},
		//------------------------------------------------------------------
		// Function: _fnFoundDuringGet
		// Parameter: oEvent
		// Description: General Method: This will get called, when to get found during data from backend.
		// Table: DDREF, DDVAL
		//------------------------------------------------------------------
		_fnFoundDuringGet: function(sAirId) {
			try {
				var that = this,
					oPrmFND = {};
				oPrmFND.filter = "ddid" + FilterOpEnum.EQ + "FND_&refid" + FilterOpEnum.EQ + this.getAircraftId();
				oPrmFND.error = function() {};
				oPrmFND.success = function(oData) {
					var oModel = dataUtil.createNewJsonModel();
					oModel.setData(oData.results);
					that.setModel(oModel, "FoundDuringSet");
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("MASTERDDREFSVC"), oPrmFND);
			} catch (e) {
				Log.error("Exception in _fnFoundDuringGet function");
			}
		},
		_fnADDGet: function() {
			try {
				var that = this,
					oPrmLimGet = {};
				//		oPrmLimGet.filter = "CAPTY eq A and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
				oPrmLimGet.filter = "CAPTY" + FilterOpEnum.EQ + "A&AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&tailid" + FilterOpEnum.EQ +
					that.getTailId();
				oPrmLimGet.error = function() {};

				oPrmLimGet.success = function(oData) {}.bind(this);

				ajaxutil.fnRead(this.getResourceBundle().getText("CHECKADDLIMITATIONSSVC"), oPrmLimGet);
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
					oPrmLimGet = {};
				//	oPrmLimGet.filter = "CAPTY eq L and AIRID eq " + this.getAircraftId() + " and tailid eq " + that.getTailId();
				oPrmLimGet.filter = "CAPTY" + FilterOpEnum.EQ + "L&AIRID" + FilterOpEnum.EQ + this.getAircraftId() + "&tailid" + FilterOpEnum.EQ +
					that.getTailId();
				oPrmLimGet.error = function() {};
				oPrmLimGet.success = function(oData) {}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("CHECKADDLIMITATIONSSVC"), oPrmLimGet);
			} catch (e) {
				Log.error("Exception in Limitations:_fnLimitationsGet function");
				this.handleException(e);
			}
		},

		// ***************************************************************************
		//  Profile Section  
		// ***************************************************************************	
		// Change Pin

		onProfileModelLoad: function(oEvent) {
			//var oProfileModel = this.getModel("oProfileModel");

			try {
				var that = this,
					oParameter = {};

				oParameter.error = function(error) {
					MessageBox.error(error.responseText);
				};
				oParameter.success = function(oData) {
					if (oData.results.length) {
						// Populate Profile UserId/Name

						this.getModel("oProfileModel").setProperty("/userId", oData.results[0].plantuser);
						//Rahul: 24/11/2020: 07:07PM: oData.results[0].TITLE + ". " code added
						this.getModel("oProfileModel").setProperty("/userName", oData.results[0].TITLE + ". " + oData.results[0].namefirst + " " +
							oData.results[0].namelast);
					}
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("EMPPINPWDSVC"), oParameter);

			} catch (e) {
				Log.error("Exception in onProfileModelLoad function");
				this.handleException(e);
			}
		},

		onChangePinPress: function(oEvent) {
			this.openDialog("ChangePin", ".fragments.");
		},
		onChangePwdPress: function(oEvent) {
			this.openDialog("ChangePassword", ".fragments.");
		},
		onSaveChangePin: function(oEvent) {
			var that = this;
			if (!that._validateChangedPin(oEvent)) {
				that._saveChangedPin(oEvent);
				that.closeDialog("ChangePin");
			}
		},
		onSaveChangePwd: function(oEvent) {
			var that = this;
			if (!that._validateChangedPwd(oEvent)) {
				that._saveChangedPin(oEvent);
				that.closeDialog("ChangePassword");
			}
		},
		_validateChangedPin: function(oEvent) {

			var aChangedUser = this.getView().getModel("oProfileModel").getData();
			if (aChangedUser.newPin === "") {
				MessageBox.error("Pin can not be blank");
				return true; //Invalid
			}
			if (aChangedUser.newPin.length !== 6) {
				MessageBox.error("Pin should be of 6 digits");
				return true; //Invalid
			}
			if (aChangedUser.newPin !== aChangedUser.newCPin) {
				MessageBox.error("Pin is not matching");
				return true; //Invalid
			} else {
				return false; //Valid
			}
		},
		_validateChangedPwd: function(oEvent) {

			var aChangedUser = this.getView().getModel("oProfileModel").getData();
			var errorMsg = this._validatePasswordStr(aChangedUser.newPwd);
			if (errorMsg) {
				MessageBox.error(errorMsg);
				return true; // Invalid
			}
			if (aChangedUser.newPwd !== aChangedUser.newCPwd) {
				MessageBox.error("Password is not matching");
				return true; //Invalid
			} else {
				return false; //Valid
			}
		},
		_validatePasswordStr: function(password) {
			try {
				var strength = 0;
				var lv_message = "";
				var inValid = false;
				if (password.match(/[a-z]+/)) {
					strength += 1;
				}
				if (password.match(/[A-Z]+/)) {
					strength += 1;
				}
				if (password.match(/[0-9]+/)) {
					strength += 1;
				}
				if (password.match(/[$@#&!]+/)) {
					strength += 1;
				}
				if (password.length < 12) {
					lv_message = "minimum number of characters is 12";
					inValid = true;
				} else {
					strength += 1;
				}

				if (password.length > 24) {
					lv_message = "maximum number of characters is 24";
					inValid = true;
				} else {
					strength += 1;
				}

				if (strength < 5) {
					lv_message = "password is weak.Use strong password";
					inValid = true;
				}
				if (inValid) {
					//	this.getView().byId("ipPassword").setValueState(sap.ui.core.ValueState.Error);
					//	this.getView().byId("ipPassword").setValueStateText(lv_message);
					return lv_message;
				} else {
					return false;
				}
			} catch (e) {}

		},
		_saveChangedPin: function(oEvent) {
			var that = this;

			var aChangedUser = that.getView().getModel("oProfileModel").getData(); //oEvent.getSource().getBindingContext("oProfileModel").getObject();
			aChangedUser.newPin = dataUtil._AESHexEncript(aChangedUser.newPin); //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
			aChangedUser.oldPin = dataUtil._AESHexEncript(aChangedUser.oldPin); //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
			if (aChangedUser.newPwd !== "" || aChangedUser.newPwd !== undefined) {
				aChangedUser.newPwd = dataUtil._AESHexEncript(aChangedUser.newPwd); //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
				aChangedUser.oldPwd = dataUtil._AESHexEncript(aChangedUser.oldPwd); //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
			} else {
				aChangedUser.newPwd = "";
				aChangedUser.oldPwd = "";
			}
			var userDetail = {
				plantuser: aChangedUser.userId,
				namefirst: "",
				namelast: "",
				TITLE: "", //LAKSHMI: 26/11/2020 : 02:47 PM: Changed FOR RESOLVING ERROR
				oldpin: aChangedUser.oldPin,
				pin: aChangedUser.newPin,
				oldpwd: aChangedUser.oldPwd,
				pwd: aChangedUser.newPwd
			};
			var oParameter = {};
			oParameter.error = function(error) {
				//Rahul: 26/11/2020 : 02:47 PM: Changed FOR Display ERROR-Start
				try {
					var oErrorMes = JSON.parse(error.responseText).sortmessage.replace("RAISERROR executed: ", "");
					MessageBox.error(oErrorMes);
				} catch (e) {
					MessageBox.error(error.responseText);
				}
				//Rahul: 26/11/2020 : 02:47 PM: Changed FOR Display ERROR-End	
			};
			oParameter.success = function() {
				that.getView().getModel("oProfileModel").refresh();
				MessageBox.show("Changes are saved");
			};
			ajaxutil.fnUpdate(this.getResourceBundle().getText("EMPPINPWDSVC"), oParameter, [userDetail], "ZRM_E_REPL", this);
		},

		onCancel: function(oEvent) {
			var that = this;
			that.closeDialog("ChangePin");
			that.closeDialog("ChangePassword");
		},
		onWarningMessageSelect: function(oEvent,sText) {
			try {
				var oButton = oEvent.getSource(),
					oDialogModel = dataUtil.createNewJsonModel();

				if (!this._oPopover) {
					sap.ui.core.Fragment.load({
						name: "avmet.ah.fragments.WarningMessage",
						controller: this
					}).then(function(oPopover) {
						this._oPopover = oPopover;
						this.getView().addDependent(this._oPopover);
						this._oPopover.setModel(oDialogModel, "ToolTipModel");
						this._oPopover.getModel("ToolTipModel").setProperty("/Text", sText);
						this._oPopover.openBy(oButton);
					}.bind(this));
				} else {
					this._oPopover.getModel("ToolTipModel").setProperty("/Text", sText);
					this._oPopover.openBy(oButton);
				}
			} catch (e) {
				//Log.error("Exception in handlePressToolTipMenu function");
			}
		}

	});

});