import React, { useRef } from "react";
import { BufferGeometry } from "three";
import Button from "./Buttons";
import ClassLegend from "./ClassLegend";
import Viewer, { FaceClass } from "./Viewer";
import classNames from "classnames";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-w-screen bg-pageBackground">
      {children}
    </div>
  );
}

export function IntroPage(props: {
  showColdStartMessage: boolean;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDemoUpload: (file: File) => void;
}) {
  const { handleUpload, handleDemoUpload, showColdStartMessage } = props;

  const ref = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    ref.current?.click();
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="min-w-1/2 max-w-[1000px] ml-10 p-10">
        <div className="text-6xl pt-20 text-[#276299] font-medium uppercase">
          CAD File
        </div>
        <div className="text-6xl pt-6 text-[#276299] font-medium uppercase">
          Feature Detector
        </div>
        <div className="text-3xl pt-6 text-[#283942] font-light leading-relaxed">
          A minimal app that converts STEP files to Three.js via pythonOCC and
          detects the manufacturing features with{" "}
          <a
            href="https://arxiv.org/abs/2006.10211"
            className="text-[#276299] hover:text-[#276299]/50"
          >
            UV-Net
          </a>
          . The model was trained on the{" "}
          <a
            href="https://github.com/hducg/MFCAD"
            className="text-[#276299] hover:text-[#276299]/50"
          >
            MFCAD
          </a>{" "}
          dataset, so the classification is a bit wonky. But it relays the
          concept.
        </div>
        <div className="text-2xl pt-4 text-[#283942] font-light leading-relaxed">
          Stack Info:
        </div>
        <div className="pl-12">
          <div className="text-[#283942] grid grid-cols-3 max-w-[600px] justify-center gap-x-10 pt-3">
            <div className="flex justify-center">
              <div className="w-40 flex flex-col items-center">
                <div className="font-light text-center border-b border-[#283942] w-full">
                  Frontend
                </div>
                <ul className="pt-2 font-light list-disc pl-4 w-full">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>React-Three-Fiber</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-40 flex flex-col items-center">
                <div className="font-light text-center border-b border-[#283942] w-full">
                  Backend
                </div>
                <ul className="pt-2 font-light list-disc pl-4 w-full">
                  <li>Python</li>
                  <li>FastAPI</li>
                  <li>PythonOCC</li>
                  <li>PyTorch</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-40 flex flex-col items-center">
                <div className="font-light text-center border-b border-[#283942] w-full">
                  Infra
                </div>
                <ul className="pt-2 font-light list-disc pl-4 w-full">
                  <li>CDK</li>
                  <li>Lambda</li>
                  <li>SageMaker</li>
                  <li>Docker</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"w-1/2 flex items-center justify-center"}>
        <div className="flex flex-col items-center">
          <Button disabled={showColdStartMessage} onClick={handleButtonClick}>
            <div>Upload STEP File</div>
            <input
              ref={ref}
              className="hidden h-0 w-0"
              id="input"
              name="input"
              accept="application/step"
              onChange={handleUpload}
              type="file"
            />
          </Button>
          <div className="relative">
            <button
              className={classNames(
                "pt-4",
                showColdStartMessage
                  ? "pointer-events-none text-slate-400"
                  : "text-[#283942] hover:text-[#276299]"
              )}
              onClick={async () => {
                // Grab the demo file in the public folder and upload
                const fileResponse = await fetch(
                  `${process.env.PUBLIC_URL}/${"TITAN-1M.step"}`
                );
                const blob = await fileResponse.blob();
                const file = new File([blob], "TITAN-1M.step");
                handleDemoUpload(file);
              }}
            >
              Or use a demo file
            </button>
            {showColdStartMessage && (
              <div className="pt-4 w-[240px] text-[#283942] absolute -left-12">
                The lambda is cold starting, give it a few seconds to wake up...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ViewerPage(props: {
  showColorButton: () => React.ReactNode;
  handleClearFile: () => void;
  setShowColor: (showColor: boolean) => void;
  showColor: boolean;
  faceClassSelected: FaceClass | undefined;
  setFaceClassSelected: (faceClass: FaceClass | undefined) => void;
  geometry: BufferGeometry[] | undefined;
  faceClasses: FaceClass[] | undefined;
}) {
  const {
    showColorButton,
    handleClearFile,
    setShowColor,
    showColor,
    faceClassSelected,
    setFaceClassSelected,
    geometry,
    faceClasses,
  } = props;

  return (
    <div className="h-screen w-screen relative">
      <>
        <div className="absolute top-20 left-20 z-50">
          <div className=" flex gap-x-10">
            {showColorButton()}
            <Button
              height="60px"
              width="180px"
              onClick={() => {
                handleClearFile();
                setShowColor(false);
              }}
            >
              Back To Home
            </Button>
          </div>
          {showColor && (
            <div className="pt-10">
              <ClassLegend faceClassSelected={faceClassSelected} />
            </div>
          )}
        </div>
        <Viewer
          setFaceClassSelected={setFaceClassSelected}
          geo={geometry}
          faceClasses={faceClasses}
          showColor={showColor}
        />
      </>
    </div>
  );
}
