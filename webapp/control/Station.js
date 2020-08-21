sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : Micro chart with Button
	 *	 Usage : To display the Circle chart with button
	 *   Functions : onmouseover , setButtonText
	 *   Properties : 
	 *   Note : 
	 *************************************************************************** */
	return Control.extend("avmet.ah.control.Station", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				subTitle: {
					type: "string",
					defaultValue: ""
				},
				footerLeftInfo: {
					type: "string",
					defaultValue: ""
				},
				footerRightInfo: {
					type: "sap.m.Link",
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
			
			
				var aChildren = oControl.getContent();
			oRM.write("<div");
					oRM.writeControlData(oControl);
					oRM.addClass("StationOuterDiv");
					oRM.writeClasses();
			oRM.write(">");
			// var aChildren = oControl.getContent();
			// oRM.write("<div class='StationOuterDiv'>");
			oRM.write("<div class='StationTopDiv'>");
			oRM.write("<div class='StationLeftIcon'>");
			oRM.renderControl(aChildren[1]);
			oRM.write("</div>");
			oRM.write("<div class='StationTitleDiv'>");
			oRM.write("<div class='StationSubTitle'>");
			oRM.write(oControl.getSubTitle());
			oRM.write("</div>");
			oRM.write("<div class='StationTitle'>");
			oRM.write(oControl.getTitle());
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("<div class='StationIconContent'>");
			oRM.write("<div class='StationShowIcon'>");
			oRM.renderControl(aChildren[0]);
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");

			oRM.write("<div class='line'>");
			oRM.write("</div>");

			oRM.write("<div class='StationBottomDiv'>");
			oRM.write("<div class='StationFooterLeft'>");
			oRM.write(oControl.getFooterLeftInfo());
			oRM.write("</div>");
			if (oControl.getFooterRightInfo() === "") {
				oRM.write("<div class='StationFooterRight'>");
				oRM.write(oControl.getFooterRightInfo());
				oRM.write("</div>");
			} else {
				oRM.write("<div class='StationFooterRightForData'>");
				oRM.write(oControl.getFooterRightInfo());
				oRM.write("</div>");
			}
			oRM.write("</div>");

			oRM.write("</div>");
		}
	});
});