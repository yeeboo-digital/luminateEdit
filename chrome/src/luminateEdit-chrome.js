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
  /* checks the current URL for known front-end servlet names, as defined in luminateEdit.servlets */
  checkForLuminateOnlineUrl: function(tabId, changeInfo, tab) {
    if(changeInfo.status == 'loading') {
      luminateEdit.tabUrl = tab.url.replace('view-source:', '');

      var currentServlet = luminateEdit.getCurrentServlet();
      /* hide the action if URL broadly matches but is not a known servlet */
      if(currentServlet == null || !luminateEdit.servlets[currentServlet] || luminateEdit.servlets[currentServlet].getUrl() == null) {
        chrome.action.hide(tabId);
      }
    }
  },

  /* go to the admin URL when the edit icon is clicked */
  goToEditUrl: function() {
    /* update the tab URL to ensure it is up-to-date at the time the icon is clicked */
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

/* bind listeners */
chrome.tabs.onUpdated.addListener(luminateEdit.chrome.checkForLuminateOnlineUrl);
chrome.action.onClicked.addListener(luminateEdit.chrome.goToEditUrl);