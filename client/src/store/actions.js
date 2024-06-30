export const addAiModel = (response) => ({
  type: "ADD_AI_MODEL",
  response,
});
export const removeAiModel = () => ({
  type: "REMOVE_AI_MODEL",
});
export const setActiveAiModel = (response) => ({
  type: "SET_ACTIVE_AI_MODEL",
  response,
});
export const removeActiveAiModel = () => ({
  type: "REMOVE_ACTIVE_AI_MODEL",
});
