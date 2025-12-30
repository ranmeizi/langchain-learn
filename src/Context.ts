import { Page } from "puppeteer-core";

type ContextType = {
    page?: Page
    requests: {
        url: string,
        result: string
    }[]
}

export class Context {

    data: ContextType = {
        page: undefined,
        requests:[]
    }
    constructor() { }


    setDate(data: Partial<ContextType>) {
        this.data = {
            ...this.data,
            ...data
        }
    }

    get page() {
        return this.data.page
    }

    get requests() {
        return this.data.requests
    }
}

export const ctx = new Context()