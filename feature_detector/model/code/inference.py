import json
import os
import torch, torch.functional as F
from models import Segmentation
import dgl
import util
import logging
import sys


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))


def model_fn(model_dir):
    model = Segmentation.load_from_checkpoint(os.path.join(model_dir,"best.ckpt"))
    return model.eval()

# def transform_fn(model, data, request_content_type, content_type):
#     '''
#     edges=edges,
#     src=src,
#     dst=dst,
#     n_nodes=n_nodes,
#     graph_face_feat=graph_face_feat,
#     graph_edge_feat=graph_edge_feat,
#     '''

#     assert request_content_type == "application/json"
#     # logging.DEBUG("TRYING THE DESERIALIZATION HERE")
#     data = json.loads(data)
#     feat_tensor = torch.Tensor(data['graph_face_feat'])
#     edge_tensor = torch.Tensor(data['graph_edge_feat'])
#     print(feat_tensor.shape)
#     print(edge_tensor.shape)
    
#     dgl_graph = dgl.graph((data['src'], data['dst']), num_nodes=data['n_nodes'])
#     dgl_graph.ndata["x"] = torch.Tensor(data['graph_face_feat'])
#     dgl_graph.edata["x"] = torch.Tensor(data['graph_edge_feat'])

#     # center and scale
#     dgl_graph.ndata["x"], center, scale = util.center_and_scale_uvgrid(
#         dgl_graph.ndata["x"], return_center_scale=True
#     )
#     dgl_graph.edata["x"][..., :3] -= center
#     dgl_graph.edata["x"][..., :3] *= scale
        
#     dgl_graph.ndata["x"] = dgl_graph.ndata["x"].permute(0, 3, 1, 2).type(torch.FloatTensor)
#     dgl_graph.edata["x"] = dgl_graph.edata["x"].permute(0, 2, 1).type(torch.FloatTensor)
    
#     logits =  model(dgl_graph)
#     assert content_type == "application/json"
#     predicts = logits.argmax(dim=1).cpu().numpy().tolist()
#     # return json.dumps({"res":predicts}).encode('utf-8')
#     # # logging.DEBUG("RESPONSE JSON",predicts)
#     res =  json.dumps([util.face_classification_to_label(p) for p in predicts]).encode('utf-8')
#     return res

def input_fn(request_body, request_content_type):
    '''
    edges=edges,
    src=src,
    dst=dst,
    n_nodes=n_nodes,
    graph_face_feat=graph_face_feat,
    graph_edge_feat=graph_edge_feat,
    '''
    
    assert request_content_type == "application/json"
    data = json.loads(request_body)
    
    dgl_graph = dgl.graph((data['src'], data['dst']), num_nodes=data['n_nodes'])
    dgl_graph.ndata["x"] = torch.Tensor(data['graph_face_feat'])
    dgl_graph.edata["x"] = torch.Tensor(data['graph_edge_feat'])

    # center and scale
    dgl_graph.ndata["x"], center, scale = util.center_and_scale_uvgrid(
        dgl_graph.ndata["x"], return_center_scale=True
    )
    dgl_graph.edata["x"][..., :3] -= center
    dgl_graph.edata["x"][..., :3] *= scale
        
    dgl_graph.ndata["x"] = dgl_graph.ndata["x"].permute(0, 3, 1, 2).type(torch.FloatTensor)
    dgl_graph.edata["x"] = dgl_graph.edata["x"].permute(0, 2, 1).type(torch.FloatTensor)
    return dgl_graph

def predict_fn(input_object, model):
    logits =  model(input_object)
    return logits

def output_fn(prediction, content_type):
    assert content_type == "application/json"
    predicts = prediction.argmax(dim=1).cpu().numpy().tolist()
    res =  json.dumps({"response":[util.face_classification_to_label(p) for p in predicts]}).encode('utf-8')
    return res