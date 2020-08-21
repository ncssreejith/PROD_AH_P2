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
	return Control.extend("avmet.ah.control.Dashboard3", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				buttonText: {
					type: "string",
					defaultValue: ""
				},
				leftNumeric: {
					type: "int",
					defaultValue: ""
				},
				leftHeading: {
					type: "string",
					defaultValue: ""
				},
				leftSubHeading: {
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
		init: function () {
			var that = this;
			var sButtonText = this.getButtonText();
			this.setAggregation("_tileButton", new Button({
				text: sButtonText,
				type: "Transparent",
				press: function (oEvent) {
					that.fireSelect();
				}
			}).addStyleClass("titleButtonCSS, sapUiSizeCompact"));

		},

		setButtonText: function (iValue) {
			this.setProperty("buttonText", iValue, true);
			this.getAggregation("_tileButton").setText(iValue);

		},

		renderer: function (oRM, oControl) {
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("DBTile3OutDiv");
			oRM.writeClasses();
			oRM.write(">");
				oRM.write("<div class='DBTile3Top'>");
					oRM.write("<div class='DBTile3TopTitleDiv'>");
						oRM.write("<div class='DBTile3TopTitle'>");
							oRM.write(oControl.getTitle());
						oRM.write("</div>");
					oRM.write("</div>");
					oRM.write("<div class='DBTile3TopButtonDiv'>");
						oRM.write("<div class='DBTile3TopButton'>");
							oRM.renderControl(aChildren[2]);
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile3Left'>");
					oRM.write("<div class='DBTile3LeftTitleDiv'>");
						oRM.write("<div class='DBTile3LeftInfo'>");
							oRM.write("<div class='DBTile3LeftInfoNum'>");
								oRM.write(oControl.getLeftNumeric());
							oRM.write("</div>");
							oRM.write("<div class='DBTile3LeftInfoHeading'>");
								oRM.write(oControl.getLeftHeading());
							oRM.write("</div>");
							oRM.write("<div class='DBTile3LeftInfoSubHeading'>");
								oRM.write(oControl.getLeftSubHeading());
							oRM.write("</div>");
						oRM.write("</div>");
					oRM.write("</div>");
				oRM.write("</div>");
				oRM.write("<div class='DBTile3Right'>");
						oRM.write("<div class='DBTile3RightChartDiv'>");
							oRM.write("<div class='DBTile3RightChart'>");
								oRM.renderControl(aChildren[0]);
							oRM.write("</div>");
						oRM.write("</div>");
						oRM.write("<div class='DBTile3RightSegBtnDiv'>");
							oRM.write("<div class='DBTile3RightSegBtn'>");
								oRM.renderControl(aChildren[1]);
							oRM.write("</div>");
						oRM.write("</div>");
				oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});