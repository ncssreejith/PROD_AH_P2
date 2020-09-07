/* eslint no-console: "error" */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"../model/dataUtil",
	"sap/base/Log",
	"../util/html2pdfbundle",
	"avmet/ah/util/ajaxutil",
	"avmet/ah/util/cvUtil",
	"../model/AvMetInitialRecord"
], function(Controller, JSONModel, MessageToast, Fragment, dataUtil, Log, html2pdfbundle, ajaxutil, cvUtil, AvMetInitialRecord) {
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
			dataUtil.getDataSet(this.getOwnerComponent().appModel).airSel.tailid
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
				if (fragId !== null && fragId !== undefined && fragId.length > 1) {
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

			if (viewName !== undefined && viewName !== null) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo(viewName);
			} else {

				var oHistory, sPreviousHash;
				oHistory = sap.ui.core.routing.History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("DashboardInitial", {}, true /*no history*/ );
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
		fnLoadSrv1Dashboard: function() {
			try {
				var oParameter = {};
				oParameter.filter = "tailid eq " + this.getTailId() + " and REFID eq " + this.getAircraftId();
				oParameter.error = function() {};
				oParameter.success = function(oData) {
					if (oData && oData.results.length && oData.results.length > 0) {
						oData.results[0].txt3 = this.fnReplaceString(oData.results[0].txt3);
						oData.results[0].txt2 = this.fnReplaceString(oData.results[0].txt2);
						this.getModel("avmetModel").setProperty("/dash", oData.results.length > 0 ? oData.results[0] : {});
						var oDash = this.getModel("avmetModel").getProperty("/dash");
						var oModel = this.getView().getModel("avmetModel");
						oModel.setProperty("/UnlockAVMET", this.fnCheckLockStatus(oDash.astid));
						if (this.fnOverwriteStatus(oDash.astid)) {
							oModel.setProperty("/dash/TBTN3", true);
						}
						oModel.setProperty("/UnlockRec", this.fnCheckRecLockStatus(oDash.astid));
						this.fnSetMenuVisible(oDash.TBTN1, this.fnFindRoleChangeStations);
						this.fnSetMenuVisible(oDash.TBTN2, this.fnFindCreateFlightService);
						this.fnSetMenuVisible(oDash.TBTN3, this.fnFindCosjobs);
						this.getModel("menuModel").refresh();
						this.getModel("avmetModel").refresh();
					}
				}.bind(this);
				avmet.ah.util.ajaxutil.fnRead("/DashboardCountsSvc", oParameter);
			} catch (e) {
				Log.error("Exception in fnLoadSrv1Dashboard function");
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
				dataUtil.setDataSet("oUserSession", null);
				sap.m.URLHelper.redirect("/avmetlogin/index.html", false);
			} catch (e) {
				Log.error("Exception in onLogoffPress function");
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
					case "AST_FAIR0":
						// case "AST_FAIR1":
						// case "AST_FAIR2":
						return true;
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
				if (subTxt === undefined || subTxt === null) {
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
				oPrmCAPStatus.filter = "airid eq " + that.getAircraftId() + " and Tailid eq " + that.getTailId();
				oPrmCAPStatus.error = function() {};

				oPrmCAPStatus.success = function(oData) {}.bind(this);

				ajaxutil.fnRead("/CheckCapStatusSvc", oPrmCAPStatus);
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
			sValue = this._fnConvertCurrentTime(sValue);
			if (sValue < minTime || sValue > maxTime) {
				return Lable + " can be " + this.formatter.defaultDateTimeFormat(minTime) + " - " + this.formatter.defaultDateTimeFormat(maxTime);
			}
			return "";
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
		}

	});

});