const _options = false;
chrome.runtime.sendMessage({type: 1},
    function (response) {
        if (!response) {
            chrome.runtime.openOptionsPage();
            window.close();
        }
});
