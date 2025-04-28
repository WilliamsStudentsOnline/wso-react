import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store"; // Assuming your store definition is here

const getCurrentAcademicYears = (): number[] => {
  const now = new Date();
  // consider august, not may
  const academicYearStart =
    now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return [
    (academicYearStart + 4) % 100,
    (academicYearStart + 3) % 100,
    (academicYearStart + 2) % 100,
    (academicYearStart + 1) % 100,
  ];
};

export const AVAILABLE_YEARS = getCurrentAcademicYears();
export type UserType = "professor" | "staff" | "student";
export const AVAILABLE_TYPES: UserType[] = ["student", "staff", "professor"];

interface QueryBuilderState {
  name: string;
  unix: string;
  country: string;
  state: string;
  city: string;
  selectedYears: number[];
  selectedTypes: UserType[];
  building: string;
}

const initialState: QueryBuilderState = {
  name: "",
  unix: "",
  country: "",
  state: "",
  city: "",
  selectedYears: [],
  selectedTypes: [],
  building: "",
};

const queryBuilderSlice = createSlice({
  name: "queryBuilder",
  initialState,
  reducers: {
    updateQueryField: <K extends keyof QueryBuilderState>(
      state: QueryBuilderState,
      action: PayloadAction<{ field: K; value: QueryBuilderState[K] }>
    ) => {
      state[action.payload.field] = action.payload.value;
      // force country to US if selecting state
      if (action.payload.field === "state" && action.payload.value !== "") {
        state.country = "United States";
      }
      // clear state if country switches to not US
      if (
        action.payload.field === "country" &&
        action.payload.value !== "United States" &&
        state.state !== ""
      ) {
        state.state = "";
      }
    },
    toggleQueryYear: (state, action: PayloadAction<number>) => {
      const year = action.payload;
      const index = state.selectedYears.indexOf(year);
      if (index === -1) {
        state.selectedYears.push(year);
      } else {
        state.selectedYears.splice(index, 1);
      }
    },
    toggleQueryType: (state, action: PayloadAction<UserType>) => {
      const type = action.payload;
      const index = state.selectedTypes.indexOf(type);
      if (index === -1) {
        state.selectedTypes.push(type);
      } else {
        state.selectedTypes.splice(index, 1);
      }
    },
    resetQueryFilters: () => initialState,
  },
});

export const {
  updateQueryField,
  toggleQueryYear,
  toggleQueryType,
  resetQueryFilters,
} = queryBuilderSlice.actions;

export const selectQueryFilters = (state: RootState) => state.queryBuilder;

export const selectGeneratedQuery = (
  state: RootState
): { query: string; warning: string } => {
  const filters = state.queryBuilder;
  const queryParts: string[] = [];
  let warning = "";

  const addFilter = (condition: boolean, queryPart: string) => {
    if (condition) {
      queryParts.push(queryPart);
    }
  };

  addFilter(!!filters.name.trim(), `name:"${filters.name.trim()}"`);
  addFilter(!!filters.unix.trim(), `unix:"${filters.unix.trim()}"`);
  addFilter(!!filters.country.trim(), `country:"${filters.country.trim()}"`);
  addFilter(!!filters.state.trim(), `state:"${filters.state.trim()}"`);
  addFilter(!!filters.city.trim(), `city:"${filters.city.trim()}"`);
  addFilter(!!filters.building.trim(), `bldg:"${filters.building.trim()}"`);

  if (filters.selectedYears.length > 0) {
    queryParts.push(
      `(${filters.selectedYears.map((y) => `year:"${y}"`).join(" OR ")})`
    );
  }

  if (filters.selectedTypes.length > 0) {
    queryParts.push(
      `(${filters.selectedTypes.map((t) => `type:"${t}"`).join(" OR ")})`
    );
  }

  const hasStudentOnlyFilters =
    filters.country ||
    filters.state ||
    filters.city ||
    filters.selectedYears.length > 0;
  const studentTypeSelected = filters.selectedTypes.includes("student");
  const onlyNonStudentTypesSelected =
    filters.selectedTypes.length > 0 && !studentTypeSelected;

  if (hasStudentOnlyFilters && onlyNonStudentTypesSelected) {
    warning =
      'Student-only filters (location, year) were selected, but the "student" type is not included.';
  }

  return { query: queryParts.join(" AND "), warning };
};

export default queryBuilderSlice.reducer;
