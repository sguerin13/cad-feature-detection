import io
import json
import os
import pickle
import shutil
import tarfile

import boto3
import botocore
from botocore.response import StreamingBody
import numpy as np
import sagemaker
from sagemaker.deserializers import SimpleBaseDeserializer

from inference import model_fn, transform_fn
class DebugDeserializer(SimpleBaseDeserializer):
    """Deserialize JSON data from an inference endpoint into a Python object."""

    def __init__(self, accept="application/json"):
        """Initialize a ``JSONDeserializer`` instance.

        Args:
            accept (union[str, tuple[str]]): The MIME type (or tuple of allowable MIME types) that
                is expected from the inference endpoint (default: "application/json").
        """
        super(DebugDeserializer, self).__init__(accept=accept)

    def deserialize(self, stream, content_type):
        """Deserialize JSON data from an inference endpoint into a Python object.

        Args:
            stream (botocore.response.StreamingBody): Data to be deserialized.
            content_type (str): The MIME type of the data.

        Returns:
            object: The JSON-formatted data deserialized into a Python object.
        """
        response_string = stream.read().decode("utf-8")
        return json.loads(response_string)

def fetch_model(model_data):
    """Untar the model.tar.gz object either from local file system
    or a S3 location

    Args:
        model_data (str): either a path to local file system starts with
        file:/// that points to the `model.tar.gz` file or an S3 link
        starts with s3:// that points to the `model.tar.gz` file

    Returns:
        model_dir (str): the directory that contains the uncompress model
        checkpoint files
    """

    model_dir = "/tmp/model"
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    if model_data.startswith("file"):
        shutil.copy2(
            os.path.join(model_dir, "model.tar.gz"), os.path.join(model_dir, "model.tar.gz")
        )
    elif model_data.startswith("s3"):
        # get bucket name and object key
        bucket_name = model_data.split("/")[2]
        key = "/".join(model_data.split("/")[3:])

        s3 = boto3.resource("s3")
        try:
            s3.Bucket(bucket_name).download_file(key, os.path.join(model_dir, "model.tar.gz"))
        except botocore.exceptions.ClientError as e:
            if e.response["Error"]["Code"] == "404":
                print("the object does not exist.")
            else:
                raise

    # untar the model
    tar = tarfile.open(os.path.join(model_dir, "model.tar.gz"))
    tar.extractall(model_dir)
    tar.close()

    return model_dir


def test(model_data):
    # decompress the model.tar.gz file
    model_dir = fetch_model(model_data)

    # load the model
    net = model_fn(model_dir)

    # simulate some input data to test transform_fn
    with open('code/demo_input.pkl', 'rb') as f:
        data = pickle.load(f)


    # encode numpy array to binary stream
    serializer = sagemaker.serializers.JSONSerializer()
    deserializer = DebugDeserializer()

    data = {
        'src': data['src'],
        'dst':  data['dst'],
        'n_nodes':  data['n_nodes'],
        'graph_face_feat':  data['graph_face_feat'].tolist(),
        'graph_edge_feat': data['graph_edge_feat'].tolist(),
    }
    jstr = serializer.serialize(data)
    jstr = json.dumps(data)

    # "send" the bin_stream to the endpoint for inference
    # inference container calls transform_fn to make an inference
    # and get the response body for the caller

    content_type = "application/json"
    # input_object = input_fn(jstr, content_type)
    # predictions = predict_fn(input_object, net)
    # res = output_fn(predictions, content_type)
    res = transform_fn(net, jstr, content_type, content_type)

    # Convert the string to bytes
    # bytes_data = res.encode('utf-8')

    # Create a BytesIO object from the bytes data
    stream = io.BytesIO(res)

    # Create a StreamingBody object
    streaming_body = StreamingBody(stream, len(res))
    response = deserializer.deserialize(streaming_body, content_type)
    return response

if __name__ == "__main__":
    model_data = "s3://sagemaker-us-east-1-774241761077/uv_net.tar.gz"
    response = test(model_data)
    print(type(response))