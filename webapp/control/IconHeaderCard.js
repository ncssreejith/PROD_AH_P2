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
	return Control.extend("avmet.ahbf.control.IconHeaderCard", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				signOffFlag: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				image: {
					type: "sap.ui.core.Control"
				},
				content: {
					type: "sap.ui.core.Control"
				}
			},
			defaultAggregation: "content",
			events: {
				press: {},
				hover: {},
				hoverOut: {}
			}
		},
		onmouseover: function (evt) {
			this.fireHover({});
		},
		ontap: function (oEvent) {
			//console.log('Called');
			this.firePress(oEvent);
		},

		onmouseout: function (evt) {
			this.fireHoverOut({});
		},

		init: function () {

		},

		renderer: function (oRM, oControl) {
			var bSignOffFlag = oControl.getSignOffFlag();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			if (bSignOffFlag === "X") {
				oRM.addClass("IconHeaderOuterDivGreen");
			} else {
				oRM.addClass("IconHeaderOuterDiv");
			}
			oRM.writeClasses();
			oRM.write(">");
			var aChildren = oControl.getContent();
			oRM.write("<div class='IconHeaderDiv'>");
			oRM.write("<div class='IconHeaderIMGDiv'>");
			oRM.renderControl(aChildren[0]);
			oRM.write("</div>");
			oRM.write("<div class='IconHeaderIMGTextDiv'>");
			oRM.write(oControl.getTitle());
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("<div class='IconFooterDiv'>");
			oRM.write("<div class='IconHeaderFooterIMG'>");
			if (bSignOffFlag === "X") {
				oRM.write("<div class='CompletedTickIcon'>");
				oRM.write("<span>");
				oRM.renderControl(aChildren[1]);
				oRM.write("</span>");
				oRM.write("</div>");
			}
			oRM.write("</div>");
			oRM.write("</div>");
			//get icon aggregation img (cornerFooterIMG)
			oRM.write("</div>");
		}
	});
});