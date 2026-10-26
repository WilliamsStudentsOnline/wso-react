// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

const ERROR_INVALID_USER_TAG = 1406;
const ERROR_TAG_ALREADY_EXISTS = 1408;

const TagRemove = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="tag-edit__remove"
    aria-label={label}
  >
    <span className="material-icons" aria-hidden>
      close
    </span>
  </button>
);

TagRemove.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

const errorMessage = (error) =>
  error?.message || error?.error || "Something went wrong.";

const TagEdit = ({ tags, updateTags, updateErrors, wso }) => {
  const [newTag, updateNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [busy, setBusy] = useState(false);

  const tagAutocomplete = async (event) => {
    const value = event.target.value;
    updateNewTag(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const tagResponse = await wso.autocompleteService.autocompleteTag(
        value,
        5
      );
      setSuggestions(tagResponse.data ?? []);
    } catch {
      // autocomplete is optional
    }
  };

  const matchingSuggestion = (name) =>
    suggestions.find(
      (s) => s.value && s.value.toLowerCase() === name.toLowerCase()
    );

  const updateUserTags = async (updatedTags) => {
    await wso.userService.updateUserTags("me", { tags: updatedTags });
    updateTags(updatedTags);
    updateNewTag("");
    setSuggestions([]);
    updateErrors([]);
  };

  const requestNewTag = async (tagName) => {
    await wso.userService.createUserTagRequest("me", { tagName });
    updateNewTag("");
    setSuggestions([]);
    updateErrors([
      `Requested new tag "${tagName}" - pending moderator approval.`,
    ]);
  };

  const addTagHandler = async () => {
    const name = newTag.trim();
    if (!name || busy) {
      updateErrors([]);
      return;
    }
    if (tags.some((tag) => tag.toLowerCase() === name.toLowerCase())) {
      updateErrors(["Unable to add the same tag twice."]);
      return;
    }

    setBusy(true);
    try {
      const known = matchingSuggestion(name);
      if (known?.value) {
        await updateUserTags([...tags, known.value]);
        return;
      }

      try {
        await requestNewTag(name);
      } catch (error) {
        // name already exists in tags table — attach immediately
        if (error?.errorCode === ERROR_TAG_ALREADY_EXISTS) {
          await updateUserTags([...tags, name]);
          return;
        }
        throw error;
      }
    } catch (error) {
      // typed an existing name that wasn't in suggestions
      if (error?.errorCode === ERROR_INVALID_USER_TAG) {
        try {
          await requestNewTag(name);
          return;
        } catch (requestError) {
          updateErrors([errorMessage(requestError)]);
          return;
        }
      }
      updateErrors([errorMessage(error)]);
    } finally {
      setBusy(false);
    }
  };

  const removeTagHandler = async (index) => {
    if (busy) return;
    const updatedTags = Object.assign([], tags);
    updatedTags.splice(index, 1);
    setBusy(true);
    try {
      await updateUserTags(updatedTags);
    } catch (error) {
      updateErrors([errorMessage(error)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tag-edit">
      <ul className="tag-edit__chips">
        {tags.map((tag, i) => (
          <li className="tag-edit__chip" key={tag}>
            <span className="tag-edit__chip-label">{tag}</span>
            <TagRemove
              label={`Remove ${tag}`}
              onClick={() => removeTagHandler(i)}
            />
          </li>
        ))}
      </ul>

      <div className="tag-edit__compose">
        <div className="tag-edit__input-wrap">
          <input
            className="tag-edit__input"
            type="text"
            onChange={tagAutocomplete}
            placeholder="New tag"
            maxLength="255"
            value={newTag}
            disabled={busy}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTagHandler();
              }
            }}
          />
          {suggestions && suggestions.length > 0 ? (
            <ul className="tag-edit__suggestions">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    className="tag-edit__suggestion"
                    onClick={() => {
                      setSuggestions([]);
                      updateNewTag(suggestion.value);
                    }}
                  >
                    {suggestion.value}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          className="tag-edit__add"
          onClick={addTagHandler}
          disabled={!newTag.trim() || busy}
          aria-label="Add tag"
        >
          +
        </button>
      </div>
    </div>
  );
};

TagEdit.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  updateTags: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

TagEdit.defaultProps = {
  tags: [],
};

export default TagEdit;
