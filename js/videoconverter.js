importScripts('ffmpeg-all-codecs.js');

var now = Date.now;

function print(text) {
	postMessage({
		'type' : 'stdout',
		'data' : text
	});
}

onmessage = function(event) {

	var message = event.data;

	if (message.type === "run") {

		var Module = {
			print: print,
			printErr: print,
			files: message.files || message.MEMFS || [],
			arguments: message.arguments || [],
			TOTAL_MEMORY: message.TOTAL_MEMORY || false
			// Can play around with this option - must be a power of 2
			// TOTAL_MEMORY: 268435456
		};

		var doit = function() {

			postMessage({
				'type' : 'start',
				'data' : Module.arguments.join(" ")
			});

			postMessage({
				'type' : 'stdout',
				'data' : 'Received command: ' +
				Module.arguments.join(" ") +
				((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")
			});

			var time = now();
			var result = ffmpeg_run(Module);

			var totalTime = now() - time;
			postMessage({
				'type' : 'stdout',
				'data' : 'Finished processing (took ' + totalTime + 'ms)'
			});

			postMessage({
				'type' : 'done',
				'data' : result,
				'time' : totalTime
			});
		}

		// Prepare function chain for fixing up file system with blobs
		for(var i = 0; i < Module.files.length; i++) {
			if (Module.files[i].data.size) { // assume it's a blob
				doit = (function(or, doit) {
					var fileReader = new FileReader();
					fileReader.onload = function() {
						Module.files[or].data = new Uint8Array(this.result);
						doit();
					};
					try {
						fileReader.readAsArrayBuffer(Module.files[or].data);
					} catch(e) { doit(); }
				}).bind(undefined, i, doit);
			}
		}

		doit();
	}
};

postMessage({
	'type' : 'ready'
});
