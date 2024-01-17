// React imports
import React, { useState, useEffect } from "react";
import Button from "../../Components";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const FacebookLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, updateSearch] = useState("");
  const [query, updateQuery] = useState("");
  const [forcedOff, setForcedOff] = useState(false);

  const [selected, setSelected] = useState(false);
  const [name, updateName] = useState("");
  const [unix, updateUnix] = useState("");
  const [country, updateCountry] = useState("");
  const [state, updateState] = useState("");
  const [city, updateCity] = useState("");
  const [button1, setButton1] = useState(false);
  const [button2, setButton2] = useState(false);
  const [button3, setButton3] = useState(false);
  const [button4, setButton4] = useState(false);
  const [button5, setButton5] = useState(false);
  const [button6, setButton6] = useState(false);
  const [button7, setButton7] = useState(false);
  const [building, updateBuilding] = useState("");

  useEffect(() => {
    if (searchParams?.get("q")) {
      updateQuery(searchParams.get("q") ?? "");
    } else {
      updateQuery("");
    }
  }, [searchParams]);

  // Handles submissions
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (selected) searchParams.set("q", query);
    else searchParams.set("q", search);
    navigateTo(`/facebook?${searchParams.toString()}`);
    setSelected(false);
  };

  function handleClick() {
    setForcedOff(selected);
    setSelected(!selected);
  }

  function FilterButton() {
    return (
      <button
        onClick={handleClick}
        className={selected ? "button-toggled" : "button-default"}
      >
        Advanced
      </button>
    );
  }

  function QueryManager() {
    // display all active filters
    let str = "";
    let prior = false;

    // base query (search box)
    if (search.trim() !== "") {
      str += search;
      prior = true;
    }

    // name
    if (name.trim() !== "") {
      str += prior ? " AND (" : "(";
      str += 'name: "' + name + '")';
      prior = true;
    }

    // unix
    if (unix.trim() !== "") {
      str += prior ? " AND (" : "(";
      str += 'unix: "' + unix + '")';
      prior = true;
    }

    // country
    if (country.trim() !== "") {
      str += prior ? " AND (" : "(";
      str += 'country: "' + country + '")';
      prior = true;
    }

    // state
    if (state !== "") {
      str += prior ? " AND (" : "(";
      str += 'state: "' + state + '")';
      prior = true;
    }

    // town
    if (city.trim() !== "") {
      str += prior ? " AND (" : "(";
      str += 'city: "' + city + '")';
      prior = true;
    }

    // year
    let firstYear = 1;
    if (!button1) {
      firstYear = 2;
      if (!button2) {
        firstYear = 3;
        if (!button3) {
          firstYear = 4;
        }
      }
    }
    if (button1 || button2 || button3 || button4) str += prior ? " AND (" : "(";
    if (button1) str += 'year: "27"';
    if (button2) str += firstYear === 2 ? 'year: "26"' : ' OR year: "26"';
    if (button3) str += firstYear === 3 ? 'year: "25"' : ' OR year: "25"';
    if (button4) str += firstYear === 4 ? 'year: "24"' : ' OR year: "24"';
    if (button1 || button2 || button3 || button4) {
      str += ")";
      prior = true;
    }

    // type
    let firstType = 1;
    if (!button5) {
      firstType = 2;
      if (!button6) {
        firstType = 3;
      }
    }
    if (button5 || button6 || button7) str += prior ? " AND (" : "(";
    if (button5) str += 'type: "professor"';
    if (button6) str += firstType === 2 ? 'type: "staff"' : ' OR type: "staff"';
    if (button7)
      str += firstType === 3 ? 'type: "student"' : ' OR type: "student"';
    if (button5 || button6 || button7) {
      str += ")";
      prior = true;
    }

    // building
    if (building.trim() !== "") {
      str += prior ? " AND (" : "(";
      str += 'bldg: "' + building + '")';
    }

    // warning conditions
    let warn = "";
    if (
      (button5 || button6) &&
      !button7 &&
      (country !== "" ||
        state !== "" ||
        city !== "" ||
        button1 ||
        button2 ||
        button3 ||
        button4)
    ) {
      warn = 'student-only filter added with type: "student" excluded';
    }

    // render, update query
    if (!selected) return <></>;
    else if (str === "") {
      updateQuery(str);
      return (
        <div>
          <div className="active-filters">
            <div id="italic">empty query</div>
          </div>
          <br />
        </div>
      );
    } else {
      updateQuery(str);
      if (warn === "")
        return (
          <div>
            <div className="active-filters">{str}</div>
            <br />
          </div>
        );
      else
        return (
          <div>
            <div className="active-filters">{str}</div>
            <div className="warning">{warn}</div>
          </div>
        );
    }
  }

  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <Link to="/facebook">Facebook</Link>
          </h1>
          <ul>
            <li>
              <Link to="/facebook">Search</Link>
            </li>
            <li>
              <Link to="/facebook/help">Help</Link>
            </li>
            {currUser === null
              ? null
              : [
                  <li key="view">
                    <Link to={`/facebook/users/${currUser.id}`}>View</Link>
                  </li>,
                  <li key="edit">
                    <Link to="/facebook/edit"> Edit </Link>
                  </li>,
                ]}
          </ul>
        </div>
        <div>
          <form onSubmit={submitHandler}>
            <div
              style={{
                display: "flex",
                alignContent: "space-between",
                alignItems: "center",
              }}
            >
              <input
                style={{ marginTop: "12px" }}
                aria-label="Search box for Facebook"
                type="search"
                placeholder="Search Facebook"
                onClick={(event) => {
                  if (
                    name !== "" ||
                    unix !== "" ||
                    country !== "" ||
                    state !== "" ||
                    city !== "" ||
                    button1 ||
                    button2 ||
                    button3 ||
                    button4 ||
                    button5 ||
                    button6 ||
                    button7 ||
                    building !== ""
                  ) {
                    if (!forcedOff) setSelected(true);
                  }
                }}
                onChange={(event) => {
                  updateSearch(event.target.value);
                }}
              />
              <input
                data-disable-with="Search"
                type="submit"
                value="Search"
                className="submit"
              />
              <div style={{ marginLeft: "20px" }}>
                <FilterButton />
              </div>
            </div>
          </form>
        </div>
        <div className={selected ? "advanced-query-facebook" : "invisible"}>
          <br />
          <QueryManager />
          <table id="homepage-table">
            <tbody>
              <tr>
                <td align="right">
                  <strong>name</strong>
                </td>
                <td align="left">
                  <input
                    type="text"
                    placeholder="John Doe"
                    onChange={(event) => updateName(event.target.value)}
                  />
                </td>
                <td align="right">
                  <strong>unix</strong>
                </td>
                <td align="left">
                  <input
                    type="text"
                    placeholder="####"
                    onChange={(event) => updateUnix(event.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td align="right">
                  <strong>country</strong>
                </td>
                <td align="left">
                  <input
                    type="text"
                    placeholder="United States"
                    onChange={(event) => updateCountry(event.target.value)}
                  />
                </td>
                <td align="right">
                  <strong>state</strong>
                </td>
                <td align="center">
                  <div className="vertical">
                    <select
                      onChange={(event) => updateState(event.target.value)}
                    >
                      <option value=""></option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District Of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                  </div>
                </td>
                <td align="right">
                  <strong>city</strong>
                </td>
                <td align="left">
                  <input
                    type="text"
                    placeholder="Williamstown"
                    onChange={(event) => updateCity(event.target.value)}
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td align="right">
                  <strong>class year</strong>
                </td>
                <td align="left">
                  <Button
                    onClick={() => {
                      button1 ? setButton1(false) : setButton1(true);
                    }}
                    className={button1 ? "button-toggled" : "button-default"}
                  >
                    27 / 26.5
                  </Button>
                </td>
                <td align="left">
                  <Button
                    onClick={() => {
                      button2 ? setButton2(false) : setButton2(true);
                    }}
                    className={button2 ? "button-toggled" : "button-default"}
                  >
                    26 / 25.5
                  </Button>
                </td>
                <td align="left">
                  <Button
                    onClick={() => {
                      button3 ? setButton3(false) : setButton3(true);
                    }}
                    className={button3 ? "button-toggled" : "button-default"}
                  >
                    25 / 24.5
                  </Button>
                </td>
                <td align="left">
                  <Button
                    onClick={() => {
                      button4 ? setButton4(false) : setButton4(true);
                    }}
                    className={button4 ? "button-toggled" : "button-default"}
                  >
                    24 / 23.5
                  </Button>
                </td>
              </tr>
              <tr>
                <td align="right">
                  <strong>user type</strong>
                </td>
                <td align="left">
                  <Button
                    onClick={() => {
                      button5 ? setButton5(false) : setButton5(true);
                    }}
                    className={button5 ? "button-toggled" : "button-default"}
                  >
                    professor
                  </Button>
                </td>
                <td align="left">
                  <Button
                    onClick={() => {
                      button6 ? setButton6(false) : setButton6(true);
                    }}
                    className={button6 ? "button-toggled" : "button-default"}
                  >
                    staff
                  </Button>
                </td>
                <td align="left">
                  <Button
                    onClick={() => {
                      button7 ? setButton7(false) : setButton7(true);
                    }}
                    className={button7 ? "button-toggled" : "button-default"}
                  >
                    student
                  </Button>
                </td>
              </tr>
              <br />
              <tr>
                <td align="right">
                  <strong>building</strong>
                </td>
                <td align="left">
                  <input
                    type="text"
                    placeholder="Paresky"
                    onChange={(event) => updateBuilding(event.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>
      {children}
    </div>
  );
};

export default FacebookLayout;
