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
	return Control.extend("avmet.ah.control.DBStatusTile", {
		metadata: {
			properties: {
				header: {
					type: "string",
					defaultValue: ""
				},
				subHeader: {
					type: "string",
					defaultValue: ""
				},
				title: {
					type: "string",
					defaultValue: ""
				},
				subTitle: {
					type: "string",
					defaultValue: ""
				},
				info: {
					type: "string",
					defaultValue: ""
				},
				buttonName: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				items: {
					type: "sap.ui.core.Control",
					multiple: true,
					singularName: "item"
				},
				content: {
					type: "sap.ui.core.Control"
				}
			},
			defaultAggregation: "content",
			events: {
				select: {

				}
			}
		},
		init: function() {},

		ontap: function(evt) {
			this.fireSelect({});
		},

		renderer: function(oRM, oControl) {
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("statusTileOutDiv");
			oRM.writeClasses();
			oRM.write(">");

			if (oControl.getTitle() === "FAIR") {
				oRM.write("<div class='StatusLeftRedDiv'>");
			} else if (oControl.getTitle() === "Unserviceable" || oControl.getTitle() === "Role Change") {
				oRM.write("<div class='StatusLeftYellowDiv'>");
			} else if (oControl.getTitle() === "Flight Servicing") {
				oRM.write("<div class='StatusLeftGreyDiv'>");
			} else if (oControl.getTitle() === "Awaiting Recipient") {
				oRM.write("<div class='StatusLeftOrgDiv'>");
			} else {
				oRM.write("<div class='StatusLeftGreenDiv'>");
			}
			oRM.write("<div class='StatusLeftTextDiv'>");
			if (oControl.getTitle() === "Unservicable" || oControl.getTitle() === "Flight Servicing") {
				oRM.write("<div class='StatusSubTitleBlackDiv'>");
			} else {
				oRM.write("<div class='StatusSubTitleDiv'>");
			}
			oRM.write(oControl.getSubTitle());
			oRM.write("</div>");
			if (oControl.getTitle() === "Unservicable" || oControl.getTitle() === "Flight Servicing") {
				oRM.write("<div class='StatusTitleBlackDiv'>");
			} else {
				oRM.write("<div class='StatusTitleDiv'>");
			}
			oRM.write(oControl.getTitle());
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");

			oRM.write("<div class='StatusCenterDiv'>");
			if (oControl.getHeader()) {
				oRM.write("<div class='StatusHeaderDiv'>");
				oRM.write(oControl.getHeader());
				oRM.write("</div>");
			}
			if (oControl.getSubHeader()) {
				oRM.write("<div class='StatusSubHeaderDiv'>");
				oRM.write(oControl.getSubHeader());
				oRM.write("</div>");
			}
			if (oControl.getInfo()) {
				oRM.write("<div class='StatusInfoDiv'>");
				oRM.write(oControl.getInfo());
				oRM.write("</div>");
			}

			oRM.write("</div>");
			oRM.write("<div class='StatusRightDiv'>");

			$.each(oControl.getItems(), function(key, value) {
				oRM.renderControl(value);
			});
			oRM.write("</div>");
			oRM.write("</div>");
		},
		fnStatusColor: function() {

		}
	});
});