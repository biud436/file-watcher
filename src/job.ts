import { EventEmitter } from "events";
import * as cron from "node-cron";

namespace EntryPoint {
    export class TaskJob extends EventEmitter {
        private list!: Promise<any>[];

        constructor() {
            super();
        }

        public addTask(task: Promise<any>) {
            this.list.push(task);
        }

        public runTask() {
            cron.schedule("1/* * * * *", () => {
                Promise.all(this.list.map((task: Promise<any>) => task))
                    .then((result: any) => {
                        console.log(result);
                        this.list = [];
                    })
                    .catch((err) => {
                        console.warn(err);
                    });
            });
        }
    }
}

export = EntryPoint.TaskJob;
