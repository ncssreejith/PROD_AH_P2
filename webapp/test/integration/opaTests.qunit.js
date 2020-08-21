/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"avmet/ah/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});