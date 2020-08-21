sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Label",
	"sap/m/Button"
], function(Control, Label, Button) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : Micro chart with Button
	 *	 Usage : To display the Circle chart with button
	 *   Functions : onmouseover , setButtonText
	 *   Properties : 
	 *   Note : 
	 *************************************************************************** */
	return Control.extend("avmet.ah.control.Dashboard6", {
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
				chart4Count: {
					type: "string",
					defaultValue: ""
				},
				chart1Text: {
					type: "string",
					defaultValue: ""
				},
				chart2Text: {
					type: "string",
					defaultValue: ""
				},
				chart3Text: {
					type: "string",
					defaultValue: ""
				},
				chart4Text: {
					type: "string",
					defaultValue: ""
				},
				chart1Visible: {
					type: "boolean",
					defaultValue: true
				},
				chart2Visible: {
					type: "boolean",
					defaultValue: true
				},
				chart3Visible: {
					type: "boolean",
					defaultValue: true
				},
				chart4Visible: {
					type: "boolean",
					defaultValue: true
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
		onmouseover: function(evt) {
			this.fireHover({});
		},
		init: function() {},

		renderer: function(oRM, oControl) {
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("DBTile6OutDiv");
			oRM.writeClasses();
			oRM.write(">");
			oRM.write("<div class='DBTile6Top'>");
			oRM.write("<div class='DBTile6TopTitleDiv'>");
			oRM.write("<div class='DBTile6TopTitle'>");
			oRM.write(oControl.getTitle());
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("<div class='DBTile6TopButtonDiv'>");
			oRM.write("<div class='DBTile6TopButton'>");
			oRM.renderControl(aChildren[0]);
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("<div class='DBTile6Left'>");

			if (oControl.getChart1Visible()) {
				oRM.write("<div class='DBTile6LeftTxt1'>");
				oRM.write(oControl.getChart1Text());
				// oRM.write("Rocket 1");
				oRM.write("</div>");
			} else {
				oRM.write("<div class='DBTile6LeftTxt1'>");
				oRM.write("Nothing Installed");
				oRM.write("</div>");
			}
			if (oControl.getChart2Visible()) {
				oRM.write("<div class='DBTile6LeftTxt1'>");
				oRM.write(oControl.getChart2Text());
				oRM.write("</div>");
			}
			if (oControl.getChart3Visible()) {
				oRM.write("<div class='DBTile6LeftTxt1'>");
				oRM.write(oControl.getChart3Text());
				oRM.write("</div>");
			}
			if (oControl.getChart4Visible()) {
				oRM.write("<div class='DBTile6LeftTxt1'>");
				oRM.write(oControl.getChart4Text());
				oRM.write("</div>");
			}
			oRM.write("</div>");
			oRM.write("<div class='DBTile6Center'>");

			if (oControl.getChart1Visible()) {
				oRM.write("<div class='DBTile6CenterBar1'>");
				oRM.renderControl(aChildren[1]);
				oRM.write("</div>");
			}
			if (oControl.getChart2Visible()) {
				oRM.write("<div class='DBTile6CenterBar1'>");
				oRM.renderControl(aChildren[2]);
				oRM.write("</div>");
			}
			if (oControl.getChart3Visible()) {
				oRM.write("<div class='DBTile6CenterBar1'>");
				oRM.renderControl(aChildren[3]);
				oRM.write("</div>");
			}
			if (oControl.getChart4Visible()) {
				oRM.write("<div class='DBTile6CenterBar1'>");
				oRM.renderControl(aChildren[4]);
				oRM.write("</div>");
			}
			oRM.write("</div>");
			oRM.write("<div class='DBTile6Right'>");
			if (oControl.getChart1Visible()) {
				oRM.write("<div class='DBTile6RightTxt1'>");
				oRM.write(oControl.getChart1Count());
				oRM.write("</div>");
			}
			if (oControl.getChart2Visible()) {
				oRM.write("<div class='DBTile6RightTxt1'>");
				oRM.write(oControl.getChart2Count());
				oRM.write("</div>");
			}
			if (oControl.getChart3Visible()) {
				oRM.write("<div class='DBTile6RightTxt1'>");
				oRM.write(oControl.getChart3Count());
				oRM.write("</div>");
			}
			if (oControl.getChart4Visible()) {
				oRM.write("<div class='DBTile6RightTxt1'>");
				oRM.write(oControl.getChart4Count());
				oRM.write("</div>");
			}
			oRM.write("</div>");
			oRM.write("<div class='DBTile6Bottom'>");
			// oRM.write("<div class='DBTile6TotalCountDiv'>");
			// oRM.write("<div class='DBTile6TotalCount'>");
			// oRM.write("Total: ");
			// oRM.write(oControl.getTotalCount());
			// oRM.write("</div>");
			// oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});