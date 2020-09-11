sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Link"
], function(Control, Link) {
	"use strict";
	/* ***************************************************************************
	 *   Control name:            
	 *   Purpose : Micro chart with Button
	 *	 Usage : To display the Circle chart with button
	 *   Functions : onmouseover , setButtonText
	 *   Properties : 
	 *   Note : 
	 *************************************************************************** */
	return Control.extend("avmet.f16.control.Station1", {
		metadata: {
			properties: {
				title: {
					type: "string",
					defaultValue: ""
				},
				subTitle: {
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
				content: {
					type: "sap.ui.core.Control"
				},
				_oLink: {
					type: "sap.m.Link",
					multiple: false
				}
			},
			defaultAggregation: "content",
			events: {
				press: {},
				hover: {},
				fireSerialPress: {}
			}
		},
		onmouseover: function(evt) {
			this.fireHover({});
		},
		ontap: function(oEvent) {
			if (oEvent.srcControl.getId().search("link") === -1) {
				this.firePress(oEvent);
			} 
		},
		init: function() {
			var that = this;
			this.evtType = "";
			var oLink = new Link({
				text: "testme",
				press: function(oEvent) {
					that.fireFireSerialPress(oEvent);
				}
			});
			this.setAggregation("_oLink", oLink);
		},

		renderer: function(oRM, oControl) {

			var oLink = oControl.getAggregation("_oLink");
			var aChildren = oControl.getContent();
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("StationOuterDiv");
			oRM.writeClasses();
			oRM.write(">");
			// var aChildren = oControl.getContent();
			// oRM.write("<div class='StationOuterDiv'>");
			oRM.write("<div style='height: 77px;'>");
			oRM.write("<div class='StationLeftIcon'>");
			oRM.renderControl(aChildren[1]);
			oRM.write("</div>");
			oRM.write("<div class='StationTopDiv'>");
			oRM.write("<div class='StationIconTopDiv'>");
			oRM.write("<div class='StationShowIcon'>");
			oRM.renderControl(aChildren[0]);
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("<div class='StationTitleDiv'>");
			oRM.write("<div class='StationSubTitle'>");
			oRM.write(oControl.getSubTitle());
			oRM.write("</div>");
			oRM.write("<div class='StationTitle'>");
			oRM.write(oControl.getTitle());
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");
			oRM.write("</div>");

			oRM.write("<div class='StationBottomDiv'>");
			oRM.write("<div class='StationFooterLeft'>");
			oRM.write(oControl.getFooterLeftInfo());
			oRM.write("</div>");
			if (oControl.getFooterRightInfo() === "") {
				oRM.write("<div class='StationFooterRight'>");
				oLink.setText(oControl.getFooterRightInfo());
				oRM.renderControl(oControl.getAggregation("_oLink"));
				oLink.setVisible(false);
				oRM.write("</div>");
			} else {
				oRM.write("<div class='StationFooterRightForData'>");
				oLink.setText(oControl.getFooterRightInfo());
				oRM.renderControl(oControl.getAggregation("_oLink"));
				oRM.write("</div>");
			}
			oRM.write("</div>");

			oRM.write("</div>");
		}

	});
});