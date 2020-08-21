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
	return Control.extend("avmet.ah.control.Wizard", {
		metadata: {
			properties: {
				step1Text: {
					type: "string",
					defaultValue: ""
				},
				step2Text: {
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
		onmouseover: function (evt) {
			this.fireHover({});
		},
		init: function () {

		},

		renderer: function (oRM, oControl) {
			oRM.write("<div class='container'>");
			oRM.write("<div class='row'>");
				oRM.write("<article style='margin-top: 10em;'>");
					oRM.write("<div class='widget-body'>");
						oRM.write("<div class='row'>");
							oRM.write("<div class='col-sm-12'>");
								oRM.write("<div class='col-sm-12 col-md-3'>");
									oRM.write("<div class='vrtwiz'>");
										oRM.write("<ul class='verticalwiz'>");
											oRM.write("<li class='active'>");
												oRM.write("<a href='#tab1' data-toggle='tab' class='active'>");
													oRM.write("<span class='title'>");
														oRM.write(oControl.getStep1Text());
													oRM.write("</span>");
												oRM.write("</a>");
												oRM.write("<a href='#tab1' data-toggle='tab' class='active'>");
													oRM.write("<span class='title'>");
														oRM.write(oControl.getStep2Text());
													oRM.write("</span>");
												oRM.write("</a>");
											oRM.write("</li>");
										oRM.write("</ul>");
									oRM.write("</div>");
								oRM.write("</div>");
							oRM.write("</div>");
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</article>");
			oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});