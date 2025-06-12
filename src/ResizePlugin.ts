import "./ResizePlugin.less";
import { I18n, Locale, defaultLocale } from "./i18n";
import { format } from "./utils";

interface Size {
  width: number;
  height: number;
}
interface Position {
  left: number;
  top: number;
  width: number;
  height: number;
}
class ResizeElement extends HTMLElement {
  public originSize?: Size | null = null;
  [key: string]: any;
}

interface ResizePluginOption {
  locale?: Locale;
  [index: string]: any;
}

let pluginOptions: ResizePluginOption | undefined;

const template = `
<div class="showSize" name="ql-size" title="{0}">{size}</div>
<div class="handler" title="{0}"></div>
<div class="toolbar">
  <div class="group">
    <a class="btn" data-type="width" data-styles="width:100%">100%</a>
    <a class="btn" data-type="width" data-styles="width:50%">50%</a>
    <span class="input-wrapper"><input data-type="width" type="number" maxlength="3" min="0" max="100" onKeyUp="if(this.value>100){this.value='100';}else if(this.value<0){this.value='0';}"/><span class="suffix">%</span><span class="tooltip">Press enter key to apply change!</span></span>
    <a class="btn" data-type="width" data-styles="width:auto">{4}</a>
  </div>
  <div class="group">
    <a class="btn" data-type="align" data-styles="float:left; margin-right:12px; margin-left:0px">{1}</a>
    <a class="btn" data-type="align" data-styles="float:none; display:block; margin:auto">{2}</a>
    <a class="btn" data-type="align" data-styles="float:right; margin-left:12px; margin-right:0px">{3}</a>
  </div>
</div>
`;
class ResizePlugin {
  resizeTarget: ResizeElement;
  resizer: HTMLElement | null = null;
  container: HTMLElement;
  startResizePosition: Position | null = null;
  i18n: I18n;
  options: any;

  constructor(resizeTarget: ResizeElement, container: HTMLElement, options?: ResizePluginOption) {
    this.i18n = new I18n(options?.locale || defaultLocale);
    this.options = options;
    this.resizeTarget = resizeTarget;
    if (!resizeTarget.originSize) {
      resizeTarget.originSize = {
        width: resizeTarget.clientWidth,
        height: resizeTarget.clientHeight,
      };
    }
    pluginOptions = options;
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

  initResizer() {
    let resizer: HTMLElement | null = this.container.querySelector("#editor-resizer");
    if (!resizer) {
      resizer = document.createElement("div");
      resizer.setAttribute("id", "editor-resizer");
      resizer.innerHTML = format(
        template,
        this.i18n.findLabel("altTip"),
        this.i18n.findLabel("floatLeft"),
        this.i18n.findLabel("center"),
        this.i18n.findLabel("floatRight"),
        this.i18n.findLabel("restore"),
        this.i18n.findLabel("inputTip")
      );
      this.container.appendChild(resizer);
    }
    this.resizer = resizer;
  }

  positionResizerToTarget(el: HTMLElement) {
    if (this.resizer !== null) {
      const parentWidth = el.parentElement?.clientWidth || 1;
      // const parentHeight = el.parentElement?.clientHeight || 1;
      const widthPercent = (el.clientWidth / parentWidth) * 100;
      // const heightPercent = (el.clientHeight / parentHeight) * 100;

      this.resizer.style.setProperty("left", el.offsetLeft + "px");
      this.resizer.style.setProperty("top", el.offsetTop + "px");
      this.resizer.style.setProperty("width", el.clientWidth + "px");
      this.resizer.style.setProperty("height", el.clientHeight + "px");

      document.getElementsByName("ql-size").item(0).innerHTML = `${widthPercent.toFixed(0)}%`;
    }
  }

  bindEvents() {
    if (this.resizer !== null) {
      this.resizer.addEventListener("mousedown", this.startResize);
      this.resizer.addEventListener("click", this.toolbarClick);
      this.resizer.addEventListener("change", this.toolbarInputChange);
    }
    window.addEventListener("mouseup", this.endResize);
    window.addEventListener("mousemove", this.resizing);
    window.addEventListener("keydown", this.handleKeydown);
  }

  _setStylesForToolbar(type: string, styles: string | undefined) {
    const storeKey = `_styles_${type}`;
    const style: CSSStyleDeclaration = this.resizeTarget.style;
    const originStyles = this.resizeTarget[storeKey];
    style.cssText = style.cssText.replaceAll(" ", "").replace(originStyles, "") + `;${styles}`;
    this.resizeTarget[storeKey] = styles;

    this.positionResizerToTarget(this.resizeTarget);
    this.options?.onChange(this.resizeTarget);
  }

  toolbarInputChange(e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const type = target?.dataset?.type;
    const value = target.value;
    if (type && Number(value)) {
      this._setStylesForToolbar(type, `width: ${Number(value)}%;`);
    }
  }

  toolbarClick(e: MouseEvent) {
    const target: HTMLElement = e.target as HTMLElement;
    const type = target?.dataset?.type;

    if (type && target.classList.contains("btn")) {
      this._setStylesForToolbar(type, target?.dataset?.styles);
    }
  }

  startResize(e: MouseEvent) {
    const target: HTMLElement = e.target as HTMLElement;
    if (target.classList.contains("handler") && e.which === 1) {
      this.startResizePosition = {
        left: e.clientX,
        top: e.clientY,
        width: this.resizeTarget.clientWidth,
        height: this.resizeTarget.clientHeight,
      };
    }
  }

  endResize() {
    this.startResizePosition = null;
    this.options?.onChange(this.resizeTarget);
  }

  resizing(e: MouseEvent) {
    if (!this.startResizePosition) return;
    const deltaX: number = e.clientX - this.startResizePosition.left;
    const deltaY: number = e.clientY - this.startResizePosition.top;
    let width = this.startResizePosition.width;
    let height = this.startResizePosition.height;
    width += deltaX;
    height += deltaY;

    const parentWidth = this.resizeTarget.parentElement?.clientWidth || 1;
    const parentHeight = this.resizeTarget.parentElement?.clientHeight || 1;
    let widthPercent = (width / parentWidth) * 100;
    let heightPercent = (height / parentHeight) * 100;

    if (e.altKey) {
      const originSize = this.resizeTarget.originSize as Size;
      const rate: number = originSize.height / originSize.width;
      heightPercent = rate * widthPercent;
    }

    this.resizeTarget.style.setProperty("width", Math.max(widthPercent, 1) + "%");
    this.resizeTarget.style.setProperty("height", Math.max(heightPercent, 1) + "%");
    this.positionResizerToTarget(this.resizeTarget);
  }

  handleKeydown(e: KeyboardEvent) {
    const hasTarget = this.resizeTarget.clientWidth !== 0;
    if ((e.key === "Delete" || e.key === "Backspace") && !hasTarget) {
      document.getElementsByName("ql-size").item(0).innerHTML = `${hasTarget}%`;
      this.destroy();
    }
  }

  destroy() {
    this.container.removeChild(this.resizer as HTMLElement);
    window.removeEventListener("mouseup", this.endResize);
    window.removeEventListener("mousemove", this.resizing);
    window.removeEventListener("keydown", this.handleKeydown);
    this.resizer = null;
  }
}

export default ResizePlugin;
