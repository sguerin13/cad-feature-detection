# import dgl
import numpy as np
from app.occwl.graph import face_adjacency
from app.occwl.uvgrid import ugrid, uvgrid


def build_graph(
    solid, curv_num_u_samples=10, surf_num_u_samples=10, surf_num_v_samples=10
):
    # Build face adjacency graph with B-rep entities as node and edge features
    graph = face_adjacency(solid)

    # Compute the UV-grids for faces
    graph_face_feat = []
    for face_idx in graph.nodes:
        # Get the B-rep face
        face = graph.nodes[face_idx]["face"]
        # Compute UV-grids
        points = uvgrid(
            face, method="point", num_u=surf_num_u_samples, num_v=surf_num_v_samples
        )
        normals = uvgrid(
            face, method="normal", num_u=surf_num_u_samples, num_v=surf_num_v_samples
        )
        visibility_status = uvgrid(
            face,
            method="visibility_status",
            num_u=surf_num_u_samples,
            num_v=surf_num_v_samples,
        )
        mask = np.logical_or(
            visibility_status == 0, visibility_status == 2
        )  # 0: Inside, 1: Outside, 2: On boundary
        # Concatenate channel-wise to form face feature tensor
        face_feat = np.concatenate((points, normals, mask), axis=-1)
        graph_face_feat.append(face_feat)
    graph_face_feat = np.asarray(graph_face_feat)

    # Compute the U-grids for edges
    graph_edge_feat = []
    for edge_idx in graph.edges:
        # Get the B-rep edge
        edge = graph.edges[edge_idx]["edge"]
        # Ignore dgenerate edges, e.g. at apex of cone
        if not edge.has_curve():
            continue
        # Compute U-grids
        points = ugrid(edge, method="point", num_u=curv_num_u_samples)
        tangents = ugrid(edge, method="tangent", num_u=curv_num_u_samples)
        # Concatenate channel-wise to form edge feature tensor
        edge_feat = np.concatenate((points, tangents), axis=-1)
        graph_edge_feat.append(edge_feat)
    graph_edge_feat = np.asarray(graph_edge_feat)

    # Convert face-adj graph to DGL format
    edges = list(graph.edges)
    src = [e[0] for e in edges]
    dst = [e[1] for e in edges]

    n_nodes = len(graph.nodes)
    return dict(
        edges=edges,
        src=src,
        dst=dst,
        n_nodes=n_nodes,
        graph_face_feat=graph_face_feat,
        graph_edge_feat=graph_edge_feat,
    )

def pre_process_graph_for_json(graph):
    graph['graph_face_feat'] = graph['graph_face_feat'].tolist()
    graph['graph_edge_feat'] = graph['graph_edge_feat'].tolist()
    return graph