/*global CryptoJS*/
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"../util/crypto"
], function(JSONModel, Device, crypto) {
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
		// destination 
		//Rahul: 25/11/2020: 06:53 removed destination and Username and PWD
		destination: "/AVMET/gold",
		username: "EA12345",
		pwd: "pass1234",
		
		/* Function : getDataSet
		 *  parameter : vDataSetName
		 *  To get the data from local storage
		 */
		/*	Rahul: 23/11/2020: 10:42AM: changed dataUtil file location to util and changed in all controllers
		 added crypto.js file for AES encription */
		getDataSet: function(vDataSetName) {
			if (this._storage === undefined) {
				this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
			}
			var oDataSet = this._storage.get(vDataSetName);
			var info = this._storage.get(vDataSetName) === null ? null : oDataSet;
			return this._decryptInfo(info);
		},
		/* Function : setDataSet
		 *  parameter : vDataSetName
		 *  parameter : oDataSet
		 *  To set the data from local storage
		 */
		setDataSet: function(vDataSetName, oDataSet) {
			this._storage = new jQuery.sap.storage.Storage(jQuery.sap.storage.Type.local);
			this._storage.put(vDataSetName, this._encriptInfo(oDataSet)); //Sreejith: 25/11/2020 : 11:27 AM: Changed _encriptInfo to _AESHexEncript 
			//Sreejith: 25/11/2020 : 08:27 AM: Changed_AESHexEncript to _encriptInfo
			return true;
		},
		/* Function : getJsonModel
		 *  parameter : vDataSetName
		 *  To get Json model by passing data set
		 */
		getJsonModel: function(vDataSetName) {
			return this.createJsonModel(this.getDataSet(vDataSetName));
		},
		/* Function : createJsonModel
		 *  parameter : oDataSet
		 *  To create Json model by passing data set
		 */
		createJsonModel: function(oDataSet) {
			return (oDataSet !== undefined && oDataSet !== null) ? new sap.ui.model.json.JSONModel(oDataSet) : null;
		},
		createNewJsonModel: function() {
			return new JSONModel();
		},

		fnGetUIEncriptionKey: function(info) {
			//Rahul: 25/11/2020: 07:17PM : EncriptionKey Changes (Sreejith)
			return 'Yq3t6w9z$C&F)J@'; // Later will replace with service call
			//return '8Cnh7Ks5Mp';
		},
		/*	Rahul: 23/11/2020: 10:42AM: changed for VAPT Password HASH START*/
		_AESHexEncript: function(value) {
			var pwhash = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(this.fnGetUIEncriptionKey()));
			var key = CryptoJS.enc.Hex.parse(pwhash.toString(CryptoJS.enc.Hex).substr(0, 32));

			var encrypted = CryptoJS.AES.encrypt(value, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});

			return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
		},
		_AESBase64Encript: function(value) {
			var pwhash = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(this.fnGetUIEncriptionKey()));
			var key = CryptoJS.enc.Base64.parse(pwhash.toString(CryptoJS.enc.Base64).substr(0, 32));

			var encrypted = CryptoJS.AES.encrypt(value, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});

			return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
		},
		_AESHexDecript: function(value) {
			var ciphertext = CryptoJS.enc.Hex.parse(value);
			var pwhash = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(this.fnGetUIEncriptionKey()));
			var key = CryptoJS.enc.Hex.parse(pwhash.toString(CryptoJS.enc.Hex).substr(0, 32));
			var decrypted = CryptoJS.AES.decrypt({
				ciphertext: ciphertext
			}, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return decrypted.toString(CryptoJS.enc.Utf8);
		},
		_AESBase64Decript: function(value) {
			var ciphertext = CryptoJS.enc.Base64.parse(value);
			var pwhash = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(this.fnGetUIEncriptionKey()));
			var key = CryptoJS.enc.Base64.parse(pwhash.toString(CryptoJS.enc.Base64).substr(0, 32));
			var decrypted = CryptoJS.AES.decrypt({
				ciphertext: ciphertext
			}, key, {
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			});
			return decrypted.toString(CryptoJS.enc.Utf8);
		},
		/*	Rahul: 23/11/2020: 10:42AM: changed for VAPT Password HASH END*/
		_encriptInfo: function(info) {
			try {
				//	
				if (info) {
					info = btoa(btoa(JSON.stringify(info)) + this.fnGetUIEncriptionKey());
					return info;
				}
				return null;
			} catch (e) {
				return info;
			}

		},
		_decryptInfo: function(info) {
			try {
				if (info) {
					info = atob(info);
					info = info.replace(this.fnGetUIEncriptionKey(), '');
					info = atob(info);
					return JSON.parse(info);
				}
				return null;
			} catch (e) {
				return info;
			}

		},
		/*	Rahul: 23/11/2020: 10:42AM: changed for VAPT file upload issue Start*/
		_fileMimeVerification: function(src) {
				//var src = e.target.result;
				var bFlag = false;
				var byteString = src.split(',')[1];
				if (byteString) {
					var raw = atob(byteString);
					var result = '';
					for (var i in raw) {
						if (i <= 7) {
							var hex = raw.charCodeAt(i).toString(16);
							result += (hex.length === 2 ? hex : '0' + hex);
						} else {
							break;
						}
					}
					var header = result.substring(0, 8);
					switch (header) {
						case "89504e47":
							bFlag = true;
							break;
						case "47494638":
							bFlag = true;
							break;
						case "ffd8ffe0":
						case "ffd8ffe1":
						case "ffd8ffe2":
						case "ffd8ffe3":
						case "ffd8ffe8":
							bFlag = true;
							break;
						default:
							bFlag = false; // Or you can use the blob.type as fallback
							break;
					}
				} else {
					bFlag = false;
				}
				return bFlag;
			}
			/*	Rahul: 23/11/2020: 10:42AM: changed for VAPT file upload issue End*/

	};
});