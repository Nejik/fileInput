 /*!
 * njf - v0.1
 * nejikrofl@gmail.com
 * Copyright (c) 2015 N.J.
*/
;(function(window, document, undefined){
'use strict';
var $ = window.jQuery || window.j;

if(!$) {
	throw new Error('njFileInput requires jQuery or "j" library (https://github.com/Nejik/j)');
	return false;
}

//insert styles
var style = document.createElement('style');
style.innerHTML = '\
	.njf-inited[data-njf-wrap] {\
	    position: relative;\
	    overflow: hidden;\
	}\
	.njf-inited [data-njf-input] {\
    position: absolute;\
    top: 0;\
    right: 0;\
    min-width: 100%;\
    min-height: 100%;\
    font-size: 100px;\
    text-align: right;\
    filter: alpha(opacity=0);\
    opacity: 0;\
    outline: none;\
    background: white;\
    cursor: inherit;\
    display: block;\
}'
//prepend styles;
var head = document.getElementsByTagName('head')[0];
head.insertBefore(style, head.firstChild);



window.njf = function (opts) {
	opts = opts || {};
	var o = this.o = $.extend(true, {}, njf.defaults, opts),
		that = this;

	if(!o.elem) return;//we can't do anything without input file
	if(o.elem.njf) return;//we can't initialize 2 times

	this._o = {};//internal options
	this.v = {};//object with cached variables

	o.$elem = $(o.elem);
	o.elem = $(o.elem)[0];

	this._gatherData();


	this.v.wrap = o.$elem.closest('[data-njf-wrap]');
	if(!this.v.wrap.length) return;

	this.v.wrap.addClass(o.class);

	if(this.v.wrap.css('display') === 'inline') {
		this._o.display = 'changed';
		this.v.wrap.css('display', 'inline-block')
	}


	this.v.label = this.v.wrap.find('[data-njf-label]');


	var that = this;
	o.$elem.on('change', function() {
		var length = this.files ? this.files.length : 1,
			label = this.value.replace(/\\/g, '/').replace(/.*\//, '');

		if(o.multilabel && length > 1) {
			label = o.multilabel.replace('%length%', length)
		}

		if(that.v.label[0].tagName.toLowerCase() == 'input') {
			that.v.label[0].value = label;
		} else {
			that.v.label.text(label);
		}
		

		that._cb_change();
	});
	


	if(o.elem) o.elem.njf = this;

	this._cb_init();
	return this;
}

//common methods
njf.forElement = function (elem) {//return instance
	return $(elem)[0].njf;
}


//individual class methods
var proto = njf.prototype;


proto._gatherData = function (first) {//first - only first, initial data gather
	var o = this.o,
		el = o.$elem,
		dataO = el.data(),//data original
		dataMeta = {};//data processed

	//get data from data attributes
	for (var p in dataO) {//use only data properties with njp prefix
		if (dataO.hasOwnProperty(p) && /^njp[A-Z]+/.test(p) ) {
			var shortName = p.match(/^njp(.*)/)[1],
				shortNameLowerCase = shortName.charAt(0).toLowerCase() + shortName.slice(1);

			dataMeta[shortNameLowerCase] = checkval(dataO[p]);
		}
	}

	function checkval(val) {//make boolean from string
		if(val === 'true') {
			return true;
		} else if(val === 'false') {
			return false;
		} else {
			return val;
		}
	}

	//properties we can't redefine
	delete dataMeta.elem;
	

	$.extend(true, o, dataMeta);
}




proto._cb_init = function () {
	var o = this.o;

	$(document).triggerHandler('njf_init', [this.o.elem, this]);
	if(o.$elem.length) o.$elem.triggerHandler('njf_init', [this.o.elem, this]);	
	if(o.init) o.init.call(this, this.o.elem);
};
proto._cb_change = function () {
	var o = this.o;

	$(document).triggerHandler('njf_change', [this.o.elem, this]);
	if(o.$elem.length) o.$elem.triggerHandler('njf_change', [this.o.elem, this]);	
	if(o.change) o.change.call(this, this.o.elem);
};

//data-njf-wrap
//data-njf-input
//data-njf-label
njf.defaults = {
	elem: '',//input element
	multilabel: '%length% files selected.',//(string || false) message that will be used as label, when multiple files are loaded. %length% will be changed for real length
	class: 'njf-inited',

	init: function(){},//(function) callback when init is complete
	change: function(){}//(function) callback when user adds file
}
})(window, document);

//autobind
$(document).on('DOMContentLoaded', function () {
	$('[data-njf-input]').each(function () {
		new njf({elem:this});
	})
})