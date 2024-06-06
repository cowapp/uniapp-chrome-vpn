// begin proxy logic
let PAC_Script = `
var domains= {};
var direct = "DIRECT;";
var subnetIpRangeList = [
0,1,
167772160,184549376,	//10.0.0.0/8
2886729728,2887778304,	//172.16.0.0/12
3232235520,3232301056,	//192.168.0.0/16
2130706432,2130706688	//127.0.0.0/24
];
function check_ipv4(host) {
	var re_ipv4 = /^\d+\.\d+\.\d+\.\d+$/g;
	if (re_ipv4.test(host)) {
		return true;
	}
}
function convertAddress(ipchars) {
	var bytes = ipchars.split(".");
	var result = (bytes[0] << 24) |
	(bytes[1] << 16) |
	(bytes[2] << 8) |
	(bytes[3]);
	return result >>> 0;
}
function isInSubnetRange(ipRange, intIp) {
	for ( var i = 0; i < 10; i += 2 ) {
		if ( ipRange[i] <= intIp && intIp < ipRange[i+1] )
			return true;
	}
}
function getShortHost(a) {
    var b = a.split(":")[0],splitArr = b.split("."),arrLen = splitArr.length;
    var c = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (c.test(b)) {
        return b
    }
    if (arrLen > 2) {
        b = splitArr[arrLen - 3] + "." + splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
    }
    return b
}
function isNeedProxy(host) {
	var a=host.split(".");
	for(var i=a.length-1;i>=0;i--){
		let v = a.slice(i).join(".");
		if(domains.hasOwnProperty(v) || selfDomains.hasOwnProperty(v)){
			return true;
		}
	}
}
function isApiHost(host) {
	if(apiObj.hasOwnProperty(host)){
		return true;
	}
}
function FindProxyForURL(url, host) {
    if(""+host === proxy_host || isApiHost(host)) {
        return direct;
    }
	url=""+url;
	host=""+host;
	if ( host.includes("localhost") ) {
		return direct;
	}
	if ( check_ipv4(host) === true ) {
		var intIp = convertAddress(strIp);
		if ( isInSubnetRange(subnetIpRangeList, intIp) ) {
			return direct;
		}
	}
	if ( mode == "all" ) {
		return wall_proxy;
	}
	if ( isNeedProxy(host) === true ) {
		return wall_proxy;
	}
	return direct;
}`;
//getShortHost(host);
function on(proxy_server,global,apiServers,cb) {
	//console.log("api_servers:",apiServers);
	var pxmd = global ? "all":"smart";
	var selfDomains = uni.getStorageSync("_self_domains");
	if (!selfDomains) {
		selfDomains = {};
	}
	var mode = `var mode = "` +pxmd+`";`
    var proxy_host = `var proxy_host = "` +proxy_server.host+`";`
	var domainInfo = `var user_domains_str = '` + JSON.stringify(selfDomains)+`';`
	//console.log("self domains=> \ninfo=>",selfDomains,domainInfo);
	var selfDomainsObj = `var selfDomains = JSON.parse(user_domains_str);`
	var apiServerStr = `var api_servers_str = '` + apiServers +`';`
	var apiOjbStr = `var apiObj = JSON.parse(api_servers_str);`
	var proxyInfo = `var wall_proxy = "`+proxy_server.schema+` `+proxy_server.host+`:`+proxy_server.port+`";`	
	var script = proxy_host + mode + domainInfo + selfDomainsObj + apiServerStr + apiOjbStr + proxyInfo + PAC_Script
	chrome.proxy.settings.set({
	        value:  {mode: "pac_script", pacScript: {data:script}},
	        scope: 'regular'
	    }, function () {
			if(cb) {
				cb();
			}
	});
	if(global) {
		chrome.runtime.sendMessage({type: 11});
	}else{
		chrome.runtime.sendMessage({type: 10});
	}
	//console.log("proxy on:",pxmd, proxyInfo,script);
	chrome.runtime.sendMessage({type: 3,data:script});
}

function off(){
	chrome.proxy.settings.clear({scope:'regular'},()=>{
		chrome.action.setIcon({path: 'static/logo_off38.png'});
	});
	chrome.runtime.sendMessage({type: 3,data:""});
}
// end proxy logic

// headers modify
function updateHeaderRes(msg){
	// request
	const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);
	let rules = [
	  {
	    id: 1,
	    priority: 1,
	    action: {
	      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
	      requestHeaders: [
	        {
	          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
	          header: '_p_x_user',
	          value: msg.xuser,
	        },
	      ]
	    },
	    condition: {
	      urlFilter: '*',
	      resourceTypes: allResourceTypes,
	    }
	  },
	  {
	    id: 2,
	    priority: 1,
	    action: {
	      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
	      requestHeaders: [
	        {
	          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
	          header: '_p_x_token',
	          value: msg.xtoken,
	        },
	      ]
	    },
	    condition: {
	      urlFilter: '*',
	      resourceTypes: allResourceTypes,
	    }
	  }];
	chrome.declarativeNetRequest.updateDynamicRules({
	  removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
	  addRules: rules
	});
}

function isInRules(domains, host) {
    var a=host.split(".");
    for(var i=a.length-1;i>=0;i--){
        let v = a.slice(i).join(".");
        if(domains.hasOwnProperty(v)){
            return true;
        }
    }
}

// web request error
function getShortHost(a) {
    var b = a.split(":")[0],splitArr = b.split("."),arrLen = splitArr.length;
    var c = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (c.test(b)) {
        return b
    }
    if (arrLen > 2) {
        b = splitArr[arrLen - 3] + "." + splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
    }
    return b
}
// NODE_OPTIONS=--openssl-legacy-provider
function setRequestErrListener(){}
module.exports = {
	on,
    off,
	updateHeaderRes,
	getShortHost,
	setRequestErrListener,
	isInRules
}