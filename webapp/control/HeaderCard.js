sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Label",
	"sap/m/Button",
	"sap/ui/core/Icon"
], function (Control, Label, Button, Icon) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : Micro chart with Button
	 *	 Usage : To display the Circle chart with button
	 *   Functions : onmouseover , setButtonText
	 *   Properties : 
	 *   Note : 
	 *************************************************************************** */
	return Control.extend("avmet.ah.control.HeaderCard", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				signedBy: {
					type: "string",
					defaultValue: ""
				},
				signOffFlag: {
					type: "string",
					defaultValue: ""
				},
				dateTime: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				content: {
					type: "sap.ui.core.Control"
				},
				_Icon: {
					type: "sap.ui.core.Control",
					multiple: false,
					hidden: true
				}
			},
			defaultAggregation: "content",
			events: {

			}
		},

		init: function () {
			this.clock = new Icon({
				src: "sap-icon://request"
			});
			this.setAggregation("_Icon", this.clock);
		},

		renderer: function (oRM, oControl) {
			var bSignOffFlag = oControl.getSignOffFlag();
			oRM.write("<div class='HeaderCardOuterDiv'>");
				oRM.write("<div class='HeaderCardTitle'>");
					
							oRM.write(oControl.getTitle());
					
				oRM.write("</div>");
				if (bSignOffFlag === "X") {
				oRM.write("<div class='HeaderCardSubHeaderDiv'>");
				// oRM.write("<div class='IconHeaderFooterClockIMG'>");
				// oRM.write("<div class='clockIconCSS'>");
				
				oRM.write("<span>");
				oRM.renderControl(oControl.getAggregation('_Icon'));
				oRM.write("</span>");
				oRM.write("  Signed by");
				oRM.write("</div>");
				// oRM.write("</div>");
				// oRM.write("</div>");
			}
				oRM.write("<div class='HeaderCardSubHeaderDiv'>");
					
							oRM.write(oControl.getSignedBy());
					
				oRM.write("</div>");
				oRM.write("<div class='HeaderCardSubHeaderDiv'>");
					
							oRM.write(oControl.getDateTime());
					
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});