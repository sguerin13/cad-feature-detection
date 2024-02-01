import { useEffect } from "react";
import Page, { IntroPage, ViewerPage } from "./Components/Page";
import { useShowColorButton } from "./Components/ShowColorButton";
import { useInputForm, wakeUpLambda } from "./hooks/upload";
import { ErrorBoundary } from "react-error-boundary";
import MediaQuery from "react-responsive";

function App() {
  const { file, cadFile, handleUpload, handleClearFile } = useInputForm();
  const {
    showColorButton,
    showColor,
    setShowColor,
    faceClassSelected,
    setFaceClassSelected,
  } = useShowColorButton();

  useEffect(() => {
    wakeUpLambda();
  }, []);

  return (
    <Page>
      <MediaQuery maxWidth={1024}>
        <div className="flex flex-col min-h-screen justify-center items-center">
          <div>
            <div className="text-center text-2xl font-bold">
              This app is not optimized for mobile
            </div>
            <div className="text-center text-2xl font-bold">
              Please use a desktop browser
            </div>
          </div>
        </div>
      </MediaQuery>
      <MediaQuery minWidth={1025}>
        <ErrorBoundary
          fallback={
            <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
              <div>Looks Like Something Went Wrong</div>
              <div>
                <a href="/" className="text-blue-500">
                  Go Home
                </a>{" "}
                Or Refresh
              </div>
            </div>
          }
        >
          {!file ? (
            <IntroPage handleUpload={handleUpload} />
          ) : (
            <ViewerPage
              showColorButton={showColorButton}
              handleClearFile={handleClearFile}
              setShowColor={setShowColor}
              showColor={showColor}
              faceClassSelected={faceClassSelected}
              setFaceClassSelected={setFaceClassSelected}
              geometry={cadFile?.geometry}
              faceClasses={cadFile?.faceClasses}
            />
          )}
        </ErrorBoundary>
      </MediaQuery>
    </Page>
  );
}

export default App;
