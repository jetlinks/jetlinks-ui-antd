export interface ViewItem extends ReactGridLayout.Layout {
    component?: string;
    title?: string;
    config?: any;
}

export interface VisualizationItem {
    id: string;
    type: string;
    target: string;
    metadata: string;
    name: string;
    description: string;
}