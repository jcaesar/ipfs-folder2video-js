function autogw() {
	if(RegExp("^/ip[fn]s/").test(document.location.pathname))
		return document.location.origin;
	else
		return "https://ipfs.io";
}
			
function log(str) {
	var t = document.createTextNode(str);
	append_log(t);
	return t;
}

function append_log(obj) {
	if (document.body) {
		var p = document.createElement('p');
		p.appendChild(obj);
		p.appendChild(document.createElement('br'));
		document.body.appendChild(p);
	} else {
		console.log(obj.innerText);
	}
}

function localize(translations) {
	var lc = language();
	var lst = {};
	for (var strd in translations) {
		lst[strd] = translations[strd][lc] || translations[strd]['en'] || ("[MISSING TRANSLATION: " + strd + "]");
	}
	return lst;
}

function wipe(node) {
	while(node.firstChild)
		node.removeChild(node.firstChild);
}

function settext(nodeid, text) {
	var node = document.getElementById(nodeid);
	wipe(node);
	node.appendChild(document.createTextNode(text));
}

// https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADOklEQVQ4jW1TfUhTURT/7b239/b23t6m87lKJ6VimYat5cqpga6s6BNaZWnf2geVFWnhambrYyRmHytX5lLKMohVVBgFJUQFZQRlhI2CiqggE8Iw91fdLVciXTjcy7nn/s45v/O7wJ+liOw8D2OyEfOWzWcOOtYrfeWr6Yb5eXDG6WEj9/JA7GD7e2BFEfmldrr9ZoO253lbzM8nfulbxyV1z+NWLuirpj/PzYOfZZFGYumhAMpRcXC4t1DdbV5V56alzJ5UI9KHiZBHyhiWmYopviq67eUVNrhrLfXWIGMxeUP9BWAY5O9cpei+4FY+n5gGC/FxkQxJBKhiDXfonk/T1XlV7Ht8UQiWr1QGyF3iQNtImDQO7a01XGdGSvhxpCp+ZjaK7l+IfnfKpb2db6EXJsUj2V5AF907K36xpKORxGigZjGvrIjqqVil2js4c4EV9hsn+Q8367nAVDNyIuVKQHS9U2h1rOO71GqYYNDD7a0Wfp3YJ7QYjRgRCoyJwQhPJfV6xVzKs6uEbq93MG3Er46AL51BF/qP6foShqMY8Qacbz4oBI84VB/dlbwnMQraXBPW11UwHRPSkUpGWtC0nw/kmjErAmA1IevOGal/XDK2IU5G07lDmp6M0SguWaC831wrPD2xm31TvVnVYhqNidlmJq+mnL/r2shdDvdMAGwW5N46rekfm4QySCKqPHvEYOZ4WDUsxlgzqNoNS5iA1yV8bXRrXjfVSO88TqH76E62Q6sNM0+VLlKWNh9Q95LkC0O82BZMZz4ddooeWYY4UKZK4pBMSMrUcEhJScBU9xbFq1gdMuLjEec/KdxaNod5RkQ1JgQgx0bD33I86n2RnZv9H6kqxibCVrUWLwxRSK/czG295hW/EwLdoUSRmadlm6m35z3azyXLWbskIXoQAF04DU7nBjyt3qF2XT+r682zKB4Sv36wlCmWxuLJ45nAuWO6Lz5PTOualXyh1YKsOQX0TK+Lf3TXL/+45I3qzTHTD4hyc/CfzxTSdqJWQGN+FtO1f4eu73RdbH9DnaF/73Zdry2LeqbXhsvWD2nx31cesNCoTCoWxToJ24iV8WyY7RBh/FB+fgPEB9xmWhx3bAAAAABJRU5ErkJggg==';
    document.getElementsByTagName('head')[0].appendChild(link);
})();

// https://stackoverflow.com/questions/951791/javascript-global-error-handling
window.onerror = function(msg, url, line, col, error) {
   var extra = !col ? '' : ' Column: ' + col;
   extra += !error ? '' : ' Error: ' + error;
   log("ERROR: " + msg + " Url: " + url + " Line: " + line + extra);
};

// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
function lerpColor(a, b, amount) { 

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

// https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters/1099670#1099670
function getQueryParams(qs) {
	qs = qs.split('+').join(' ');

	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return params;
}

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatSizeUnits(bytes){
	if      (bytes>=1073741824) {bytes=(bytes/1073741824).toFixed(2)+' GB';}
	else if (bytes>=1048576)    {bytes=(bytes/1048576).toFixed(2)+' MB';}
	else if (bytes>=1024)       {bytes=(bytes/1024).toFixed(2)+' KB';}
	else                        {bytes=bytes+' B';}
	return bytes;
}

// https://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
function uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

// https://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference/4079798#4079798 
// needs server-side yadda yadda いやだ
function language() {
	var code = window.navigator.userLanguage || window.navigator.language;
	return code.replace(/^[^a-z]*([a-z])[^a-z]*([a-z]).*/i, "$1$2");
}

// https://davidwalsh.name/window-iframe
function on_frame_event(f) {
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	eventer(messageEvent, f);
}

// https://stackoverflow.com/questions/14388452/how-do-i-load-a-json-object-from-a-file-with-ajax
function getJSON(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 0) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback)
					callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

// some stackoverflow answer… *hides*
function loadScript(url, callback)
{
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onreadystatechange = callback;
	script.onload = callback;
	head.appendChild(script);
}
