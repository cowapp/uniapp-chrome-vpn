(async () => {
    let {started} = await chrome.storage.session.get("started");
    if (started === undefined) {
        chrome.action.setIcon({path: 'static/logo_off38.png'});
        chrome.management.getAll(function (a) {
            a.forEach(function (b) {
                b.enabled && b.id != chrome.runtime.id && -1 !== b.permissions.indexOf('proxy') && chrome.management.setEnabled(b.id, !1)
            })
        });
        let pacScriptConfig = {
            mode: 'pac_script',
            pacScript: {
                data: `function FindProxyForURL(url, host) {
                           return "DIRECT";
                      }`
            }
        };
        chrome.proxy.settings.set({value: pacScriptConfig, scope: 'regular'}, () => {
        });
        //console.log("session has started");
        chrome.storage.session.set({started: true});
        chrome.runtime.openOptionsPage();
        createEmptyTabOnStarted();
        let reload = false;
        setInterval(function () {
            let ct = getBJTime();
            let hh = ct.getHours();
            let mm = ct.getMinutes();
            if (!reload && hh === 5 && mm > 1) {
                reload = true;
                chrome.runtime.openOptionsPage();
            } else if (hh > 5) {
                reload = false;
            }
        }, 20000);
        //setInterval(chrome.runtime.getPlatformInfo, 100000);
        /**
         * Tracks when a service worker was last alive and extends the service worker
         * lifetime by writing the current time to extension storage every 20 seconds.
         * You should still prepare for unexpected termination - for example, if the
         * extension process crashes or your extension is manually stopped at
         * chrome://serviceworker-internals.
         */
        let heartbeatInterval;

        async function runHeartbeat() {
            await chrome.storage.local.set({ 'last-heartbeat': new Date().getTime() });
        }

        /**
         * Starts the heartbeat interval which keeps the service worker alive. Call
         * this sparingly when you are doing work which requires persistence, and call
         * stopHeartbeat once that work is complete.
         */
        async function startHeartbeat() {
            // Run the heartbeat once at service worker startup.
            runHeartbeat().then(() => {
                // Then again every 20 seconds.
                heartbeatInterval = setInterval(runHeartbeat, 20 * 1000);
            });
        }

        async function stopHeartbeat() {
            clearInterval(heartbeatInterval);
        }

        /**
         * Returns the last heartbeat stored in extension storage, or undefined if
         * the heartbeat has never run before.
         */
        async function getLastHeartbeat() {
            return (await chrome.storage.local.get('last-heartbeat'))['last-heartbeat'];
        }
        startHeartbeat()
    } else {
        //console.log("session is already running");
    }
})();
let udat = undefined;
let reqErrMap = {};
let domains = {};
let on = false;
let global = false;
let remote = undefined;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 0:
            udat = message.data;
            break;
        case 1:
            sendResponse(udat);
            break;
        case 2:
            closeCurrentTab().then(tab => {
            });
            break
        case 3:
            if (message.data === "") {
                on = false;
            } else {
                on = true;
            }
            voidWebRtc();
            break;
        case 4:
            udat = undefined;
        case 5:
            sendResponse(reqErrMap);
            break
        case 6:
            domains = message.data;
            break
        case 7:
            closeOnstartEmptyTab();
            break
        case 10:
            chrome.action.setIcon({path: 'static/logo38.png'});
            getCurrentTab().then(tab => {
                if (tab) {
                    let currentDomain = extractRootDomain(tab.url);
                    if (domains.hasOwnProperty(currentDomain)) {
                        chrome.action.setIcon({path: 'static/logo38_smart.png'});
                    }
                }
            });
            break;
        case 11:
            chrome.action.setIcon({path: 'static/logo_global38.png'});
            global = true;
            break;
        case 12:
            chrome.action.setIcon({path: 'static/logo38_smart.png'});
            break;
        case -1:
            break;
        case 13:
            remote = message.data;
            break;
        case 14:
            sendResponse(remote);
            break;
        default:
            console.error("unknown type:", message.type);
    }
});

function extractHostname(a) {
    var b;
    if (a.indexOf("//") > -1) {
        b = a.split("/")[2]
    } else {
        b = a.split("/")[0]
    }
    b = b.split(":")[0];
    b = b.split("?")[0];
    return b
}

let emptyTabId = -1;

function createEmptyTabOnStarted() {
    chrome.tabs.create({
        "url": "chrome://newtab/",
        "active": true
    }, function (tab) {
        emptyTabId = tab.id;
    });
}

function closeOnstartEmptyTab() {
    if (emptyTabId > 0) {
        chrome.tabs.remove(emptyTabId);
        emptyTabId = -1;
    }
}

function extractRootDomain(a) {
    var b = extractHostname(a),
        splitArr = b.split('.'),
        arrLen = splitArr.length;
    var c = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (c.test(b)) {
        return b
    }
    if (arrLen > 2) {
        let p3 = splitArr[arrLen - 3];
        if (p3 === "www") {
            b = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        } else {
            b = p3 + '.' + splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        }
    }
    return b
}

async function getTab(tid) {
    let tabs = await chrome.tabs.query({});
    for (let tb of tabs) {
        if (tb.id === tid) {
            return tb;
        }
    }
    return undefined;
}

var errReq = function (a) {
    var e = a.error;
    var tabId = a.tabId;
    var b = {
        "net::ERR_CONNECTION_RESET": 1,
        "net::ERR_CONNECTION_TIMED_OUT": 1,
        "net::ERR_TIMED_OUT": 1
    };
    if (b.hasOwnProperty(e)) {
        getTab(tabId).then(tab => {
            if (tab) {
                // console.log("error:", e, "url:", a.url, "page:", tab.url)
                let domain = extractRootDomain(tab.url);
                if (!reqErrMap.hasOwnProperty(domain)) {
                    reqErrMap[domain] = {}
                }
                let domainErr = extractRootDomain(a.url);
                reqErrMap[domain][domainErr] = 1
                if (on && !global) {
                    let pageErrMap = reqErrMap[domain];
                    // auto add sub error domain
                    let error = 0;
                    for (let sub in pageErrMap) {
                        if (!isInRules(sub)) {
                            error++
                        }
                    }
                    if (error > 0) {
                        chrome.action.setBadgeText({tabId: tab.id, text: error + ""})
                    }
                }
            }
        })
    }
}

var errProxyReq = function (a) {
    var e = a.error;
    //console.log("web request error:", e,"url:",a.url);
}

chrome.webRequest.onErrorOccurred.addListener(errReq, {urls: ["*://*/*"]});
chrome.proxy.onProxyError.addListener(errProxyReq);

function doTab() {
    if (on && !global) {
        getCurrentTab().then(tab => {
            if (tab) {
                let currentDomain = extractRootDomain(tab.url);
                if (isInRules(currentDomain)) {
                    // has error inside to main
                    if (reqErrMap.hasOwnProperty(currentDomain)) {
                        let pageErrMap = reqErrMap[currentDomain];
                        // auto add sub error domain
                        let error = 0;
                        for (let sub in pageErrMap) {
                            if (!isInRules(sub)) {
                                error++
                            }
                        }
                        if (error > 0) {
                            chrome.action.setBadgeText({tabId: tab.id, text: error + ""})
                        }
                    }
                    chrome.action.setIcon({path: 'static/logo38_smart.png'});
                } else {
                    chrome.action.setIcon({path: 'static/logo38.png'});
                }
            }
        });
    }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    doTab()
});
chrome.tabs.onActivated.addListener(function (info) {
    doTab()
});

function isInRules(host) {
    var a = host.split(".");
    for (var i = a.length - 1; i >= 0; i--) {
        let v = a.slice(i).join(".");
        if (domains.hasOwnProperty(v)) {
            return true;
        }
    }
}

async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0];
}

async function closeCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    let tabs = await chrome.tabs.query({});
    if (tabs.length === 1) {
        createNewEmptyTab(false);
    }
    for (let tb of tabs) {
        if (tb.url.indexOf("://extensions") > -1) {
            chrome.tabs.remove(tb.id);
            closeOnstartEmptyTab();
            if (tabs.length === 2) {
                createNewEmptyTab(true);
            }
        }
    }
    return;
}

function createNewEmptyTab(isActive) {
    const ua = navigator.userAgent;
    if (ua.indexOf("Edg") > -1) {
        chrome.tabs.create({
            "url": "edge://newtab/",
            "active": isActive
        });
    } else if (ua.indexOf("Chrome") > -1) {
        chrome.tabs.create({
            "url": "chrome://newtab/",
            "active": isActive
        });
    } else {
        chrome.tabs.create({
            "url": "https://",
            "active": isActive
        });
    }
}

// void webrtc leak
/* Function to get version of Chrome. https://stackoverflow.com/a/4900484 */
function getMajorVerison() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : false;
}

function voidWebRtc() {
    if (getMajorVerison() > 47) {
        var policy = "disable_non_proxied_udp";
        chrome.storage.local.set({
            rtcIPHandling: policy
        }, function () {
            try {
                chrome.storage.local.get('rtcIPHandling', function (items) {
                    chrome.privacy.network.webRTCIPHandlingPolicy.set({
                        value: items.rtcIPHandling
                    });
                });
            } catch (e) {
                console.log("Error: " + e.message);
            }
        });
    } else if (getMajorVerison() > 41 && getMajorVerison() < 47) {
        var rtcMultipleRoutes = true;
        chrome.storage.local.set({
            rtcMultipleRoutes: rtcMultipleRoutes
        }, function () {
            try {
                chrome.storage.local.get('rtcMultipleRoutes', function (items) {
                    chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
                        value: !items.rtcMultipleRoutes,
                        scope: 'regular'
                    });
                });
            } catch (e) {
                console.log("Error: " + e.message);
            }
        });
    } else if (getMajorVerison() == 47) {
        var nonProxiedUDP = true;
        var rtcMultipleRoutes = true;
        chrome.storage.local.set({
            nonProxiedUDP: nonProxiedUDP,
            rtcMultipleRoutes: rtcMultipleRoutes
        }, function () {
            try {
                chrome.storage.local.get(null, function (items) {
                    chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
                        value: !items.rtcMultipleRoutes,
                        scope: 'regular'
                    });
                    chrome.privacy.network.webRTCNonProxiedUdpEnabled.set({
                        value: !items.nonProxiedUDP,
                        scope: 'regular'
                    });
                });
            } catch (e) {
                console.log("Error: " + e.message);
            }
        });
    }
}

function getBJTime() {
    var d = new Date();
    currentDate = new Date();
    tmpHours = currentDate.getHours();
    var time_zone = -d.getTimezoneOffset() / 60;
    if (time_zone < 0) {
        time_zone = Math.abs(time_zone) + 8;
        currentDate.setHours(tmpHours + time_zone);
    } else {
        time_zone -= 8;
        currentDate.setHours(tmpHours - time_zone);
    }
    return currentDate;
}