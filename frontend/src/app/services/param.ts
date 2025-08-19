export type StandardParamStyle =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject'
  ;

export type ParamStyle = StandardParamStyle | string;
export type ParamLocation = 'query' | 'header' | 'path' | 'cookie';
export type StandardDataType =
  | "integer"
  | "number"
  | "boolean"
  | "string"
  | "object"
  | "array"
  ;


export type DataType = StandardDataType | string;

export type StandardDataFormat =
  | "int32"
  | "int64"
  | "float"
  | "double"
  | "byte"
  | "binary"
  | "date"
  | "date-time"
  | "password"
  ;

export type DataFormat = StandardDataFormat | string;

export interface Param {
  name: string;
  value: unknown;
  in: ParamLocation;
  style: ParamStyle,
  explode: boolean;
  dataType: DataType;
  dataFormat: DataFormat | undefined;
}
