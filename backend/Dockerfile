# Grab the AWS Lambda Image
FROM public.ecr.aws/lambda/python:3.9

# make sure image is up to date
RUN yum update -y

# needed for the libraries in test-env.yml
RUN yum install -y libglvnd-glx

RUN yum install -y wget

RUN yum clean all

# grab miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -o miniconda.sh && sh Miniconda3-latest-Linux-x86_64.sh -b -p /opt/miniconda

# copy over the environment.yml file
# This is a variable that is exposed to the docker file when building
COPY cad-feature-detector-backend.yml ${LAMBDA_TASK_ROOT}

# if not using the --no-build flag when creating it, run the follwing line to get rid of the windows packages
# `conda env export --no-builds | grep -v "^prefix: " > environment.yaml`
# RUN sed -i -r '/m2w64|vs2015|msys2|win|vc/d' /tmp/environment.yml

# create the conda environment - here the --prefix flag tells you where to place the environment
RUN /opt/miniconda/bin/conda env create --file cad-feature-detector-backend.yml --prefix /opt/conda-env

# install the python lambda runtime interface client
RUN /opt/conda-env/bin/pip install awslambdaric

# this moves the python3.9 binary out of the way and replaces it with a symlink to the conda environment python
RUN mv /var/lang/bin/python3.9 /var/lang/bin/python3.9-clean && ln -sf /opt/conda-env/bin/python /var/lang/bin/python3.9

# # set the path to the conda environment and the dependencies
# TODO: see if needed for path to depencies
# ENV PYTHONPATH "/var/lang/lib/python3.8/site-packages:/opt/my-code"
# ENV PYTHONPATH="${LAMBDA_TASK_ROOT}:${PYTHONPATH}"

# copy over the code
COPY ./app ${LAMBDA_TASK_ROOT}/app

CMD ["app.main.handler"]
