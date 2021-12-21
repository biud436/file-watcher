# Introduction

This project allows you to watch changing of the latest file and emit specific event to any listener.

```ts
const watcher = new DebounceWathcer();
watcher.on("change", (filename: string) => {
    // do something
});
```

# Installation

if you are installed `Node.js` and `npm` via `nvm` in your linux system, you have to run as below command.

```sh
npm install -g yarn
yarn install
yarn run start
```

before running the command called `yarn run start`, you should modify the config.json placed in config folder of the root directory.

```json
{
    "linux": {
        "watchDir": "./",
        "action": ["git fetch", "git pull"]
    },
    "windows": {
        "watchDir": "./",
        "action": []
    },
    "darwin": {
        "watchDir": "./",
        "action": []
    }
}
```
