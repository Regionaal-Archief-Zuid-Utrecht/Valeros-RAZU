export type ElasticRangeQuery = {
  range: {
    [fieldId: string]: {
      gte?: string | number;
      lte?: string | number;
    };
  };
};
