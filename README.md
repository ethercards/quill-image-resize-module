# QUILL-RESIZE-MODULE

A module for Quill rich text editor to allow images to be resized.

## Usage

### Webpack/ES6

`npm install @galaxis/quill-resize-module`

```javascript
import Quill from "quill";
import ResizeModule from "@galaxis/quill-resize-module";

Quill.register("modules/resize", ResizeModule);

const quill = new Quill(editor, {
  modules: {
    resize: {
      locale: {
        //By default:
        // floatLeft: "Left",
        // floatRight: "Right",
        // center: "Center",
        // restore: "Default",
        // altTip: "Press and hold alt to lock ratio!",
        // inputTip: "Press enter key to apply change!",
      },
    },
  },
});
```
