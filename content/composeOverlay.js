/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var ReplyToAllAsCc = {
  init: function() {
  }
};

window.addEventListener('DOMContentLoaded', function ReplyToAllAsCcSetup() {
  window.removeEventListener('DOMContentLoaded', ReplyToAllAsCcSetup, false);

  let (source = window.stateListener.NotifyComposeBodyReady.toSource()) {
    eval('window.stateListener.NotifyComposeBodyReady = '+source.replace(
      /(\}\)?)$/,
      'ReplyToAllAsCc.init(); $1'
    ));
  }
}, false);
