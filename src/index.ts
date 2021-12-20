import * as fs from "fs";
import * as path from "path";
import { v4 } from "uuid";
import { EventEmitter } from "events";
import DebounceWathcer from "./debounce_watcher";

namespace EntryPoint {
    export class App extends EventEmitter {
        private _watcher = new DebounceWathcer();

        constructor() {
            super();
            this.listen();
        }

        /**
         * Listen to events
         */
        listen() {
            this.on("ready", () => {
                this._watcher.on("change", (filename: string) => {
                    console.clear();
                    console.log(filename + "가 변경되었습니다");
                });
                this._watcher.addWatch(".");
            });
        }

        emitAllEvents() {
            this.emit("ready");
        }

        start() {
            this.emitAllEvents();
        }
    }
}

const app = new EntryPoint.App();
app.start();
