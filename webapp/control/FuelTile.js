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
	return Control.extend("avmet.ah.control.FuelTile", {
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
					defaultValue: "null"
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
					oRM.addClass("FuelOuterDiv");
					oRM.writeClasses();
			oRM.write(">");
				oRM.write("<div class='FuelTopDiv'>");
					oRM.write("<div class='FuelChartContent'>");
						oRM.write("<div class='FuelChart'>");
							oRM.renderControl(aChildren[0]);
						oRM.write("</div>");
					oRM.write("</div>");
					oRM.write("<div class='FuelTitleContent'>");
						oRM.write("<div class='FuelNoteContent'>");
							oRM.write("<div class='FuelNote'>");
								if(oControl.getShowNote() === "true"){
									oRM.renderControl(aChildren[1]);
								}
							oRM.write("</div>");
						oRM.write("</div>");
						oRM.write("<div class='FuelTitle'>");
							oRM.write(oControl.getTitle());
						oRM.write("</div>");
						oRM.write("<div class='FuelCount'>");
							oRM.write(oControl.getCount());
						oRM.write("</div>");
						oRM.write("<div class='FuelUnit'>");
							oRM.write(oControl.getUnit());
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='FuelBottomDiv'>");
					oRM.write("<div class='FuelBottomContent'>");
						oRM.write("<div class='FuelBottomLeftContent'>");
							oRM.write("<div class='FuelServicedText'>");
								oRM.write("Serviced");
							oRM.write("</div>");
							oRM.write("<div class='FuelStatusIcon'>");
							if(oControl.getStatus() !== null ){
								if(oControl.getStatus() === ""){
									oRM.renderControl(aChildren[2]);	
								}else if(oControl.getStatus() === "X"){
									oRM.renderControl(aChildren[3]);	
								}
							}
							oRM.write("</div>");
							oRM.write("<div class='FuelServicedCount'>");
								oRM.write(oControl.getServicedCount());
							oRM.write("</div>");
						oRM.write("</div>");
						oRM.write("<div class='FuelBottomRightContent'>");
							oRM.write("<div class='FuelServicedText'>");
								oRM.write("Max");
							oRM.write("</div>");
							oRM.write("<div class='FuelMaxCount'>");
								oRM.write(oControl.getMaxCount());
							oRM.write("</div>");
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});