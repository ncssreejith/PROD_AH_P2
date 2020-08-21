/*global QUnit*/

sap.ui.define([
	"avmet/ah/controller/AvMetFrame.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AvMetFrame Controller");

	QUnit.test("I should test the AvMetFrame controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});