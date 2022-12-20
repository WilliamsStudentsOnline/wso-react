const floorplanMap = new Map([
  ["Agard", ["https://campus-life.williams.edu/files/2022/04/Agard.pdf"]],
  ["Brooks", ["https://campus-life.williams.edu/files/2022/04/Brooks.pdf"]],
  ["Bryant", ["https://campus-life.williams.edu/files/2022/04/Bryant.pdf"]],
  ["Carter", ["https://campus-life.williams.edu/files/2022/04/Carter.pdf"]],
  ["Currier", ["https://campus-life.williams.edu/files/2022/04/Currier.pdf"]],
  ["Dodd", ["https://campus-life.williams.edu/files/2022/04/Dodd.pdf"]],
  ["East", ["https://campus-life.williams.edu/files/2022/04/East.pdf"]],
  ["Faye", ["https://campus-life.williams.edu/files/2022/04/Faye.pdf"]],
  ["Fitch", ["https://campus-life.williams.edu/files/2022/04/Fitch.pdf"]],
  ["Garfield", ["https://campus-life.williams.edu/files/2022/04/Garfield.pdf"]],
  ["Gladden", ["https://campus-life.williams.edu/files/2022/04/Gladden.pdf"]],
  ["Goodrich", ["https://campus-life.williams.edu/files/2022/04/Goodrich.pdf"]],
  ["Horn", ["https://campus-life.williams.edu/files/2022/04/Horn.pdf"]],
  ["Hubbell", ["https://campus-life.williams.edu/files/2022/04/Hubbell.pdf"]],
  ["Lehman", ["https://campus-life.williams.edu/files/2022/04/Lehman.pdf"]],
  [
    "Mark-Hopkins",
    ["https://campus-life.williams.edu/files/2022/04/Mark-Hopkins.pdf"],
  ],
  ["Morgan", ["https://campus-life.williams.edu/files/2022/04/Morgan.pdf"]],
  ["Parsons", ["https://campus-life.williams.edu/files/2022/04/Parsons.pdf"]],
  ["Perry", ["https://campus-life.williams.edu/files/2022/04/Perry.pdf"]],
  ["Prospect", ["https://campus-life.williams.edu/files/2022/04/Prospect.pdf"]],
  ["Sewall", ["https://campus-life.williams.edu/files/2022/04/Sewall.pdf"]],
  ["Spencer", ["https://campus-life.williams.edu/files/2022/04/Spencer.pdf"]],
  ["Thompson", ["https://campus-life.williams.edu/files/2022/05/Thompson.pdf"]],
  ["Tyler", ["https://campus-life.williams.edu/files/2022/04/Tyler.pdf"]],
  [
    "Tyler-Annex",
    ["https://campus-life.williams.edu/files/2022/04/Tyler-Annex.pdf"],
  ],
  ["West", ["https://campus-life.williams.edu/files/2022/04/West.pdf"]],
  ["Wood", ["https://campus-life.williams.edu/files/2022/04/Wood.pdf"]],
]);

/**
 * Returns the floorplan links of the given dormitory building.
 *
 * @param {String} name - Name of dormitory whose floorplan links we wish to obtain.
 */
const floorplanHelper = (name) => {
  return floorplanMap.get(name);
};

export default floorplanHelper;
