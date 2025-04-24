/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sbxrlabc/app_store/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
