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
    this.iteSharp = 0;
    this.iteSharpList = [];
    this.iteBlurry = 0;
    this.iteBlurryList = [];
    _ref = this.options.el;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      $el = $(el);
      hash = this.hash();
      if (!el.getAttribute('data-blurry-id')) {
        el.setAttribute('data-blurry-id', hash);
        if (this._type(el) === 'Canvas') {
          this.sharpEl[hash] = el.toDataURL();
          this.iteSharpList.push(this.iteSharp);
          this.iteSharp++;
        }
        if (this._type(el) === 'Image') {
          if (el.naturalHeight !== 0 || el.naturalWidth !== 0) {
            canvas = this.canvasify(this.options.replaceWithCanvas, this.iteSharp, $el, el, el.naturalWidth, el.naturalHeight);
            this.sharpEl[hash] = canvas.toDataURL();
            this.iteSharpList.push(this.iteSharp);
            this.iteSharp++;
          }
        }
      }
    }
    totalSharpEl = this._size(this.sharpEl);
    if (totalSharpEl >= 1) {
      _ref2 = this.sharpEl;
      _fn = __bind(function(sharpHash, sharpData) {
        var imgtmp;
        imgtmp = new Image();
        imgtmp.src = sharpData;
        return imgtmp.onload = __bind(function() {
          var cvs, cvsctx, cvstmp;
          cvstmp = new this._Canvas();
          cvsctx = cvstmp.getContext('2d');
          cvstmp.height = imgtmp.naturalHeight;
          cvstmp.width = imgtmp.naturalWidth;
          cvsctx.clearRect(0, 0, cvstmp.width, cvstmp.height);
          cvsctx.drawImage(imgtmp, 0, 0);
          cvs = new StackBlur.canvasRGBA(cvstmp, 0, 0, cvstmp.width, cvstmp.height, this.options.radius);
          this.blurryEl[sharpHash] = cvs.toDataURL();
          console.log(sharpHash + ' ' + (sharpData === this.blurryEl[sharpHash]));
          if (this.iteBlurry === this.iteSharpList.length - 1) {
            this.iteBlurryList.push(this.iteBlurry);
            this.iteBlurry++;
            return this.options.onComplete(this);
          }
          this.iteBlurryList.push(this.iteBlurry);
          return this.iteBlurry++;
        }, this);
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
  /*
  	@param replaceWithCanvas querySelector
  	@param indexInOptions querySelector
  	@param $el querySelector
  	@param el querySelector
  	@param w int
  	@param h int
  	@return HTMLImageElement
  	*/
  Blurry.prototype.canvasify = function(replaceWithCanvas, indexInOptions, $el, el, w, h) {
    var attr, attrToSkip, ctx, cvs, _i, _len, _ref, _ref2;
    cvs = new this._Canvas();
    cvs.height = el.naturalHeight;
    cvs.width = el.naturalWidth;
    ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(el, 0, 0);
    ctx.save;
    if (replaceWithCanvas) {
      _ref = el.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        attrToSkip = ['alt', 'src'];
        if (_ref2 = attr.name, __indexOf.call(attrToSkip, _ref2) >= 0) {} else {
          cvs.setAttribute(attr.name, attr.value);
        }
      }
      $el.replaceWith(cvs);
      this.options.el[indexInOptions] = cvs;
    }
    return cvs;
  };
  /*
  	@param replaceWithImage boolean
  	@param el HTMLCanvasElement
  	@param $el querySelector
  	@return HTMLImageElement
  	*/
  Blurry.prototype.imagify = function(replaceWithImage, el, $el) {
    var imgtmp;
    imgtmp = new Image;
    imgtmp.src = el.toDataURL();
    imgtmp.onload = __bind(function() {
      if (replaceWithImage) {
        $el.replaceWith(imgtmp);
      }
      return imgtmp;
    }, this);
    ({
      /*
        */
      dataToCanvas: function(data) {}
    });
    imgtmp = new Image;
    imgtmp.src = data;
    return imgtmp.onload = __bind(function() {
      var canvas;
      canvas = new this._Canvas();
      canvas.height = imgtmp.naturalHeight;
      canvas.width = imgtmp.naturalWidth;
      cvsctx.clearRect(0, 0, canvas.width, canvas.height);
      cvsctx.drawImage(imgtmp, 0, 0);
      return canvas;
    }, this);
  };
  /*
  	*/
  Blurry.prototype.canvasDataReplacement = function(canvas, data) {
    var imgtmp;
    imgtmp = new Image;
    imgtmp.src = data;
    return imgtmp.onload = __bind(function() {
      var cvsctx;
      canvas.height = imgtmp.naturalHeight;
      canvas.width = imgtmp.naturalWidth;
      cvsctx = canvas.getContext('2d');
      cvsctx.clearRect(0, 0, canvas.width, canvas.height);
      cvsctx.drawImage(imgtmp, 0, 0);
      return canvas;
    }, this);
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
    return cvs;
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
        } else if (this._type(el) === 'Canvas') {
          console.log('not ready for canvas');
          $(el.parentNode).bind('mouseover', {
            _this: this,
            el: el,
            parent: el.parentNode
          }, function(e) {
            var $parent, a, el, _j, _len2, _results2;
            $parent = $(e.data.parent).find(e.data.el.tagName.toLowerCase());
            _results2 = [];
            for (_j = 0, _len2 = $parent.length; _j < _len2; _j++) {
              el = $parent[_j];
              a = e.data._this.canvasDataReplacement(el, e.data._this.blurryEl[el.dataset.blurryId]);
              _results2.push(a());
            }
            return _results2;
          });
          return $(el.parentNode).bind('mouseout', {
            _this: this,
            el: el,
            parent: el.parentNode
          }, function(e) {
            var $parent, a, el, _j, _len2, _results2;
            $parent = $(e.data.parent).find(e.data.el.tagName.toLowerCase());
            _results2 = [];
            for (_j = 0, _len2 = $parent.length; _j < _len2; _j++) {
              el = $parent[_j];
              a = e.data._this.canvasDataReplacement(el, e.data._this.sharpEl[el.dataset.blurryId]);
              _results2.push(a());
            }
            return _results2;
          });
        } else {
          ;
        }
      }, this)(el));
    }
    return _results;
  };
  Blurry.prototype._mouseover = function(e) {
    if (!e) {
      e = window.event;
    }
    console.log(e);
    return console.log(e.currentTarget.parentNode);
  };
  Blurry.prototype._mouseactive = function(e) {
    var areaX, areaY, mx, my;
    if (!e) {
      e = window.event;
    }
    console.log(e);
    mx = e.pageX;
    my = e.pageY;
    areaX = [e.currentTarget.offsetLeft, e.currentTarget.offsetLeft + e.currentTarget.offsetWidth];
    areaY = [e.currentTarget.offsetTop, e.currentTarget.offsetTop + e.currentTarget.offsetHeight];
    if ((areaX[1] >= mx && mx >= areaX[0]) && (areaY[1] >= my && my >= areaY[0])) {
      console.log('over');
    }
    console.log(areaX);
    return console.log(mx);
  };
  Blurry.prototype._mouseout = function(_this) {
    return _this.mousePos = null;
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
    var blurFx, hash, _i, _len, _ref, _results;
    blurFx = new Blurry({
      replaceWithCanvas: true,
      parent: $('section.identity'),
      el: $('section.identity').find('h1 img'),
      radius: 3,
      onComplete: function(_this) {
        return console.log('complete');
      }
    });
    console.log(blurFx);
    _ref = blurFx.blurryEl;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hash = _ref[_i];
      _results.push((function(hash) {
        console.log('__' + hash);
        return console.log($('*[blurry-id="' + hash + '"]'));
      })(hash));
    }
    return _results;
  }, this));
});