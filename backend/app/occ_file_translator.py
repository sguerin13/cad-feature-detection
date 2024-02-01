import copy
import json
import os
import sys
import uuid
from tempfile import NamedTemporaryFile

from fastapi import HTTPException, UploadFile
from OCC.Core.Tesselator import ShapeTesselator
from OCC.Core.TopoDS import TopoDS_Shape
from OCC.Extend.DataExchange import read_step_file
from OCC.Extend.TopologyUtils import TopologyExplorer


def read_file_to_shape(file: UploadFile):
    # read upload file to a virtual filepath to be read by pythonOCC
    temp = NamedTemporaryFile(delete=False)
    shape = None
    try:
        try:
            contents = file.file.read()
            with temp as f:
                f.write(contents)
        except Exception:
            raise HTTPException(status_code=500, detail="Error on uploading the file")
        finally:
            file.file.close()

        shape = copy.deepcopy(read_step_file(temp.name))

    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")
    finally:
        os.remove(temp.name)  # Delete temp file
        return shape


def convert_shape(
    shape: TopoDS_Shape,
    export_edges=False,
    mesh_quality=1.0,
):
    
    face_list = []
    t = TopologyExplorer(shape)
    for face in list(t.faces()):
        shape_uuid = uuid.uuid4().hex
        tess = ShapeTesselator(face)
        tess.Compute(compute_edges=export_edges, mesh_quality=mesh_quality, parallel=True)
        shape_content = tess.ExportShapeToThreejsJSONString(shape_uuid)
        face_list.append(shape_content)

    return [json.loads(f) for f in face_list]
