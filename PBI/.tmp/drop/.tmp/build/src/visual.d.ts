import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
export declare class Visual implements IVisual {
    private config;
    private host;
    private colorPalette;
    private dv;
    constructor(options: VisualConstructorOptions);
    private init;
    private getObjectFromDataView;
    getConfig(): any;
    setConfig(config: any): void;
    getDisplaySettingsFromMetaData(name: string): any;
    update(options: VisualUpdateOptions): void;
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    destroy(): void;
}
