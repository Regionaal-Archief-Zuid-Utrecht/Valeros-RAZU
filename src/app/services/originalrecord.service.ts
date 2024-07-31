import { Injectable, EventEmitter } from '@angular/core';
import { SearchService } from './search/search.service';
import { NodeModel } from '../models/node.model';
import { BehaviorSubject, Cons } from 'rxjs';
import { NodeService } from './node.service';
import { FetchJsonService } from './fetchjson.service';
import { SparqlService } from './sparql.service';
import { translate } from '@jsverse/transloco';

type ChildrenDict = { [key: string]: ChildrenDict[] };
type RepresentationDict = { id: string; label: string; url: string[] };
interface SubConstructorDict {
  id: string;
  label: string;
  children?: SubConstructorDict[];
  representations?: RepresentationDict[];
}

type ConstructDict = {
  [id: string]: {
    label: string;
    children?: SubConstructorDict[];
    representations?: RepresentationDict[];
  };
};

@Injectable({
  providedIn: 'root',
})
export class OriginalRecordService {
  private _showingForNodeId: BehaviorSubject<string | undefined> =
    new BehaviorSubject<string | undefined>(undefined);
  dataGenerated = new EventEmitter<any>();
  setMessage = new EventEmitter<any>();
  lastShownNodeId: string | undefined = undefined;
  showingForNodeId = this._showingForNodeId.asObservable();
  shown = false;
  available = false;
  url = '';

  constructor(
    private search: SearchService,
    private nodes: NodeService,
    private fetchjson: FetchJsonService,
    private sparql: SparqlService,
  ) {}

  show(node: NodeModel) {
    const nodeId = this.nodes.getId(node);
    this.checkAvailability(nodeId);
    if (this.available) {
      this.shown = true;
    } else {
      this.stopShowing();
    }
  }

  stopShowing() {
    this.shown = false;
  }

  // MAIN functions
  checkAvailability(nodeId: string) {
    this.fetchjson.fetchJson(nodeId, 'mdto').subscribe((result) => {
      if (!result) {
        this.available = false;
      }
      if (typeof result === 'string') {
        this.available = true;
        this.url = result;
      }
    });
  }

  getOriginal(nodeId: string) {
    //this.fetchjson.downloadFile(nodeId, 'mdto');
    const message = translate('DOWNLOADABLES_GATHERING_OVERVIEW');
    this.setMessage.emit(message);
    this.getDownloadables(nodeId).then((result) => {
      this.dataGenerated.emit(result);
      this.setMessage.emit(null);
    });
  }

  async getDownloadables(nodeId: string): Promise<ConstructDict> {
    //Promise<ChildDict>
    const listOfChildren = await this.fetchChildren(nodeId);

    // Fetch representations and files
    const listOfRepresentations = await this.fetchRepresentations(
      nodeId,
      listOfChildren,
    );

    // Collect all IRIs from listOfChildren
    const allIRIsSet: Set<string> = new Set();
    this.fetchIRIList(listOfChildren, allIRIsSet);

    // Collect nested IRIs from listOfRepresentations, avoiding top-level
    for (const key in listOfRepresentations) {
      if (listOfRepresentations.hasOwnProperty(key)) {
        const nestedIRIs = Object.keys(listOfRepresentations[key]);
        nestedIRIs.forEach((nestedKey) => allIRIsSet.add(nestedKey));
      }
    }

    // Include the nodeId itself
    allIRIsSet.add(nodeId);

    // Convert Set to Array
    const listOfAllIRIs: string[] = Array.from(allIRIsSet);

    const labels = await this.sparql.getLabels(listOfAllIRIs);
    const labelDict = labels.reduce(
      (acc, label) => {
        acc[label['@id']] = label.label;
        return acc;
      },
      {} as { [key: string]: string },
    );
    const collection = this.buildMainConstruct(
      nodeId,
      listOfChildren,
      listOfRepresentations,
      labelDict,
    );

    return collection;
  }
  //FETCHERS
  async fetchRepresentationsAndFiles(
    child: string,
  ): Promise<{ [key: string]: { url: string }[] }> {
    const representations: { [key: string]: { url: string }[] } = {};

    const representationIds = await this.getRepresentations(child);
    for (const representation of representationIds) {
      const fileURLs = await this.getFilesOfRepresentations(representation);
      representations[representation] = fileURLs.map((url) => ({ url }));
    }
    return representations;
  }

  async fetchChildren(nodeId: string): Promise<ChildrenDict> {
    const result: ChildrenDict = {}; // Initialize result as an empty object
    const children = await this.getChildren(nodeId); // Await the result

    // Use for...of to iterate over the array of children
    if (children.length >= 1) {
      for (const child of children) {
        const grandchildren = await this.fetchChildren(child);

        // Check if grandchildren is not empty and child itself is not an empty string
        if (Object.keys(grandchildren).length > 0) {
          result[child] = [grandchildren]; // Initialize array with the fetched grandchildren
        } else {
          // Optionally include the child only if you need to show nodes with no children
          result[child] = [];
        }
      }
    }

    return result;
  }
  async fetchRepresentations(
    nodeId: string,
    listOfChildren: ChildrenDict,
  ): Promise<{ [id: string]: { [key: string]: string[] } }> {
    const finalList: { [id: string]: { [key: string]: string[] } } = {};

    // Collect all IDs from listOfChildren and nodeId
    const ids = Object.keys(listOfChildren);
    ids.push(nodeId);

    // Fetch representations and files for each ID
    const fetchPromises = ids.map(async (id) => {
      // Fetch representations and files
      const result = await this.fetchRepresentationsAndFiles(id);

      // Map the result to retain the hierarchy
      finalList[id] = {};
      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          const urlArray = result[key];
          finalList[id][key] = urlArray.map((item) => item.url);
        }
      }
    });

    // Wait for all fetch operations to complete
    await Promise.all(fetchPromises);

    return finalList;
  }
  fetchIRIList(dict: any, iris: Set<string>): void {
    for (const key in dict) {
      if (dict.hasOwnProperty(key)) {
        iris.add(key); // Use Set to avoid duplicates

        // If the value is an object, check for children or representations
        if (typeof dict[key] === 'object') {
          // Check if it has children
          if (Array.isArray(dict[key].children)) {
            dict[key].children.forEach((child: any) =>
              this.fetchIRIList(child, iris),
            );
          }

          // Check if it has representations
          if (dict[key].representations) {
            // Only add nested IRIs from representations
            for (const repKey in dict[key].representations) {
              if (dict[key].representations.hasOwnProperty(repKey)) {
                // Add nested IRIs to iris
                Object.keys(dict[key].representations[repKey]).forEach(
                  (nestedKey) => iris.add(nestedKey),
                );
              }
            }
          }
        }
      }
    }
  }

  // SPARQL-calls
  async getChildren(nodeId: string): Promise<string[]> {
    return await this.sparql.getObjIds(nodeId, [
      'http://www.nationaalarchief.nl/mdto#bevatOnderdeel',
      'http://www.nationaalarchief.nl/mdto#identificatie',
      'http://www.nationaalarchief.nl/mdto#identificatieKenmerk',
    ]);
  }
  async getRepresentations(nodeId: string): Promise<string[]> {
    const representations = await this.sparql.getObjIds(nodeId, [
      'http://www.nationaalarchief.nl/mdto#heeftRepresentatie',
      'http://www.nationaalarchief.nl/mdto#identificatie',
      'http://www.nationaalarchief.nl/mdto#identificatieKenmerk',
    ]);
    return representations;
  }

  async getFilesOfRepresentations(nodeId: string): Promise<string[]> {
    const fileURLs = await this.sparql.getObjIds(nodeId, [
      'http://www.nationaalarchief.nl/mdto#URLBestand',
    ]);
    return fileURLs;
  }
  // BUILDERS
  buildRepresentationDicts = (
    obj: { [key: string]: { [key: string]: string[] } },
    labelDict: { [key: string]: string },
  ): { [key: string]: RepresentationDict[] } => {
    const representations: { [key: string]: RepresentationDict[] } = {};

    for (const key in obj) {
      representations[key] = Object.keys(obj[key]).map((childKey) => ({
        id: childKey,
        label: labelDict[childKey] || '',
        url: obj[key][childKey],
      }));
    }

    return representations;
  };

  // Function to build SubConstructorDict
  buildConstructDict = (
    nodeId: string,
    listOfChildren: ChildrenDict,
    labelDict: { [key: string]: string },
    representationDicts: { [key: string]: RepresentationDict[] },
  ): SubConstructorDict => {
    // Create the SubConstructorDict object for the current nodeId
    const subConstruct: SubConstructorDict = {
      id: nodeId,
      label: labelDict[nodeId] || '',
      children: [],
      representations: representationDicts[nodeId] || [],
    };

    // Check if there are children for this nodeId in the listOfChildren
    const childrenList = listOfChildren[nodeId];
    if (childrenList && Object.keys(childrenList).length > 0) {
      subConstruct.children = Object.keys(childrenList).map((childKey) =>
        this.buildConstructDict(
          childKey,
          listOfChildren,
          labelDict,
          representationDicts,
        ),
      );
    }

    return subConstruct;
  };

  // Main function to build the ConstructDict
  buildMainConstruct = (
    nodeId: string,
    listOfChildren: ChildrenDict,
    replist: { [key: string]: { [key: string]: string[] } },
    labelDict: { [key: string]: string },
  ): ConstructDict => {
    // Create the representation dictionaries
    const representationDicts = this.buildRepresentationDicts(
      replist,
      labelDict,
    );

    const mainConstruct: ConstructDict = {
      [nodeId]: {
        label: labelDict[nodeId] || '',
        children: Object.keys(listOfChildren).map((childId) =>
          this.buildConstructDict(
            childId,
            listOfChildren,
            labelDict,
            representationDicts,
          ),
        ),
        representations: representationDicts[nodeId] || [],
      },
    };

    return mainConstruct;
  };
}
