const initialState = {
  aiModel: ["gpt-3.5-turbo", "gpt-4"],
  isAiModelAvailable: false,
  activeAiModel: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_AI_MODEL":
      return {
        ...state,
        aiModel: action.response,
        isAiModelAvailable: true,
      };
    case "REMOVE_AI_MODEL":
      return {
        ...state,
        aiModel: [],
        isAiModelAvailable: false,
      };
    case "SET_ACTIVE_AI_MODEL":
      return {
        ...state,
        activeAiModel: action.response,
      };
    case "REMOVE_ACTIVE_AI_MODEL":
      return {
        ...state,
        activeAiModel: null,
      };
    default:
      return state;
  }
};

export default userReducer;
