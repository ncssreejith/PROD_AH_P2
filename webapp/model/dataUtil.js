sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";
	/* *******************************************************************************************************************
    *   This file is for Managing Database/Ajax/OData Calls               
    *   1. getDataSet : To getting the saved data from local storage. 
    *                   eg: Previously if the data for Table 'POTable' have saved as 'POTableData', 
    *					you will get the saved data by calling getDataSet('POTableData') from controller
    *	2. setDataSet : If you have a dataset in view which you have to save to backed,use this (as per now it will save locally) 
    *                   eg: If you have a dataset 'oPOTableData' for the Table 'POTable',then send the data as 
    *					setDataSet('POTableData',oPOTableData) from controller
    *   3. getJsonModel : If you wanted to get the saved dataset as JSON model, instead of calling getDataSet, use this method.
    *					  It will give you the JSON model insead of data.
    *	4. createJsonModel : If you wanted to create JSON model, always use this function instead of writting it in controller.
    *						 This will help us to find JSON model usage in entire application 
     ******************************************************************************************************************* */
	return {
		/* Function : getDataSet
		*  parameter : vDataSetName
		*  To get the data from local storage
		*/
		getDataSet: function(vDataSetName){
			if(this._storage === undefined)
			this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
			var oDataSet = this._storage.get(vDataSetName);
			return this._storage.get(vDataSetName)===null? null:oDataSet;
		},
		/* Function : setDataSet
		*  parameter : vDataSetName
		*  parameter : oDataSet
		*  To set the data from local storage
		*/
		setDataSet: function(vDataSetName,oDataSet){
			this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
			this._storage.put(vDataSetName, oDataSet);
			return true;
		},
		/* Function : getJsonModel
		*  parameter : vDataSetName
		*  To get Json model by passing data set
		*/
		getJsonModel: function(vDataSetName){
			return this.createJsonModel(this.getDataSet(vDataSetName));
		},
		/* Function : createJsonModel
		*  parameter : oDataSet
		*  To create Json model by passing data set
		*/
		createJsonModel: function(oDataSet){
			return (oDataSet!== undefined && oDataSet!== null)?new sap.ui.model.json.JSONModel(oDataSet):null;
		},
		createNewJsonModel: function () {
			return new JSONModel();
		},

	};
});