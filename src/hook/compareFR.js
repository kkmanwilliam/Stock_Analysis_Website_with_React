import { useEffect, useState } from "react";
import { getCompareFRData } from "../utilities";

export const useCompareFRState = (symbol_list) => {
  const [compareFRState, setCompareFRState] = useState({
    loading: true,
    error: null,
    data: null
  });
  useEffect(() => {
    getCompareFRData(symbol_list)
      .then((res) =>
        setCompareFRState({
          loading: null,
          error: null,
          data: res.data
        })
      )
      .catch((error) => {
        console.log("fetch compareFRState failed", error);
        setCompareFRState({
          loading: false,
          error: error,
          data: null
        });
      });
  }, [symbol_list]);
  return compareFRState;
};
