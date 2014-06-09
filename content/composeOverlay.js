/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var ReplyToAllAsCc = {
  isReplyAll: function() {
    return gMsgCompose.type == Components.interfaces.nsIMsgCompType.ReplyAll;
  },

  getOriginalSender: function() {
    var originalHdr = this.getMsgHdrFromURI(gMsgCompose.originalMsgURI);
    var sender = this.extractAddresses(originalHdr.mime2DecodedAuthor);
    return sender.length > 0 ? sender[0] : null ;
  },

  getMsgHdrFromURI: function(aURI) {
    return Components.classes['@mozilla.org/messenger;1']
             .getService(Components.interfaces.nsIMessenger)
             .msgHdrFromURI(aURI);
  },

  extractAddresses: function(aAddressesWithComments) {
    var parser = Components.classes['@mozilla.org/messenger/headerparser;1']
                   .getService(Components.interfaces.nsIMsgHeaderParser);
    var addresses = {};
    var names = {};
    var fullNames = {};
    var count = {};
    parser.parseHeadersWithArray(aAddressesWithComments, addresses, names, fullNames, count);
    return addresses.value;
  },

  get addressingWidget() {
    return document.getElementById('addressingWidget');
  },

  get awRecipientItems() {
    var menulists = this.addressingWidget.querySelectorAll('listitem.addressingWidgetItem');
    return Array.slice(menulists, 0);
  },

  getRecipientTypeChooser: function(aItem) {
    return aItem.querySelector('menulist');
  },
  getRecipientValue: function(aItem) {
    return aItem.querySelector('textbox').value;
  },

  init: function() {
    if (!this.isReplyAll())
      return;

    var sender = this.getOriginalSender();

    this.awRecipientItems.forEach(function(aItem) {
      var chooser = this.getRecipientTypeChooser(aItem);
      var recipient = this.getRecipientValue(aItem);
      var addresses = this.extractAddresses(recipient);
      if (chooser.value == 'addr_to' && addresses[0] != sender)
        chooser.value = 'addr_cc';
    }, this);
  },

  handleEvent: function(aEvent) {
    switch (aEvent.type) {
      case 'compose-window-init':
        aEvent.currentTarget.removeEventListener(aEvent.type, this, false);
        widnow.addEventListener('unload', this, false);
        gMsgCompose.RegisterStateListener(this);
        return;

      case 'unload':
        aEvent.currentTarget.removeEventListener(aEvent.type, this, false);
        gMsgCompose.UnregisterStateListener(this);
        return;
    }
  },

  // nsIMsgComposeStateListener
  NotifyComposeFieldsReady: function() {
    // do it after all fields are constructed completely.
    setTimeout(this.init.bind(this), 0);
  },
  NotifyComposeBodyReady: function() {},
  ComposeProcessDone: function() {},
  SaveInFolderDone: function() {}
};

document.documentElement.addEventListener('compose-window-init', ReplyToAllAsCc, false);
