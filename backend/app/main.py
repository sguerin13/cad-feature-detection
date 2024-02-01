import json
import os
from dotenv import load_dotenv
load_dotenv()

import boto3
from app.build_graph import build_graph, pre_process_graph_for_json
from app.occ_file_translator import convert_shape, read_file_to_shape
from app.occwl.shape import Shape
from app.occwl.solid import Solid
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def process_step(file: UploadFile):
    try:
        occ_shape = read_file_to_shape(file)
        graph_dict = build_graph(Solid(occ_shape))
        graph_dict = pre_process_graph_for_json(graph_dict)

        endpoint = os.environ["ENDPOINT_NAME"]
        runtime = boto3.client("runtime.sagemaker")
        response = runtime.invoke_endpoint(
            EndpointName=endpoint, ContentType="application/json", Body=json.dumps(graph_dict).encode("utf-8")
        )
        faces = json.loads(response['Body'].read().decode())

        threejs_json = convert_shape(occ_shape)
        return {"three": threejs_json, "faces": faces}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Waking Up"}


handler = Mangum(app, lifespan="off")
