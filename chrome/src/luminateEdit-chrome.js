/*
 * Luminate Online Page Editor - Chrome
 * luminateEdit-chrome.js
 * Version: 1.12 (15-NOV-2017)
 * Updated for Manifest V3 compatibility
 */

/* set up declarativeContent rules on install to show action for potential Luminate Online pages */
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: '/site/' } }),
        new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: '/images/content/pagebuilder/' } })
      ],
      actions: [new chrome.declarativeContent.ShowAction()]
    }]);
  });
});

luminateEdit.chrome = {
  /* go to the admin URL when the edit icon is clicked */
  goToEditUrl: function() {
    /* fetch the current tab URL at click time */
    chrome.tabs.query({
      active: true,
      windowId: chrome.windows.WINDOW_ID_CURRENT
    }, function(allTabs) {
      luminateEdit.tabUrl = allTabs[0].url.replace('view-source:', '');

      var currentServlet = luminateEdit.getCurrentServlet();
      if(luminateEdit.tabUrl != null && currentServlet != null) {
        var adminBaseUrl = luminateEdit.tabUrl.split('/site/')[0];
        /* if this is an Image Library image, split on the images directory */
        if(luminateEdit.tabUrl.indexOf('/images/content/pagebuilder/') != -1) {
          adminBaseUrl = luminateEdit.tabUrl.split('/images/')[0];
        }

        chrome.tabs.create({
          url: adminBaseUrl + '/site/' + luminateEdit.servlets[currentServlet].getUrl()
        });
      }
    });
  }
};

chrome.action.onClicked.addListener(luminateEdit.chrome.goToEditUrl);
