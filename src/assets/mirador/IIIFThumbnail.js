// NOTE: This file is identical to the original Mirador 3.4.3 one, but triggers handleIntersection on image load, to force the thumbnail to load regardless of whether or not it is in view.
// Without this, the thumbnail does not load in Angular, because the Intersection Observer of the lazy-loaded image never triggers for some reason.
// See https://github.com/ProjectMirador/mirador/issues/4138 for more details.
// This file overwrites the one in node_modules/mirador/dist/es/src/components/IIIFThumbnail.js (see package.json).

function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == typeof e || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
import React, { Component } from 'react';
import 'intersection-observer'; // polyfill needed for Safari
import Typography from '@material-ui/core/Typography';
import IntersectionObserver from '@researchgate/react-intersection-observer';
import classNames from 'classnames';
import getThumbnail from '../lib/ThumbnailFactory';

/**
 * Uses InteractionObserver to "lazy" load canvas thumbnails that are in view.
 */
export var IIIFThumbnail = /*#__PURE__*/function (_Component) {
  /**
   */
  function IIIFThumbnail(props) {
    var _this;
    _classCallCheck(this, IIIFThumbnail);
    _this = _callSuper(this, IIIFThumbnail, [props]);
    _this.state = {
      loaded: false
    };
    _this.handleIntersection = _this.handleIntersection.bind(_this);
    return _this;
  }

  /** */
  _inherits(IIIFThumbnail, _Component);
  return _createClass(IIIFThumbnail, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          image: _this2.image()
        });
      });
    }

    /** */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;
      var _this$props = this.props,
        maxHeight = _this$props.maxHeight,
        maxWidth = _this$props.maxWidth,
        resource = _this$props.resource;
      if (prevProps.maxHeight !== maxHeight || prevProps.maxWidth !== maxWidth || prevProps.resource !== resource) {
        this.setState(function (state) {
          return _objectSpread(_objectSpread({}, state), {}, {
            image: _this3.image()
          });
        }); // eslint-disable-line
      }
    }

    /**
     * Handles the intersection (visibility) of a given thumbnail, by requesting
     * the image and then updating the state.
     */
  }, {
    key: "handleIntersection",
    value: function handleIntersection(event) {
      var loaded = this.state.loaded;
      if (loaded || !event.isIntersecting) return;
      this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          loaded: true
        });
      });
    }

    /**
     *
    */
  }, {
    key: "imageStyles",
    value: function imageStyles() {
      var _this$props2 = this.props,
        maxHeight = _this$props2.maxHeight,
        maxWidth = _this$props2.maxWidth,
        style = _this$props2.style;
      var image = this.image();
      var styleProps = {
        height: 'auto',
        width: 'auto'
      };
      if (!image) return _objectSpread(_objectSpread({}, style), {}, {
        height: maxHeight || 'auto',
        width: maxWidth || 'auto'
      });
      var thumbHeight = image.height,
        thumbWidth = image.width;
      if (thumbHeight && thumbWidth) {
        if (maxHeight && thumbHeight > maxHeight || maxWidth && thumbWidth > maxWidth) {
          var aspectRatio = thumbWidth / thumbHeight;
          if (maxHeight && maxWidth) {
            if (maxWidth / maxHeight < aspectRatio) {
              styleProps.height = Math.round(maxWidth / aspectRatio);
              styleProps.width = maxWidth;
            } else {
              styleProps.height = maxHeight;
              styleProps.width = Math.round(maxHeight * aspectRatio);
            }
          } else if (maxHeight) {
            styleProps.height = maxHeight;
            styleProps.maxWidth = Math.round(maxHeight * aspectRatio);
          } else if (maxWidth) {
            styleProps.width = maxWidth;
            styleProps.maxHeight = Math.round(maxWidth / aspectRatio);
          }
        } else {
          styleProps.width = thumbWidth;
          styleProps.height = thumbHeight;
        }
      } else if (thumbHeight && !thumbWidth) {
        styleProps.height = maxHeight;
      } else if (!thumbHeight && thumbWidth) {
        styleProps.width = maxWidth;
      } else {
        // The thumbnail wasn't retrieved via an Image API service,
        // and its dimensions are not specified in the JSON-LD
        // (note that this may result in a blurry image)
        styleProps.width = maxWidth;
        styleProps.height = maxHeight;
      }
      return _objectSpread(_objectSpread({}, styleProps), style);
    }

    /** */
  }, {
    key: "image",
    value: function image() {
      var _this$props3 = this.props,
        thumbnail = _this$props3.thumbnail,
        resource = _this$props3.resource,
        maxHeight = _this$props3.maxHeight,
        maxWidth = _this$props3.maxWidth,
        thumbnailsConfig = _this$props3.thumbnailsConfig;
      if (thumbnail) return thumbnail;
      var image = getThumbnail(resource, _objectSpread(_objectSpread({}, thumbnailsConfig), {}, {
        maxHeight: maxHeight,
        maxWidth: maxWidth
      }));
      if (image && image.url) return image;
      return undefined;
    }

    /** */
  }, {
    key: "label",
    value: function label() {
      var _this$props4 = this.props,
        label = _this$props4.label,
        resource = _this$props4.resource;
      return label || IIIFThumbnail.getUseableLabel(resource);
    }

    /**
     */
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$props5 = this.props,
        children = _this$props5.children,
        classes = _this$props5.classes,
        imagePlaceholder = _this$props5.imagePlaceholder,
        labelled = _this$props5.labelled,
        thumbnail = _this$props5.thumbnail,
        variant = _this$props5.variant;
      var _this$state = this.state,
        image = _this$state.image,
        loaded = _this$state.loaded;
      var _ref = loaded && (thumbnail || image) || {},
        _ref$url = _ref.url,
        src = _ref$url === void 0 ? imagePlaceholder : _ref$url;
      return /*#__PURE__*/React.createElement("div", {
        className: classNames(classes.root, _defineProperty({}, classes["".concat(variant, "Root")], variant))
      }, /*#__PURE__*/React.createElement(IntersectionObserver, {
        onChange: this.handleIntersection
      }, /*#__PURE__*/React.createElement("img", {
        alt: "",
        role: "presentation",
        src: src,
        style: this.imageStyles(),
        className: classes.image,
        onLoad: function onLoad() {
          return _this4.handleIntersection({
            isIntersecting: true
          });
        }
      })), labelled && /*#__PURE__*/React.createElement("div", {
        className: classNames(classes.label, _defineProperty({}, classes["".concat(variant, "Label")], variant))
      }, /*#__PURE__*/React.createElement(Typography, {
        variant: "caption",
        classes: {
          root: classNames(classes.caption, _defineProperty({}, classes["".concat(variant, "Caption")], variant))
        }
      }, this.label())), children);
    }
  }], [{
    key: "getUseableLabel",
    value: /** */
    function getUseableLabel(resource, index) {
      return resource && resource.getLabel && resource.getLabel().length > 0 ? resource.getLabel().getValue() : String(index + 1);
    }
  }]);
}(Component);
IIIFThumbnail.defaultProps = {
  children: null,
  classes: {},
  // Transparent "gray"
  imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMDQmtBwADgwF/Op8FmAAAAABJRU5ErkJggg==',
  label: undefined,
  labelled: false,
  maxHeight: null,
  maxWidth: null,
  style: {},
  thumbnail: null,
  thumbnailsConfig: {},
  variant: null
};