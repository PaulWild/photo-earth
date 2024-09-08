import Layer from "ol/layer/Layer.js";
import { data } from "./uk";
import { composeCssTransform } from "ol/transform.js";
import "./style.css";
import Stroke from "ol/style/Stroke";
import ol, { Image } from "ol";
import Map, { FrameState } from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon, { fromExtent } from "ol/geom/Polygon";
import { fromLonLat, toLonLat, transform, transformExtent } from "ol/proj";
import { Fill, Style } from "ol/style";
import ImageLayer from "ol/layer/Image";
import { ImageStatic, OSM } from "ol/source";
import { boundingExtent, getCenter } from "ol/extent";
import TileLayer from "ol/layer/Tile";
import Crop from "ol-ext/filter/Crop";

const map = new Map({
  target: "map",
  view: new View({
    center: fromLonLat([-2, 51]),
    zoom: 6,
  }),
  controls: [],
});

const raster = new TileLayer({
  source: new OSM(),
});
map.addLayer(raster);

for (let i = 1; i <= data.geometries.length; i++) {
  console.log("hello");
  const hex = data.geometries[i].coordinates[0];

  // Convert points to the map's projection
  const transformedPoints = hex.map((point) =>
    transform(point, "EPSG:4326", "EPSG:3857")
  );

  // Calculate the bounding extent
  const extent = boundingExtent(transformedPoints);

  // Get the width and height of the extent
  const width = extent[2] - extent[0];
  const height = extent[3] - extent[1];

  // Determine the maximum side length to make the bounding box a square
  const maxSide = Math.max(height, width);

  const center = getCenter(extent);

  // Calculate the new extent to make it a square
  const halfSide = maxSide / 2;
  const squareExtent = [
    center[0] - halfSide,
    center[1] - halfSide,
    center[0] + halfSide,
    center[1] + halfSide,
  ];

  const polygon = new Polygon([transformedPoints]);

  const feature = new Feature(polygon);
  feature.setStyle(
    new Style({
      stroke: new Stroke({
        color: "#ffffff",
        width: 1,
      }),
    })
  );

  const mask = new Crop({
    feature: feature, // The feature to be masked
    inner: false, // Whether to mask the inside or outside
  });

  // Create the image layer
  const imageLayer = new ImageLayer({
    source: new ImageStatic({
      url: `https://placedog.net/500/500?id=${i}`, // Replace with the path to your image
      imageExtent: squareExtent,
    }),
    opacity: 0.8,
  });

  imageLayer.addFilter(mask);
  map.addLayer(imageLayer);
}
