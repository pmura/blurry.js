var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
this.Blurry = (function() {
  function Blurry(options) {
    var $el, canvas, el, hash, iteB, iteBArr, iteS, iteSArr, sharpData, sharpHash, totalSharpEl, _fn, _i, _len, _ref, _ref2;
    if (options == null) {
      options = {};
    }
    this.usedHashes = [];
    this.options = options;
    this.sharpEl = {};
    this.blurryEl = {};
    iteS = 0;
    iteSArr = [];
    iteB = 0;
    iteBArr = [];
    _ref = this.options.el;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      $el = $(el);
      hash = this.hash();
      if (!el.getAttribute('data-blurry-id')) {
        el.setAttribute('data-blurry-id', hash);
        if (this._type(el) === 'Canvas') {
          this.sharpEl[hash] = el.toDataURL();
          iteSArr.push(iteS);
          iteS++;
        }
        if (this._type(el) === 'Image') {
          if (el.naturalHeight !== 0 || el.naturalWidth !== 0) {
            canvas = this.canvasify($el, el, el.naturalWidth, el.naturalHeight);
            this.sharpEl[hash] = canvas.toDataURL();
            iteSArr.push(iteS);
            iteS++;
          }
        }
      }
    }
    console.log(iteSArr);
    totalSharpEl = this._size(this.sharpEl);
    if (totalSharpEl >= 1) {
      _ref2 = this.sharpEl;
      _fn = __bind(function(sharpHash, sharpData) {
        var imgtmp;
        imgtmp = new Image();
        imgtmp.src = sharpData;
        console.log(iteB);
        setTimeout(this.blurry(this, imgtmp, {
          sharpHash: sharpHash,
          sharpData: sharpData
        }), 2);
        iteBArr.push(iteB);
        return iteB++;
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
  Blurry.prototype.blurry = function(_this, imgtmp, sharpObj) {
    return imgtmp.onload = (__bind(function(_self, _this, options) {
      var cvsctx, cvstmp;
      cvstmp = new _this._Canvas();
      cvsctx = cvstmp.getContext('2d');
      cvstmp.height = _self.naturalHeight;
      cvstmp.width = _self.naturalWidth;
      cvsctx.clearRect(0, 0, cvstmp.width, cvstmp.height);
      cvsctx.drawImage(_self, 0, 0);
      cvsctx.save;
      cvstmp = new StackBlur.canvasRGBA(cvstmp, 0, 0, cvstmp.width, cvstmp.height, 3);
      _this.blurryEl[options.sharpHash] = cvstmp.toDataURL();
      return console.log(options.sharpData === _this.blurryEl[options.sharpHash]);
    }, this))(imgtmp, _this, {
      sharpHash: sharpObj.sharpHash,
      sharpData: sharpObj.sharpData
    });
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
    var k, v, _ref, _results;
    window.blurFx = new Blurry({
      el: $('canvas')
    });
    console.log(blurFx, blurFx.options.el.length);
    _ref = blurFx.blurryEl;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      _results.push(__bind(function() {
        return console.log(k + ':' + Object.prototype.toString.call(k), v + ':' + Object.prototype.toString.call(v));
      }, this)());
    }
    return _results;
  }, this));
});