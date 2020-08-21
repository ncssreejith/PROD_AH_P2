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
	return Control.extend("avmet.ah.control.PilotAcceptCard", {
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
				reviewed: {
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
		init: function () {},

		onmouseover: function (oEvent) {
			this.fireHover(oEvent);
		},
		ontap: function (oEvent) {
			//console.log('Called');
			this.firePress(oEvent);
		},

		renderer: function (oRM, oControl) {
			var bReview = oControl.getReviewed();
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			if (bReview === "Pending") {
				oRM.addClass("PATilePendingOuterDiv");
			} else if (bReview === "Reviewed"){
				oRM.addClass("PATileReviewOuterDiv");
			}
			oRM.writeClasses();
			oRM.write(">");
				oRM.write("<div class='PAHeaderContent'>");
					oRM.write("<div class='PAAvatarContent'>");
						oRM.renderControl(aChildren[0]);
					oRM.write("</div>");
					oRM.write("<div class='PATitleContent'>");
						oRM.write(oControl.getTitle());
					oRM.write("</div>");
					oRM.write("<div class='PACountContent'>");
						oRM.write(oControl.getCount());
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='PABottomContent'>");
					oRM.write("<div class='PAPickIconContent'>");
					if (bReview === "Reviewed") {
						oRM.write("<div class='PATickIcon'>");
							oRM.write("<span>");
								//oRM.renderControl(aChildren[1]);
							oRM.write("</span>");
						oRM.write("</div>");
					}
					oRM.write("</div>");
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});