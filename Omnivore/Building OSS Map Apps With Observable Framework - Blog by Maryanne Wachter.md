---
id: c28c8d98-e79e-11ee-a838-7f4c2c434c88
title: Building OSS Map Apps With Observable Framework - Blog by Maryanne Wachter
tags:
  - RSS
date_published: 2024-03-21 00:00:00
---

# Building OSS Map Apps With Observable Framework - Blog by Maryanne Wachter
#Omnivore

[Read on Omnivore](https://omnivore.app/me/building-oss-map-apps-with-observable-framework-blog-by-maryanne-18e61cf39c9)
[Read Original](https://mclare.blog/posts/building-oss-map-apps-with-observable-framework/)



[All Articles](https:&#x2F;&#x2F;mclare.blog&#x2F;)

## [](#motivation)Motivation

I’ve been a pretty heavy user of [Observable](https:&#x2F;&#x2F;observablehq.com&#x2F;) since 2021\. It was my initial entry point to learning and working with D3, and I still use the notebook interface heavily for prototyping and exploring public datasets. When I saw the announcement for [Observable Framework](https:&#x2F;&#x2F;observablehq.com&#x2F;blog&#x2F;observable-2-0), it seemed like a no brainer that would support a [lot](https:&#x2F;&#x2F;mclare.blog&#x2F;visuals&#x2F;ec3epds&#x2F;) [of](https:&#x2F;&#x2F;mclare.dev&#x2F;soft-stories&#x2F;) [the](https:&#x2F;&#x2F;observablehq.com&#x2F;@m-clare&#x2F;sustainable-design-in-communities) [visualizations](https:&#x2F;&#x2F;bridge.watch&#x2F;) I like to build (and help me do so quickly). I’ve been working with open source mapping lately, and I saw in the initial documentation that there was [Mapbox support](https:&#x2F;&#x2F;observablehq.com&#x2F;framework&#x2F;lib&#x2F;mapbox-gl). I wanted to see how difficult it would be to build maps with Observable Framework using open source libraries (my preferred stack of [Maplibre](https:&#x2F;&#x2F;maplibre.org&#x2F;) and [Protomaps](https:&#x2F;&#x2F;protomaps.com&#x2F;)), so I prototyped this [interactive map of potential energy efficient retrofits of Boston buildings](https:&#x2F;&#x2F;m-clare.observablehq.cloud&#x2F;boston-building-retrofits&#x2F;) over the past few weekends.

[ ![Boston Building Retrofits](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,s2a-U6CSwwUdsHmAnlabMD-Milw0Qfnay4dz1IvtynDc&#x2F;https:&#x2F;&#x2F;mclare.blog&#x2F;static&#x2F;f8579020f78ad917d5feee99622b3366&#x2F;d9199&#x2F;boston-retrofits-example.png) ](https:&#x2F;&#x2F;mclare.blog&#x2F;static&#x2F;f8579020f78ad917d5feee99622b3366&#x2F;5f78c&#x2F;boston-retrofits-example.png) 

Boston Building Retrofits

## [](#dataset-selection)Dataset Selection

The city of [Boston](https:&#x2F;&#x2F;data.boston.gov&#x2F;) has a number of great datasets about its buildings, including an aggregated view around its efforts in sustainability and energy efficiency, called the [Boston Building Inventory](https:&#x2F;&#x2F;data.boston.gov&#x2F;dataset&#x2F;boston-buildings-inventory). From the docs:

&gt; “This dataset pulls from many different data sources to identify individual building characteristics of all buildings in Boston. It also identifies high-potential retrofit options to reduce carbon emissions in multifamily buildings, using the best available data and assumptions from building experts.”

There are a few different components included with the dataset, including explanations of the potential retrofits, as well as a presentation providing further motivation for the project. I first took a look at the raw data using [Visidata](https:&#x2F;&#x2F;www.visidata.org&#x2F;) before deciding to focus on mapping a subset of the data, only looking at the envelope retrofit strategies (which I have more familiarity with as a structural engineer).

## [](#starting-an-observable-framework-project)Starting an Observable Framework Project

I started my Observable Framework project with default settings to launch the initial template application (I chose &#x60;npm&#x60; for my package management setup because I have very few opinions on the js package management hellscape). I did appreciate that Observable allows you to opt in on telemetry data given that the Framework library is open source.

## [](#data-loaders)Data Loaders

The key differentiator for me with Observable Framework vs. other static site generators is the [data loader](https:&#x2F;&#x2F;observablehq.com&#x2F;framework&#x2F;loaders) functionality. Most of the datasets that I work with are around building data, which is updated at most once a day (and in some cases, like [Bridge.watch](https:&#x2F;&#x2F;bridge.watch&#x2F;?plot%5Ftype&#x3D;percent%5Fpoor), only once a year!) The language-agnostic implementation means that I can easily build loaders in whichever programming language I need to (maybe even Rust 😈…), and then make a cron job on my server that would run the loader and deploy the static site once a day. For this visualization, I could just use NodeJS for my loader, but quite often I’ll do data cleaning in Visidata and export the list of commands used within Visidata to generate a Python&#x2F;Pandas script.

For the Boston Buildings Inventory, I needed to stitch two data sets together. The retrofit potential data only had parcel numbers, not actual latitudes and longitudes to impose markers on buildings on the map. I utilized the [parcel map from 2022](https:&#x2F;&#x2F;data.boston.gov&#x2F;dataset&#x2F;parcels-2022&#x2F;resource&#x2F;023f4a54-9a73-492a-8489-3ae0f99dbf92) for Boston with its shapefiles (unfortunately 2023 is not available yet from ARCGis). I wanted to keep the map a bit lighter, so I used the [polylabel](https:&#x2F;&#x2F;www.npmjs.com&#x2F;package&#x2F;polylabel?activeTab&#x3D;code) library to find a “center” of a building that was within its boundaries, rather than centroid which could exist outside. I wrote a [loader script](https:&#x2F;&#x2F;github.com&#x2F;m-clare&#x2F;boston-map&#x2F;blob&#x2F;main&#x2F;docs&#x2F;data&#x2F;buildings%5Fdata.csv.js) that zipped the parcel lat&#x2F;long data together with the subset of fields I wanted from the buildings data set, and output the new dataset as a zip file. Also, don’t be like me and [read the docs](https:&#x2F;&#x2F;observablehq.com&#x2F;framework&#x2F;routing) that say that the loader file name needs to match the &#x60;FileAttachment&#x60; name you put into your components or Markdown doc.

## [](#the-markdown-file)The Markdown File

Within &#x60;index.md&#x60;, I ran afoul of some async commands and had to split my javascript across a few cells. I’d like to go back and figure out exactly what triggered the bad behavior, or if it’s more of a hot reloading symptom&#x2F;issue because of the map. The aforementioned issue with the loader file name did introduce some questions about what you’d do if your data loader needed to have multiple output files. As far as I could tell, you would need to have a single output zipped archive and then unpack each individual file with &#x60;${unzipped_object}.file(${filename}).csv()&#x60;. Because I had zipped the loader data as a csv to make it lighter than JSON or GeoJSON, I needed to handle transformation to GeoJSON client side and load it as a data source within my map.

&#x60;&#x60;&#x60;typescript
const geoBuildingData &#x3D; {
  type: &quot;FeatureCollection&quot;,
  name: &quot;geoBuildings&quot;,
  crs: { type: &quot;name&quot;, properties: { name: &quot;urn:ogc:def:crs:OGC:1.3:CRS84&quot; } },
  features: [],
};

const bldData &#x3D; await buildingData.file(&quot;buildings_data.csv&quot;).csv();

const buildingTypologies &#x3D; new Set(
  bldData.map((feature) &#x3D;&gt; feature.building_typology)
);

bldData.map((feature) &#x3D;&gt; {
  const { point: rawPoint, ...rest } &#x3D; feature;
  const point &#x3D; rawPoint.split(&quot;,&quot;).map((value) &#x3D;&gt; parseFloat(value));
  geoBuildingData.features.push({
    type: &quot;Feature&quot;,
    properties: { ...rest },
    geometry: { type: &quot;Point&quot;, coordinates: point },
  });
});

...

map.on(&quot;load&quot;, () &#x3D;&gt; {
  map.addSource(&quot;bld-data&quot;, {
    type: &quot;geojson&quot;,
    data: geoBuildingData,
  });
})

&#x60;&#x60;&#x60;

I also got _real_ sloppy with some CSS to try and recreate the look and feel of some of the [other](https:&#x2F;&#x2F;mclare.dev&#x2F;nyc-building-complaints&#x2F;) [maps](https:&#x2F;&#x2F;mclare.dev&#x2F;soft-stories&#x2F;) I’ve built. It was a bit painful to figure out what to target and how to override the styles. I know that when you create an Observable Framework project, you can select a style, but I do wish it was a bit easier to customize after that first step.

For this prototype I used project hosting with Observable because I wanted to see what the deploy process would look like. It was easy! The only hiccup I ran into was that I couldn’t figure out how to set access to the map as public once I had deployed (it defaulted to private), but it turns out a newer version of Observable Framework allows you to set the project up as public when you’re initially configuring the project from the CLI. The Observable team is also responsive, so I had an answer on the [forum](https:&#x2F;&#x2F;talk.observablehq.com&#x2F;t&#x2F;no-option-for-public-access-provided-upon-deploy&#x2F;8950&#x2F;2) less than two hours after I asked!

![Boston Building Inventory Map](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x0,shoHCbuIAQd2teR9a-0-QwxMEvnBAS0S2ua-NAkfJVNU&#x2F;https:&#x2F;&#x2F;mclare.blog&#x2F;static&#x2F;bldg-map-36c8b4852005f351fd1b98c221cd9b6c.gif)

[Boston Building Retrofits](https:&#x2F;&#x2F;m-clare.observablehq.cloud&#x2F;boston-building-retrofits&#x2F;)

[Github](https:&#x2F;&#x2F;github.com&#x2F;m-clare&#x2F;boston-map)

## [](#things-this-prototype-is-not)Things This Prototype is Not

* optimized for performance - in a world where I have an infinite amount of time for side projects, I’d build my loader to directly make map tiles based on the building data layer.
* the cleanest code - I could probably separate out all the map data into a component. Maybe I will do that later (I took a stab at it and had some issues with the Runtime library)
* optimized for mobile - I didn’t extend zoom levels far enough for the basemap (only to level 15) to be able to use fat fingers to select individual markers easily.
* bug-free - The heads up display seems to duplicate or come in the wrong order on some devices&#x2F;browsers so it becomes difficult to read the text (#worksonmymachine)

## [](#takeaways)Takeaways

I could definitely see myself moving away from [Gatsby](https:&#x2F;&#x2F;www.gatsbyjs.com&#x2F;) (which is what I currently use for this blog) and rewriting using Observable Framework. I’m currently working off of a custom fork of my [Gatsby theme](https:&#x2F;&#x2F;github.com&#x2F;alxshelepenok&#x2F;gatsby-starter-lumen) to support mdx specifically because I want to be able to load in React components and visualizations both from Observable notebooks, as well as local components. I break things a lot with Gatsby, and more often than not, I get some new whack-a-mole issue with GraphQL when I &#x60;gatsby develop&#x60; a new blog post after a few months. I think Observable Framework might make this easier for me to do, but I’d have to give some thought as to how to change over the existing work which utilizes React to manage some state for the interactive visuals (but even in some of those cases, I was using Observable’s cell takeout so it seems like that shouldn’t be too onerous).

The original plan for this project was to also include marker filters via a select input based on the building type (which is currently used to color code markers). However, I couldn’t figure out how to pass an event handler to the [Observable Input](https:&#x2F;&#x2F;observablehq.com&#x2F;framework&#x2F;inputs&#x2F;select) that would update the map. I know how to do this in React using &#x60;useRef&#x60; hooks for libraries that require manipulating the canvas (ThreeJs, Maplibre-GL-JS), but outside of working directly with [html inputs](https:&#x2F;&#x2F;developer.mozilla.org&#x2F;en-US&#x2F;docs&#x2F;Web&#x2F;HTML&#x2F;Element&#x2F;Input), I didn’t know how to accomplish this with Observable components (wrestling with styling raw HTML inputs is not how I want to spend my free time). I created a div in the markdown file and then used that as the container for the map, but I couldn’t access that reference in a different &#x60;js&#x60; cell. I also had to host my map font files elsewhere, rather than in the same location as the &#x60;pmtiles&#x60; file.

&#x60;&#x60;&#x60;maxima
const features &#x3D; display(document.createElement(&quot;div&quot;));
features.id &#x3D; &quot;features&quot;;
features.style &#x3D; &quot;z-index: 100&quot;;
const mapContainer &#x3D; display(document.getElementById(&quot;mapContainer&quot;));
mapContainer.appendChild(features);

const div &#x3D; display(document.getElementById(&quot;mapContainer&quot;));
const windowHeight &#x3D; window.innerHeight;
const windowWidth &#x3D; window.innerWidth;
div.style &#x3D; &#x60;position: relative; height: ${windowHeight - 50}px; width: 100%&#x60;;
const map &#x3D; new maplibregl.Map({
  container: div,
  zoom: 12,
  maxZoom: 14,
  minZoom: 10,
  maxBounds: [
    [-71.191247, 42.227911],
    [-70.648072, 42.450118],
  ],
  center: [-71.08936258403622, 42.3181973483706],
  style: {
    version: 8,
    sources: {
      openmaptiles: {
        type: &quot;vector&quot;,
        tiles: [&quot;pmtiles:&#x2F;&#x2F;&quot; + mapFile.source.getKey() + &quot;&#x2F;{z}&#x2F;{x}&#x2F;{y}&quot;],
      },
    },
    layers: mapStyle.layers,
    glyphs:
      &quot;https:&#x2F;&#x2F;m-clare.github.io&#x2F;map-glyphs&#x2F;fonts&#x2F;{fontstack}&#x2F;{range}.pbf&quot;,
  },
});
&#x60;&#x60;&#x60;

Outside of these issues, this was a pretty fun way to test some of the edges of Observable Framework. Next steps will be testing out self-hosting with Digital Ocean, trying to refactor the map into its own reuseable component, and (maybe) mucking around with inputs again.

## [](#acknowledgements)Acknowledgements

Thanks to Brandon Liu, the creator of [Protomaps](https:&#x2F;&#x2F;protomaps.com&#x2F;) for quickly troubleshooting the initial issues with loading &#x60;pmtiles&#x60;, and creating a [sample map example](https:&#x2F;&#x2F;bdon.github.io&#x2F;observable-framework-maps&#x2F;example-map#interaction%3A-maplibre-gl-js) which I used to develop this project.