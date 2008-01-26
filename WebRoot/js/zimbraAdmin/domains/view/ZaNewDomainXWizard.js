/*
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Yahoo! Public License
 * Version 1.0 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * 
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaNewDomainXWizard
* @contructor
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaNewDomainXWizard = function(parent, app) {
	this._app=app;
	ZaXWizardDialog.call(this, parent,app, null, ZaMsg.NDD_Title, "550px", "300px","ZaNewDomainXWizard");

	this.stepChoices = [
		{label:ZaMsg.TABT_GeneralPage, value:1},
		{label:ZaMsg.TABT_GALMode, value:2},
		{label:ZaMsg.TABT_GALonfiguration, value:3}, 
		{label:ZaMsg.TABT_GALonfiguration, value:4},
		{label:ZaMsg.TABT_GALSyncConfiguration, value:5},
		{label:ZaMsg.TABT_GALSyncConfiguration, value:6},				
		{label:ZaMsg.TABT_GALonfigSummary, value:7},
		{label:ZaMsg.TABT_TestGalConfig, value:8},
		{label:ZaMsg.TABT_GalTestResult, value:9},		
		{label:ZaMsg.TABT_AuthMode, value:10},				
		{label:ZaMsg.TABT_AuthSettings, value:11},						
		{label:ZaMsg.TABT_AuthSettings, value:12},								
		{label:ZaMsg.TABT_AuthSettings, value:13},								
		{label:ZaMsg.TABT_TestAuthSettings, value:14},				
		{label:ZaMsg.TABT_AuthTestResult, value:15},
		{label:ZaMsg.Domain_Tab_VirtualHost, value:16},
		{label:ZaMsg.Domain_Tab_Notebook, value:17},		
		{label:ZaMsg.TABT_Notebook_Access_Control, value:18},			
		{label:ZaMsg.TABT_DomainConfigComplete, value:19}		
	];
		
	this.GALModes = [
		{label:ZaMsg.GALMode_internal, value:ZaDomain.GAL_Mode_internal},
		{label:ZaMsg.GALMode_external, value:ZaDomain.GAL_Mode_external}, 
		{label:ZaMsg.GALMode_both, value:ZaDomain.GAL_Mode_both}
  	];
  	this.GALServerTypes = [
		{label:ZaMsg.GALServerType_ldap, value:ZaDomain.GAL_ServerType_ldap},
		{label:ZaMsg.GALServerType_ad, value:ZaDomain.GAL_ServerType_ad} 
	];
	
	this.AuthMechs = [
		{label:ZaMsg.AuthMech_zimbra, value:ZaDomain.AuthMech_zimbra},
		{label:ZaMsg.AuthMech_ldap, value:ZaDomain.AuthMech_ldap},
		{label:ZaMsg.AuthMech_ad, value:ZaDomain.AuthMech_ad}		
	];

	this.TestResultChoices = [
		{label:ZaMsg.AuthTest_check_OK, value:ZaDomain.Check_OK},
		{label:ZaMsg.AuthTest_check_UNKNOWN_HOST, value:ZaDomain.Check_UNKNOWN_HOST},
		{label:ZaMsg.AuthTest_check_CONNECTION_REFUSED, value:ZaDomain.Check_CONNECTION_REFUSED},
		{label:ZaMsg.AuthTest_check_SSL_HANDSHAKE_FAILURE, value:ZaDomain.Check_SSL_HANDSHAKE_FAILURE},				
		{label:ZaMsg.AuthTest_check_COMMUNICATION_FAILURE, value:ZaDomain.Check_COMMUNICATION_FAILURE},
		{label:ZaMsg.AuthTest_check_AUTH_FAILED, value:ZaDomain.Check_AUTH_FAILED},
		{label:ZaMsg.AuthTest_check_AUTH_NOT_SUPPORTED, value:ZaDomain.Check_AUTH_NOT_SUPPORTED},
		{label:ZaMsg.AuthTest_check_NAME_NOT_FOUND, value:ZaDomain.Check_NAME_NOT_FOUND},
		{label:ZaMsg.AuthTest_check_INVALID_SEARCH_FILTER, value:ZaDomain.Check_INVALID_SEARCH_FILTER},
		{label:ZaMsg.AuthTest_check_FAILURE, value:ZaDomain.Check_FAILURE}												
	];
	
	this.initForm(ZaDomain.myXModel,this.getMyXForm());		
	this._localXForm.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new AjxListener(this, ZaNewDomainXWizard.prototype.handleXFormChange));
	this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, new AjxListener(this, ZaNewDomainXWizard.prototype.handleXFormChange));	
	this.lastErrorStep=0;
	this._helpURL = location.pathname + "adminhelp/html/WebHelp/managing_domains/creating_a_domain.htm";			
}

ZaNewDomainXWizard.prototype = new ZaXWizardDialog;
ZaNewDomainXWizard.prototype.constructor = ZaNewDomainXWizard;
ZaXDialog.XFormModifiers["ZaNewDomainXWizard"] = new Array();

ZaNewDomainXWizard.prototype.handleXFormChange = 
function () {
	if(this._localXForm.hasErrors()) {
		if(this.lastErrorStep < this._containedObject[ZaModel.currentStep])
			this.lastErrorStep=this._containedObject[ZaModel.currentStep];
	} else {
		this.lastErrorStep=0;
	}
	this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);	
}

ZaNewDomainXWizard.prototype.changeButtonStateForStep = 
function(stepNum) {
	if(this.lastErrorStep == stepNum) {
		this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
		this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
		if(stepNum>1)
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
	} else {
		if(stepNum == 1) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if (stepNum == 2) {
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
		} else if(stepNum == 7) {
			//change next button to "test"
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(ZaMsg.Domain_GALTestSettings);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if(stepNum == 8) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
		}else if(stepNum == 9) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if (stepNum == 13) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(ZaMsg.Domain_GALTestSettings);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if(stepNum == 14) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
		} else if(stepNum == 17) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if(stepNum == 18) {
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else if(stepNum == 19) {
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(false);
			this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
		} else {
			if(stepNum == 6 || stepNum==5) {
				this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
			}
			this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
			this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
		}
	}
}
/**
* @method setObject sets the object contained in the view
* @param entry - ZaDomain object to display
**/
ZaNewDomainXWizard.prototype.setObject =
function(entry) {
	this._containedObject = new Object();
	this._containedObject.attrs = new Object();

	for (var a in entry.attrs) {
		this._containedObject.attrs[a] = entry.attrs[a];
	}
	this._containedObject[ZaDomain.A_NotebookTemplateFolder]=entry[ZaDomain.A_NotebookTemplateFolder];
	this._containedObject[ZaDomain.A_NotebookTemplateDir]=entry[ZaDomain.A_NotebookTemplateDir];	

	this._containedObject.notebookAcls = {};

	if(entry.notebookAcls) {
		for(var gt in entry.notebookAcls) {
			if(!(entry.notebookAcls[gt] instanceof Array)) {
				this._containedObject.notebookAcls[gt] = {r:0,w:0,i:0,d:0,a:0,x:0};
				for (var a in entry.notebookAcls[gt]) {
					this._containedObject.notebookAcls[gt][a] = entry.notebookAcls[gt][a];
				}
			} else {
				this._containedObject.notebookAcls[gt] = [];
				var cnt = entry.notebookAcls[gt].length;
				for(var i = 0; i < cnt; i++) {
					var aclObj = entry.notebookAcls[gt][i];
					var _newAclObj = {};
					_newAclObj.name = aclObj.name;
					_newAclObj.acl = {r:0,w:0,i:0,d:0,a:0,x:0};
					for (var a in aclObj.acl) {
						_newAclObj.acl[a] = aclObj.acl[a];
					}					
					this._containedObject.notebookAcls[gt][i] = _newAclObj;
				}
			}
		}
	}	
/*	this._containedObject.notebookAcls[ZaDomain.A_NotebookPublicACLs] = new Object();
	for (var a in entry.notebookAcls[ZaDomain.A_NotebookPublicACLs]) {
		this._containedObject.notebookAcls[ZaDomain.A_NotebookPublicACLs][a] = entry.notebookAcls[ZaDomain.A_NotebookPublicACLs][a];
	}

	this._containedObject.notebookAcls[ZaDomain.A_NotebookDomainACLs] = new Object();
	for (var a in entry.notebookAcls[ZaDomain.A_NotebookDomainACLs]) {
		this._containedObject.notebookAcls[ZaDomain.A_NotebookDomainACLs][a] = entry.notebookAcls[ZaDomain.A_NotebookDomainACLs][a];
	}*/
	this._containedObject[ZaModel.currentStep] = 1;
	this._localXForm.setInstance(this._containedObject);	
}

/**
* static change handlers for the form
**/
ZaNewDomainXWizard.onGALServerTypeChange =
function (value, event, form) {
	if(value == "ad") {
		form.getInstance().attrs[ZaDomain.A_GalLdapFilter] = "ad";
		form.getInstance().attrs[ZaDomain.A_zimbraGalAutoCompleteLdapFilter] = "adAutoComplete";		
	} else {
		form.getInstance().attrs[ZaDomain.A_GalLdapFilter] = "";
		form.getInstance().attrs[ZaDomain.A_zimbraGalAutoCompleteLdapFilter] = "(|(cn=%s*)(sn=%s*)(gn=%s*)(mail=%s*))";		
	}
	this.setInstanceValue(value);	
}


ZaNewDomainXWizard.onGalModeChange = 
function (value, event, form) {
	this.setInstanceValue(value);
	if(value != "zimbra") {
		form.getInstance().attrs[ZaDomain.A_GalLdapFilter] = "";
		if(!form.getInstance().attrs[ZaDomain.A_GALServerType]) {
			form.getInstance().attrs[ZaDomain.A_GALServerType] = "ldap";
		}
		if(!form.getInstance().attrs[ZaDomain.A_GalLdapSearchBase]) {
			if(form.getInstance().attrs[ZaDomain.A_domainName]) {
				var parts = form.getInstance().attrs[ZaDomain.A_domainName].split(".");
				var szSearchBase = "";
				var coma = "";
				for(var ix in parts) {
					szSearchBase += coma;
				 	szSearchBase += "dc=";
				 	szSearchBase += parts[ix];
					var coma = ",";
				}
				form.getInstance().attrs[ZaDomain.A_GalLdapSearchBase] = szSearchBase;
			}
		}
	}
}

ZaNewDomainXWizard.onGALSyncServerTypeChange =
function (value, event, form) {
	if(value == "ad") {
		form.getInstance().attrs[ZaDomain.A_zimbraGalSyncLdapFilter] = "ad";
	} 
	this.setInstanceValue(value);	
}

ZaNewDomainXWizard.onGALSyncChange =
function (value, event, form) {
	this.setInstanceValue(value);
	var inst = form.getInstance();
	if(value=='FALSE') {
		if(inst.attrs[ZaDomain.A_zimbraGalSyncLdapFilter] == "ad") {
			inst.attrs[ZaDomain.A_GALSyncServerType] = "ad";
		} else if(!inst.attrs[ZaDomain.A_GALSyncServerType]) {
			inst.attrs[ZaDomain.A_GALSyncServerType] = "ldap";
		}
	} 
}

ZaNewDomainXWizard.prototype.testGALSettings =
function () {
	var callback = new AjxCallback(this, this.checkGALCallBack);
	ZaDomain.testGALSettings(this._containedObject, callback, this._containedObject[ZaDomain.A_GALSampleQuery]);	
}

/**
* Callback function invoked by Asynchronous CSFE command when "check" call returns
**/
ZaNewDomainXWizard.prototype.checkGALCallBack = 
function (arg) {
	if(!arg)
		return;
	if(arg.isException()) {
		this._containedObject[ZaDomain.A_GALSearchTestResultCode] = arg.getException().code;
		this._containedObject[ZaDomain.A_GALSearchTestMessage] = arg.getException().detail+"\n"+arg.getException().msg;
		this._containedObject[ZaDomain.A_GALSearchTestSearchResults] = null;		

		this._containedObject[ZaDomain.A_GALSyncTestResultCode] = arg.getException().code;
		this._containedObject[ZaDomain.A_GALSyncTestMessage] = arg.getException().detail+"\n"+arg.getException().msg;
		this._containedObject[ZaDomain.A_GALSyncTestSearchResults] = null;	
	} else {
		var batchResp = arg.getResponse().Body.BatchResponse;
		if(batchResp && batchResp.CheckGalConfigResponse) {
			var searchResponse = batchResp.CheckGalConfigResponse[0];
			this._containedObject[ZaDomain.A_GALSearchTestResultCode] = searchResponse.code[0]._content;	
			if(this._containedObject[ZaDomain.A_GALSearchTestResultCode] != ZaDomain.Check_OK) {
				this._containedObject[ZaDomain.A_GALSearchTestMessage] = searchResponse.message[0]._content;		
				this._containedObject[ZaDomain.A_GALSearchTestSearchResults] = null;			
			} else {
				this._containedObject[ZaDomain.A_GALTestSearchResults] = new Array();
				if(searchResponse.cn && searchResponse.cn.length) {
					var len = searchResponse.cn.length;
					for (var ix=0;ix<len;ix++) {
						var cnObject = new Object();
						if(searchResponse.cn[ix]._attrs) {
							for (var a in searchResponse.cn[ix]._attrs) {
								cnObject[a] = searchResponse.cn[ix]._attrs[a];
							}
							this._containedObject[ZaDomain.A_GALTestSearchResults].push(cnObject);						
						}
					}
				}
			}
			
			var syncResponse = batchResp.CheckGalConfigResponse[1];
			this._containedObject[ZaDomain.A_GALSyncTestResultCode] = syncResponse.code[0]._content;	
			if(this._containedObject[ZaDomain.A_GALSyncTestResultCode] != ZaDomain.Check_OK) {
				this._containedObject[ZaDomain.A_GALSyncTestMessage] = syncResponse.message[0]._content;		
				this._containedObject[ZaDomain.A_GALSyncTestSearchResults] = null;			
			}				
		}
	}

	this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
	this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
	this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
	this.goPage(9);
}

/**
* Eevent handlers for form items
**/
ZaNewDomainXWizard.onAuthMechChange = 
function (value, event, form) {
	this.setInstanceValue(value);
	if(value == ZaDomain.AuthMech_ad) {
		if(!form.getInstance().attrs[ZaDomain.A_AuthADDomainName]) {
			form.getInstance().attrs[ZaDomain.A_AuthADDomainName] = form.getInstance().attrs[ZaDomain.A_domainName];
		}
	}
}

ZaNewDomainXWizard.prototype.testAuthSettings =
function () {
	if(this._containedObject.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_ad) {
		this._containedObject.attrs[ZaDomain.A_AuthLdapUserDn] = "%u@"+this._containedObject.attrs[ZaDomain.A_AuthADDomainName];
	}

	var callback = new AjxCallback(this, this.checkAuthCallBack);
	ZaDomain.testAuthSettings(this._containedObject, callback);	
}

/**
* Callback function invoked by Asynchronous CSFE command when "check" call returns
**/
ZaNewDomainXWizard.prototype.checkAuthCallBack = 
function (arg) {
/*
	if(arg instanceof AjxException || arg instanceof ZmCsfeException || arg instanceof AjxSoapException) {
		this._containedObject[ZaDomain.A_AuthTestResultCode] = arg.code;
		this._containedObject[ZaDomain.A_AuthTestMessage] = arg.detail;
	} else {
		this._containedObject[ZaDomain.A_AuthTestResultCode] = arg.getBody().firstChild.firstChild.firstChild.nodeValue;
		if(this._containedObject[ZaDomain.A_AuthTestResultCode] != ZaDomain.Check_OK) {
			this._containedObject[ZaDomain.A_AuthTestMessage] = arg.getBody().firstChild.childNodes[1].firstChild.nodeValue;		
			if(arg.getBody().firstChild.lastChild.firstChild != null) {
				this._containedObject[ZaDomain.A_AuthComputedBindDn] = arg.getBody().firstChild.lastChild.firstChild.nodeValue;		
			} else {
				this._containedObject[ZaDomain.A_AuthComputedBindDn] = "";
			}			
			//this._containedObject[ZaDomain.A_AuthComputedBindDn] = arg.getBody().firstChild.lastChild.firstChild.nodeValue;		
		}
	}*/
	if(!arg)
		return;
	if(arg.isException()) {
		this._containedObject[ZaDomain.A_AuthTestResultCode] = arg.getException().code;
		this._containedObject[ZaDomain.A_AuthTestMessage] = arg.getException().detail+"\n"+arg.getException().msg;
	} else {
		var response = arg.getResponse().Body.CheckAuthConfigResponse;
		this._containedObject[ZaDomain.A_AuthTestResultCode] = response.code[0]._content;
		if(this._containedObject[ZaDomain.A_AuthTestResultCode] != ZaDomain.Check_OK) {
			this._containedObject[ZaDomain.A_AuthTestMessage] = response.message[0]._content;		
			if(response.bindDn != null) {
				this._containedObject[ZaDomain.A_AuthComputedBindDn] = response.bindDn[0]._content;		
			} else {
				this._containedObject[ZaDomain.A_AuthComputedBindDn] = "";
			}
		}
	}	
	this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
	this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
	this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(true);
	this.goPage(15);
}


/**
* Overwritten methods that control wizard's flow (open, go next,go previous, finish)
**/
ZaNewDomainXWizard.prototype.popup = 
function (loc) {
	ZaXWizardDialog.prototype.popup.call(this, loc);
	this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
	this._button[DwtWizardDialog.NEXT_BUTTON].setEnabled(true);
	this._button[DwtWizardDialog.FINISH_BUTTON].setEnabled(false);
	this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(false);	
}

ZaNewDomainXWizard.prototype.goPrev =
function () {
	if(this._containedObject[ZaModel.currentStep] == 9) {
		//skip 8th step
		this.goPage(7);
		this.changeButtonStateForStep(7);
	} else if (this._containedObject[ZaModel.currentStep] == 10 && this._containedObject.attrs[ZaDomain.A_GalMode]==ZaDomain.GAL_Mode_internal) {
		this.goPage(2);
		this.changeButtonStateForStep(2);		
	} else if (this._containedObject[ZaModel.currentStep] == 15) {
		//skip 14th step
		this.goPage(13);
		this.changeButtonStateForStep(13);		
	} else if(this._containedObject[ZaModel.currentStep] == 16) {
		if(this._containedObject.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_zimbra) {
			this.goPage(10); //skip all auth configuration
			this.changeButtonStateForStep(10);
		} else {
			this.goPage(15);
			this.changeButtonStateForStep(15);
		}
	} else if(this._containedObject[ZaModel.currentStep] == 13) {
		this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
		if(this._containedObject.attrs[ZaDomain.A_AuthMech] == ZaDomain.AuthMech_ad) {
			this.goPage(11); //skip all auth configuration
			this.changeButtonStateForStep(11);
		} else {
			this.goPage(12);
			this.changeButtonStateForStep(12);
		}
	} else if(this._containedObject[ZaModel.currentStep] == 19) {
		if (this._containedObject[ZaDomain.A_CreateNotebook] != "TRUE") {
			this.goPage(17);
			this.changeButtonStateForStep(17);	
		}else{
			this.goPage(18);
			this.changeButtonStateForStep(18);
		}
	} else {
		this._button[DwtWizardDialog.NEXT_BUTTON].setText(AjxMsg._next);
		this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]-1);
		this.goPage(this._containedObject[ZaModel.currentStep]-1);
	}
}

ZaNewDomainXWizard.prototype.goNext = 
function() {
	if(this._containedObject[ZaModel.currentStep] == 3 && this._containedObject.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal) {	
		//check that Filter is provided and at least one server
		if(!this._containedObject.attrs[ZaDomain.A_GalLdapFilter]) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_SEARCH_FILTER_REQUIRED);			
			return;
		}
		if(!this._containedObject.attrs[ZaDomain.A_GalLdapURL] || this._containedObject.attrs[ZaDomain.A_GalLdapURL].length < 1) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_LDAP_URL_REQUIRED);					
			return;
		}
	} 
	if (this._containedObject[ZaModel.currentStep] == 1) {
		this._containedObject.attrs[ZaDomain.A_AuthADDomainName] = this._containedObject.attrs[ZaDomain.A_domainName];
//		this.changeButtonStateForStep(2);
		this.goPage(2);		
	} else if(this._containedObject[ZaModel.currentStep] == 2 && this._containedObject.attrs[ZaDomain.A_GalMode]==ZaDomain.GAL_Mode_internal) {
//		this.changeButtonStateForStep(10);
		this.goPage(10);
	} else if(this._containedObject[ZaModel.currentStep] == 4) {
		//clear the password if the checkbox is unchecked
		if(this._containedObject.attrs[ZaDomain.A_UseBindPassword]=="FALSE") {
			this._containedObject.attrs[ZaDomain.A_GalLdapBindPassword] = null;
			this._containedObject.attrs[ZaDomain.A_GalLdapBindPasswordConfirm] = null;
			this._containedObject.attrs[ZaDomain.A_GalLdapBindDn] = null;
		}
		//check that passwords match
		if(this._containedObject.attrs[ZaDomain.A_GalLdapBindPassword]!=this._containedObject.attrs[ZaDomain.A_GalLdapBindPasswordConfirm]) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
			return false;
		}
		this.goPage(5);
//		this.changeButtonStateForStep(5);		
	} else if(this._containedObject[ZaModel.currentStep] == 5) { 
		if(this._containedObject.attrs[ZaDomain.A_GALSyncUseGALSearch]=="FALSE") {
			this.goPage(6);
		} else {
			this.goPage(7);
		}
	} else if(this._containedObject[ZaModel.currentStep] == 7) {
		if(!this._containedObject[ZaDomain.A_GALSampleQuery]) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_SEARCH_TERM_REQUIRED);			
			return;
		}	
		this.goPage(8);
 		this.testGALSettings();
//		this.changeButtonStateForStep(8);
	} else if(this._containedObject[ZaModel.currentStep] == 6) {
		//clear the password if the checkbox is unchecked
		if(this._containedObject.attrs[ZaDomain.A_SyncUseBindPassword]=="FALSE") {
			this._containedObject.attrs[ZaDomain.A_zimbraGalSyncLdapBindPassword] = null;
			this._containedObject.attrs[ZaDomain.A_GalSyncLdapBindPasswordConfirm] = null;
			this._containedObject.attrs[ZaDomain.A_zimbraGalSyncLdapBindDn] = null;
		}
		//check that passwords match
		if(this._containedObject.attrs[ZaDomain.A_zimbraGalSyncLdapBindPassword]!=this._containedObject.attrs[ZaDomain.A_GalSyncLdapBindPasswordConfirm]) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
			return false;
		}
		this.goPage(7);
//		this.changeButtonStateForStep(7);		
	} else if (this._containedObject[ZaModel.currentStep] == 10) {
		this._button[DwtWizardDialog.PREV_BUTTON].setEnabled(true);
		if(this._containedObject.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_zimbra) {
			this.goPage(16);		
//			this.changeButtonStateForStep(16);
		} else {
			this.goPage(11);
//			this.changeButtonStateForStep(11);			
		}
	} else if (this._containedObject[ZaModel.currentStep] == 11) {
		//check if LDAP URL is provided
		if(!this._containedObject.attrs[ZaDomain.A_AuthLdapURL]) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_LDAP_URL_REQUIRED);
			return false;
		}
		if(this._containedObject.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ad) {
			this.goPage(13);		
			this.changeButtonStateForStep(13);
		} else {
			this.goPage(10);
			this.changeButtonStateForStep(12);			
		}
	} else if (this._containedObject[ZaModel.currentStep] == 12) {
			//clear the password if the checkbox is unchecked
		if(this._containedObject[ZaDomain.A_AuthUseBindPassword]=="FALSE") {
			this._containedObject.attrs[ZaDomain.A_AuthLdapSearchBindDn] = null;
			this._containedObject.attrs[ZaDomain.A_AuthLdapSearchBindPassword] = null;
			this._containedObject[ZaDomain.A_AuthLdapSearchBindPasswordConfirm] = null;
		}
		//check that passwords match
		if(this._containedObject.attrs[ZaDomain.A_AuthLdapSearchBindPassword]!=this._containedObject[ZaDomain.A_AuthLdapSearchBindPasswordConfirm]) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
			return false;
		}
		this.goPage(13);
//		this.changeButtonStateForStep(13);
	} else if(this._containedObject[ZaModel.currentStep] == 13) {
		this.goPage(14);
 		this.testAuthSettings();
//		this.changeButtonStateForStep(14);
	} else if(this._containedObject[ZaModel.currentStep] == 17) {
		if (this._containedObject[ZaDomain.A_CreateNotebook] != "TRUE") {
			this.goPage(this._containedObject[ZaModel.currentStep] + 2);
//			this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);
		} else if(this._containedObject[ZaDomain.A_NotebookAccountPassword] != this._containedObject[ZaDomain.A_NotebookAccountPassword2]) {
			this._app.getCurrentController().popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
		} else {		
			this.goPage(this._containedObject[ZaModel.currentStep] + 1);
//			this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);
		}
	} else {
		this.goPage(this._containedObject[ZaModel.currentStep] + 1);
//		this.changeButtonStateForStep(this._containedObject[ZaModel.currentStep]);
	}
}

ZaNewDomainXWizard.getGalSyncLdapFilterEnabled = function () {
	var val1 = this.getModel().getInstanceValue(this.getInstance(),ZaDomain.A_GALSyncUseGALSearch);
	var val2 = this.getModel().getInstanceValue(this.getInstance(),ZaDomain.A_GALSyncServerType);
	return (val1 == 'FALSE' && val2=='ldap');	
}

ZaNewDomainXWizard.getGalSyncConfigSeparate = function () {
	var val1 = this.getModel().getInstanceValue(this.getInstance(),ZaDomain.A_GALSyncUseGALSearch);
	return (val1 == 'FALSE');	
}

ZaNewDomainXWizard.myXFormModifier = function(xFormObject) {
	var resultHeaderList = new Array();
	resultHeaderList[0] = new ZaListHeaderItem("email", ZaMsg.ALV_Name_col, null, "116px", null, "email", true, true);
	resultHeaderList[1] = new ZaListHeaderItem("fullName", ZaMsg.ALV_FullName_col, null, "116px", null, "fullName", true, true);
	
	xFormObject.items = [
		{type:_OUTPUT_, colSpan:2, align:_CENTER_, valign:_TOP_, ref:ZaModel.currentStep, choices:this.stepChoices},
		{type:_SEPARATOR_, align:_CENTER_, valign:_TOP_},
		{type:_SPACER_,  align:_CENTER_, valign:_TOP_},		
		{type: _SWITCH_,
			items: [
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 1", relevantBehavior:_HIDE_,
					items: [
						{ref:ZaDomain.A_domainName, type:_TEXTFIELD_, label:ZaMsg.Domain_DomainName,labelLocation:_LEFT_, width:200},
						{ref:ZaDomain.A_zimbraPublicServiceHostname, type:_TEXTFIELD_, label:ZaMsg.Domain_zimbraPublicServiceHostname,labelLocation:_LEFT_, width:200},						
						{ref:ZaDomain.A_description, type:_TEXTFIELD_, label:ZaMsg.NAD_Description, labelLocation:_LEFT_, width:250},
						{ref:ZaDomain.A_domainDefaultCOSId, type:_OSELECT1_, 
							label:ZaMsg.Domain_DefaultCOS, labelLocation:_LEFT_, 
							choices:this._app.getCosListChoices()
						},
						{ref:ZaDomain.A_zimbraDomainStatus, type:_OSELECT1_, msgName:ZaMsg.NAD_DomainStatus,
							label:ZaMsg.Domain_zimbraDomainStatus, 
							labelLocation:_LEFT_, choices:ZaDomain.domainStatusChoices
						},						
						{ref:ZaDomain.A_notes, type:_TEXTAREA_, label:ZaMsg.NAD_Notes, labelLocation:_LEFT_, labelCssStyle:"vertical-align:top", width:250}
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 2", relevantBehavior:_HIDE_,
					items: [
						{ref:ZaDomain.A_GalMode, type:_OSELECT1_, label:ZaMsg.Domain_GalMode, labelLocation:_LEFT_, choices:this.GALModes, onChange:ZaNewDomainXWizard.onGalModeChange},
						{ref:ZaDomain.A_GalMaxResults, type:_TEXTFIELD_, label:ZaMsg.NAD_GalMaxResults, labelLocation:_LEFT_}					
					]
				},
				{type:_CASE_, numCols:2, relevant:"instance[ZaModel.currentStep] == 3 && instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal", relevantBehavior:_HIDE_,cssStyle:"overflow:auto",
					items: [
						{ref:ZaDomain.A_GALServerType, type:_OSELECT1_, label:ZaMsg.Domain_GALServerType, labelLocation:_LEFT_, choices:this.GALServerTypes, onChange:ZaNewDomainXWizard.onGALServerTypeChange},
						{type:_GROUP_, numCols:6, colSpan:6,label:"   ",labelLocation:_LEFT_,
							items: [
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerName, width:"200px"},
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerPort,  width:"40px"},	
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALUseSSL, width:"40px"}									
							]
						},
						{ref:ZaDomain.A_GalLdapURL, type:_REPEAT_, label:ZaMsg.Domain_GalLdapURL, repeatInstance:"", showAddButton:true, showRemoveButton:true,  
							addButtonLabel:ZaMsg.Domain_AddURL, 
							removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,
							showAddOnNextRow:true,
							items: [
								{ref:".", type:_LDAPURL_, label:null, labelLocation:_NONE_}
							]
						},
						{ref:ZaDomain.A_GalLdapFilter, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapFilter, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_GALServerType] == ZaDomain.GAL_ServerType_ldap", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_zimbraGalAutoCompleteLdapFilter, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_zimbraGalAutoCompleteLdapFilter, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_GALServerType] == 'ldap'", relevantBehavior:_DISABLE_},						
						{ref:ZaDomain.A_GalLdapSearchBase, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapSearchBase, labelLocation:_LEFT_}
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 4 && instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal", relevantBehavior:_HIDE_,
					items: [
						{ref:ZaDomain.A_UseBindPassword, type:_CHECKBOX_, label:ZaMsg.Domain_UseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_},
						{ref:ZaDomain.A_GalLdapBindDn, type:_TEXTFIELD_, label:ZaMsg.Domain_GalLdapBindDn, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_UseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_GalLdapBindPassword, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPassword, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_UseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_GalLdapBindPasswordConfirm, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPasswordConfirm, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_UseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_}														
					]			
				}, 
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 5", relevantBehavior:_HIDE_,
					items: [
						{ref:ZaDomain.A_GALSyncUseGALSearch, type:_CHECKBOX_, label:ZaMsg.Domain_GALSyncUseGALSearch, 
							labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",
							labelCssClass:"xform_label", align:_LEFT_,labelWrap:true,
							onChange:ZaNewDomainXWizard.onGALSyncChange
						},
						{ref:ZaDomain.A_GALSyncServerType, type:_OSELECT1_, label:ZaMsg.Domain_GALServerType, labelLocation:_LEFT_, 
							choices:this.GALServerTypes, onChange:ZaNewDomainXWizard.onGALSyncServerTypeChange,
							relevant:"ZaNewDomainXWizard.getGalSyncConfigSeparate.call(item)",
							relevantBehavior:_DISABLE_
						},
						{type:_GROUP_, numCols:6, colSpan:6,label:"   ",labelLocation:_LEFT_,
							relevant:"ZaNewDomainXWizard.getGalSyncConfigSeparate.call(item)",
							relevantBehavior:_DISABLE_,
							items: [
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerName, width:"200px"},
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALServerPort,  width:"40px"},	
								{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_GALUseSSL, width:"60px"}									
							]
						},
						{ref:ZaDomain.A_zimbraGalSyncLdapURL, type:_REPEAT_, label:ZaMsg.Domain_GalLdapURL+":", repeatInstance:"", showAddButton:true, showRemoveButton:true,
							relevant:"ZaNewDomainXWizard.getGalSyncConfigSeparate.call(item)",
							relevantBehavior:_DISABLE_,
							addButtonLabel:ZaMsg.Domain_AddURL, 
							removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,								
							showAddOnNextRow:true,							
							items: [
								{ref:".", type:_LDAPURL_, label:null, labelLocation:_NONE_}
							]
						},
						{ref:ZaDomain.A_zimbraGalSyncLdapFilter, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapFilter, labelLocation:_LEFT_, textWrapping:"soft", 
							relevant:"ZaNewDomainXWizard.getGalSyncLdapFilterEnabled.call(item)",
							relevantBehavior:_DISABLE_
						},
						{ref:ZaDomain.A_zimbraGalSyncLdapSearchBase, type:_TEXTAREA_, width:380, height:40, label:ZaMsg.Domain_GalLdapSearchBase, labelLocation:_LEFT_, textWrapping:"soft", 
							relevant:"ZaNewDomainXWizard.getGalSyncConfigSeparate.call(item)",
							relevantBehavior:_DISABLE_							
						}						
					]
				},
				{type:_CASE_, relevant:"(instance[ZaModel.currentStep] == 6 && instance.attrs[ZaDomain.A_GalMode] != ZaDomain.GAL_Mode_internal && instance.attrs[ZaDomain.A_GALSyncUseGALSearch]=='FALSE')", relevantBehavior:_HIDE_,
					items: [
						{ref:ZaDomain.A_SyncUseBindPassword, type:_CHECKBOX_, label:ZaMsg.Domain_UseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_},
						{ref:ZaDomain.A_zimbraGalSyncLdapBindDn, type:_INPUT_, label:ZaMsg.Domain_GalLdapBindDn, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_SyncUseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_zimbraGalSyncLdapBindPassword, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPassword, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_SyncUseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_GalSyncLdapBindPasswordConfirm, type:_SECRET_, label:ZaMsg.Domain_GalLdapBindPasswordConfirm, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_SyncUseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_}							
					]			
				},					
				
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 7", relevantBehavior:_HIDE_,width:"500px",
					items: [
						{ref:ZaDomain.A_GalMode, type:_OUTPUT_, label:ZaMsg.Domain_GalMode, choices:this.GALModes},
						{ref:ZaDomain.A_GalMaxResults, type:_OUTPUT_, label:ZaMsg.NAD_GalMaxResults},
						//search
						{type:_ZAWIZ_TOP_GROUPER_, relevant:"instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal", relevantBehavior:_HIDE_,
							useParentTable:false,
							numCols:2,colSpan:2,
							label:ZaMsg.Domain_GALSearchConfigSummary,
							items: [
								{ref:ZaDomain.A_GALServerType, type:_OUTPUT_, label:ZaMsg.Domain_GALServerType, choices:this.GALServerTypes, labelLocation:_LEFT_},
								{ref:ZaDomain.A_GalLdapURL, type:_REPEAT_, label:ZaMsg.Domain_GalLdapURL+":", labelLocation:_LEFT_,showAddButton:false, showRemoveButton:false,
									items:[
										{type:_OUTPUT_, ref:".", label:null,labelLocation:_NONE_}
									]
								},	
								{ref:ZaDomain.A_GalLdapFilter, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapFilter, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_GALServerType] == 'ldap'", relevantBehavior:_HIDE_,required:true},
								{ref:ZaDomain.A_GalLdapSearchBase, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapSearchBase, labelLocation:_LEFT_},
								{ref:ZaDomain.A_UseBindPassword, type:_OUTPUT_, label:ZaMsg.Domain_UseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE"},
								{ref:ZaDomain.A_GalLdapBindDn, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapBindDn, labelLocation:_LEFT_, relevant:"instance.attrs[ZaDomain.A_UseBindPassword] == 'TRUE'", relevantBehavior:_HIDE_}
							]
						},
						//sync
						{type:_ZAWIZ_TOP_GROUPER_, 
							label:ZaMsg.Domain_GALSyncConfigSummary,
							useParentTable:false,
							numCols:2,colSpan:2,
							items: [
								{ref:ZaDomain.A_GALSyncUseGALSearch, type:_OUTPUT_, label:ZaMsg.Domain_GALSyncUseGALSearch, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE"},
								{ref:ZaDomain.A_GALSyncServerType, type:_OUTPUT_, label:ZaMsg.Domain_GALServerType, choices:this.GALServerTypes, labelLocation:_LEFT_,
								relevant:"(instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal && instance.attrs[ZaDomain.A_GALSyncUseGALSearch]=='FALSE')", relevantBehavior:_HIDE_},
								{ref:ZaDomain.A_zimbraGalSyncLdapURL, type:_REPEAT_, label:ZaMsg.Domain_GalLdapURL+":", labelLocation:_LEFT_,showAddButton:false, showRemoveButton:false,
									relevant:"(instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal && instance.attrs[ZaDomain.A_GALSyncUseGALSearch]=='FALSE')", relevantBehavior:_HIDE_,
									items:[
										{type:_OUTPUT_, ref:".", label:null,labelLocation:_NONE_}
									]
								},	
								{ref:ZaDomain.A_zimbraGalSyncLdapFilter, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapFilter, labelLocation:_LEFT_, 
									relevant:"( (instance.attrs[ZaDomain.A_GALServerType] == 'ldap') && (instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal && instance.attrs[ZaDomain.A_GALSyncUseGALSearch]=='FALSE'))", 
									relevantBehavior:_HIDE_,required:true},
								{ref:ZaDomain.A_zimbraGalSyncLdapSearchBase, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapSearchBase, labelLocation:_LEFT_,
									relevant:"(instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal && instance.attrs[ZaDomain.A_GALSyncUseGALSearch]=='FALSE')", relevantBehavior:_HIDE_
								},
								{ref:ZaDomain.A_SyncUseBindPassword, type:_OUTPUT_, label:ZaMsg.Domain_UseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",
									relevant:"(instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal && instance.attrs[ZaDomain.A_GALSyncUseGALSearch]=='FALSE')", relevantBehavior:_HIDE_								
								},
								{ref:ZaDomain.A_zimbraGalSyncLdapBindDn, type:_OUTPUT_, label:ZaMsg.Domain_GalLdapBindDn, labelLocation:_LEFT_, 
									relevant:"( (instance.attrs[ZaDomain.A_UseBindPassword] == 'TRUE') && (instance.attrs[ZaDomain.A_GalMode]!=ZaDomain.GAL_Mode_internal && instance.attrs[ZaDomain.A_GALSyncUseGALSearch]=='FALSE'))", 
									relevantBehavior:_HIDE_
								}
							]
						},
						{ref:ZaDomain.A_GALSampleQuery, type:_INPUT_, label:ZaMsg.Domain_GALSampleSearchName, labelLocation:_LEFT_, labelWrap:true, cssStyle:"width:100px;"}					
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 8", relevantBehavior:_HIDE_,
					items: [
						{type:_OUTPUT_, value:ZaMsg.Domain_GALTestingInProgress}
					]	
				}, 
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 9", relevantBehavior:_HIDE_,width:"500px",
					items: [
						{type:_ZAWIZ_TOP_GROUPER_, relevant:"instance[ZaDomain.A_GALSearchTestResultCode] == ZaDomain.Check_OK", 
							label:ZaMsg.Domain_GALSearchTestResults,
							numCols:2,
							items: [
								{type:_DWT_ALERT_,content:ZaMsg.Domain_GALSearchTestSuccessful,
									ref:null,
									colSpan:"2",
									iconVisible: false,
									align:_CENTER_,				
									style: DwtAlert.INFORMATION
								},										
								{type:_OUTPUT_, value:ZaMsg.Domain_GALSearchResult,  align:_CENTER_, colSpan:2, relevant:"(instance[ZaDomain.A_GALTestSearchResults]!=null && instance[ZaDomain.A_GALTestSearchResults].length>0)"},											
								{type:_SPACER_,  align:_CENTER_, valign:_TOP_, colSpan:"*"},	
								{ref: ZaDomain.A_GALTestSearchResults, type:_DWT_LIST_, height:"140px", width:"260px",colSpan:2,
			 				    	cssClass: "DLSource", forceUpdate: true, 
			 				    	widgetClass:ZaGalObjMiniListView, headerList:resultHeaderList,
			 				    	hideHeader:true
			 				    }
							]
						},
						{type:_ZAWIZ_TOP_GROUPER_, relevant:"instance[ZaDomain.A_GALSearchTestResultCode] != ZaDomain.Check_OK",
							label:ZaMsg.Domain_GALSearchTestResults,
							numCols:2,					
							items: [
							   {type:_DWT_ALERT_,content:ZaMsg.Domain_GALSearchTestFailed,
									ref:null,
									colSpan:"2",
									iconVisible: true,
									align:_CENTER_,				
									style: DwtAlert.WARNING
								},							
								{type:_OUTPUT_, ref:ZaDomain.A_GALSearchTestResultCode, label:ZaMsg.Domain_GALTestResult, choices:this.TestResultChoices},
								{type:_TEXTAREA_, ref:ZaDomain.A_GALSearchTestMessage, label:ZaMsg.Domain_GALTestMessage, height:"200px", width:"380px"}
							]
						},
						{type:_ZAWIZ_TOP_GROUPER_, relevant:"instance[ZaDomain.A_GALSyncTestResultCode] == ZaDomain.Check_OK", 
							label:ZaMsg.Domain_GALSyncTestResults,
							numCols:2,
							items: [
								{type:_DWT_ALERT_,content:ZaMsg.Domain_GALSyncTestSuccessful,
									ref:null,
									colSpan:"*",
									iconVisible: false,
									align:_CENTER_,				
									style: DwtAlert.INFORMATION
								}
							]
						},
						{type:_ZAWIZ_TOP_GROUPER_, relevant:"instance[ZaDomain.A_GALSyncTestResultCode] != ZaDomain.Check_OK",
							label:ZaMsg.Domain_GALSyncTestResults,
							numCols:2,						
							items: [
								{type:_DWT_ALERT_,content:ZaMsg.Domain_GALSyncTestFailed,
									ref:null,
									colSpan:"2",
									iconVisible: true,
									align:_CENTER_,				
									style: DwtAlert.WARNING
								},							
								{type:_OUTPUT_, ref:ZaDomain.A_GALSyncTestResultCode, label:ZaMsg.Domain_GALTestResult, choices:this.TestResultChoices},
								{type:_TEXTAREA_, ref:ZaDomain.A_GALSyncTestMessage, label:ZaMsg.Domain_GALTestMessage, height:"200px", width:"380px"}
							]
						}
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 10", relevantBehavior:_HIDE_,
					items:[
						{type:_OSELECT1_, label:ZaMsg.Domain_AuthMech, choices:this.AuthMechs, ref:ZaDomain.A_AuthMech, onChange:ZaNewDomainXWizard.onAuthMechChange}
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 11", relevantBehavior:_HIDE_,												
					items:[
						{type:_SWITCH_,
							items: [
								{type:_CASE_, relevant:"instance.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ad",
									items:[
										{ref:ZaDomain.A_AuthADDomainName, type:_INPUT_, width:200,  label:ZaMsg.Domain_AuthADDomainName, labelLocation:_LEFT_},
										{type:_GROUP_, numCols:6, colSpan:6,label:"   ",labelLocation:_LEFT_,
											items: [
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthADServerName, width:"200px"},
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthADServerPort,  width:"40px"},	
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthADUseSSL, width:"40px"}									
											]
										},
										{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, repeatInstance:"", showAddButton:true, showRemoveButton:true,  
											addButtonLabel:ZaMsg.Domain_AddURL, 
											showAddOnNextRow:true,	
											removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,																						
											items: [
												{ref:".", type:_LDAPURL_, label:null, labelLocation:_NONE_,ldapSSLPort:"3269",ldapPort:"3268"}
											]
										}									
									]
								},
								{type:_CASE_, relevant:"instance.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ldap",
									items:[
										{type:_GROUP_, numCols:6, colSpan:6,label:"   ",labelLocation:_LEFT_,
											items: [
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"35px"},
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthLDAPServerName, width:"200px"},
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:" ", width:"5px"},									
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthLDAPServerPort,  width:"40px"},	
												{type:_OUTPUT_, label:null, labelLocation:_NONE_, value:ZaMsg.Domain_AuthLDAPUseSSL, width:"40px"}									
											]
										},	
										{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, repeatInstance:"", showAddButton:true, showRemoveButton:true,  
											addButtonLabel:ZaMsg.Domain_AddURL, 
											showAddOnNextRow:true,												
											removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,
											items: [
												{ref:".", type:_LDAPURL_, label:null,ldapSSLPort:"636",ldapPort:"389", labelLocation:_NONE_}
											]
										},
										{ref:ZaDomain.A_AuthLdapSearchFilter, type:_TEXTAREA_, width:380, height:100, label:ZaMsg.Domain_AuthLdapFilter, labelLocation:_LEFT_, textWrapping:"soft"},
										{ref:ZaDomain.A_AuthLdapSearchBase, type:_TEXTAREA_, width:380, height:50, label:ZaMsg.Domain_AuthLdapSearchBase, labelLocation:_LEFT_, textWrapping:"soft"},
										{type:_OUTPUT_, value:ZaMsg.NAD_DomainsAuthStr, colSpan:2}
									]
								},
								{type:_CASE_, relevant:"instance.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_zimbra",
									items:[
										{type:_OUTPUT_, value:ZaMsg.Domain_Auth_Config_Complete}
									]
								}
							]
						}
					]
				},
				{type:_CASE_, numCols:2, relevant:"instance[ZaModel.currentStep] == 12 && instance.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ldap", relevantBehavior:_HIDE_,
					items: [
						{ref:ZaDomain.A_AuthUseBindPassword, type:_CHECKBOX_, label:ZaMsg.Domain_AuthUseBindPassword, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_},
						{ref:ZaDomain.A_AuthLdapSearchBindDn, type:_TEXTFIELD_, label:ZaMsg.Domain_AuthLdapBindDn, labelLocation:_LEFT_, relevant:"instance[ZaDomain.A_AuthUseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_AuthLdapSearchBindPassword, type:_SECRET_, label:ZaMsg.Domain_AuthLdapBindPassword, labelLocation:_LEFT_, relevant:"instance[ZaDomain.A_AuthUseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_AuthLdapSearchBindPasswordConfirm, type:_SECRET_, label:ZaMsg.Domain_AuthLdapBindPasswordConfirm, labelLocation:_LEFT_, relevant:"instance[ZaDomain.A_AuthUseBindPassword] == 'TRUE'", relevantBehavior:_DISABLE_}							
					]						
				},
				{type:_CASE_, numCols:2, relevant:"instance[ZaModel.currentStep] == 13 && instance.attrs[ZaDomain.A_AuthMech]!=ZaDomain.AuthMech_zimbra", relevantBehavior:_HIDE_,
					items: [
						{type:_OUTPUT_, value:ZaMsg.Domain_Auth_ConfigSummary, align:_CENTER_, colSpan:"*"}, 
						{type:_SPACER_, height:10},
						{ref:ZaDomain.A_AuthMech, type:_OUTPUT_, label:ZaMsg.Domain_AuthMech, choices:this.AuthMechs, alignment:_LEFT_},
						{type:_GROUP_, relevant:"instance.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ad", useParentTable:true,
							items:[
								{ref:ZaDomain.A_AuthADDomainName, type:_OUTPUT_, label:ZaMsg.Domain_AuthADDomainName, labelLocation:_LEFT_},
								{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, labelLocation:_LEFT_,showAddButton:false, showRemoveButton:false,
									items:[
										{type:_OUTPUT_, ref:".", label:null,labelLocation:_NONE_}
									]
								}											
							]
						},
						{type:_GROUP_, relevant:"instance.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ldap", useParentTable:true,
							items:[
								{ref:ZaDomain.A_AuthLdapURL, type:_REPEAT_, label:ZaMsg.Domain_AuthLdapURL, labelLocation:_LEFT_,showAddButton:false, showRemoveButton:false,
									items:[
										{type:_OUTPUT_, ref:".", label:null,labelLocation:_NONE_}
									]
								},											
								{ref:ZaDomain.A_AuthLdapSearchFilter, type:_OUTPUT_, label:ZaMsg.Domain_AuthLdapFilter, labelLocation:_LEFT_},
								{ref:ZaDomain.A_AuthLdapSearchBase, type:_OUTPUT_, label:ZaMsg.Domain_AuthLdapSearchBase, labelLocation:_LEFT_},
								{ref:ZaDomain.A_AuthUseBindPassword, type:_OUTPUT_, label:ZaMsg.Domain_AuthUseBindPassword, labelLocation:_LEFT_,choices:ZaModel.BOOLEAN_CHOICES},											
								{ref:ZaDomain.A_AuthLdapSearchBindDn, type:_TEXTFIELD_, label:ZaMsg.Domain_AuthLdapBindDn, labelLocation:_LEFT_, relevant:"instance[ZaDomain.A_AuthUseBindPassword] == 'TRUE'", relevantBehavior:_HIDE_}											
							]
						},
						{type:_SPACER_, height:10},
						{type:_OUTPUT_,value:ZaMsg.Domain_AuthProvideLoginPwd, align:_CENTER_, colSpan:"*"},
						{type:_INPUT_, label:ZaMsg.Domain_AuthTestUserName+":", ref:ZaDomain.A_AuthTestUserName, alignment:_LEFT_},
						{type:_SECRET_, label:ZaMsg.Domain_AuthTestPassword+":", ref:ZaDomain.A_AuthTestPassword, alignment:_LEFT_}
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 14 && instance.attrs[ZaDomain.A_AuthMech]!=ZaDomain.AuthMech_zimbra", relevantBehavior:_HIDE_,
					items: [
						{type:_OUTPUT_,value:ZaMsg.Domain_AuthTestingInProgress}
					]
				},
				{type:_CASE_,  numCols:1, relevant:"instance[ZaModel.currentStep] == 15 && instance.attrs[ZaDomain.A_AuthMech]!=ZaDomain.AuthMech_zimbra", relevantBehavior:_HIDE_,
					items: [
						{type:_SWITCH_,
							items: [
								{type:_CASE_, relevant:"instance[ZaDomain.A_AuthTestResultCode] == ZaDomain.Check_OK",
									items: [
										{type:_OUTPUT_, value:ZaMsg.Domain_AuthTestSuccessful, alignment:_CENTER_}
									]
								},
								{type:_CASE_, relevant:	"instance[ZaDomain.A_AuthTestResultCode] != ZaDomain.Check_OK",
									items: [
										{type:_OUTPUT_, value:ZaMsg.Domain_AuthTestFailed, alignment:_CENTER_, colSpan:2, label:null},
										{type:_OUTPUT_, ref:ZaDomain.A_AuthTestResultCode, label:ZaMsg.Domain_AuthTestResultCode, choices:this.TestResultChoices, alignment:_LEFT_},
										{type:_OUTPUT_, ref:ZaDomain.A_AuthComputedBindDn, label:ZaMsg.Domain_AuthComputedBindDn, alignment:_LEFT_, relevant:"instance.attrs[ZaDomain.A_AuthMech]==ZaDomain.AuthMech_ad", relevantBehavior:_HIDE_},
										{type:_TEXTAREA_, ref:ZaDomain.A_AuthTestMessage, label:ZaMsg.Domain_AuthTestMessage, height:150, alignment:_LEFT_, width:"320px"}
									]
								}
							]
						}
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 16",relevantBehavior:_HIDE_, 
					items:[
						{type:_DWT_ALERT_,content:null,ref:ZaDomain.A_domainName,
							getDisplayValue: function (itemVal) {
								return AjxMessageFormat.format(ZaMsg.Domain_VH_Explanation,itemVal);
							},
							colSpan:"*",
							iconVisible: false,
							align:_CENTER_,				
							style: DwtAlert.INFORMATION
						},
						{ref:ZaDomain.A_zimbraVirtualHostname, type:_REPEAT_, label:null, repeatInstance:"", showAddButton:true, showRemoveButton:true, 
								addButtonLabel:ZaMsg.NAD_AddVirtualHost, 
								showAddOnNextRow:true,
								removeButtonLabel:ZaMsg.NAD_RemoveVirtualHost,
								items: [
									{ref:".", type:_TEXTFIELD_, label:null,width:250}
								]
						}
					]
				},
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 17", relevantBehavior:_HIDE_,
					items: [
						{ref:ZaDomain.A_CreateNotebook, type:_CHECKBOX_, label:ZaMsg.Domain_CreateNotebook, labelLocation:_LEFT_,trueValue:"TRUE", falseValue:"FALSE",labelCssClass:"xform_label", align:_LEFT_,
							onChange:function(value, event, form){
								this.setInstanceValue(value);
								if(!this.getInstance()[ZaDomain.A_NotebookAccountName])
									this.getInstance()[ZaDomain.A_NotebookAccountName]=ZaDomain.DEF_WIKI_ACC+"@"+this.getInstance().attrs[ZaDomain.A_domainName];
							}
						},
						{ref:ZaDomain.A_NotebookAccountName, type:_TEXTFIELD_, label:ZaMsg.Domain_NotebookAccountName, labelLocation:_LEFT_, relevant:"instance[ZaDomain.A_CreateNotebook] == 'TRUE'", relevantBehavior:_DISABLE_},						
						{ref:ZaDomain.A_NotebookAccountPassword, type:_SECRET_, label:ZaMsg.Domain_NotebookAccountPassword, labelLocation:_LEFT_, relevant:"instance[ZaDomain.A_CreateNotebook] == 'TRUE'", relevantBehavior:_DISABLE_},
						{ref:ZaDomain.A_NotebookAccountPassword2, type:_SECRET_, label:ZaMsg.NAD_ConfirmPassword, labelLocation:_LEFT_, relevant:"instance[ZaDomain.A_CreateNotebook] == 'TRUE'", relevantBehavior:_DISABLE_}												
					]
				},	
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 18", relevantBehavior:_HIDE_,
					items: [
						{type:_ZAWIZ_TOP_GROUPER_,label:ZaMsg.Domain_GlobalAcl,colSizes:["200px","300px"],  width: "500px",
							items:[
								{ref:ZaDomain.A_NotebookDomainACLs, type:_ACL_, label:ZaMsg.ACL_Dom+":",labelLocation:_LEFT_,
									visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false}
								},							
								{type:_SPACER_, height:10},
								{ref:ZaDomain.A_NotebookAllACLs, type:_ACL_, label:ZaMsg.ACL_All+":",labelLocation:_LEFT_,
									visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false}
								},
								{type:_SPACER_, height:10},
								{ref:ZaDomain.A_NotebookPublicACLs, type:_ACL_, label:ZaMsg.ACL_Public+":",labelLocation:_LEFT_,
									visibleBoxes:{r:true,w:false,a:false,i:false,d:false,x:false}
								},
								{type:_SPACER_, height:10}

							]
						},
						{type:_SPACER_, height:10},
						{type:_ZAWIZ_TOP_GROUPER_, numCols:1, colSizes:["100%"], label:ZaMsg.Domain_PerGrp_Acl,width:"500px",
							items:[
								{type:_REPEAT_, ref:ZaDomain.A_NotebookGroupACLs,width:"100%",
									label:null, 
									repeatInstance:{name:"test@test.com",acl:{r:0,w:0,i:0,d:0,a:0,x:0}}, 
									showAddButton:true, showRemoveButton:true, 
									addButtonLabel:ZaMsg.Domain_AddGrpAcl, 
									addButtonWidth: 100,
									showAddOnNextRow:true,
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,								
									removeButtonWidth:80,											
									items: [
										{ref:".", type:_ADDR_ACL_, label:null, labelLocation:_NONE_,
											visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false},
											onChange:null,
											//forceUpdate:true,
											dataFetcherMethod:ZaSearch.prototype.dynSelectSearchGroups
										}
									]
								}
							]
						},
						{type:_SPACER_, height:10},
						{type:_ZAWIZ_TOP_GROUPER_, numCols:1,colSizes:["100%"],label:ZaMsg.Domain_PerUsr_Acl, width: "500px",
							items:[
								{type:_REPEAT_, ref:ZaDomain.A_NotebookUserACLs,width:"100%",
									label:null, 
									repeatInstance:{name:"test@test.com",acl:{r:0,w:0,i:0,d:0,a:0,x:0}}, 
									showAddButton:true, showRemoveButton:true, 
									addButtonLabel:ZaMsg.Domain_AddUsrAcl, 
									addButtonWidth: 150,
									showAddOnNextRow:true,
									removeButtonLabel:ZaMsg.Domain_REPEAT_REMOVE,
									removeButtonWidth:80,								
									items: [
										{ref:".", type:_ADDR_ACL_, label:null, labelLocation:_NONE_,
											visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false},
											onChange:null,
											forceUpdate:true,
											dataFetcherMethod:ZaSearch.prototype.dynSelectSearchAccounts
										}
									]
								}

							]
						}					
					]
				},							
				{type:_CASE_, relevant:"instance[ZaModel.currentStep] == 19", relevantBehavior:_HIDE_,
					items: [
						{type:_OUTPUT_, value:ZaMsg.Domain_Config_Complete}
					]
				}										
			]	
		}
	];
}
ZaXDialog.XFormModifiers["ZaNewDomainXWizard"].push(ZaNewDomainXWizard.myXFormModifier);