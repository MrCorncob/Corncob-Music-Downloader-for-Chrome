// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var workingUrls = ["http://mp3.zing.vn/bai-hat/",
                  "http://mp3.zing.vn/album/",
                  "http://www.nhaccuatui.com/bai-hat/",
                  "http://www.nhaccuatui.com/playlist/",
                  "http://mp3.zing.vn/chu-de/",
                  "http://mp3.zing.vn/bang-xep-hang/"];
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
  var newUrl = changeInfo.url;
  var flag = false;
  for(i = 0 ; i< workingUrls.length; i++)
  {
    if(newUrl.indexOf(workingUrls[i]) > -1)
    {
      flag = true;
      break;
    }
  }
  if(flag)
  {
    chrome.pageAction.show(tabId);
  }
  else
  {
    chrome.pageAction.hide(tabId);
  }

});

// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    code: 'download();'
  });
});
