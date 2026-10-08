export type ElasticFullTextMatchQuery = {
  match: {
    full_text: {
      query: string;
    };
  };
};
