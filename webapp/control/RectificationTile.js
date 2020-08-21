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
	return Control.extend("avmet.ah.control.Rectification", {
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
				footerText: {
					type: "string",
					defaultValue: ""
				},
				prime: {
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
				select: {},
				hover: {}
			}
		},
		ontap: function (evt) {
			this.fireSelect({});
		},
		onmouseover: function (evt) {
			this.fireHover({});
		},
		init: function () {

		},

		renderer: function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("RectificationOuterDiv");
			oRM.writeClasses();
			oRM.write(">");
			oRM.write("<div class='RectificationTopDiv'>");
			oRM.write("<div class='RectificationTitleContent'>");
			oRM.write("<div class='RectificationTitle'>");
			oRM.write(oControl.getTitle());
			oRM.write("</div>");
			oRM.write("</div>");
			if (oControl.getPrime() === "true") {
				oRM.write("<div class='RectificationPrimeContent'>");
				oRM.write("<div class='RectificationPrime'>");
				oRM.write("<span>");
				oRM.write("Prime");
				oRM.write("</span>");
				oRM.write("</div>");
				oRM.write("</div>");
			} else {
				oRM.write("<div class='RectificationPrimeContentTrans'>");
				oRM.write("<div class='RectificationPrimeTrans'>");
				oRM.write("<span>");
				oRM.write("");
				oRM.write("</span>");
				oRM.write("</div>");
				oRM.write("</div>");
			}
			oRM.write("</div>");
			oRM.write("<div class='RectificationBottomDiv'>");
			oRM.write("<div class='RectificationCountDiv'>");
			oRM.write("<div class='RectificationCount'>");
			oRM.write(oControl.getCount());
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("<div class='RectificationFooterDiv'>");
			oRM.write("<div class='RectificationFooter'>");
			oRM.write(oControl.getFooterText());
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});