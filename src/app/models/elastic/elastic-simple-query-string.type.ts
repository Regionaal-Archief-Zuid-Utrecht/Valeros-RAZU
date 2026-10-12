export type ElasticSimpleQueryString = {
  simple_query_string: {
    query: string;
    fields?: string[];
  };
};
