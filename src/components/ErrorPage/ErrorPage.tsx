import React, { useEffect, useState } from "react";
import LoadingState from "../LoadingFrame/Loading.tsx";
import NotFoundPage from "./NotFoundPage.tsx";
const ErrorPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadingState = () => {
      setTimeout(() => {
        setIsLoaded(false);
      }, 2000);
      setIsLoaded(true);
    };
    loadingState();
  }, []);
  return <div>{isLoaded ? <LoadingState></LoadingState> : <NotFoundPage></NotFoundPage>}</div>;
};

export default ErrorPage;
