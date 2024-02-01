import torch
def center_and_scale_uvgrid(inp: torch.Tensor, return_center_scale=False):
    bbox = bounding_box_uvgrid(inp)
    diag = bbox[1] - bbox[0]
    scale = 2.0 / max(diag[0], diag[1], diag[2])
    center = 0.5 * (bbox[0] + bbox[1])
    inp[..., :3] -= center
    inp[..., :3] *= scale
    if return_center_scale:
        return inp, center, scale
    return inp

def bounding_box_uvgrid(inp: torch.Tensor):
    pts = inp[..., :3].reshape((-1, 3))
    mask = inp[..., 6].reshape(-1)
    point_indices_inside_faces = mask == 1
    pts = pts[point_indices_inside_faces, :]
    return bounding_box_pointcloud(pts)

def bounding_box_pointcloud(pts: torch.Tensor):
    x = pts[:, 0]
    y = pts[:, 1]
    z = pts[:, 2]
    box = [[x.min(), y.min(), z.min()], [x.max(), y.max(), z.max()]]
    return torch.tensor(box)

def face_classification_to_label(index):
    face_map = {
        "15": "stock",
        "0": "rectangular_through_slot",
        "14": "chamfer",
        "12": "triangular_pocket",
        "4": "6sides_passage",
        "7": "slanted_through_step",
        "1": "triangular_through_slot",
        "10": "rectangular_blind_slot",
        "9": "triangular_blind_step",
        "8": "rectangular_blind_step",
        "2": "rectangular_passage",
        "6": "2sides_through_step",
        "13": "6sides_pocket",
        "3": "triangular_passage",
        "11": "rectangular_pocket",
        "5": "rectangular_through_step"
    }
    return face_map[str(index)]