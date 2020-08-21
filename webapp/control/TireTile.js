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
	return Control.extend("avmet.ah.control.TireTile", {
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
				unit: {
					type: "string",
					defaultValue: ""
				},
				servicedCount: {
					type: "string",
					defaultValue: ""
				},
				showNote: {
					type: "string",
					defaultValue: ""
				},
				maxCount: {
					type: "string",
					defaultValue: ""
				},
				status: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				radialChart: {
					type: "sap.suite.ui.microchart",
					multiple: false,
					visibility: "true"
				},

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
					oRM.addClass("TireOuterDiv");
					oRM.writeClasses();
			oRM.write(">");
				oRM.write("<div class='TireTopDiv'>");
					oRM.write("<div class='TireTitleContent'>");
						oRM.write("<div class='TireNoteContent'>");
							oRM.write("<div class='TireNote'>");
								if(oControl.getShowNote() === "true"){
									oRM.renderControl(aChildren[0]);
								}
							oRM.write("</div>");
						oRM.write("</div>");
						oRM.write("<div class='TireTitle'>");
							oRM.write(oControl.getTitle());
						oRM.write("</div>");
						oRM.write("<div class='TireCount'>");
							oRM.write(oControl.getCount());
						oRM.write("</div>");
						oRM.write("<div class='TireUnit'>");
							oRM.write(oControl.getUnit());
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='TireBottomDiv'>");
					oRM.write("<div class='TireBottomContent'>");
						oRM.write("<div class='TireBottomLeftContent'>");
							oRM.write("<div class='TireServicedText'>");
								oRM.write("Serviced");
							oRM.write("</div>");
							oRM.write("<div class='TireStatusIcon'>");
							if(oControl.getStatus() !== ""){
								if(oControl.getStatus() === "Up"){
									oRM.renderControl(aChildren[1]);	
								}else if(oControl.getStatus() === "down"){
									oRM.renderControl(aChildren[2]);	
								}
							}
							oRM.write("</div>");
							oRM.write("<div class='TireServicedCount'>");
								oRM.write(oControl.getServicedCount());
							oRM.write("</div>");
						oRM.write("</div>");
						oRM.write("<div class='TireBottomRightContent'>");
							oRM.write("<div class='FuelServicedText'>");
								oRM.write("Max");
							oRM.write("</div>");
							oRM.write("<div class='TireMaxCount'>");
								oRM.write(oControl.getMaxCount());
							oRM.write("</div>");
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});