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
	return Control.extend("avmet.ah.control.HeaderCard", {
		metadata: {
			properties: {
				title: {
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

			}
		},

		init: function () {

		},

		renderer: function (oRM, oControl) {
			oRM.write("<div class='HeaderCardOuterDiv'>");
				oRM.write("<div class='HeaderCardTitle'>");
					
							oRM.write(oControl.getTitle());
					
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});