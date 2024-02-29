import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { BufferGeometry, BufferGeometryLoader } from "three";
import { FaceClass } from "../Components/Viewer";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 20000,
});

export type ResponseType = {
  geometry: BufferGeometry[];
  faceClasses: FaceClass[];
};

export function useInputForm() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [cadFile, setCadFile] = useState<ResponseType | undefined>(undefined);
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !["stp", "step"].includes(file.name.split(".").pop()?.toLowerCase() ?? "")){
      alert(`File must be a .step file, file extension provided is ${file.name.split(".").pop()?.toLowerCase()}`);
      return;
    }
    setFile(file);
    uploadFile(file, setFile, setCadFile);
  };

  const handleDemoUpload = (file: File) => {
    setFile(file);
    uploadFile(file, setFile, setCadFile);
  };

  const handleClearFile = () => {
    setFile(undefined);
    setCadFile(undefined);
  }

  return { file, cadFile, handleUpload, handleClearFile, handleDemoUpload };
}

export const uploadFile = (
  uploadedFile: File | undefined,
  setFile: (file: File | undefined) => void,
  setReturnedFile: (file: ResponseType) => void
) => {
  const loader = new BufferGeometryLoader();
  API({
    method: "post",
    url: "/upload",
    data: { name: "CAD.step", file: uploadedFile },
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "json",
  })
    .then((response: AxiosResponse<{ three: JSON[]; faces: FaceClass[] }>) => {
      setReturnedFile({
        geometry: (response.data.three).map((t) => loader.parse(t)),
        faceClasses: response.data.faces,
      });
    })
    .catch((error: any) => {
      console.log(error.message);
      setFile(undefined);
    });
};

export const wakeUpLambda = () =>
  API({
    method: "get",
    url: "/",
    responseType: "json",
  });