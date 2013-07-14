var Tag = function(tag, options, events) {
	FRAME5.Emitter.call(this)
	this.tag = tag
	this.options = options || {}
	this.events = events || []
	this.id = uuid()
	this.options['id'] = this.id
	this.cache = null
	this.cacheEl = null
	this.cacheEvents = {}
}

FRAME5.utils.inherits(Tag, FRAME5.Emitter);
Tag.prototype._on = Tag.prototype.on
Tag.prototype.on = function(event, fn) {
	this.cacheEl.on(event, fn)
	this._on(event, fn)
}
Tag.prototype.render = function() {

	if (this.cache) {
		return this.cache
	}

	var tag = this.tag
	var options = this.options || {}

	var html = '<' + tag + ' '

	var keys = Object.keys(options)
	keys.forEach(function(key) {
		html += key + '="' + options[key] + '" '
	})
	html += '>'
	html += this.renderContent()
	html += '</' + tag + '>'
	this.cache = html
	return html
}
Tag.prototype.content = function(content) {
	this._content = content
	this.cache = null
	return this
}
Tag.prototype.attachEents = function() {
	console.log(this.events)
	var self = this
	this.events.forEach(function(event) {
		self.cacheEl.on(event, self.emit.bind(self.emit))
	})
	return this
}
Tag.prototype.cacheElFn = function() {
	if (!this.cacheEl) {
		this.cacheEl = $('#' + this.id)
		this.attachEents()
		if (this._content.length) {
			if ( typeof this._content == 'string') {
				return
			}
			this._content.forEach(function(content) {
				if ( typeof content == 'string') {
					return
				}
				content.cacheElFn()
			})
		}
	}
	return this
}
Tag.prototype.append = function(e) {
	$(e).append(this.render())
	this.cacheElFn()
	return this
}
Tag.prototype.prepend = function(content) {
	$(e).prepend(this.render())
	this.cacheElFn()
	return this
}
Tag.prototype.html = function(content) {
	$(e).html(this.render())
	this.cacheElFn()
	return this
}
Tag.prototype.renderContent = function() {

	var html = ''
	if (Array.isArray(this._content)) {
		for (var i = 0; i < this._content.length; i++) {
			if (this._content[i] instanceof Tag) {
				html += this._content[i].render()
			} else {
				html += this._content[i]
			}
		};
	} else {
		html += this._content
	}
	return html
}
Tag.prototype.update = function(content) {
	this.content(content)

	this.cacheElFn()
	this.cacheEl.html(this.renderContent())
}
Tag.prototype.changePage = function() {
	$.mobile.changePage('#' + this.id)
}