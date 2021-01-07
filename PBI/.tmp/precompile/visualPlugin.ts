import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api"
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var wishyoulizationbarchartrace2_DEBUG: IVisualPlugin = {
    name: 'wishyoulizationbarchartrace2_DEBUG',
    displayName: 'Animated Bar Chart Race',
    class: 'Visual',
    apiVersion: '2.1.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        throw 'Visual instance not found';
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["wishyoulizationbarchartrace2_DEBUG"] = wishyoulizationbarchartrace2_DEBUG;
}

export default wishyoulizationbarchartrace2_DEBUG;