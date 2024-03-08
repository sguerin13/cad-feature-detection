# CAD Feature Detection

A minimal app that converts STEP files to Three.js via pythonOCC and detects the manufacturing features with [UV-Net](https://github.com/AutodeskAILab/UV-Net). The model was trained on the [MFCAD](https://github.com/hducg/MFCAD) dataset, so the classification is a bit wonky. But it relays the concept.

This project also makes use of the [occwl](https://github.com/AutodeskAILab/occwl) wrapper around PythonOCC to handle the mapping from BREP to graph representation.

A live demo can be found [here](https://feature-detector.steveguerin.com)

### Tech Stack Info:

- Frontend
    - React
    - TypeScript
    - React-Three-Fiber
    - Tailwind CSS

- Backend
    - Python
    - FastAPI
    - PythonOCC
    - PyTorch

- Infra
    - CDK
    - Lambda
    - SageMaker
    - Docker

## How to use

### Frontend

- Run the frontend locally: `cd frontend && npm run start`
- Create a production build: `cd frontend && npm run build`
- Config:

    - Create an .env file in the frontend folder with the following fields:

        ```
        #to set the paths properly the assets folder
        PUBLIC_URL="https://yoururl.com or localhost:3000"

        # URL for your backend
        REACT_APP_API_URL="https://api.yoururl.com or localhost:8080"
        ```

### Backend

- Run the backend locally: `cd backend && uvicorn app.main:app --reload`

- Config:

    - Create an .env in the `backend/app` folder with the following fields:

        ```
        ENDPOINT_NAME="name-of-sagemaker-endpoint"
        ```

### SageMaker

- A trained UVNet model is included in the repo. To deploy the model to sagemaker, install the `requirements.txt` file in the feature_detector folder and then run the notebook. You must also create an .env file in the feature_detector folder with the following fields populated:

    ```
    SAGEMAKER_EXECUTION_ROLE="sagemaker execution role"
    SAGEMAKER_S3_BUCKET="sagemaker s3 bucket to store model.tar.gz file"
    ```


### Infra

- Create an .env file in the infra folder for CDK:

    ```
    DOMAIN="yourdomain.com"
    APP_NAME="NameForYourAppInCDK"
    API_SUBDOMAIN="sub.domain.for.api"
    FE_SUBDOMAIN="fe.subdomain"
    FE_BUCKET_NAME="name-for-s3-bucket-for-fe"
    ```
