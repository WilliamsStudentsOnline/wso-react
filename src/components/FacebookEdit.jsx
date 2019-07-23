// React Imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// External Imports
import axios from 'axios';
import FacebookLayout from './FacebookLayout';

const FacebookEdit = ({ currentUser, authToken, notice, warning }) => {
  const [newTags, setNewTags] = useState([]);
  const [count, setCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');

  const removeTagHandler = event => {
    const clickedId = parseInt(event.target.attributes.data.value, 10);
    setNewTags(newTags.filter(i => i !== clickedId));
  };

  const addTagHandler = () => {
    setNewTags(newTags.concat([count]));
    setCount(count + 1);
  };

  const tagSuggestions = () => {
    if (suggestions) {
      return (
        <table className="tag-suggestions">
          <tbody>
            {suggestions.map(suggestion => (
              <tr key={suggestion.name}>
                <td>
                  <button
                    type="button"
                    className="autocomplete-option"
                    onClick={() => {
                      axios({
                        url: '/facebook/edit/autocomplete',
                        params: { q: suggestion.name },
                        headers: {
                          'X-Requested-With': 'XMLHttpRequest',
                        },
                      }).then(response => {
                        return setSuggestions(response.data);
                      });

                      setQuery(suggestion.name);
                    }}
                  >
                    {suggestion.name}
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

  const tagAutocomplete = event => {
    setQuery(event.target.value);
    axios({
      url: '/facebook/edit/autocomplete',
      params: { q: event.target.value },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then(response => {
      return setSuggestions(response.data);
    });
  };

  const newTagGenerator = () => {
    return newTags.map(newTag => {
      return (
        <li className="fb-tag" key={newTag}>
          <input
            className="tag-input"
            type="text"
            onChange={tagAutocomplete}
            placeholder="New Tag"
            maxLength="255"
            size="20"
            name={`tags[${Date.now()}]`}
            id={`tags[${Date.now()}]`}
            value={query}
          />
          <button
            type="button"
            onClick={removeTagHandler}
            data={newTag}
            style={{
              display: 'inline',
              padding: 0,
              margin: 0,
              background: '#fff',
              color: '#6F4933',
              minWidth: 0,
            }}
          >
            X
          </button>
          {tagSuggestions()}
        </li>
      );
    });
  };

  const hideOnClick = event => {
    const target = event.target.parentElement;
    target.style.display = 'none';
  };

  return (
    <FacebookLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
      <article className="list-creation">
        <section>
          <div id="errors">
            {currentUser.errors && currentUser.errors.full_messages
              ? currentUser.errors.full_messages.map(msg => {
                  return <p>{`* ${msg}`}</p>;
                })
              : null}
          </div>

          <form
            id={`edit_${currentUser.type.toLowerCase()}_${currentUser.id}`}
            className={`edit_${currentUser.type.toLowerCase()}`}
            encType="multipart/form-data"
            action={`/facebook/users/${currentUser.id}`}
            acceptCharset="UTF-8"
            method="post"
          >
            <input type="hidden" name="authenticity_token" value={authToken} />
            <input type="hidden" name="_method" value="patch" />
            <div className="field">
              <h3>Profile Picture</h3>
              <br />
              <input
                id={`${currentUser.type.toLowerCase()}_picture`}
                type="file"
                name={`${currentUser.type.toLowerCase()}[picture]`}
              />
            </div>

            <br />
            <br />

            <div className="field">
              {currentUser.type === 'Student' ||
              currentUser.type === 'Alumni' ? (
                <>
                  <h3>Tags</h3>
                  <p>
                    <strong>Note:&nbsp;</strong>
                    Only actual student groups (student organizations, music
                    groups, sports teams, etc.) can be added as tags. Don&#39;t
                    see your group? Contact us at wso-dev@wso.williams.edu
                  </p>
                  <ul id="tag-list">
                    {currentUser.tags.map(tag => (
                      <li className="fb-tag" key={tag.name}>
                        {tag.name}
                        <a
                          href={`/facebook/remove-tag/${tag.id}`}
                          data-method="delete"
                          className="fb-tag-remove"
                          data-remote="true"
                          rel="nofollow"
                          onClick={hideOnClick}
                        >
                          X
                        </a>
                      </li>
                    ))}

                    {newTagGenerator()}

                    <li id="add-tag">
                      <button type="button" onClick={addTagHandler}>
                        Add Tag
                      </button>
                    </li>
                  </ul>
                  <br />
                  <br />
                </>
              ) : null}
              <h3>Preferences</h3>
              Preselected values indicate current settings
              <br />
              <br />
              <strong>Facebook profile:</strong>
              <br />
              Show
              {' '}
              <input
                id={`${currentUser.type.toLowerCase()}_visible_1`}
                type="radio"
                value="1"
                defaultChecked={currentUser.visible}
                name={`${currentUser.type.toLowerCase()}[visible]`}
              />
              Hide
              {' '}
              <input
                id={`${currentUser.type.toLowerCase()}_visible_0`}
                type="radio"
                value="0"
                defaultChecked={!currentUser.visible}
                name={`${currentUser.type.toLowerCase()}[visible]`}
              />
              <br />
              <br />
              <strong>Home Address:</strong>
              <br />
              Show
              {' '}
              <input
                id={`${currentUser.type.toLowerCase()}_home_visible_1`}
                type="radio"
                value="1"
                defaultChecked={currentUser.home_visible}
                name={`${currentUser.type.toLowerCase()}[home_visible]`}
              />
              Hide
              {' '}
              <input
                id={`${currentUser.type.toLowerCase()}_home_visible_0`}
                type="radio"
                value="0"
                defaultChecked={!currentUser.home_visible}
                name={`${currentUser.type.toLowerCase()}[home_visible]`}
              />
              <br />
              <br />
              {currentUser.type === 'Student' ? (
                <>
                  <strong>Dorm Address:</strong>
                  <br />
                  Show
                  {' '}
                  <input
                    id={`${currentUser.type.toLowerCase()}_dorm_visible_1`}
                    type="radio"
                    value="1"
                    defaultChecked={currentUser.dorm_visible}
                    name={`${currentUser.type.toLowerCase()}[dorm_visible]`}
                  />
                  Hide
                  {' '}
                  <input
                    id={`${currentUser.type.toLowerCase()}_dorm_visible_0`}
                    type="radio"
                    value="0"
                    defaultChecked={!currentUser.dorm_visible}
                    name={`${currentUser.type.toLowerCase()}[dorm_visible]`}
                  />
                  <br />
                  <br />
                  <strong>Off Cycle:&nbsp;</strong>
                  <input
                    id={`${currentUser.type.toLowerCase()}_off_cycle`}
                    type="checkbox"
                    name={`${currentUser.type.toLowerCase()}[off_cycle]`}
                  />
                  (Checking this box will subtract 0.5 from your class year.)
                  <br />
                  <br />
                </>
              ) : null}
              <strong>Pronouns:</strong>
              <input
                type="text"
                name={`${currentUser.type.toLowerCase()}[pronoun]`}
                id={`${currentUser.type.toLowerCase()}_pronoun`}
              />
              <br />
              <br />
              <input
                type="submit"
                name="commit"
                value="Save changes"
                data-disable-with="Save changes"
              />
            </div>
          </form>
        </section>
      </article>
    </FacebookLayout>
  );
};

FacebookEdit.propTypes = {
  currentUser: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FacebookEdit.defaultProps = {
  notice: '',
  warning: '',
};

export default FacebookEdit;
