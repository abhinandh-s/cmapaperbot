
import wasmModule from "./cmapaperbot.wasm";
import * as internal from "./cmapaperbot.internal.js";

const instance = new WebAssembly.Instance(wasmModule, {
  "./cmapaperbot.internal.js": {
    __wbindgen_init_externref_table:
      internal.__wbindgen_init_externref_table,
  },
});

internal.__wbg_set_wasm(instance.exports);

instance.exports.__wbindgen_start();

export * from "./cmapaperbot.internal.js";
