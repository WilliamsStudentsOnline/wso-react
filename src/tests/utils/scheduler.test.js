import {
  dayConversionGCal,
  gcalFormattedDate,
  nextDateWithDay,
  toDayArray,
} from "../../lib/scheduler";

describe("nextDateWithDay", () => {
  it("throws when an invalid daysOfWeekAllowed is provided", () => {
    expect(() => nextDateWithDay("2021-08-56", [8])).toThrow();
  });

  it("does not do anything when an empty daysOfWeekAllowed is passed in", () => {
    expect(nextDateWithDay("2021-08-31", [])).toEqual("2021-08-31");
  });

  it("does not modify the date if it is allowed", () => {
    expect(nextDateWithDay("2020-09-06", [0])).toEqual("20200906");
  });

  it("add days if necessary", () => {
    expect(nextDateWithDay("2020-09-06", [1])).toEqual("20200907");
  });

  it("does not subtract days", () => {
    expect(nextDateWithDay("2020-09-05", [5])).toEqual("20200911");
  });
});

describe("gcalFormattedDate", () => {
  it("modifies YYYYMMDD dates", () => {
    expect(gcalFormattedDate("20200906")).toEqual("2020-09-06");
  });

  it("does not modify YYYY-MM-DD dates", () => {
    expect(gcalFormattedDate("2020-09-06")).toEqual("2020-09-06");
  });
});

describe("toDayArray", () => {
  it("converts M-F", () => {
    expect(toDayArray("M-F")).toEqual([1, 2, 3, 4, 5]);
  });

  it("converts MWF", () => {
    expect(toDayArray("MWF")).toEqual([1, 3, 5]);
  });

  it("converts TR", () => {
    expect(toDayArray("TR")).toEqual([2, 4]);
  });
});

describe("dayConversionGCal", () => {
  it("converts M-F", () => {
    expect(dayConversionGCal("M-F")).toEqual("MO,TU,WE,TH,FR");
  });

  it("converts MWF", () => {
    expect(dayConversionGCal("MWF")).toEqual("MO,WE,FR");
  });

  it("converts TR", () => {
    expect(dayConversionGCal("TR")).toEqual("TU,TH");
  });
});
