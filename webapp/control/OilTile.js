sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Label",
	"sap/m/Button"
], function (Control, Label, Button) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : Micro chart with Button
	 *	 Usage : To display the Circle chart with button
	 *   Functions : onmouseover , setButtonText
	 *   Properties : 
	 *   Note : 
	 *************************************************************************** */
	return Control.extend("avmet.ah.control.OilTile", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				count: {
					type: "string",
					defaultValue: ""
				},
				serviceAmount: {
					type: "string",
					defaultValue: ""
				},
				footerLeftInfo: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				content: {
					type: "sap.ui.core.Control"
				}
			},
			defaultAggregation: "content",
			events: {
				press: {},
				hover: {}
			}
		},
		onmouseover: function (evt) {
			this.fireHover({});
		},
		ontap: function (oEvent) {
			this.firePress(oEvent);
		},
		init: function () {

		},

		renderer: function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("OilTileContainer");
			oRM.writeClasses();
			oRM.write(">");
				oRM.write("<div class='OilTileContentTop'>");
					oRM.write("<div class='OilTileLeftContent'>");
						oRM.write("<div class='OilTileTitle'>");
							oRM.write(oControl.getTitle());
						oRM.write("</div>");
						oRM.write("<div class='OilTileCount'>");
							oRM.write(oControl.getCount());
						oRM.write("</div>");
					oRM.write("</div>");
					oRM.write("<div class='OilTileRightContent'>");
						oRM.write("<div class='OilTileServicedAmt'>");
							oRM.write(oControl.getServiceAmount());
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				
				oRM.write("<div class='OilLine'>");
				oRM.write("</div>");
				
				oRM.write("<div class='FuelTileContentBottom'>");
					oRM.write("<div class='OilTileFooterLeft'>");
						oRM.write(oControl.getFooterLeftInfo());
					oRM.write("</div>");
				oRM.write("</div>");
				
			oRM.write("</div>");
		}
	});
});