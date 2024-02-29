import { useEffect, useState } from "react";
import Page, { IntroPage, ViewerPage } from "./Components/Page";
import { useShowColorButton } from "./Components/ShowColorButton";
import { useInputForm, wakeUpLambda } from "./hooks/upload";
import { ErrorBoundary } from "react-error-boundary";
import MediaQuery from "react-responsive";

function App() {
  const { file, cadFile, handleUpload, handleClearFile, handleDemoUpload } =
    useInputForm();

  const [showColdStartMessage, setShowColdStartMessage] = useState(false);

  const {
    showColorButton,
    showColor,
    setShowColor,
    faceClassSelected,
    setFaceClassSelected,
  } = useShowColorButton();

  const coldStartPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Cold Start");
    }, 2000);
  });

  useEffect(() => {
    Promise.race([wakeUpLambda(), coldStartPromise])
      .then((value) => {
        if (value === "Cold Start") {
          setShowColdStartMessage(true);
          setTimeout(() => {
            setShowColdStartMessage(false);
          }, 5000);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
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
            <IntroPage
              showColdStartMessage={showColdStartMessage}
              handleUpload={handleUpload}
              handleDemoUpload={handleDemoUpload}
            />
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
