"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ThumbnailExtractor =
/*#__PURE__*/
function (_Component) {
  _inherits(ThumbnailExtractor, _Component);

  function ThumbnailExtractor(props) {
    var _this;

    _classCallCheck(this, ThumbnailExtractor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ThumbnailExtractor).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "getTime", function () {
      var thisTime = new Date().getTime();
      var diff = thisTime - _this.lastTime;
      var fromStart = thisTime - _this.startTime;
      _this.lastTime = thisTime;
      return {
        diff: diff,
        fromStart: fromStart
      };
    });

    _defineProperty(_assertThisInitialized(_this), "cleanUp", function () {
      _this.video = null;
      delete _this.video;
      _this.videoHtml = null;
      delete _this.videoHtml;
    });

    _defineProperty(_assertThisInitialized(_this), "grabComplete", function (image) {
      var _this$props = _this.props,
          onCapture = _this$props.onCapture,
          onComplete = _this$props.onComplete,
          onCompleteDetails = _this$props.onCompleteDetails;
      var counter = _this.currentShot;
      _this.completed++; //Stats are nice

      var statTime = _this.getTime(); //Save it to the array


      _this.captures.push(image);

      _this.capturesDetailed[counter].url = image;
      _this.capturesDetailed[counter].captureTime = statTime.diff; //Fire the event incase anyone is listening

      onCapture && onCapture(_this.captures); //All done so remove the elements

      if (_this.completed >= _this.count) {
        _this.cleanUp();

        onComplete && onComplete(_this.captures);

        var stats = _this.getTime();

        onCompleteDetails && onCompleteDetails({
          thumbs: _this.capturesDetailed,
          totalTime: stats.fromStart,
          details: {
            thumbnailCount: _this.count,
            videoDuration: _this.videoDuration,
            videoInterval: _this.videoInterval,
            thumbWidth: _this.thumbWidth,
            thumbHeight: _this.thumbHeight,
            videoStart: _this.videoStart
          }
        });
      } else {
        //Prepare the next shot
        _this.prepareScreenshot();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "save", function (canvas) {
      //Get the shot
      var theCapture = canvas.toDataURL('image/jpeg', 0.7); //done

      _this.grabComplete(theCapture);
    });

    _defineProperty(_assertThisInitialized(_this), "captureScreenShot", function () {
      var canvas = document.createElement('canvas');
      canvas.width = _this.thumbWidth;
      canvas.height = _this.thumbHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(_this.video, 0, 0, _this.thumbWidth, _this.thumbHeight); //and save

      _this.save(canvas);
    });

    _defineProperty(_assertThisInitialized(_this), "prepareScreenshot", function () {
      _this.currentShot++;
      var newTime = Math.floor(_this.videoStart + _this.currentShot * _this.videoInterval - _this.videoInterval);

      var statTime = _this.getTime();

      _this.capturesDetailed[_this.currentShot] = {
        capture: _this.currentShot,
        width: _this.thumbWidth,
        height: _this.thumbHeight,
        timeindex: newTime,
        startTime: statTime.fromStart,
        captureTime: null
      };
      _this.video.currentTime = newTime;
    });

    _defineProperty(_assertThisInitialized(_this), "initScreenshot", function () {
      _this.thumbWidth = _this.video.videoWidth;
      _this.thumbHeight = _this.video.videoHeight; //Wide video

      if (_this.thumbWidth > _this.thumbHeight) {
        var ratio = _this.maxWidth / _this.thumbWidth;
        _this.thumbWidth = _this.maxWidth;
        _this.thumbHeight = parseInt(_this.thumbHeight * ratio); //square video
      } else if (_this.thumbWidth === _this.thumbHeight) {
        _this.thumbWidth = _this.maxWidth;
        _this.thumbHeight = _this.maxHeight; //tall video
      } else {
        var _ratio = _this.maxHeight / _this.thumbHeight;

        _this.thumbHeight = _this.maxHeight;
        _this.thumbWidth = parseInt(_this.thumbWidth * _ratio);
      }

      _this.videoHtml.style.width = _this.thumbWidth;
      _this.videoHtml.style.height = _this.thumbHeight;
      _this.videoDuration = _this.video.duration;
      _this.videoInterval = _this.videoDuration / (_this.count + 1); //this will ensure credits are ignored

      _this.videoStart = _this.videoInterval / 2; //Prepare the next shot

      _this.prepareScreenshot();
    });

    _defineProperty(_assertThisInitialized(_this), "parseVideo", function () {
      var _this$props2 = _this.props,
          videoFile = _this$props2.videoFile,
          onBeforeCapture = _this$props2.onBeforeCapture,
          onStartCapture = _this$props2.onStartCapture,
          onUnsupportedVideo = _this$props2.onUnsupportedVideo;
      onBeforeCapture && onBeforeCapture();
      _this.lastTime = _this.startTime = new Date().getTime();
      var data = new FormData();
      data.append('file', videoFile, videoFile.name);
      var url = window.URL || window.webkitURL;
      var fileURL = url.createObjectURL(videoFile);
      var videoHtml = document.createElement('video');
      videoHtml.setAttribute('id', 'videoHtmlCapture');
      videoHtml.setAttribute('controls', true);
      videoHtml.setAttribute('preload', 'metadata');
      videoHtml.setAttribute('crossorigin', '*');
      videoHtml.setAttribute('width', '600');
      videoHtml.setAttribute('src', fileURL);
      var theVideo = document.createElement('source');
      theVideo.setAttribute('src', fileURL);
      theVideo.setAttribute('type', videoFile.type);
      videoHtml.innerHTML = theVideo;
      _this.videoHtml = videoHtml;
      _this.video = _this.videoHtml;

      _this.video.onloadedmetadata = function () {
        onStartCapture && onStartCapture(_this.captures);

        _this.video.play();
      };

      _this.video.onplay = function () {
        _this.initScreenshot();
      }; //Can't play this video


      _this.video.onerror = function () {
        onUnsupportedVideo && onUnsupportedVideo();
      };

      _this.video.addEventListener('seeked', function () {
        //Check we still have a video (might have been cancelled)
        if (_this.video) {
          _this.video.pause();

          _this.captureScreenShot();
        }
      });
    });

    _this.video;
    _this.videoHtml;
    _this.videoHeight;
    _this.videoWidth;
    _this.videoDuration;
    _this.videoInterval;
    _this.videoStart;
    _this.completed = 0;
    _this.captures = [];
    _this.capturesDetailed = {};
    _this.events = {};
    _this.currentShot = 0;
    _this.startTime = null;
    _this.lastTime = null;
    _this.maxWidth = props.maxWidth || 1280;
    _this.maxHeight = props.maxHeight || 1280;
    _this.count = props.count || 8;
    return _this;
  }

  _createClass(ThumbnailExtractor, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevProps.videoFile !== this.props.videoFile) {
        this.parseVideo();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var videoFile = this.props.videoFile;

      if (!videoFile) {
        return null;
      }

      return _react["default"].createElement("div", null, "I am a dummy react npm module");
    }
  }]);

  return ThumbnailExtractor;
}(_react.Component);

exports["default"] = ThumbnailExtractor;
