# Animated Bar Chart Race Custom Visual For Power BI

_The familiar bar chart turns fascinating with a new trendy feature to animate bars racing to the top based on ranks._

![Preview](./demo/animation-example.gif)

## How to use

For examples on how to use please refer to the sample report in the demo folder names `Animated-Bar-Chart-Race-Custom-Visual-Demo.pbix` It demonstrates the visual and its various usecases and configuration setups.

## Build Process
This visual features a two phase build process for easy debugging, i.e. we first build the visual as a web component and create a `bundle.js` and in the second phase we build the Power BI visual in the `PBI` folder.

```
git clone https://github.com/wishyoulization/PowerBI-visuals-BarChartRace.git
cd PowerBI-visuals-BarChartRace
npm install
npm run-script build
cd PBI
npm install
npm run-script package
```

When developing locally in a browser.
```
cd PowerBI-visuals-BarChartRace
npm run-script start
```

When developing locally for PowerBI debugger (Please refer to the Power BI Custom Visual Development Guide for more details on how to setup build tools).
```
cd PowerBI-visuals-BarChartRace
cd PBI
npm run-script start
```