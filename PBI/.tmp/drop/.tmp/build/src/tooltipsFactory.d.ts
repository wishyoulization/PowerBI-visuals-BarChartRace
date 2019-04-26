import powerbi from "powerbi-visuals-api";
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
export interface ForceGraphTooltipInputObject {
    [propertyName: string]: any;
}
export declare class ForceGraphTooltipsFactory {
    static build(inputObject: ForceGraphTooltipInputObject, dataViewMetadataColumns: DataViewMetadataColumn[]): VisualTooltipDataItem[];
}
export declare class ForceGraphMetadataRoleHelper {
    static getColumnByRoleName(dataViewMetadataColumns: DataViewMetadataColumn[], roleName: string): DataViewMetadataColumn;
}
