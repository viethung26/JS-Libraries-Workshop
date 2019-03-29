function JqueryX(selector) {
	if(!(this instanceof JqueryX)) return new JqueryX(selector)
	this.push.apply(this, document.querySelectorAll(selector))
}
JqueryX.prototype = []
JqueryX.fn = JqueryX.prototype
const $ = (window.$ = JqueryX)
//
JqueryX.fn.html = function(html) {
	console.log(this)
	this.forEach(element => element.innerHTML = html)
	return this
}
JqueryX.fn.attr = function(name, value) {
	this.forEach(element => element.setAttribute(name, value))
	return this
}