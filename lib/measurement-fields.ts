import {
  PANTS_FIELDS,
  TOPS_FIELDS,
  type GarmentCategory,
  type MeasurementField,
  type ProductMeasurement
} from "@/lib/types";

export function visibleFields(category: GarmentCategory) {
  return category === "pants" ? PANTS_FIELDS : TOPS_FIELDS;
}

export function fieldLabel(field: MeasurementField) {
  switch (field) {
    case "body_length":
      return "着丈";
    case "body_width":
      return "身幅";
    case "shoulder_width":
      return "肩幅";
    case "sleeve_length":
      return "袖丈";
    case "waist":
      return "ウエスト";
    case "rise":
      return "股上";
    case "inseam":
      return "股下";
    case "thigh_width":
      return "わたり幅";
    case "hem_width":
      return "裾幅";
  }
}

export function readMeasurementField(measurement: ProductMeasurement, field: MeasurementField) {
  switch (field) {
    case "body_length":
      return measurement.bodyLength;
    case "body_width":
      return measurement.bodyWidth;
    case "shoulder_width":
      return measurement.shoulderWidth;
    case "sleeve_length":
      return measurement.sleeveLength;
    case "waist":
      return measurement.waist;
    case "rise":
      return measurement.rise;
    case "inseam":
      return measurement.inseam;
    case "thigh_width":
      return measurement.thighWidth;
    case "hem_width":
      return measurement.hemWidth;
  }
}

export function writeMeasurementField(
  measurement: ProductMeasurement,
  field: MeasurementField,
  value: number
) {
  switch (field) {
    case "body_length":
      measurement.bodyLength = value;
      break;
    case "body_width":
      measurement.bodyWidth = value;
      break;
    case "shoulder_width":
      measurement.shoulderWidth = value;
      break;
    case "sleeve_length":
      measurement.sleeveLength = value;
      break;
    case "waist":
      measurement.waist = value;
      break;
    case "rise":
      measurement.rise = value;
      break;
    case "inseam":
      measurement.inseam = value;
      break;
    case "thigh_width":
      measurement.thighWidth = value;
      break;
    case "hem_width":
      measurement.hemWidth = value;
      break;
  }
}
