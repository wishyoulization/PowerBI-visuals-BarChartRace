import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
export declare class ForceGraphColumns<T> {
    static getMetadataColumns(dataView: DataView): ForceGraphColumns<DataViewMetadataColumn>;
    static getCategoricalColumns(dataView: DataView): {
        Source: any;
        Target: any;
        Weight: any;
        LinkType: any;
        SourceType: any;
        TargetType: any;
        SourceSize: any;
        SourceHex: any;
        TargetSize: any;
        TargetHex: any;
        LinkSize: any;
        LinkHex: any;
    };
    Source: T;
    Target: T;
    Weight: T;
    LinkType: T;
    SourceType: T;
    TargetType: T;
    SourceSize: T;
    SourceHex: T;
    TargetSize: T;
    TargetHex: T;
    LinkSize: T;
    LinkHex: T;
}
