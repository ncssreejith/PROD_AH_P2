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
	return Control.extend("avmet.ah.control.Dashboard5", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				chart1Count: {
					type: "string",
					defaultValue: ""
				},
				chart2Count: {
					type: "string",
					defaultValue: ""
				},
				chart3Count: {
					type: "string",
					defaultValue: ""
				},
				totalCount: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				_tileButton: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				},
				radialChart: {
					type: "sap.suite.ui.microchart",
					multiple: false,
					visibility: "true"
				},
				segmentedButton: {
					type: "sap.m.SegmentedButton",
					multiple: false,
					visibility: "true"
				},
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
		init: function () {},

		

		renderer: function (oRM, oControl) {
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("DBTile5OutDiv");
			oRM.writeClasses();
			oRM.write(">");
				oRM.write("<div class='DBTile5Top'>");
					oRM.write("<div class='DBTile5TopTitleDiv'>");
						oRM.write("<div class='DBTile5TopTitle'>");
							oRM.write(oControl.getTitle());
						oRM.write("</div>");
					oRM.write("</div>");
					oRM.write("<div class='DBTile5TopButtonDiv'>");
						oRM.write("<div class='DBTile5TopButton'>");
							oRM.renderControl(aChildren[0]);
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile5Left'>");
					oRM.write("<div class='DBTile5LeftTxt1'>");
						oRM.write("Loaded & Connected");
					oRM.write("</div>");
					oRM.write("<div class='DBTile5LeftTxt2'>");
						oRM.write("Loaded & Disconnected");
					oRM.write("</div>");
					// oRM.write("<div class='DBTile5LeftTxt3'>");
					// 	oRM.write("Unloaded");
					// oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile5Center'>");
					oRM.write("<div class='DBTile5CenterBar1'>");
						oRM.renderControl(aChildren[1]);
					oRM.write("</div>");
					oRM.write("<div class='DBTile5CenterBar2'>");
						oRM.renderControl(aChildren[2]);
					oRM.write("</div>");
					oRM.write("<div class='DBTile5CenterBar3'>");
						oRM.renderControl(aChildren[3]);
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile5Right'>");
					oRM.write("<div class='DBTile5RightTxt1'>");
						oRM.write(oControl.getChart1Count());
					oRM.write("</div>");
					oRM.write("<div class='DBTile5RightTxt2'>");
						oRM.write(oControl.getChart2Count());
					oRM.write("</div>");
					// oRM.write("<div class='DBTile5RightTxt3'>");
					// 	oRM.write(oControl.getChart3Count());
					// oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile5Bottom'>");
					oRM.write("<div class='DBTile5TotalCountDiv'>");
						oRM.write("<div class='DBTile5TotalCount'>");
							oRM.write("Total: ");
							oRM.write(oControl.getTotalCount());
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});