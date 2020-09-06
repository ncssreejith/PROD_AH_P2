sap.ui.define([
	"sap/ui/core/Control"
], function(Control) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : Micro chart with Button
	 *	 Usage : To display the Circle chart with button
	 *   Functions : onmouseover , setButtonText
	 *   Properties : 
	 *   Note : 
	 *************************************************************************** */
	return Control.extend("avmet.ah.control..Others", {
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
				count: {
					type: "string",
					defaultValue: ""
				},
				showButton: {
					type: "string",
					defaultValue: ""
				},
				footerLeftInfo: {
					type: "string",
					defaultValue: ""
				},
				footerRightInfo: {
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
		onmouseover: function(evt) {
			this.fireHover({});
		},
		ontap: function(oEvent) {
			this.firePress(oEvent);
		},
		init: function() {

		},

		renderer: function(oRM, oControl) {
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("OtherOuterDiv");
			oRM.writeClasses();
			oRM.write(">");
			oRM.write("<div class='OtherTopDiv'>");
			oRM.write("<div class='OtherLeftDiv'>");
			if (oControl.getSubTitle() !== "") {
				oRM.write("<div class='OtherSubTitleDiv'>");
				oRM.write(oControl.getSubTitle());
				oRM.write("</div>");
			}

			if (oControl.getSubTitle() !== "") {
				oRM.write("<div class='OtherTitleDivWhenSubTitle'>");
				oRM.write(oControl.getTitle());
				oRM.write("</div>");
			} else {
				oRM.write("<div class='OtherTitleDiv'>");
				oRM.write(oControl.getTitle());
				if (oControl.getShowButton() === "H") {
					oRM.write("<div class='HotButton'>");
					oRM.write("Hot");
					oRM.write("</div>");
				}
				if (oControl.getShowButton() === "C") {
					oRM.write("<div class='ColdButton'>");
					oRM.write("Cold");
					oRM.write("</div>");
				}
				if (oControl.getShowButton() === "") {
					// oRM.write("<div class='OtherButton'>");
					// oRM.write("Hot");
					// oRM.write("</div>");
				}

				oRM.write("</div>");
			}
			oRM.write("</div>");

			if (aChildren.length) {
				oRM.write("<div class='OtherRightIcon'>");
				oRM.renderControl(aChildren[0]);
				oRM.write("</div>");
			}
			if (oControl.getSubTitle() !== "") {
				oRM.write("<div class='OtherCountDivWhenSubTitle'>");
				oRM.write(oControl.getCount());
				oRM.write("</div>");
			} else {
				oRM.write("<div class='OtherCountDiv'>");
				oRM.write(oControl.getCount());
				oRM.write("</div>");
			}
			oRM.write("</div>");

			oRM.write("<div class='OtherLine'>");
			oRM.write("</div>");

			oRM.write("<div class='OtherBottomDiv'>");
			if (oControl.getSubTitle() !== "") {
				oRM.write("<div class='OtherFooterLeftWhenSubTitle'>");
				oRM.write(oControl.getFooterLeftInfo());
				oRM.write("</div>");
			} 
			if (oControl.getFooterLeftInfo()) {
				oRM.write("<div class='OtherFooterLeft'>");
				oRM.write(oControl.getFooterLeftInfo());
				oRM.write("</div>");
			}
			if (oControl.getFooterRightInfo()) {
				oRM.write("<div class='OtherFooterRight'>");
				oRM.write(oControl.getFooterRightInfo());
				oRM.write("</div>");
			}
			oRM.write("</div>");

			oRM.write("</div>");
		}
	});
});