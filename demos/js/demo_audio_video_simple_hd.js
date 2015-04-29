//
//Copyright (c) 2014, CosRTC Software Inc.
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without
//modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
//LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//POSSIBILITY OF SUCH DAMAGE.
//
var selfThunderrtcid = "";


function connect() {
    thunderrtc.setVideoDims(1280,720);
    thunderrtc.enableDebug(false);
    thunderrtc.setRoomOccupantListener(convertListToButtons);
    thunderrtc.easyApp("thunderrtc.videoChatHd", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
}


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}


function convertListToButtons (roomName, data, isPrimary) {
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for(var thunderrtcid in data) {
        var button = document.createElement('button');
        button.onclick = function(thunderrtcid) {
            return function() {
                performCall(thunderrtcid);
            };
        }(thunderrtcid);

        var label = document.createTextNode(thunderrtc.idToName(thunderrtcid));
        button.appendChild(label);
        button.className = "callbutton";
        otherClientDiv.appendChild(button);
    }
}


function performCall(otherThunderrtcid) {
    thunderrtc.hangupAll();
    var acceptedCB = function(accepted, caller) {
        if( !accepted ) {
            thunderrtc.showError("CALL-REJECTED", "Sorry, your call to " + thunderrtc.idToName(caller) + " was rejected");
        }
    };
    var successCB = function() {};
    var failureCB = function() {};
    thunderrtc.call(otherThunderrtcid, successCB, failureCB, acceptedCB);
}


function loginSuccess(thunderrtcid) {
    selfThunderrtcid = thunderrtcid;
    document.getElementById("iam").innerHTML = "I am " + thunderrtc.cleanId(thunderrtcid);
}


function loginFailure(errorCode, message) {
    thunderrtc.showError(errorCode, message);
}


// Sets calls so they are automatically accepted (this is default behaviour)
thunderrtc.setAcceptChecker(function(caller, cb) {
    cb(true);
} );