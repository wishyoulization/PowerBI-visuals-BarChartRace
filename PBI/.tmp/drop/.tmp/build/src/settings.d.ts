import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
export declare class ForceGraphSettings extends DataViewObjectsParser {
    animation: Animation;
    labels: LabelsSettings;
    links: LinksSettings;
    nodes: NodesSettings;
    size: SizeSettings;
}
export declare class Animation {
    show: boolean;
}
export declare class LabelsSettings {
    show: boolean;
    color: string;
    fontSize: number;
    allowIntersection: boolean;
}
export declare class LinksSettings {
    showArrow: boolean;
    showLabel: boolean;
    colorLink: LinkColorType;
    thickenLink: boolean;
    displayUnits: number;
    decimalPlaces: number;
}
export declare enum LinkColorType {
    ByWeight,
    ByLinkType,
    Interactive
}
export declare class NodesSettings {
    displayImage: boolean;
    defaultImage: string;
    imageUrl: string;
    imageExt: string;
    nameMaxLength: number;
    highlightReachableLinks: boolean;
    fill: string;
    stroke: string;
}
export declare class SizeSettings {
    charge: number;
    boundedByBox: boolean;
}
