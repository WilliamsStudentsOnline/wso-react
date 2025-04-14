import React, { useEffect, useState } from "react";
import "../../stylesheets/MajorBuilder.css";
import { MAJORS } from "../../../constants/majors";

const MajorEditor = () => {
  const [link, setLink] = useState("");
  const [prefix, setPrefix] = useState("");
  const [division, setDivision] = useState(0);
  const [infoList, setInfoList] = useState([]);
  const [reqs, setReqs] = useState([]);
  const [importText, setImportText] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [importMajor, setImportMajor] = useState("");

  const addInfo = () => setInfoList([...infoList, ""]);
  const updateInfo = (i, value) => {
    const newInfo = [...infoList];
    newInfo[i] = value;
    setInfoList(newInfo);
  };
  const removeInfo = (i) => setInfoList(infoList.filter((_, idx) => idx !== i));

  // Each requirement section is an object with a description (e.g. "Introduction"), a requiredCount, and groups
  const addRequirement = () => {
    setReqs([...reqs, { description: "", requiredCount: 1, groups: [] }]);
  };
  const updateRequirementField = (reqIdx, field, value) => {
    const newReqs = [...reqs];
    newReqs[reqIdx][field] = value;
    setReqs(newReqs);
  };
  const removeRequirement = (reqIdx) => {
    setReqs(reqs.filter((_, idx) => idx !== reqIdx));
  };

  const addGroupToReq = (reqIdx) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups.push({ items: [] });
    setReqs(newReqs);
  };
  const removeGroupFromReq = (reqIdx, groupIdx) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups = newReqs[reqIdx].groups.filter(
      (_, idx) => idx !== groupIdx
    );
    setReqs(newReqs);
  };

  // Each item is a requirement object with a mandatory description
  // The user may add extra fields (e.g. course, regex, ignore) to that requirement
  // If no extra fields are added, serialization returns { placeholder: <description> }
  const addRequirementItemToGroup = (reqIdx, groupIdx) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups[groupIdx].items.push({
      description: "",
      extraFields: [], // extraFields is an array of { type, value }
    });
    setReqs(newReqs);
  };
  const removeRequirementItemFromGroup = (reqIdx, groupIdx, itemIdx) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups[groupIdx].items = newReqs[reqIdx].groups[
      groupIdx
    ].items.filter((_, idx) => idx !== itemIdx);
    setReqs(newReqs);
  };
  const updateRequirementItemDescription = (
    reqIdx,
    groupIdx,
    itemIdx,
    value
  ) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups[groupIdx].items[itemIdx].description = value;
    setReqs(newReqs);
  };

  // These additional keys let the user add filters such as a specific course, regex, etc.
  const addExtraFieldToRequirementItem = (reqIdx, groupIdx, itemIdx) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups[groupIdx].items[itemIdx].extraFields.push({
      type: "course",
      value: "",
    });
    setReqs(newReqs);
  };
  const removeExtraFieldFromRequirementItem = (
    reqIdx,
    groupIdx,
    itemIdx,
    fieldIdx
  ) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups[groupIdx].items[itemIdx].extraFields.splice(
      fieldIdx,
      1
    );
    setReqs(newReqs);
  };
  const updateExtraField = (
    reqIdx,
    groupIdx,
    itemIdx,
    fieldIdx,
    key,
    value
  ) => {
    const newReqs = [...reqs];
    newReqs[reqIdx].groups[groupIdx].items[itemIdx].extraFields[fieldIdx][key] =
      value;
    setReqs(newReqs);
  };

  // If an item has no extra fields, output as { placeholder: <description> }
  // Otherwise, output as { description: <description>, and then one key per extra field }
  const convertRequirementItem = (item) => {
    console.log(item);
    const desc = item.description.trim();
    if (item.extraFields.length === 0) {
      return { placeholder: desc };
    } else {
      const result = { description: desc };
      item.extraFields.forEach((field) => {
        const val =
          typeof field.value === "string" ? field.value.trim() : field.value;
        if (val) {
          result[field.type] = field.type === "minSem" ? Number(val) : val;
        }
      });
      return result;
    }
  };

  const jsonOutput = {
    Link: link,
    Prefix: prefix,
    Division: Number(division),
    Info: infoList.filter((info) => info.trim() !== ""),
    Requirements: reqs.map((req) => {
      const groupsConverted = req.groups.map((group) => {
        const items = group.items.map((item) => convertRequirementItem(item));
        return items.length === 1 ? items[0] : items;
      });
      return {
        description: req.description, // the top-level description for this requirement set
        args: [groupsConverted, Number(req.requiredCount)],
      };
    }),
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
    setConfirmationMessage("JSON copied to clipboard!");
    setShowConfirmation(true);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      setLink(parsed.Link || "");
      setPrefix(parsed.Prefix || "");
      setDivision(parsed.Division || 0);
      setInfoList(parsed.Info || []);

      const importedReqs = (parsed.Requirements || []).map((req) => {
        const [groupsRaw, requiredCount] = req.args;
        const groups = (groupsRaw || []).map((group) => {
          const items = Array.isArray(group) ? group : [group];
          const formattedItems = items.map((obj) => {
            let item = {};
            if ("placeholder" in obj) {
              item.description = obj.placeholder;
              item.extraFields = [];
            } else {
              item.description = obj.description || "";
              item.extraFields = [];
              Object.keys(obj).forEach((key) => {
                if (key !== "description") {
                  item.extraFields.push({ type: key, value: obj[key] });
                }
              });
            }
            return item;
          });
          return { items: formattedItems };
        });
        return {
          description: req.description,
          requiredCount: requiredCount,
          groups: groups,
        };
      });
      setReqs(importedReqs);
      setActiveTab("editor");
      setConfirmationMessage("JSON imported successfully");
      setShowConfirmation(true);
    } catch (err) {
      setConfirmationMessage(`Failed to import JSON: ${err.message}`);
      setShowConfirmation(true);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("courseSchedulerCustomMajor");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setLink(parsed.Link || "");
        setPrefix(parsed.Prefix || "");
        setDivision(parsed.Division || 0);
        setInfoList(parsed.Info || []);

        const importedReqs = (parsed.Requirements || []).map((req) => {
          const [groupsRaw, requiredCount] = req.args;
          const groups = (groupsRaw || []).map((group) => {
            const items = Array.isArray(group) ? group : [group];
            const formattedItems = items.map((obj) => {
              let item = {};
              if ("placeholder" in obj) {
                item.description = obj.placeholder;
                item.extraFields = [];
              } else {
                item.description = obj.description || "";
                item.extraFields = [];
                Object.keys(obj).forEach((key) => {
                  if (key !== "description") {
                    item.extraFields.push({ type: key, value: obj[key] });
                  }
                });
              }
              return item;
            });
            return { items: formattedItems };
          });
          return {
            description: req.description,
            requiredCount: requiredCount,
            groups: groups,
          };
        });
        setReqs(importedReqs);
      } catch (err) {
        console.error("Error parsing stored major JSON:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "courseSchedulerCustomMajor",
      JSON.stringify(jsonOutput)
    );
  }, [jsonOutput]);

  const getFieldPlaceholder = (type) => {
    switch (type) {
      case "course":
        return "e.g. MATH 200";
      case "regex":
        return "e.g. MATH 2";
      case "classType":
        return "e.g. Seminar";
      case "component":
        return "e.g. Laboratory";
      case "attributes":
        return "e.g. WGSS_WGSSTHRY";
      case "minSem":
        return "e.g. 5";
      case "ignore":
        return "e.g. MATH 150, MATH 151";
      default:
        return "";
    }
  };

  const renderRequirementItem = (item, reqIdx, groupIdx, itemIdx) => {
    return (
      <div className="requirement-item">
        <input
          type="text"
          value={item.description}
          onChange={(e) =>
            updateRequirementItemDescription(
              reqIdx,
              groupIdx,
              itemIdx,
              e.target.value
            )
          }
          placeholder="Description (required)"
          className="input-field"
        />
        <button
          onClick={() =>
            addExtraFieldToRequirementItem(reqIdx, groupIdx, itemIdx)
          }
          className="major-editor-button major-editor-button-secondary"
        >
          Add Constraint
        </button>
        {item.extraFields.map((field, fieldIdx) => (
          <div key={fieldIdx} className="extra-field">
            <select
              value={field.type}
              onChange={(e) =>
                updateExtraField(
                  reqIdx,
                  groupIdx,
                  itemIdx,
                  fieldIdx,
                  "type",
                  e.target.value
                )
              }
              className="select-field"
            >
              <option value="course">Specific Course</option>
              <option value="regex">Course Matches (R)</option>
              <option value="classType">Class Format (R)</option>
              <option value="component">Has Component (R)</option>
              <option value="attributes">Has Attributes (R)</option>
              <option value="minSem">Minimum Semester</option>
              <option value="ignore">Ignore</option>
            </select>
            <button
              onClick={() =>
                removeExtraFieldFromRequirementItem(
                  reqIdx,
                  groupIdx,
                  itemIdx,
                  fieldIdx
                )
              }
              className="major-editor-button major-editor-button-icon"
            >
              ×
            </button>
            <input
              type={field.type === "minSem" ? "number" : "text"}
              value={field.value}
              onChange={(e) =>
                updateExtraField(
                  reqIdx,
                  groupIdx,
                  itemIdx,
                  fieldIdx,
                  "value",
                  e.target.value
                )
              }
              placeholder={getFieldPlaceholder(field.type)}
              className="input-field"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="major-builder-container">
      <div className="major-editor">
        <h2>Major Editor</h2>
        <p>
          Use the editor below to craft a custom major, which will show up under
          the course scheduler as &quot;Custom Major&quot;.
        </p>
        <p>
          This feature is designed for students pursuing a Contract Major, or
          students who wish to correct/improve upon the existing Major Builder.
          If you use this to fix or update a major, please export your creation
          and email it to{" "}
          <a href="mailto:wso-dev@wso.williams.edu">wso-dev@wso.williams.edu</a>
          !
        </p>
        <p style={{ fontStyle: "italic" }}>
          Warning: this feature is still in beta, and is intended for advanced
          users only. This feature can break the Major Builder display. Use
          &quot;Clear&quot; if you ever get stuck.
        </p>
        <div className="tabs">
          <button
            className={`tab ${activeTab === "editor" ? "active" : ""}`}
            onClick={() => setActiveTab("editor")}
          >
            Editor
          </button>
          <button
            className={`tab ${activeTab === "json" ? "active" : ""}`}
            onClick={() => setActiveTab("json")}
          >
            Export
          </button>
          <button
            className={`tab ${activeTab === "import" ? "active" : ""}`}
            onClick={() => setActiveTab("import")}
          >
            Import
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure?")) {
                localStorage.removeItem("courseSchedulerCustomMajor");
                setImportText(JSON.stringify({}));
                handleImport();
              }
            }}
            className="tab"
          >
            Clear
          </button>
        </div>

        {activeTab === "editor" && (
          <div className="editor-container">
            <div className="section card">
              <h3>Basic Information</h3>
              <div className="form-row">
                <label htmlFor="major-link">Dept. Website:</label>
                <input
                  id="major-link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Link to department major requirements (must start with https://)"
                  className="input-field"
                />
              </div>
              <div className="form-row">
                <label htmlFor="major-prefix">Prefix:</label>
                <input
                  id="major-prefix"
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. ASTR"
                  className="input-field"
                />
              </div>
              <div className="form-row">
                <label
                  htmlFor="major-division"
                  style={{ marginBottom: "1.25em" }}
                >
                  Division:
                </label>
                <select
                  id="major-division"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="select-field"
                >
                  <option value={0}>None</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
            </div>
            <div className="section card">
              <div className="section-header">
                <h3>Info</h3>
                <button
                  onClick={addInfo}
                  className="major-editor-button major-editor-button-primary"
                >
                  Add Info
                </button>
              </div>
              <p>
                These will show up as bullet points under &quot;Show Info.&quot;
              </p>
              {infoList.map((info, i) => (
                <div key={i} className="info-item">
                  <input
                    type="text"
                    value={info}
                    onChange={(e) => updateInfo(i, e.target.value)}
                    placeholder={`Info ${i + 1}`}
                    className="input-field"
                  />
                  <button
                    onClick={() => removeInfo(i)}
                    className="major-editor-button major-editor-button-icon"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="section card">
              <div className="section-header">
                <h3>Requirements</h3>
                <button
                  onClick={addRequirement}
                  className="major-editor-button major-editor-button-primary"
                >
                  Add Requirement
                </button>
              </div>
              <p>
                Each requirement is displayed as a collapsible section under the
                major view. Each requirement contains groups of one or more
                items. Only one item in a group is required to satisfy that
                group. Specify how many groups must be satisfied for each
                requirement with &quot;Required Count&quot;.
              </p>
              <p>
                Each item represents one requirement towards the major, usually
                a course. Items must have a description, and can have
                constraints. An item with no constraints is a placeholder that
                must be manually checked by the user.
              </p>
              <p>
                Constraints provide a way for the Major Builder to autofill
                requirements on behalf of the user. Constraints will search
                through course cross-listings. The Course constraint matches a
                course exactly. Constraints suffixed with (R) use{" "}
                <a
                  href="https://learnxinyminutes.com/pcre/"
                  className="major-info-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  regular expressions (regex)
                </a>{" "}
                to perform checks. It may be helpful to treat these as simple
                matches, e.g. &quot;MATH 2&quot; will match all courses that
                start with &quot;MATH 2&quot;, but more advanced usage is
                supported. A current list of course attributes is available{" "}
                <a
                  href="https://github.com/WilliamsStudentsOnline/wso-react/blob/master/src/constants/majorAttributes.txt"
                  target="_blank"
                  className="major-info-link"
                  rel="noreferrer"
                >
                  here
                </a>
                . In addition, it is possible to supply a comma-separated list
                of courses to ignore, or a minimum semester for which an item
                can be counted.
              </p>
              {reqs.map((req, reqIdx) => (
                <div key={reqIdx} className="requirement-card">
                  <div className="requirement-header">
                    <div className="form-row">
                      <label>Description:</label>
                      <input
                        type="text"
                        value={req.description}
                        onChange={(e) =>
                          updateRequirementField(
                            reqIdx,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Introduction"
                        className="input-field"
                      />
                    </div>
                    <div className="form-row">
                      <label>Required Count:</label>
                      <input
                        type="number"
                        min="1"
                        value={req.requiredCount}
                        onChange={(e) =>
                          updateRequirementField(
                            reqIdx,
                            "requiredCount",
                            e.target.value
                          )
                        }
                        className="input-field number-field"
                      />
                    </div>
                    <button
                      onClick={() => removeRequirement(reqIdx)}
                      className="major-editor-button major-editor-button-danger"
                    >
                      Remove Requirement
                    </button>
                  </div>
                  <div className="groups-container">
                    <div className="groups-header">
                      <h4>Groups</h4>
                      <button
                        onClick={() => addGroupToReq(reqIdx)}
                        className="major-editor-button major-editor-button-secondary"
                      >
                        Add Group
                      </button>
                    </div>
                    {req.groups.map((group, groupIdx) => (
                      <div key={groupIdx} className="group-card">
                        <div className="group-header">
                          <span className="group-label">
                            Group {groupIdx + 1}{" "}
                            {group.items.length <= 1
                              ? "(single course)"
                              : "(one of:)"}
                          </span>
                          <button
                            onClick={() => removeGroupFromReq(reqIdx, groupIdx)}
                            className="major-editor-button major-editor-button-danger-outline"
                          >
                            Remove Group
                          </button>
                        </div>
                        {group.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="item-row">
                            {renderRequirementItem(
                              item,
                              reqIdx,
                              groupIdx,
                              itemIdx
                            )}
                            <button
                              onClick={() =>
                                removeRequirementItemFromGroup(
                                  reqIdx,
                                  groupIdx,
                                  itemIdx
                                )
                              }
                              style={{ fontSize: "14px" }}
                              className="major-editor-button major-editor-button-icon"
                            >
                              Delete Item
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            addRequirementItemToGroup(reqIdx, groupIdx)
                          }
                          className="major-editor-button major-editor-button-secondary"
                        >
                          Add Item
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "json" && (
          <div className="section card">
            <div className="section-header">
              <h3>Generated JSON</h3>
              <div>
                <button
                  onClick={handleCopyToClipboard}
                  className="major-editor-button major-editor-button-primary"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
            <pre className="json-preview">
              {JSON.stringify(jsonOutput, null, 2)}
            </pre>
          </div>
        )}
        {activeTab === "import" && (
          <div>
            <div className="section card">
              <h3>Import an existing major</h3>
              <p>Load the JSON format for an existing major.</p>
              <select onChange={(e) => setImportMajor(e.target.value)}>
                {Object.keys(MAJORS)
                  .filter((k) => k !== "Custom Major")
                  .map((major) => (
                    <option key={`major-import-${major}`} value={major}>
                      {major}
                    </option>
                  ))}
              </select>
              <button
                onClick={() => {
                  setImportText(JSON.stringify(MAJORS[importMajor], null, 2));
                }}
                className="major-editor-button major-editor-button-primary"
              >
                Load JSON
              </button>
            </div>
            <div className="section card">
              <h3>Import JSON</h3>
              <p>Apply this JSON format to your custom major.</p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON here to import or load an existing major"
                className="json-input"
              />
              <button
                onClick={handleImport}
                className="major-editor-button major-editor-button-primary"
              >
                Import JSON
              </button>
            </div>
          </div>
        )}
        {showConfirmation && (
          <div className="confirmation-toast">
            <span>{confirmationMessage}</span>
            <button
              onClick={() => setShowConfirmation(false)}
              className="major-editor-button major-editor-button-icon"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MajorEditor;
