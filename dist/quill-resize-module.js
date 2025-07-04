(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.QuillResizeModule = factory());
}(this, (function () { 'use strict';

    function __$styleInject(css) {
        if (!css) return;

        if (typeof window == 'undefined') return;
        var style = document.createElement('style');
        style.setAttribute('media', 'screen');

        style.innerHTML = css;
        document.head.appendChild(style);
        return css;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    __$styleInject("#editor-resizer {\n  position: absolute;\n  border: 1px dashed #fff;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n#editor-resizer .handler {\n  position: absolute;\n  right: -5px;\n  bottom: -5px;\n  width: 10px;\n  height: 10px;\n  border: 1px solid #333;\n  background-color: rgba(255, 255, 255, 0.8);\n  cursor: nwse-resize;\n  user-select: none;\n}\n#editor-resizer .toolbar {\n  position: absolute;\n  top: -5em;\n  left: 50%;\n  padding: 0.5em;\n  border-radius: 3px;\n  transform: translateX(-50%);\n  width: 20em;\n  background-color: #222;\n  box-shadow: 2px 2px 8px #000;\n  border-radius: 8px;\n}\n#editor-resizer .toolbar .group {\n  display: flex;\n  border: 1px solid #aaa;\n  border-radius: 6px;\n  white-space: nowrap;\n  text-align: center;\n  line-height: 2;\n  color: #aaa;\n  padding: 4px;\n  font-family: Arial, Helvetica, sans-serif;\n}\n#editor-resizer .toolbar .group:not(:first-child) {\n  margin-top: 0.5em;\n}\n#editor-resizer .toolbar .group .btn {\n  flex: 1 0 0;\n  text-align: center;\n  width: 25%;\n  padding: 0;\n  display: inline-block;\n  vertical-align: top;\n  user-select: none;\n  color: inherit;\n  font-size: 14px !important;\n}\n#editor-resizer .toolbar .group .btn:not(:last-child) {\n  border-right: 1px solid #4d4d4d;\n}\n#editor-resizer .toolbar .group .btn:not(.btn-group):active {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n#editor-resizer .toolbar .group .btn:hover {\n  color: #faf5f7;\n  cursor: pointer;\n}\n#editor-resizer .toolbar .group .input-wrapper {\n  width: 25%;\n  position: relative;\n  border-right: 1px solid #4d4d4d;\n  min-width: 4em;\n}\n#editor-resizer .toolbar .group .input-wrapper::after {\n  content: \" \";\n  position: absolute;\n}\n#editor-resizer .toolbar .group .input-wrapper input {\n  color: inherit;\n  text-align: center;\n  width: 100%;\n  border: none;\n  outline: none;\n  padding: 0 0.5em;\n  padding-right: 1.5em;\n  background-color: #222;\n  margin: 0;\n}\n#editor-resizer .toolbar .group .input-wrapper input:focus ~ .tooltip {\n  display: block;\n}\n#editor-resizer .toolbar .group .input-wrapper .suffix {\n  position: absolute;\n  right: 0.5em;\n}\n#editor-resizer .toolbar .group .input-wrapper .tooltip {\n  display: none;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  background-color: #fff;\n  box-shadow: 0 0 3px #a7a7a7;\n  padding: 0 0.6em;\n  border-radius: 5px;\n  zoom: 0.85;\n}\n#editor-resizer .showSize {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  padding: 0.5em;\n  border-radius: 8px;\n  background-color: #222;\n  box-shadow: 2px 2px 8px #000;\n  transform: translateX(-50%);\n  color: #faf5f7;\n  font-size: 16px;\n}\n#editor-resizer input[type=\"number\"] {\n  -moz-appearance: textfield !important;\n  -webkit-appearance: none !important;\n  appearance: textfield !important;\n}\n#editor-resizer input::-webkit-outer-spin-button,\n#editor-resizer input::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n");

    var I18n = /** @class */ (function () {
        function I18n(config) {
            this.config = __assign(__assign({}, defaultLocale), config);
        }
        I18n.prototype.findLabel = function (key) {
            if (this.config) {
                return Reflect.get(this.config, key);
            }
            return null;
        };
        return I18n;
    }());
    var defaultLocale = {
        floatLeft: "Left",
        floatRight: "Right",
        center: "Center",
        restore: "Default",
        altTip: "Press and hold alt to lock ratio!",
        inputTip: "Press enter key to apply change!",
    };

    function format(str) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return str.replace(/\{(\d+)\}/g, function (match, index) {
            if (values.length > index) {
                return values[index];
            }
            else {
                return "";
            }
        });
    }

    var ResizeElement = /** @class */ (function (_super) {
        __extends(ResizeElement, _super);
        function ResizeElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.originSize = null;
            return _this;
        }
        return ResizeElement;
    }(HTMLElement));
    var template = "\n<div class=\"showSize\" name=\"ql-size\" title=\"{0}\">{size}</div>\n<div class=\"handler\" title=\"{0}\"></div>\n<div class=\"toolbar\">\n  <div class=\"group\">\n    <a class=\"btn\" data-type=\"width\" data-styles=\"width:100%\">100%</a>\n    <a class=\"btn\" data-type=\"width\" data-styles=\"width:50%\">50%</a>\n    <span class=\"input-wrapper\"><input data-type=\"width\" type=\"number\" maxlength=\"3\" min=\"0\" max=\"100\" onKeyUp=\"if(this.value>100){this.value='100';}else if(this.value<0){this.value='0';}\"/><span class=\"suffix\">%</span><span class=\"tooltip\">Press enter key to apply change!</span></span>\n    <a class=\"btn\" data-type=\"width\" data-styles=\"width:auto\">{4}</a>\n  </div>\n  <div class=\"group\">\n    <a class=\"btn\" data-type=\"align\" data-styles=\"float:left; margin-right:12px; margin-left:0px\">{1}</a>\n    <a class=\"btn\" data-type=\"align\" data-styles=\"float:none; display:block; margin:auto\">{2}</a>\n    <a class=\"btn\" data-type=\"align\" data-styles=\"float:right; margin-left:12px; margin-right:0px\">{3}</a>\n  </div>\n</div>\n";
    var ResizePlugin = /** @class */ (function () {
        function ResizePlugin(resizeTarget, container, options) {
            this.resizer = null;
            this.startResizePosition = null;
            this.i18n = new I18n((options === null || options === void 0 ? void 0 : options.locale) || defaultLocale);
            this.options = options;
            this.resizeTarget = resizeTarget;
            if (!resizeTarget.originSize) {
                resizeTarget.originSize = {
                    width: resizeTarget.clientWidth,
                    height: resizeTarget.clientHeight,
                };
            }
            this.container = container;
            this.initResizer();
            this.positionResizerToTarget(resizeTarget);
            this.resizing = this.resizing.bind(this);
            this.endResize = this.endResize.bind(this);
            this.startResize = this.startResize.bind(this);
            this.toolbarClick = this.toolbarClick.bind(this);
            this.toolbarInputChange = this.toolbarInputChange.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);
            this.bindEvents();
        }
        ResizePlugin.prototype.initResizer = function () {
            var resizer = this.container.querySelector("#editor-resizer");
            if (!resizer) {
                resizer = document.createElement("div");
                resizer.setAttribute("id", "editor-resizer");
                resizer.innerHTML = format(template, this.i18n.findLabel("altTip"), this.i18n.findLabel("floatLeft"), this.i18n.findLabel("center"), this.i18n.findLabel("floatRight"), this.i18n.findLabel("restore"), this.i18n.findLabel("inputTip"));
                this.container.appendChild(resizer);
            }
            this.resizer = resizer;
        };
        ResizePlugin.prototype.positionResizerToTarget = function (el) {
            var _a;
            if (this.resizer !== null) {
                var parentWidth = ((_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.clientWidth) || 1;
                // const parentHeight = el.parentElement?.clientHeight || 1;
                var widthPercent = (el.clientWidth / parentWidth) * 100;
                // const heightPercent = (el.clientHeight / parentHeight) * 100;
                this.resizer.style.setProperty("left", el.offsetLeft + "px");
                this.resizer.style.setProperty("top", el.offsetTop + "px");
                this.resizer.style.setProperty("width", el.clientWidth + "px");
                this.resizer.style.setProperty("height", el.clientHeight + "px");
                document.getElementsByName("ql-size").item(0).innerHTML = widthPercent.toFixed(0) + "%";
            }
        };
        ResizePlugin.prototype.bindEvents = function () {
            if (this.resizer !== null) {
                this.resizer.addEventListener("mousedown", this.startResize);
                this.resizer.addEventListener("click", this.toolbarClick);
                this.resizer.addEventListener("change", this.toolbarInputChange);
            }
            window.addEventListener("mouseup", this.endResize);
            window.addEventListener("mousemove", this.resizing);
            window.addEventListener("keydown", this.handleKeydown);
        };
        ResizePlugin.prototype._setStylesForToolbar = function (type, styles) {
            var _a;
            var storeKey = "_styles_" + type;
            var style = this.resizeTarget.style;
            var originStyles = this.resizeTarget[storeKey];
            style.cssText = style.cssText.replaceAll(" ", "").replace(originStyles, "") + (";" + styles);
            this.resizeTarget[storeKey] = styles;
            this.positionResizerToTarget(this.resizeTarget);
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
        };
        ResizePlugin.prototype.toolbarInputChange = function (e) {
            var _a;
            var target = e.target;
            var type = (_a = target === null || target === void 0 ? void 0 : target.dataset) === null || _a === void 0 ? void 0 : _a.type;
            var value = target.value;
            if (type && Number(value)) {
                this._setStylesForToolbar(type, "width: " + Number(value) + "%;");
            }
        };
        ResizePlugin.prototype.toolbarClick = function (e) {
            var _a, _b;
            var target = e.target;
            var type = (_a = target === null || target === void 0 ? void 0 : target.dataset) === null || _a === void 0 ? void 0 : _a.type;
            if (type && target.classList.contains("btn")) {
                this._setStylesForToolbar(type, (_b = target === null || target === void 0 ? void 0 : target.dataset) === null || _b === void 0 ? void 0 : _b.styles);
            }
        };
        ResizePlugin.prototype.startResize = function (e) {
            var target = e.target;
            if (target.classList.contains("handler") && e.which === 1) {
                this.startResizePosition = {
                    left: e.clientX,
                    top: e.clientY,
                    width: this.resizeTarget.clientWidth,
                    height: this.resizeTarget.clientHeight,
                };
            }
        };
        ResizePlugin.prototype.endResize = function () {
            var _a;
            this.startResizePosition = null;
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
        };
        ResizePlugin.prototype.resizing = function (e) {
            var _a, _b;
            if (!this.startResizePosition)
                return;
            var deltaX = e.clientX - this.startResizePosition.left;
            var deltaY = e.clientY - this.startResizePosition.top;
            var width = this.startResizePosition.width;
            var height = this.startResizePosition.height;
            width += deltaX;
            height += deltaY;
            var parentWidth = ((_a = this.resizeTarget.parentElement) === null || _a === void 0 ? void 0 : _a.clientWidth) || 1;
            var parentHeight = ((_b = this.resizeTarget.parentElement) === null || _b === void 0 ? void 0 : _b.clientHeight) || 1;
            var widthPercent = (width / parentWidth) * 100;
            var heightPercent = (height / parentHeight) * 100;
            if (e.altKey) {
                var originSize = this.resizeTarget.originSize;
                var rate = originSize.height / originSize.width;
                heightPercent = rate * widthPercent;
            }
            this.resizeTarget.style.setProperty("width", Math.max(widthPercent, 1) + "%");
            this.resizeTarget.style.setProperty("height", Math.max(heightPercent, 1) + "%");
            this.positionResizerToTarget(this.resizeTarget);
        };
        ResizePlugin.prototype.handleKeydown = function (e) {
            var hasTarget = this.resizeTarget.clientWidth !== 0;
            if ((e.key === "Delete" || e.key === "Backspace") && !hasTarget) {
                document.getElementsByName("ql-size").item(0).innerHTML = hasTarget + "%";
                this.destroy();
            }
        };
        ResizePlugin.prototype.destroy = function () {
            this.container.removeChild(this.resizer);
            window.removeEventListener("mouseup", this.endResize);
            window.removeEventListener("mousemove", this.resizing);
            window.removeEventListener("keydown", this.handleKeydown);
            this.resizer = null;
        };
        return ResizePlugin;
    }());

    var Iframe = /** @class */ (function () {
        function Iframe(element, cb) {
            this.element = element;
            this.cb = cb;
            this.hasTracked = false;
        }
        return Iframe;
    }());
    var IframeClick = /** @class */ (function () {
        function IframeClick() {
        }
        IframeClick.track = function (element, cb) {
            this.iframes.push(new Iframe(element, cb));
            if (!this.interval) {
                this.interval = setInterval(function () {
                    IframeClick.checkClick();
                }, this.resolution);
            }
        };
        IframeClick.checkClick = function () {
            if (document.activeElement) {
                var activeElement = document.activeElement;
                for (var i in this.iframes) {
                    if (activeElement === this.iframes[i].element) {
                        if (this.iframes[i].hasTracked == false) {
                            this.iframes[i].cb.apply(window, []);
                            this.iframes[i].hasTracked = true;
                        }
                    }
                    else {
                        this.iframes[i].hasTracked = false;
                    }
                }
            }
        };
        IframeClick.resolution = 500;
        IframeClick.iframes = [];
        IframeClick.interval = null;
        return IframeClick;
    }());

    function QuillResizeModule(quill, options) {
        var container = quill.root;
        var resizeTarget;
        var resizePlugin;
        function triggerTextChange() {
            var Delta = quill.getContents().constructor;
            var delta = new Delta().retain(1);
            quill.updateContents(delta);
        }
        container.addEventListener("click", function (e) {
            var target = e.target;
            if (e.target && ["img", "video"].includes(target.tagName.toLowerCase())) {
                resizeTarget = target;
                resizePlugin = new ResizePlugin(target, container.parentElement, __assign(__assign({}, options), { onChange: triggerTextChange }));
            }
        });
        quill.on("text-change", function () {
            /* container.querySelectorAll("iframe").forEach((item: HTMLIFrameElement) => {
              const videoUrl = item.src;
              const thumbnailImg = embedVideoAsImage(videoUrl);
              item.replaceWith(thumbnailImg);
            }); */
            container.querySelectorAll("iframe").forEach(function (item) {
                IframeClick.track(item, function () {
                    resizeTarget = item;
                    resizePlugin = new ResizePlugin(item, container.parentElement, __assign(__assign({}, options), { onChange: triggerTextChange }));
                });
            });
        });
        document.addEventListener("mousedown", function (e) {
            var _a, _b, _c;
            var target = e.target;
            if (target !== resizeTarget && !((_b = (_a = resizePlugin === null || resizePlugin === void 0 ? void 0 : resizePlugin.resizer) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, target))) {
                (_c = resizePlugin === null || resizePlugin === void 0 ? void 0 : resizePlugin.destroy) === null || _c === void 0 ? void 0 : _c.call(resizePlugin);
                resizePlugin = null;
                resizeTarget = null;
            }
        }, { capture: true });
    }

    return QuillResizeModule;

})));
