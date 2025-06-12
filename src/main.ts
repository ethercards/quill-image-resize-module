import ResizePlugin from "./ResizePlugin";
import IframeOnClick from "./IframeClick";
import { Locale } from "./i18n";

interface Quill {
  container: HTMLElement;
  root: HTMLElement;
  on: any;
  updateContents: (delta: any) => void;
  getContents: () => any;
}
interface QuillResizeModuleOptions {
  [index: string]: any;
  locale?: Locale;
}

function QuillResizeModule(quill: Quill, options?: QuillResizeModuleOptions) {
  const container: HTMLElement = quill.root as HTMLElement;
  let resizeTarget: HTMLElement | null;
  let resizePlugin: ResizePlugin | null;

  function triggerTextChange() {
    const Delta = quill.getContents().constructor;
    const delta = new Delta().retain(1);
    quill.updateContents(delta);
  }

  function embedVideoAsImage(videoUrl: string) {
    const thumbnailUrl = generateThumbnailUrl(videoUrl);

    const img = document.createElement("img");
    img.src = thumbnailUrl;
    img.setAttribute("data-video-url", videoUrl);
    img.style.width = "100%";

    container.appendChild(img);
    return img;
  }

  container.addEventListener("click", (e: Event) => {
    const target: HTMLElement = e.target as HTMLElement;
    if (e.target && ["img", "video"].includes(target.tagName.toLowerCase())) {
      resizeTarget = target;
      resizePlugin = new ResizePlugin(target, container.parentElement as HTMLElement, {
        ...options,
        onChange: triggerTextChange,
      });
    }
  });

  quill.on("text-change", () => {
    /* container.querySelectorAll("iframe").forEach((item: HTMLIFrameElement) => {
      const videoUrl = item.src;
      const thumbnailImg = embedVideoAsImage(videoUrl);
      item.replaceWith(thumbnailImg);
    }); */

    container.querySelectorAll("iframe").forEach((item: HTMLIFrameElement) => {
      IframeOnClick.track(item, () => {
        resizeTarget = item;
        resizePlugin = new ResizePlugin(item, container.parentElement as HTMLElement, {
          ...options,
          onChange: triggerTextChange,
        });
      });
    });
  });

  document.addEventListener(
    "mousedown",
    (e: Event) => {
      const target = e.target as HTMLElement;
      if (target !== resizeTarget && !resizePlugin?.resizer?.contains?.(target)) {
        resizePlugin?.destroy?.();
        resizePlugin = null;
        resizeTarget = null;
      }
    },
    { capture: true }
  );
}

function generateThumbnailUrl(videoUrl: string): string {
  const videoId = extractVideoId(videoUrl);
  const thumbnail = `http://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  return thumbnail;
}

function extractVideoId(url: string) {
  let startIndex = url.indexOf("/embed/");

  if (startIndex === -1) {
    return "";
  }

  startIndex += "/embed/".length;
  let endIndex = url.indexOf("?", startIndex);

  if (endIndex === -1) {
    return url.substring(startIndex);
  }

  return url.substring(startIndex, endIndex);
}

export default QuillResizeModule;
