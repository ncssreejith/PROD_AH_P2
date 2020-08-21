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
	return Control.extend("avmet.ah.control.Dashboard4", {
		metadata: {
			properties: {
				title: {
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
			oRM.addClass("DBTile4OutDiv");
			oRM.writeClasses();
			oRM.write(">");
				oRM.write("<div class='DBTile4Top'>");
					oRM.write("<div class='DBTile4TopTitleDiv'>");
						oRM.write("<div class='DBTile4TopTitle'>");
							oRM.write(oControl.getTitle());
						oRM.write("</div>");
					oRM.write("</div>");
					oRM.write("<div class='DBTile4TopButtonDiv'>");
						oRM.write("<div class='DBTile4TopButton'>");
							oRM.renderControl(aChildren[2]);
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile4Left'>");
					oRM.write("<div class='DBTile4DueSoonLegendDiv'>");
						oRM.write("<div class='DBTile4DueSoonLegend'>");
						oRM.write("</div>");
						oRM.write("<div class='DBTile4DueSoonTxt'>");
							oRM.write("Due Soon");
						oRM.write("</div>");
					oRM.write("</div>");
					oRM.write("<div class='DBTile4ExpiredLegendDiv'>");
						oRM.write("<div class='DBTile4ExpiredLegend'>");
						oRM.write("</div>");
						oRM.write("<div class='DBTile4ExpiredTxt'>");
							oRM.write("Expired");
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile4Right'>");
					oRM.write("<div class='DBTile4RightChartDiv'>");
						oRM.write("<div class='DBTile4RightChart'>");
							oRM.renderControl(aChildren[0]);
						oRM.write("</div>");
					oRM.write("</div>");
					oRM.write("<div class='DBTile4RightSegBtnDiv'>");
							oRM.write("<div class='DBTile4RightSegBtn'>");
								oRM.renderControl(aChildren[1]);
							oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});