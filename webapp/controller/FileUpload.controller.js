sap.ui.define([
	"./BaseController",
	"avmet/ah/util/ajaxutil",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(BaseController, ajaxutil, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("avmet.ah.controller.FileUpload", {
		onInit: function() {
			this.getView().setModel(new JSONModel({}), "FileUploadModel");
			this.getView().getModel("FileUploadModel").setProperty("/ActionKey", "NA");
			this.getView().getModel("FileUploadModel").setProperty("/ActionBtnVis", false);
			this._fnGetTableDD();
			var oDataSet = this.getDataSet("FilePath");
			if (oDataSet) {
				this.getView().getModel("FileUploadModel").setProperty("/filePath", oDataSet.oData.filePath);
			}
		},

		onActionSelected: function(oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();
			this.getView().getModel("FileUploadModel").setProperty("/ActionBtnVis", true);
			if (sKey === "UPLOAD") {
				this.getView().getModel("FileUploadModel").setProperty("/ButtonText", "Upload");
			} else {
				this.getView().getModel("FileUploadModel").setProperty("/ButtonText", "Download");
			}
		},

		onPressActionBtn: function() {
			var sTableKey = this.getView().getModel("FileUploadModel").getProperty("/TableKey"),
				sTableDetails = sTableKey.split("-"),
				sTableK = sTableDetails[0],
				sTableName = sTableDetails[1],
				sPath = this.getView().getModel("FileUploadModel").getProperty("/filePath"),
				sActionKey = this.getView().getModel("FileUploadModel").getProperty("/ActionKey");
			if (sActionKey === "UPLOAD") {
				//if (sPath.search(sTableName) !== -1) {
				this._postFile(sTableK, sPath);
				//}
			} else {
				this._DownloadFile(sTableK, sPath);
			}

			this.setDataSet("FilePath", new JSONModel({
				"filePath": sPath
			}));

		},

		_fnGetTableDD: function(sTailId) {
			var oPrmWB = {};
			oPrmWB.error = function() {};
			oPrmWB.success = function(oData) {
				this.getView().getModel("FileUploadModel").setProperty("/TableNameSet", oData.results);
			}.bind(this);
			ajaxutil.fnRead("/FileSvc", oPrmWB);
		},

		_postFile: function(sTableK, sPath) {
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
			oPrmWBMCreate.error = function() {
				MessageBox.success("Error occured during file Uploaded.");
			};

			oPrmWBMCreate.success = function(oData) {
				MessageBox.success("File Uploaded." + "\n Total Records: " + oData.results[0].TOT_REC + "\n Success records: " + oData.results[0]
					.TOT_SUCC_REC +
					"\n Error Records: " + oData.results[0].TOT_ER_REC);
			}.bind(this);

			ajaxutil.fnCreate("/FileSvc", oPrmWBMCreate, oPayload);
		},

		_DownloadFile: function(sTableK, sPath) {
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
			oPrmWBMCreate.error = function() {
				MessageBox.error("Error occured during download.");
			};

			oPrmWBMCreate.success = function(oData) {
				if (oData && oData.results.length > 0) {
					MessageBox.success("File Downloaded");	
				}
				
			}.bind(this);

			ajaxutil.fnCreate("/FileSvc", oPrmWBMCreate, oPayload);
		},

		setDataSet: function(vDataSetName, oDataSet) {
			this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
			this._storage.put(vDataSetName, oDataSet);
			return true;
		},

		getDataSet: function(vDataSetName) {
			if (this._storage === undefined) {
				this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
				var oDataSet = this._storage.get(vDataSetName);
				return this._storage.get(vDataSetName) === null ? null : oDataSet;
			}
		}
	});
});