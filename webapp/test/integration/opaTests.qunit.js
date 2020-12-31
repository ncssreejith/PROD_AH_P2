/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"avmet/f16/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});