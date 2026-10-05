#!/usr/bin/env python3
"""Combine all *.meta.json files into a single Turtle file.

Blank nodes from different source files are kept distinct by renaming their
labels, because rdflib would otherwise merge _:b1 from file A with _:b1 from
file B when loading them into the same graph.
"""
from pathlib import Path
from rdflib import BNode, Graph, URIRef, Literal
from rdflib.namespace import NamespaceManager

SOURCE_DIR = Path("demo/s3/k50907905")
TARGET = Path("demo/rdf/nl-wbdrazu-k50907905-689.ttl")


def rename_blank_nodes(source_graph: Graph, prefix: str) -> Graph:
    """Return a graph where every blank node gets a file-scoped label."""
    out = Graph()
    namespace_manager = NamespaceManager(Graph())
    for prefix_str, uri in source_graph.namespace_manager.namespaces():
        namespace_manager.bind(prefix_str, uri)
    out.namespace_manager = namespace_manager

    mapping: dict[str, BNode] = {}

    def map_node(node):
        if isinstance(node, BNode):
            original = str(node)
            if original not in mapping:
                mapping[original] = BNode(f"{prefix}_{original}")
            return mapping[original]
        return node

    for s, p, o in source_graph:
        out.add((map_node(s), p, map_node(o)))
    return out


def main() -> None:
    combined = Graph()
    files = sorted(SOURCE_DIR.rglob("*.meta.json"))
    print(f"Found {len(files)} metadata files under {SOURCE_DIR}")

    for idx, file_path in enumerate(files, start=1):
        source = Graph()
        source.parse(file_path, format="json-ld")
        prefix = f"f{idx:03d}"
        scoped = rename_blank_nodes(source, prefix)
        for s, p, o in scoped:
            combined.add((s, p, o))
        # Copy namespace bindings from the scoped graph into the combined graph.
        for prefix_str, uri in scoped.namespace_manager.namespaces():
            combined.bind(prefix_str, uri)
        print(f"  {file_path.name}: {len(source)} triples")

    combined.serialize(destination=TARGET, format="turtle")
    print(f"\nWrote {len(combined)} triples to {TARGET}")


if __name__ == "__main__":
    main()
