sap.ui.define([
	"./BaseController",
	"avmet/ah/util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/base/Log"
], function(BaseController, ajaxutil, JSONModel, MessageBox, Log) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.FileUpload", {
		onInit: function() {
			try {
				this.getView().setModel(new JSONModel({}), "FileUploadModel");
				this.getView().getModel("FileUploadModel").setProperty("/ActionKey", "NA");
				this.getView().getModel("FileUploadModel").setProperty("/ActionBtnVis", false);
				this._fnGetTableDD();
				var oDataSet = this.getDataSet("FilePath");
				if (oDataSet) {
					this.getView().getModel("FileUploadModel").setProperty("/filePath", oDataSet.oData.filePath);
				}
			} catch (e) {
				Log.error("Exception in FileUpload:onInit function");
				this.handleException(e);
			}
		},

		onFileInput: function(oEvent) {
			//this.fnFileValidate(oEvent.getSource().getValue());
		},

		fnFileValidate: function(sPath) {
			try {
				if (!sPath) {
					MessageBox.error("No file path found");
					return false;
				}
				sPath = sPath.split("/")[sPath.split("/").length - 1];
                 //Rahul 16/11/2020 : 11:09AM: Code commented ///////////
			/*	if (!sPath.match("^[a-zA-Z0-9]{1,200}\\.[a-zA-Z0-9]{1,10}$")) {
					MessageBox.error("Invalid file name");
					return false;
				}*/
				////////////////////////////////////////////////////////
				return true;
			} catch (e) {
				Log.error("Exception in FileUpload:fnFileValidate function");
				this.handleException(e);
			}
		},

		onActionSelected: function(oEvent) {
			try {
				var sKey = oEvent.getSource().getSelectedKey();
				this.getView().getModel("FileUploadModel").setProperty("/ActionBtnVis", true);
				if (sKey === "UPLOAD") {
					this.getView().getModel("FileUploadModel").setProperty("/ButtonText", "Upload");
				} else {
					this.getView().getModel("FileUploadModel").setProperty("/ButtonText", "Download");
				}
			} catch (e) {
				Log.error("Exception in FileUpload:onActionSelected function");
				this.handleException(e);
			}
		},

		onPressActionBtn: function() {
			try {
				var sTableKey = this.getView().getModel("FileUploadModel").getProperty("/TableKey"),
					sTableDetails = sTableKey.split("-"),
					sTableK = sTableDetails[0],
					sPath = this.getView().getModel("FileUploadModel").getProperty("/filePath"),
					sActionKey = this.getView().getModel("FileUploadModel").getProperty("/ActionKey");
				if (sActionKey === "UPLOAD") {
					if (this.fnFileValidate(sPath)) {

						this._postFile(sTableK, sPath);
					}
				} else {
					this._DownloadFile(sTableK, sPath);
				}

				this.setDataSet("FilePath", new JSONModel({
					"filePath": sPath
				}));
			} catch (e) {
				Log.error("Exception in FileUpload:onPressActionBtn function");
				this.handleException(e);
			}

		},

		_fnGetTableDD: function(sTailId) {
			try {
				var oPrmWB = {};
				oPrmWB.error = function() {};
				oPrmWB.success = function(oData) {
					this.getView().getModel("FileUploadModel").setProperty("/TableNameSet", oData.results);
				}.bind(this);
				ajaxutil.fnRead(this.getResourceBundle().getText("FILESVC"), oPrmWB);
			} catch (e) {
				Log.error("Exception in FileUpload:_fnGetTableDD function");
				this.handleException(e);
			}
		},

		_postFile: function(sTableK, sPath) {
			try {
				var oPayload = [],
					oPrmWBMCreate = {};
				oPayload.push({
					"TABNM": sTableK,
					"TDESC": "",
					"ACT": "UPLOAD",
					"FPATH": sPath,
					"TOT_REC": "0",
					"TOT_SUCC_REC": "0",
					"TOT_ER_REC": "0"
				});
				oPrmWBMCreate.error = function(err) {
					MessageBox.error(err.responseText);
				};

				oPrmWBMCreate.success = function(oData) {
					MessageBox.success("File Uploaded." + "\n Total Records: " + oData.results[0].TOT_REC + "\n Success records: " + oData.results[0]
						.TOT_SUCC_REC +
						"\n Error Records: " + oData.results[0].TOT_ER_REC);
				}.bind(this);
				oPrmWBMCreate.activity = 4;
				ajaxutil.fnCreate(this.getResourceBundle().getText("FILESVC"), oPrmWBMCreate, oPayload, "ZRM_S_UPLD", this);
			} catch (e) {
				Log.error("Exception in FileUpload:_postFile function");
				this.handleException(e);
			}
		},

		_DownloadFile: function(sTableK, sPath) {
			try {
				var oPayload = [],
					oPrmWBMCreate = {};
				oPayload.push({
					"TABNM": sTableK,
					"TDESC": "",
					"ACT": "DOWNLOAD",
					"FPATH": sPath,
					"TOT_REC": "0",
					"TOT_SUCC_REC": "0",
					"TOT_ER_REC": "0"
				});
				oPrmWBMCreate.error = function(err) {
					MessageBox.error(err.responseText);
				};

				oPrmWBMCreate.success = function(oData) {
					if (oData && oData.results.length > 0) {
						MessageBox.success("File Downloaded");
					}

				}.bind(this);

				ajaxutil.fnCreate(this.getResourceBundle().getText("FILESVC"), oPrmWBMCreate, oPayload);
			} catch (e) {
				Log.error("Exception in FileUpload:_postFile function");
				this.handleException(e);
			}

		},

		setDataSet: function(vDataSetName, oDataSet) {
			try {
				this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
				this._storage.put(vDataSetName, oDataSet);
				return true;
			} catch (e) {
				Log.error("Exception in FileUpload:setDataSet function");
				this.handleException(e);
			}
		},

		getDataSet: function(vDataSetName) {
			try {
				if (this._storage === undefined) {
					this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
					var oDataSet = this._storage.get(vDataSetName);
					return this._storage.get(vDataSetName) === null ? null : oDataSet;
				}
			} catch (e) {
				Log.error("Exception in FileUpload:getDataSet function");
				this.handleException(e);
			}
		}
	});
});