export const getSelectedMajors = ({ majorRequirementsState }) => {
  return majorRequirementsState.selectedMajors || ["", "", ""];
};
