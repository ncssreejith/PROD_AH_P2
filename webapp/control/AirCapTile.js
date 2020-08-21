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
	return Control.extend("avmet.ah.control.AirCapTile", {
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
				footerLeftInfo: {
					type: "string",
					defaultValue: ""
				},
				footerRightInfo: {
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
			
		},

		setButtonText: function (iValue) {
			this.setProperty("buttonText", iValue, true);
			this.getAggregation("_tileButton").setText(iValue);

		},

		renderer: function (oRM, oControl) {

			oRM.write("<div class='sapUiSmallMargin'");
			oRM.writeControlData(oControl);
			oRM.addClass("FuelContainer");
			oRM.write("<div class='aircapHeader'>");
			
			oRM.write(oControl.getTitle());
			
		
			oRM.write("</div>");
			oRM.write("</div>");

			
		}
	});
});