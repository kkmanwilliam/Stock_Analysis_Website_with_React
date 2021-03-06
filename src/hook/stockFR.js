import { useEffect, useState } from "react";
import { getStockFRData } from "../utilities";

export const useStockFRState = (symbol) => {
  const [stockFRState, setStockFRState] = useState({
    loading: true,
    error: null,
    data: null
  });
  useEffect(() => {
    getStockFRData(symbol)
      .then((res) => {
        if (!res) {
          setStockFRState({
            ...stockFRState,
            error: "No Data",
            loading: false
          });
        } else {
          setStockFRState({
            data: res.data,
            error: null,
            loading: false
          });
        }
      })
      .catch((error) => {
        console.log("setStockFRData Fail: ", error);
        setStockFRState({
          ...stockFRState,
          error: error,
          loading: false
        });
      });
  }, [symbol]);
  return stockFRState;
};
