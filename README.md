# Introduction

This project allows you to watch changing of the latest file and emit specific event to any listener.

```ts
const watcher = new DebounceWathcer();
watcher.on("change", (filename: string) => {
    // do something
});
```
