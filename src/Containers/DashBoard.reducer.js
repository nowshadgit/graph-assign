import { ACTIONS } from "../apiConfig/actions.constants";
import { graphData, products, years } from "../apiConfig/data";

const initialState = {
  inProgress: false,
  products:[],
  graphData:[],
  years:[]
};

const dashBoardReducerStore = (stateParam, { type, payload }) => {
  const state = stateParam || initialState;
  switch (type) {
    case ACTIONS.DASHBOARD.GET_GRAPH_DATA:
      return { ...state, graphData : graphData };
    case ACTIONS.DASHBOARD.GET_PRODUCTS:
      return { ...state, products: products };
    case ACTIONS.DASHBOARD.GET_YEARS:
      return { ...state, years:years };
    default:
      return state;
  }
};

const dummy = () => {};

export { dashBoardReducerStore, dummy };
