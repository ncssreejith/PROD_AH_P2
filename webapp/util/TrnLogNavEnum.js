/*!
 * This file is for Managing TrnLogNavEnum Enum across the Project  
 * Date : 25.Feb.2021
 * Phase : 2 
 */

sap.ui.define(function() {
	"use strict";
	
	var TrnLogNavEnum = {
			/**
			 * TrnLogNavEnum JOBCT
			 * JOBCT will navigate to job screen for correction
			 * @public
			 */
			JOBCT: "F16CosDefectsSummary",
			//{ "routeName" : "F16CosDefectsSummary","param1":"jobId"}
			//TODO: Need to udpate once the complete information received from team
			FRQCT: "",
			TSKCT: "",
			RCGCT: "",
			ADDCT: "",
			WBLCT: "",
			ENGCT: "",
			TMDCT: "",
			SPRCT: "",
			TRMCT: "",
			ARUCT: "",
			WDNCT: "",
			LDTCT: "",
			APRCT: "",
			ATRCT: "",
			PFSCT: ""
	};

	return TrnLogNavEnum;

}, /* bExport= */ true);