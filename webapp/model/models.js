sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";
	/* ***************************************************************************
    *   This file is for crreating local models              
     *************************************************************************** */
	return {
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createMainModel: function () {
			var oModel = new JSONModel({
				"BeforeFlight": [{
					"Station": "Station 1",
					"imageUrl": "css/img/Section-1.png",
					"Target": "Lau 129",
					"TargetSno": "123",
					"Destination": "AIM 120 Aur",
					"bDestinationTitle": true,
					"DestinationSno": "12345",
					"Connecter": true,
					"bMissiles": true,
					"bBombsBDU": false,
					"bPods": true,
					"bBombsGBU": false,
					"bTanks": false,
					"Missiles": [{
							"Text": "AIM 9 Aur",
							"Active": "true",
							"SNo": "",
							"Quantity": ""
						}, {
							"Text": "AIM 9M CAP",
							"Active": "true",
							"SNo": "",
							"Quantity": ""
						}, {
							"Text": "AIM 120 Aur",
							"Active": "false",
							"SNo": "12345",
							"Quantity": ""
						}, {
							"Text": "AIM 120M CAP",
							"Active": "true",
							"SNo": "",
							"Quantity": ""
						}

					],
					"Pods": [{
						"Text": "ACMI",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AMA",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}]

				}, {
					"Station": "Station 2",
					"imageUrl": "css/img/Section-2.png",
					"Target": "S210 Msl Lau",
					"TargetSno": "123",
					"Destination": "",
					"bDestinationTitle": false,
					"DestinationSno": "",
					"Connecter": false,
					"bMissiles": true,
					"bBombsBDU": false,
					"bPods": true,
					"bBombsGBU": false,
					"bTanks": false,
					"Missiles": [{

						"Text": "AIM 9 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 9M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""

					}],
					"Pods": [{

						"Text": "ACMI",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AMA",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}]

				}, {
					"Station": "Station 3",
					"imageUrl": "css/img/Section-3.png",
					"Target": "Lau 129",
					"TargetSno": "123",
					"bDestinationTitle": false,
					"Destination": "",
					"DestinationSno": "",
					"Connecter": false,
					"bMissiles": true,
					"bBombsBDU": true,
					"bPods": true,
					"bBombsGBU": true,
					"bTanks": false,
					"Missiles": [{

						"Text": "AIM 9 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 9M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}]

					,
					"Pods": [{

						"Text": "ACMI",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AMA",
						"Active": "true",
						"SNo": "",
						"Quantity": ""

					}],
					"BombsBDU": [{

						"Text": "BDU",
						"Active": "false",
						"SNo": "12345",
						"Quantity": ""
					}, {
						"Text": "BDU 50",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {

						"Text": "BDU 56",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],

					"BombsGBU": [{

						"Text": "GBU 10",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 12",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 49",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}]
				}, {
					"Station": "Station 4",
					"imageUrl": "css/img/Section-4.png",
					"Target": "370 Gal Wing Tank",
					"TargetSno": "123",
					"Destination": "",
					"bDestinationTitle": false,
					"DestinationSno": "",
					"Connecter": true,
					"bMissiles": false,
					"bBombsBDU": true,
					"bPods": false,
					"bBombsGBU": true,
					"bTanks": false,
					"BombsBDU": [{
						"Text": "BDU",
						"Active": "false",
						"SNo": "12345",
						"Quantity": ""
					}, {
						"Text": "BDU 50",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "BDU 56",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],
					"BombsGBU": [{
						"Text": "GBU 10",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 12",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 49",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}]
				}, {
					"Station": "Station 5",
					"imageUrl": "css/img/Section-5.png",
					"Target": "Centerline Pylon",
					"TargetSno": "123",
					"bDestinationTitle": true,
					"Destination": "Centerline Tank",
					"DestinationSno": "12345",
					"Connecter": true,
					"bMissiles": false,
					"bBombsBDU": false,
					"bPods": false,
					"bBombsGBU": false,
					"bTanks": true,
					"Tanks": [{
						"Text": "Centerline Tank",
						"Active": "true",
						"SNo": "12345",
						"Quantity": ""
					}]
				}, {
					"Station": "Station 6",
					"imageUrl": "css/img/Section-6.png",
					"Target": "370 Gal Wing Tank",
					"TargetSno": "123",
					"Destination": "",
					"DestinationSno": "",
					"Connecter": false,
					"bMissiles": false,
					"bBombsBDU": true,
					"bPods": false,
					"bBombsGBU": true,
					"bTanks": false,
					"BombsBDU": [{
						"Text": "BDU 33",
						"Active": "false",
						"SNo": "12345",
						"Quantity": ""
					}, {
						"Text": "BDU 50",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "BDU 56",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],
					"BombsGBU": [{
						"Text": "GBU 10",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 12",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 49",
						"Active": "true",
						"SNo": "",
						"Quantity": ""

					}]
				}, {
					"Station": "Station 7",
					"imageUrl": "css/img/Section-7.png",
					"Target": "Lau 129",
					"TargetSno": "123",
					"Destination": "",
					"bDestinationTitle": false,
					"DestinationSno": "",
					"Connecter": true,
					"bMissiles": true,
					"bBombsBDU": true,
					"bPods": true,
					"bBombsGBU": true,
					"bTanks": false,
					"Missiles": [{
						"Text": "AIM 9 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 9M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],
					"Pods": [{
						"Text": "ACMI",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AMA",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],
					"BombsBDU": [{
						"Text": "BDU",
						"Active": "false",
						"SNo": "12345",
						"Quantity": ""
					}, {
						"Text": "BDU 50",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "BDU 56",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],
					"BombsGBU": [{
						"Text": "GBU 10",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 12",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "GBU 49",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}]
				}, {
					"Station": "Station 8",
					"imageUrl": "css/img/Section-8.png",
					"Target": "S210 Msl Lau",
					"TargetSno": "123",
					"Destination": "",
					"bDestinationTitle": false,
					"DestinationSno": "",
					"Connecter": false,
					"bMissiles": true,
					"bBombsBDU": false,
					"bPods": true,
					"bBombsGBU": false,
					"bTanks": false,
					"Missiles": [{
						"Text": "AIM 9 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 9M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],
					"Pods": [{
						"Text": "ACMI",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AMA",
						"Active": "true",
						"SNo": "",
						"Quantity": ""

					}]
				}, {
					"Station": "Station 9",
					"imageUrl": "css/img/Section-9.png",
					"Target": "Lau 129",
					"TargetSno": "123",
					"Destination": "AIM 120 Aur",
					"bDestinationTitle": true,
					"DestinationSno": "12345",
					"Connecter": true,
					"bMissiles": true,
					"bBombsBDU": false,
					"bPods": true,
					"bBombsGBU": false,
					"bTanks": false,
					"Missiles": [{
						"Text": "AIM 9 Aur",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 9M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AIM 120 Aur",
						"Active": "false",
						"SNo": "12345",
						"Quantity": ""
					}, {
						"Text": "AIM 120M CAP",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}],
					"Pods": [{
						"Text": "ACMI",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}, {
						"Text": "AMA",
						"Active": "true",
						"SNo": "",
						"Quantity": ""
					}]
				}]
			});
			return oModel;
		}
	};
});