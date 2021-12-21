import { EventEmitter } from "events";
import * as cron from "node-cron";
import { CronScheduler } from "./scheduler";
namespace EntryPoint {
    export class TaskJob extends EventEmitter {
        private static list: Promise<any>[];
        private static isRunning: boolean = false;

        constructor() {
            super();
        }

        public static addTask(task: Promise<any>) {
            this.list.push(task);

            if (!this.isRunning) {
                this.isRunning = true;
                this.runTask();
            }
        }

        public static runTask() {
            cron.schedule(CronScheduler.EVERY_SECOND, () => {
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
