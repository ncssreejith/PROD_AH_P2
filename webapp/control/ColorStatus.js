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
	return Control.extend("avmet.ah.control.ColorStatus", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				status: {
					type: "string",
					defaultValue: ""
				},
				statushr: {
					type: "string",
					defaultValue: ""
				}
			}
		},
		init: function() {},

		renderer: function(oRM, oControl) {
			oRM.write("<div class='ColorStatusContent'>");
			oRM.write("<div");
			oRM.writeControlData(oControl);
			/*	if (oControl.getStatus() < 5 || oControl.getStatushr() < 10) {
					oRM.addClass("ColorStatusOrange");
				} else {
					oRM.addClass("ColorStatusBlue");
				}*/
			if (oControl.getStatus() === "1") {
				oRM.addClass("ColorStatusOrange");
			} else {
				oRM.addClass("ColorStatusBlue");
			}
			oRM.writeClasses();
			oRM.write(">");
			oRM.write("<span>");
			oRM.write(oControl.getTitle());
			oRM.write("</span>");
			oRM.write("</div>");
			oRM.write("</div>");

		}
	});
});