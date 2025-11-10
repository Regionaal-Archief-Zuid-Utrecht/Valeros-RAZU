import { Injectable } from '@angular/core';
import { ElasticShouldQueries } from '../../../models/elastic/elastic-should-queries.type';

@Injectable({
  providedIn: 'root',
})
export abstract class CustomFilterService {
  abstract getElasticQueries(): ElasticShouldQueries[];
}
