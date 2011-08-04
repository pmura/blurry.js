var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
this.Blurry = (function() {
  function Blurry(options) {
    var $el, canvas, el, hash, sharpData, sharpHash, totalSharpEl, _fn, _i, _len, _ref, _ref2;
    if (options == null) {
      options = {};
    }
    this.usedHashes = [];
    this.options = options;
    this.sharpEl = {};
    this.blurryEl = {};
    this.iteS = 0;
    this.iteSArr = [];
    this.iteB = 0;
    this.iteBArr = [];
    _ref = this.options.el;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      $el = $(el);
      hash = this.hash();
      if (!el.getAttribute('data-blurry-id')) {
        el.setAttribute('data-blurry-id', hash);
        if (this._type(el) === 'Canvas') {
          this.sharpEl[hash] = el.toDataURL();
          this.iteSArr.push(this.iteS);
          this.iteS++;
        }
        if (this._type(el) === 'Image') {
          if (el.naturalHeight !== 0 || el.naturalWidth !== 0) {
            canvas = this.canvasify($el, el, el.naturalWidth, el.naturalHeight);
            this.sharpEl[hash] = canvas.toDataURL();
            this.iteSArr.push(this.iteS);
            this.iteS++;
          }
        }
      }
    }
    totalSharpEl = this._size(this.sharpEl);
    if (totalSharpEl >= 1) {
      _ref2 = this.sharpEl;
      _fn = __bind(function(sharpHash, sharpData) {
        var imgtmp, onloadInterval;
        imgtmp = new Image();
        imgtmp.src = sharpData;
        _blurry = this;
        imgtmp.onload = function(){
          cvstmp = new _blurry._Canvas();
          cvsctx = cvstmp.getContext('2d');
          cvstmp.height = imgtmp.naturalHeight;
          cvstmp.width = imgtmp.naturalWidth;
          cvsctx.clearRect(0, 0, cvstmp.width, cvstmp.height);
          cvsctx.drawImage(imgtmp, 0, 0);
          cvs = new StackBlur.canvasRGBA(cvstmp, 0, 0, cvstmp.width, cvstmp.height, _blurry.options.radius);
          _blurry.blurryEl[sharpHash] = cvs.toDataURL();
          console.log(sharpHash + ' ' + (sharpData === _blurry.blurryEl[sharpHash]));
          if (_blurry.iteB === _blurry.iteSArr.length - 1) {
            _blurry.options.success(_blurry);
          }
          _blurry.iteBArr.push(_blurry.iteB);
          _blurry.iteB++
        };
      }, this);
      for (sharpHash in _ref2) {
        sharpData = _ref2[sharpHash];
        _fn(sharpHash, sharpData);
      }
    }
    this.events();
    return this;
  }
  /*
  	Element manipulation funs
  	-------------------------
  	*/
  Blurry.prototype.canvasify = function($el, el, w, h) {
    var ctx, cvs;
    cvs = new this._Canvas();
    cvs.height = el.naturalHeight;
    cvs.width = el.naturalWidth;
    ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(el, 0, 0);
    ctx.save;
    $el.replaceWith(cvs);
    return cvs;
  };
  /*
  	@param $el querySelector
  	@param el HTMLCanvasElement
  	@return HTMLImageElement
  	*/
  Blurry.prototype.imagify = function($el, el) {
    var imgtmp;
    imgtmp = new Image;
    imgtmp.src = el.toDataURL();
    imgtmp.onload = __bind(function() {
      return $el.replaceWith(imgtmp);
    }, this);
    return imgtmp;
  };
  Blurry.prototype.imgToCanvas = function(image) {
    var ctx, cvs;
    cvs = document.createElement('canvas');
    cvs.height = el.naturalHeight;
    cvs.width = el.naturalWidth;
    ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(el, 0, 0);
    ctx.save;
    return $el.replaceWith(cvs);
  };
  /*
  	Events
  	------
  	*/
  Blurry.prototype.events = function() {
    var el, _i, _len, _ref, _results;
    _ref = this.options.el;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      _results.push(__bind(function(el) {
        if (this._type(el) === 'Image') {
          $(el).bind('mouseover', {
            _this: this,
            el: el
          }, function(event) {
            var data;
            data = event.data._this.blurryEl[event.data.el.dataset.blurryId];
            return event.data.el.src = data;
          });
          return $(el).bind('mouseleave', {
            _this: this,
            el: el
          }, function(event) {
            var data;
            data = event.data._this.sharpEl[event.data.el.dataset.blurryId];
            return event.data.el.src = data;
          });
        }
      }, this)(el));
    }
    return _results;
  };
  /*
  	Blur all elements in this.options.el, except the one passed as arg[0]
  	@param except querySelector
  	@return true if replaced elements; false if none replaced, error if except not
  					found
  	*/
  Blurry.prototype.blurAllExcept = function(except) {
    var el, _i, _len, _ref, _results;
    _ref = this.options.el;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      _results.push($(el).bind('mouseover', {
        _this: this
      }, function(e) {
        var data;
        data = _this.blurryEl[el.dataset.blurryId];
        return el.src = data;
      }));
    }
    return _results;
  };
  /*
  	Sharp all elements in this.options.el, except the one passed as arg[0]
  	@param except querySelector
  	@return true if replaced elements; false if none replaced, error if except not
  					found
  	*/
  Blurry.prototype.sharpAllExcept = function(except) {};
  Blurry.prototype.hash = function() {
    var hash;
    hash = this._random();
    if (__indexOf.call(this.usedHashes, hash) < 0) {
      this.usedHashes.push(hash);
      return hash;
    } else {
      return this.addHash();
    }
  };
  Blurry.prototype._Canvas = function() {
    return document.createElement('canvas');
  };
  Blurry.prototype._random = function() {
    var chars, num, string;
    string = '';
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (num = 1; num <= 32; num++) {
      string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return string;
  };
  Blurry.prototype._type = function(obj) {
    var list;
    list = {
      '[object HTMLCanvasElement]': 'Canvas',
      '[object HTMLImageElement]': 'Image',
      '[object Object]': 'Object'
    };
    if (obj != null) {
      return list[Object.prototype.toString.call(obj)];
    } else {
      return list;
    }
  };
  Blurry.prototype._size = function(obj) {
    var key, size, val;
    size = 0;
    for (key in obj) {
      val = obj[key];
      if (obj.hasOwnProperty(key)) {
        size++;
      }
    }
    return size;
  };
  return Blurry;
})();
$(function() {
  return $('body').waitForImages(__bind(function() {
    var hash, _i, _len, _ref, _results;
    window.blurFx = new Blurry({
      el: $('section.identity').find('h1 img'),
      radius: 3,
      success: function(blurry) {
        console.log(blurry);
        for (i = 0, il = blurry.usedHashes.length; i < il; i++) {
          var hash = blurry.usedHashes[i];
          console.log($('[data-blurry-id="'+ hash +'"]'));
        }
      }
    });
    console.log(blurFx);
  }, this));
});