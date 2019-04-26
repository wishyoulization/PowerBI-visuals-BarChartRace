/// <reference types="d3" />
import Node = d3.layout.force.Node;
import { TooltipEnabledDataPoint } from "powerbi-visuals-utils-tooltiputils";
import { valueFormatter as vf } from "powerbi-visuals-utils-formattingutils";
import IValueFormatter = vf.IValueFormatter;
import { ForceGraphSettings } from "./settings";
export interface ForceGraphNode extends Node {
    name: string;
    image: string;
    adj: {
        [i: string]: number;
    };
    x?: number;
    y?: number;
    isDrag?: boolean;
    isOver?: boolean;
    hideLabel?: boolean;
    nodeColor?: string;
    nodeSize?: number;
}
export interface ITextRect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface ForceGraphNodes {
    [i: string]: ForceGraphNode;
}
export interface ForceGraphLink extends TooltipEnabledDataPoint {
    source: ForceGraphNode;
    target: ForceGraphNode;
    weight: number;
    formattedWeight: string;
    linkType: string;
    linkSize?: number;
    linkHex?: string;
}
export interface ForceGraphData {
    nodes: ForceGraphNodes;
    links: ForceGraphLink[];
    minFiles: number;
    maxFiles: number;
    linkedByName: LinkedByName;
    linkTypes: {};
    settings: ForceGraphSettings;
    formatter: IValueFormatter;
}
export interface LinkedByName {
    [linkName: string]: number;
}
