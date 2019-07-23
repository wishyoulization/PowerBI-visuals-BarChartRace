/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/*
 *  This file is based on or incorporates material from the projects listed below (Third Party IP).
 *  The original copyright notice and the license under which Microsoft received such Third Party IP,
 *  are set forth below. Such licenses and notices are provided for informational purposes only.
 *  Microsoft licenses the Third Party IP to you under the licensing terms for the Microsoft product.
 *  Microsoft reserves all other rights not expressly granted under this agreement, whether by
 *  implication, estoppel or otherwise.
 *
 *  d3 Force Layout
 *  Copyright (c) 2010-2015, Michael Bostock
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *  * The name Michael Bostock may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 *  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 *  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import "./../style/visual.less";

import * as d3 from "d3";
import * as _ from "lodash";
import powerbi from "powerbi-visuals-api";
import constructPage from "../../dist/bundle.js";

import IViewport = powerbi.IViewport;
import IColorPalette = powerbi.extensibility.IColorPalette;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import DataView = powerbi.DataView;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import DataViewValueColumn = powerbi.DataViewValueColumn;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualObjectInstancesToPersist = powerbi.VisualObjectInstancesToPersist;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;


export class Visual implements IVisual {
    private config: any;
    private host: IVisualHost;
    private colorPalette: IColorPalette;
    private dv: any;

    constructor(options: VisualConstructorOptions) {
        this.config = {};
        this.host = options.host;
        this.colorPalette = options.host.colorPalette;
        this.init(options);
    }

    private init(options: VisualConstructorOptions): void {
        d3.select(options.element).append("svg").attr("id", "chart")
    }

    private getObjectFromDataView(dv) {
        let all = [];
        let fieldNames = [];

        for (let c = 0; c < dv.table.columns.length; c++) {
            let currC = dv.table.columns[c];
            let field = d3.keys(currC.roles)[0];
            fieldNames.push(field);
        }

        for (let r = 0; r < dv.table.rows.length; r++) {
            let currR = dv.table.rows[r];
            let item = {};
            for (let c = 0; c < fieldNames.length; c++) {
                let currC = fieldNames[c];
                item[currC] = currR[c];
            }
            if (typeof (item["colour"]) === "undefined") {
                item["colour"] = this.host.colorPalette.getColor(item["name"]).value;
            }
            all.push(item);
        }

        return {
            data: all
        };
    }

    public getConfig() {
        let configString = "{}";
        if (this.dv && this.dv.metadata.objects && this.dv.metadata.objects.chartSettings && this.dv.metadata.objects.chartSettings.config) {
            configString = this.dv.metadata.objects.chartSettings.config;
        }
        // console.log(JSON.parse(configString));
        return JSON.parse(configString);
    }

    public setConfig(config: any) {
        let configString: string = JSON.stringify(config) || "";
        let objects: VisualObjectInstancesToPersist = {
            merge: [
                <VisualObjectInstance>{
                    objectName: "chartSettings",
                    selector: null,
                    properties: { "config": configString },
                }]
        };
        this.host.persistProperties(objects);
    }

    public getDisplaySettingsFromMetaData(name: string) {
        if (this.dv &&
            this.dv.metadata &&
            this.dv.metadata.objects &&
            this.dv.metadata.objects.displaySettings &&
            typeof this.dv.metadata.objects.displaySettings[name] !== "undefined") {
            return this.dv.metadata.objects.displaySettings[name];
        }
    }

    public update(options: VisualUpdateOptions): void {
        if (!options
            || !options.dataViews
            || !options.dataViews[0]
        ) {
            return;
        }
        this.dv = options.dataViews[0];
        let results = this.getObjectFromDataView(options.dataViews[0]);
        // console.log(options, results);
        this.config = {
            topN: this.getDisplaySettingsFromMetaData("topN") || 10,
            duration: this.getDisplaySettingsFromMetaData("duration") || 1000,
            width: options.viewport.width,
            height: options.viewport.height,
            autoPlay: (typeof this.getDisplaySettingsFromMetaData("autoPlay") != "undefined") ? this.getDisplaySettingsFromMetaData("autoPlay") : true,
            fontFamily: this.getDisplaySettingsFromMetaData("fontFamily") || "Segoe UI",
            fontSize: (typeof this.getDisplaySettingsFromMetaData("fontSize") != "undefined") ? this.getDisplaySettingsFromMetaData("fontSize") : 14,
            hideGrid: this.getDisplaySettingsFromMetaData("hideGrid") || false,
            hideNumbers: this.getDisplaySettingsFromMetaData("hideNumbers") || false,
            hidePeriod: this.getDisplaySettingsFromMetaData("hidePeriod") || false,
            periodSize: (typeof this.getDisplaySettingsFromMetaData("periodSize") != "undefined") ? this.getDisplaySettingsFromMetaData("periodSize") : 64,
            flipCroppedLabelsToRight: (typeof this.getDisplaySettingsFromMetaData("flipCroppedLabelsToRight") != "undefined") ? this.getDisplaySettingsFromMetaData("flipCroppedLabelsToRight") : true,
            useFixedXaxisRange: (typeof this.getDisplaySettingsFromMetaData("useFixedXaxisRange") != "undefined") ? this.getDisplaySettingsFromMetaData("useFixedXaxisRange") : false,
            minXaxisRange: (typeof this.getDisplaySettingsFromMetaData("minXaxisRange") != "undefined") ? +this.getDisplaySettingsFromMetaData("minXaxisRange") : "0",
            maxXaxisRange: (typeof this.getDisplaySettingsFromMetaData("maxXaxisRange") != "undefined") ? +this.getDisplaySettingsFromMetaData("maxXaxisRange") : "100",
        };
        (window as any).constructPage(results.data, this.config);
        // (window as any).constructPage(results.data, { get: this.getConfig.bind(this), set: this.setConfig.bind(this), edit: options.editMode ? true : false });
        let needToLoad = constructPage;
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        let objectName = options.objectName;
        let objectEnumeration: VisualObjectInstance[] = [];
        switch (objectName) {
            case "chartSettings":
                // ignore
                break;
            case "displaySettings":
                objectEnumeration.push({
                    objectName: objectName,
                    displayName: "Wishyoulization Settings",
                    properties: {
                        topN: this.config.topN,
                        duration: this.config.duration,
                        autoPlay: this.config.autoPlay,
                        fontFamily: this.config.fontFamily,
                        fontSize: this.config.fontSize,
                        hideGrid: this.config.hideGrid,
                        hideNumbers: this.config.hideNumbers,
                        hidePeriod: this.config.hidePeriod,
                        periodSize: this.config.periodSize,
                        flipCroppedLabelsToRight: this.config.flipCroppedLabelsToRight,
                        useFixedXaxisRange: this.config.useFixedXaxisRange,
                        minXaxisRange: this.config.minXaxisRange,
                        maxXaxisRange: this.config.maxXaxisRange,
                    },
                    validValues: {
                        topN: { numberRange: { min: 1, max: 20 } },
                        duration: { numberRange: { min: 0, max: 10000 } },
                        autoPlay: {},
                        fontFamily: {},
                        fontSize: { numberRange: { min: 0, max: 32 } },
                        hideGrid: {},
                        hideNumbers: {},
                        hidePeriod: {},
                        periodSize: { numberRange: { min: 0, max: 80 } },
                        flipCroppedLabelsToRight: {},
                        useFixedXaxisRange: {},
                        minXaxisRange: {},
                        maxXaxisRange: {},
                    },
                    selector: null
                });
                break;
        }
        return objectEnumeration;
    }

    public destroy(): void {
    }
}

