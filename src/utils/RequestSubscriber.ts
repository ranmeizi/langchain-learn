import { Page } from "puppeteer-core";

export class RequestSubscriber {
    page: Page
    subscribes: Record<string, Array<(response: any) => void>> = {}

    constructor(page: Page) {
        this.page = page
        this._init()
    }

    _init() {
        this.page.on('response', response => {
            const url = response.url()

            for (const [pattern, listeners] of Object.entries(this.subscribes)) {
                const reg = new RegExp(pattern)
                if (url.match(reg)) {
                    for (const listener of listeners) {
                        listener(response)
                    }
                }
            }
        });
    }

    on(pattern: string, listener: any) {
        if (!this.subscribes[pattern]) {
            this.subscribes[pattern] = [listener]
        } else {
            this.subscribes[pattern].push(listener)
        }

        return () => {
            this.un(pattern, listener)
        }
    }

    un(pattern: string, listener: any) {
        if (this.subscribes[pattern]) {
            this.subscribes[pattern] = this.subscribes[pattern].filter(item => item !== listener)
            if (this.subscribes[pattern].length === 0) {
                delete this.subscribes[pattern]

            }
        }
    }
}