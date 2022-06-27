export interface ScreenItem {
    description: string,
    id: string,
    name: string,
    type: string,
    target: string,
    catalogId: string,
    metadata: string,
    state:{
        text: string,
        value: string
    }
}
