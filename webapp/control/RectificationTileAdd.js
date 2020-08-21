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
	return Control.extend("avmet.ah.control.RectificationTileAdd", {
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
				},
				enabled: {
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
			this.fireHover();
		},
		init: function () {

		},

		renderer: function (oRM, oControl) {
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("RectificationAddOuterDiv");

			oRM.writeClasses();
			oRM.write(">");

			oRM.write("<div class='RectificationAddTopDiv'>");

			oRM.write("</div>");
			oRM.write("<div class='RectificationAddMiddleDiv'>");
			oRM.write("<div class='RectificationAddButton'>");
			oRM.renderControl(aChildren[0]);
			oRM.write("</div>");
			/*	oRM.write("<div class='RectificationAddText'>");*/
			oRM.write("<div");
			oRM.writeControlData(oControl);
			if (oControl.getEnabled() === "true") {
				oRM.addClass("RectificationAddText");
			} else {
				oRM.addClass("RectificationAddTextGray");
			}
			oRM.writeClasses();
			oRM.write(">");
			oRM.write("Add Work Center");
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("<div class='RectificationAddBottomDiv'>");
			oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});