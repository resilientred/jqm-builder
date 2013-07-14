/******
 *
 *
 * A set of function I use a lot.
 * 
 * Frame5 Lib.
 */
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if ( typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
		}, fBound = function() {
			return fToBind.apply(this instanceof fNOP ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}
try {
	var FRAME5 = (function(root) {

		var Browser = {};

		var _Browser = (function() {

			var ua = navigator.userAgent.toLowerCase();
			var platform = navigator.platform.toLowerCase();
			var UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0], mode = UA[1] == 'ie' && document.documentMode;

			this.name = (UA[1] == 'version') ? UA[3] : UA[1];
			this.version = mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]);
			this.Platform = {
				name : ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
			};
			this.Features = {
				xpath : !!(document.evaluate),
				air : !!(window.runtime),
				query : !!(document.querySelector),
				json : !!(window.JSON),
				webSocket : !!(window.WebSocket),
				Worker : !!(window.Worker),
				localStorage : !!(window.localStorage),
				openDatabase : !!(window.openDatabase)
			};
			this.Plugins = {};

			this[this.name] = true;
			this[this.name + parseInt(this.version, 10)] = true;
			this.Platform[this.Platform.name] = true;
			var version = (function() {
				try {
					return navigator.plugins['Shockwave Flash'].description;
				} catch (e) {
					try {
						return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
					} catch (es) {
						return false;
					}
				}
			})()
			this.Plugins.Flash = {
				version : Number(version[0] || '0.' + version[1]) || 0,
				build : Number(version[2]) || 0
			};
			this.Features.xhr = !!(function() {

				try {
					return new XMLHttpRequest();
				} catch (e) {
					try {
						return new ActiveXObject('MSXML2.XMLHTTP');
					} catch (e) {
						try {
							return new ActiveXObject('Microsoft.XMLHTTP');
						} catch (e) {
							return false;
						}
					}
				}

			})();
		}).call(Browser)

		/**==============================**
		 * onReady
		 */
		var onReady = (function(doc, win) {
			var isReady = 0, isBind = 0, fns = [], testEl = doc.createElement('p'), bindReady, init;
			bindReady = function() {
				if (isBind)
					return;
				isBind = 1;

				// Catch cases where domReady is called after the browser event has already occurred.
				// readyState: "uninitalized"、"loading"、"interactive"、"complete" 、"loaded"
				if (doc.readyState === "complete") {
					init();
				} else if (doc.addEventListener) {
					doc.addEventListener("DOMContentLoaded", function() {
						doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
						init();
					}, false);
					win.addEventListener("onload", init, false);
				} else if (doc.attachEvent) {
					// In IE, ensure firing before onload, maybe late but safe also for iframes.
					doc.attachEvent("onreadystatechange", function() {
						if (doc.readyState === "complete") {
							doc.detachEvent("onreadystatechange", arguments.callee);
							init();
						}
					});
					win.attachEvent("onload", init);

					// If IE and not a frame, continually check to see if the document is ready.
					if (testEl.doScroll && win == win.top) {
						doScrollCheck();
					}
				}
			};
			// Process items when the DOM is ready.
			init = function() {
				isReady = 1;

				// Make sure body exists, at least, in case IE gets a little overzealous.
				// This is taked directly from jQuery's implementation.
				if (!doc.body) {
					setTimeout(init, 10);
					return;
				}

				for (var i = 0, l = fns.length; i < l; i++) {
					fns[i]();
				}
				fns = [];
			};
			function doScrollCheck() {
				if (isReady)
					return;

				try {
					// If IE is used, use the trick by Diego Perini
					// http://javascript.nwbox.com/IEContentLoaded/
					testEl.doScroll('left');
				} catch (e) {
					setTimeout(doScrollCheck, 10);
					return;
				}

				init();
			}

			return win.domReady = function(fn) {
				bindReady(fn);

				if (isReady) {
					fn();
				} else {
					fns.push(fn);
				}
			};
		})(document, window);
		/**========================================================**
		 * Emitter
		 */
		var Emitter = function() {
			this.listiners = {};
			this.maxListeners = 15;
		};
		Emitter.prototype.emit = function() {

			if (arguments.length >= 1) {

				var args = Array.prototype.slice.call(arguments);
				var name = args.shift();

				if (this.listiners.hasOwnProperty(name)) {

					for (var i = this.listiners[name].length - 1; i >= 0; i--) {
						(function(func, p) {
							setTimeout(function() {

								func.apply(this, p);

							}, 0);
						})(this.listiners[name][i], args);
					}
				}
			}
			return this;

		};
		Emitter.prototype.setMaxListeners = function(n) {
			if (n >= 1 && n <= 100) {
				this.maxListeners = n;
			}
			return this;
		};
		Emitter.prototype.on = function(name, func) {
			if ( typeof (name) === 'string' && typeof (func) === 'function') {
				if (!this.listiners.hasOwnProperty(name)) {
					this.listiners[name] = [];
				} else if (this.listiners[name].length >= this.maxListeners) {
					throw 'To mant listiners been attached.';
					return this;
				}

				this.listiners[name].push(func);
			}
			return this;
		};
		Emitter.prototype.listListeners = function(name) {
			if ( typeof (name) === 'string') {

				if (!this.listiners.hasOwnProperty(name)) {
					return [];
				} else {
					return this.listiners[name];
				}
			}
		};
		Emitter.prototype.removeListener = function(name, func) {
			if (this.listiners.hasOwnProperty(name)) {
				var listiners = this.listiners[name];
				for (var i = listiners.length - 1; i >= 0; i--) {
					if (listiners[i] === func) {
						listiners.splice(i, 1);
					}
				}
				if (listiners.length === 0) {
					delete this.listiners[name];
				}

			}
			return this;
		};
		/**========================================================**
		 * utils
		 */
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		var utils = {
			uuid : function() {
				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
			},
			inherits : function(ctor, superCtor) {
				ctor.super_ = superCtor;
				ctor.prototype = Object.create(superCtor.prototype, {
					constructor : {
						value : ctor,
						enumerable : false,
						writable : true,
						configurable : true
					}
				});
			},
			log : function(data) {
				$('#log').prepend(timestamp() + ": " + data + "<br />");
			}
		}
		/**========================================================**
		 * xhr
		 */

		var Xhr = function() {

		}
		var xhr = Xhr.prototype.xhr = function(options) {

			var request = new Emitter();

			if (!options.url) {

				setTimeout(function() {
					request.emit('error', new Error('options.url is needed.'))
				}, 1)
				return request;
			}

			var req = new XMLHttpRequest();
			request.xhr = req
			var method = options.method || 'get';
			var url = options.url;
			var async = ( typeof options.async != 'undefined' ? options.async : true);

			var params = (options.data && method.toLowerCase() === 'post') ? (function() {

				try {
					return JSON.stringify(options.data)
				} catch(err) {
					return JSON.stringify({})
				}
			})() : null;
			//console.log(params)
			var headers = options.headers || {};
			req.queryString = params;
			req.open(method, url, async);
			// Set "X-Requested-With" header
			req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

			if (method.toLowerCase() == 'post')
				req.setRequestHeader('Content-Type', 'application/json');

			for (key in headers) {
				if (headers.hasOwnProperty(key)) {
					req.setRequestHeader(key, headers[key]);
				}
			}
			req.onabort = req.onerror = function() {
				console.log('onerror')
				request.emit('error')
			}
			function hdl() {
				if (req.readyState == 4) {

					if ((/^[20]/).test(req.status)) {
						request.responseText = req.responseText;
						request.status = req.status;

						request.emit('end', JSON.parse(req.responseText), req)
					}
					if ((/^[45]/).test(req.status))
						request.emit('error', req.responseText, req)
					if (req.status === 0)
						request.emit('abort', options, req)
				}
			}

			if (async) {
				req.onreadystatechange = hdl;
			}
			req.send(params);

			if (!async)
				hdl();
			return request;
		}
		/**========================================================**
		 * utils
		 */
		var SqlLite = function(shortName, version, displayName, maxSize) {

			Emitter.call(this);
			this.createTime = new Date().getTime();
			this.lastModified = 0;

			this.ready = false;

			this.shortName = shortName;

			this.version = version;

			this.displayName = displayName;

			this.maxSize = maxSize;

			var onHandlerNull = function(transaction, results) {
				console.log(results);
			};
			var onHandlerQueryError = function(transaction, error) {
				console.log(error);
				this.emit('error', error);
			};
			var onHandlerDbError = function(t, error) {
				if (error.code == 1) {
					console.log('<p>The statement failed for database reasons not covered by any other error code.Message :' + error.message + '</p>');
				}
				if (error.code == 2) {
					console.log('<p>The operation failed because the actual database version was not what it should be.Message :' + error.message + '</p>');
				}
				if (error.code == 3) {
					console.log('<p>The statement failed because the data returned from the database was too large.Message :' + error.message + '</p>');
				}
				if (error.code == 4) {
					console.log('<p>The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.Message :' + error.message + '</p>');
				}
				if (error.code == 5) {
					console.log('<p>The statement failed because of a syntax error.Message :' + error.message + '</p>');
				}
				if (error.code == 6) {
					console.log('<p>An INSERT, UPDATE, or REPLACE statement failed due to a constraint failure.Message :' + error.message + '</p>');
				}
				if (error.code == 7) {
					console.log('<p>A lock for the transaction could not be obtained in a reasonable time. Message :' + error.message + '</p>');
				} else {
					console.log(error);
				}
				this.emit('error', error);
			};

			this.on('onHandlerNull', onHandlerNull.bind(this))
			this.on('onHandlerQueryError', onHandlerQueryError.bind(this))
			this.on('onHandlerDbError', onHandlerDbError.bind(this))

		};

		utils.inherits(SqlLite, Emitter);

		SqlLite.prototype.open = function() {
			try {
				if (!window['openDatabase']) {

					return false;

				} else {

					this.openDatabase = openDatabase(this.shortName, this.version, this.displayName, this.maxSize);
					//this is the DB been setup
					this.lastModified = new Date().getTime();
					this.emit('open')
					return true;
				}
			} catch (error) {//This is a catch for any errors on the DB setup
				// / this.emit('onHandlerDbError', error)
				return false;

			}
		}
		SqlLite.prototype.query = function(query) {
			var request = new Emitter();

			this.openDatabase.transaction(function(transaction) {

				transaction.executeSql(query, [], function(t, results) {
					var len = results.rows.length;
					for (var i = 0; i < len; i++) {
						request.emit('row', results.rows.item(i))
					}
					request.emit('result', results)
				}, function(t, err) {
					request.emit('error', err)
				});
			});
			return request;
		}
		/************
		 *
		 *
		 */
		var Hang = function() {
			Emitter.call(this);
			this.chanList = {};
			this.qs = []
			this.chans = {};
			this.isPolling = false;
			this.chans['keepAlive'] = new Emitter()
			this.chans['keepAlive'].on('data', function(data) {
				console.log(data)
			})
		};
		utils.inherits(Hang, Emitter);
		Hang.prototype.chan = function(name, qs) {

			var chan = new Emitter();
			chan.send = function(type, data) {

			}
			this.startPool(chan, name)

			return chan;
		}
		Hang.prototype.hangPool = function(url, callBack) {
			var self = this;
			this.isPolling = true;
			this.xhr = xhr({
				url : url
			}).on('end', function(data) {
				self.isPolling = false;
				callBack(null, data)
			}).on('error', function() {
				self.isPolling = false;
				var err = new Error('Bad request to server.')
				callBack(err)
			}).on('abort', function(options) {
				self.hangPool('/channel/recv/' + Date.now() + '?' + queryString(self.qs.length > 0 ? self.qs : ['keepAlive']), callBack)

			})
		}
		var queryString = function(qs) {
			var str = [];
			for (var i = qs.length - 1; i >= 0; i--) {
				str.push('channels=' + qs[i])
			};
			return str.join('&')
		}
		Hang.prototype.startPool = function() {
			var self = this;
			var pool = function(err, data) {
				if (err) {
					self.emit('error', err)
				} else {
					if (data.ok) {
						delete data.ok
					} else {
						self.hangPool('/channel/recv/' + Date.now() + '?' + queryString(self.qs.length > 0 ? self.qs : ['keepAlive']), pool)
					}

					var chanKeys = Object.keys(data)
					var chan;
					for (var i = 0; i < chanKeys.length; i++) {
						var key = chanKeys[i]
						if ( chan = self.chans[key]) {
							var messages = data[key].messages
							for (var i = 0; i < messages.length; i++) {
								chan.emit('data', messages[i])
							};
						}
					};

				}
				self.hangPool('/channel/recv/' + Date.now() + '?' + queryString(self.qs.length > 0 ? self.qs : ['keepAlive']), pool)
			}
			self.hangPool('/channel/recv/' + Date.now() + '?' + queryString(self.qs.length > 0 ? self.qs : ['keepAlive']), pool)
		}
		Hang.prototype.subscribe = function(name, callBack) {
			if (!this.chans[name]) {
				this.chans[name] = new Emitter()
				if (!~this.qs.indexOf(name)) {
					this.qs.push(name)
				}
			}

			var chan = this.chans[name];
			chan.on('data', callBack)
			if (this.isPolling) {
				this.xhr.xhr.abort()
			}
		}
		Hang.prototype.unSubscribe = function(name, callBack) {
			if (this.chans[name]) {
				this.chans[name].removeListener('data', callBack)

				if (!this.chans[name].listiners['data']) {
					delete this.chans[name]
					if (!!~this.qs.indexOf(name)) {
						this.qs.splice(this.qs.indexOf(name), 1)
					}
				} else if (this.chans[name].listiners['data'].length === 0) {
					if (!!~this.qs.indexOf(name)) {
						this.qs.splice(this.qs.indexOf(name), 1)
					}
				}
			}
		}
		/**==============================**
		 * Frame5
		 *
		 *
		 */
		var Frame5 = function() {
			Emitter.call(this);
			var self = this;
			var db = this.db = new SqlLite('RN', '1.0', 'Remote-Node', 65536);

			db.on('open', function() {
				console.log('DB is open')
				self.emit('ready')
			});
			db.on('error', function() {
				console.log('DB got an error')
			});
			this.ready(function() {
				self.emit('ready')
			})
		}
		utils.inherits(Frame5, Emitter);
		/**==============================**
		 * Frame5.ready
		 */
		Frame5.prototype.ready = onReady;
		/**==============================**
		 * Frame5.SqlLite
		 */
		Frame5.prototype.SqlLite = SqlLite;
		/**==============================**
		 * Frame5.Hang
		 */
		Frame5.prototype.Hang = Hang;
		/**==============================**
		 * Frame5.Hang
		 */
		Frame5.prototype.Emitter = Emitter;
		/**==============================**
		 * Frame5.Browser
		 */

		Frame5.prototype.Browser = Browser;
		/**==============================**
		 * Frame5.utils
		 */

		Frame5.prototype.utils = utils;

		/**==============================**
		 * Frame5.xhr
		 */
		Frame5.prototype.xhr = xhr;
		/**==============================**
		 * Frame5
		 */
		return new Frame5();
	})(this)
} catch(err) {
	alert(err.message)
}