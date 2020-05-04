// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

const TagRemove = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} className="tag-remove">
      X
    </button>
  );
};

TagRemove.propTypes = { onClick: PropTypes.func.isRequired };

const TagEdit = ({ api, tags, updateTags, updateErrors }) => {
  const [newTag, updateNewTag] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const tagAutocomplete = async (event) => {
    updateNewTag(event.target.value);
    try {
      const tagResponse = await api.autocompleteService.autocompleteTags(
        event.target.value
      );
      let newSuggestions = tagResponse.data;
      if (newSuggestions.length > 5) {
        newSuggestions = newSuggestions.slice(0, 5);
      }
      setSuggestions(newSuggestions);
    } catch {
      // eslint-disable-next-line no-empty
    }
  };

  // Unsure if this is the best way to implement this.
  const updateUserTags = async (updatedTags) => {
    const params = {
      tags: updatedTags,
    };

    try {
      await api.userService.updateCurrUserTags(params);
      updateTags(updatedTags);
      updateNewTag("");
      updateErrors([]);
    } catch (error) {
      updateErrors(error.message);
    }
  };

  const addTagHandler = () => {
    if (newTag) {
      if (tags.filter((tag) => tag === newTag).length) {
        updateErrors(["Unable to add the same tag twice."]);
        return;
      }

      const updatedTags = Object.assign([], tags);
      updatedTags.push(newTag);
      updateUserTags(updatedTags);
    } else {
      updateErrors([]);
    }
  };

  const removeTagHandler = (index) => {
    const updatedTags = Object.assign([], tags);
    updatedTags.splice(index, 1);
    updateUserTags(updatedTags);
  };

  const tagSuggestions = () => {
    if (suggestions && suggestions.length > 0) {
      return (
        <table className="tag-suggestions">
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id}>
                <td>
                  <button
                    type="button"
                    className="autocomplete-option"
                    onClick={() => {
                      setSuggestions(null);
                      updateNewTag(suggestion.value);
                    }}
                  >
                    {suggestion.value}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return null;
  };

  return (
    <ul id="tag-list">
      {tags.map((tag, i) => (
        <li className="fb-tag" key={tag}>
          {tag}
          <TagRemove onClick={() => removeTagHandler(i)} />
        </li>
      ))}

      <li className="fb-tag">
        <input
          className="tag-input"
          type="text"
          onChange={tagAutocomplete}
          placeholder="New Tag"
          maxLength="255"
          size="20"
          value={newTag}
        />
        <TagRemove onClick={() => updateNewTag("")} />
        {tagSuggestions()}
      </li>

      <button type="button" onClick={addTagHandler}>
        Add Tag
      </button>
    </ul>
  );
};

TagEdit.propTypes = {
  api: PropTypes.object.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  updateTags: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
};

TagEdit.defaultProps = {
  tags: [],
};

export default TagEdit;
