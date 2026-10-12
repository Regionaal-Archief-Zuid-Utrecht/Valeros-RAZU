import { ElasticFieldExistsQuery } from './elastic-field-exists-query.type';
import { ElasticMatchAllQuery } from './elastic-match-all-query.type';
import { ElasticMatchQueries } from './elastic-match-queries.type';
import { ElasticQuery } from './elastic-query.type';
import { ElasticSimpleQueryString } from './elastic-simple-query-string.type';

export type ElasticShouldQueries = {
  bool: {
    should: (
      | ElasticMatchQueries
      | ElasticFieldExistsQuery
      | ElasticQuery
      | ElasticSimpleQueryString
      | ElasticShouldQueries
      | ElasticMatchAllQuery
    )[];
  };
};
