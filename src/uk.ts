import * as h3 from "h3-js";

const points = [
  [-2.162840525325123, 53.45226016422555],
  [-2.426998718883425, 53.58548905354107],
  [-2.04296575867437, 53.69289146791661],
  [-1.672192947253194, 53.55216910134911],
  [-1.8003205109404234, 53.30269811635088],
  [-2.2482401145890094, 53.222829742742164],
  [-0.17309299179356685, 51.50737598233357],
  [0.17947078511775771, 51.743086037683696],
  [-0.430830096707183, 51.839566580014434],
  [0.06424026989620302, 51.232234187137436],
  [-0.946036020074672, 51.42713073395129],
  [-4.589304092216764, 48.402395431570994],
  [-2.2742298494555087, 47.288600658338],
  [-2.7287889460130828, 47.60316070303912],
  [-4.251026387982336, 48.043211887435376],
  [-3.532192554622185, 47.96541061060739],
];

export const getHexes = (zoomLevel: number) => {
  const selection = points.map((point) =>
    h3.latLngToCell(point[1], point[0], zoomLevel)
  );

  return selection.map((polygon) => h3.cellToBoundary(polygon, true));
};
