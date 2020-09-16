interface Simulator {
    id: string,
    name: string,
    description: string,
    networkType: string,
    networkConfiguration: any,
    state: {
        id: string,
        text: string,
    },
    runner: {
        binds: any[],
        total: number,
        startWith: string | number,
        batch: number
    },
    listeners: {
        id: string,
        type: string,
        configuration: any
    }[]
}