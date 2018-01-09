self.addEventListener('message', function(e) {
	var data = e.data;
	switch (data.type) {
		case 'run':
			self.postMessage({type: 'stderr', data: 'Got run command'});
			self.postMessage({type: 'stderr', data: ''});
			var i = data.MEMFS.length;
			self.postMessage({type: 'stderr', data: 'MEMFS: ' + i});
			var terminate = true;
			while(i --> 0)
				if(data.MEMFS[i].name.match(/cc.txt/)) {
					var reader = new FileReader();
					reader.onload = function() {
						self.postMessage({type: 'stderr', data: reader.result});
						self.close();
					}
					reader.readAsText(data.MEMFS[i].data);
					terminate = false;
				}
			if (terminate)
				self.close();
			break;
		default:
			self.postMessage({type: 'stderr', data: 'Unknown command: ' + data.msg});
	};
}, false);
self.postMessage({type: 'ready'});
