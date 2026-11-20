// React imports
import React, { useState } from "react";
import { WSO } from "wso-api-client";
import { AutocompleteACEntry } from "wso-api-client/lib/services/types";

const ERROR_TAG_ALREADY_EXISTS = 1408;

interface TagRemoveProps {
  onClick: () => void;
  label: string;
}

const TagRemove = ({ onClick, label }: TagRemoveProps) => (
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

type ErrorLike = { message?: string; error?: string; errorCode?: number };

const errorMessage = (error: unknown) => {
  const e = error as ErrorLike | undefined;
  return e?.message || e?.error || "Something went wrong.";
};

export interface TagEditProps {
  tags: string[];
  updateTags: (tags: string[]) => void;
  updateErrors: (errors: string[]) => void;
  wso: WSO;
}

const TagEdit = ({ tags, updateTags, updateErrors, wso }: TagEditProps) => {
  const [newTag, updateNewTag] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteACEntry[]>([]);
  const [busy, setBusy] = useState(false);

  const trimmed = newTag.trim();
  const matchingSuggestion = suggestions.find(
    (s) => s.value && s.value.toLowerCase() === trimmed.toLowerCase()
  );
  const alreadyHaveTag = tags.some(
    (tag) => tag.toLowerCase() === trimmed.toLowerCase()
  );
  const showRequestOption = Boolean(trimmed) && !matchingSuggestion;

  const tagAutocomplete = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const updateUserTags = async (updatedTags: string[]) => {
    await wso.userService.updateUserTags("me", { tags: updatedTags });
    updateTags(updatedTags);
    updateNewTag("");
    setSuggestions([]);
    updateErrors([]);
  };

  const requestNewTag = async (tagName: string) => {
    await wso.userService.createUserTagRequest("me", { tagName });
    updateNewTag("");
    setSuggestions([]);
    updateErrors([
      `Requested new tag "${tagName}" - pending moderator approval.`,
    ]);
  };

  const addExistingTag = async (tagName: string) => {
    if (tags.some((tag) => tag.toLowerCase() === tagName.toLowerCase())) {
      updateErrors(["Unable to add the same tag twice."]);
      return;
    }
    setBusy(true);
    try {
      await updateUserTags([...tags, tagName]);
    } catch (error) {
      updateErrors([errorMessage(error)]);
    } finally {
      setBusy(false);
    }
  };

  const confirmAndRequestTag = async (tagName: string) => {
    if (busy) return;
    if (tags.some((tag) => tag.toLowerCase() === tagName.toLowerCase())) {
      updateErrors(["Unable to add the same tag twice."]);
      return;
    }
    // eslint-disable-next-line no-restricted-globals, no-alert
    const ok = confirm(
      `Request new tag "${tagName}"?\n\nTags are intended for RSOs and other student groups. Once we approve your request, any student will be able to add this tag.`
    );
    if (!ok) return;

    setBusy(true);
    try {
      await requestNewTag(tagName);
    } catch (error) {
      if ((error as ErrorLike)?.errorCode === ERROR_TAG_ALREADY_EXISTS) {
        await updateUserTags([...tags, tagName]);
        return;
      }
      updateErrors([errorMessage(error)]);
    } finally {
      setBusy(false);
    }
  };

  const addTagHandler = async () => {
    if (!trimmed || busy) {
      updateErrors([]);
      return;
    }
    if (alreadyHaveTag) {
      updateErrors(["Unable to add the same tag twice."]);
      return;
    }

    if (matchingSuggestion?.value) {
      await addExistingTag(matchingSuggestion.value);
      return;
    }

    await confirmAndRequestTag(trimmed);
  };

  const removeTagHandler = async (index: number) => {
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

  const showDropdown = suggestions.length > 0 || showRequestOption;

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
            maxLength={255}
            value={newTag}
            disabled={busy}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTagHandler();
              }
            }}
          />
          {showDropdown ? (
            <ul className="tag-edit__suggestions">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    className="tag-edit__suggestion"
                    disabled={busy}
                    onClick={() =>
                      suggestion.value && addExistingTag(suggestion.value)
                    }
                  >
                    {suggestion.value}
                  </button>
                </li>
              ))}
              {showRequestOption ? (
                <li>
                  <button
                    type="button"
                    className="tag-edit__suggestion tag-edit__suggestion--request"
                    disabled={busy || alreadyHaveTag}
                    onClick={() => confirmAndRequestTag(trimmed)}
                  >
                    Request new tag
                  </button>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          className="tag-edit__add"
          onClick={addTagHandler}
          disabled={!trimmed || busy}
          aria-label="Add tag"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TagEdit;
