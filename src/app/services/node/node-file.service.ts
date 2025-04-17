import { Injectable } from '@angular/core';
import { NodeModel } from '../../models/node.model';
import { NodeService } from './node.service';
import { Settings } from '../../config/settings';

@Injectable({
  providedIn: 'root',
})
export class NodeFileService {
  constructor(private nodes: NodeService) {}

  getFiles(node: NodeModel | undefined): string[] {
    if (!node) {
      return [];
    }

    return this.nodes.getObjValues(
      node,
      Settings.predicates.files,
      undefined,
      true,
    );
  }
}
