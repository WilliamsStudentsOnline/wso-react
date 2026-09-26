import React, { FormEvent, FocusEventHandler, ReactNode } from "react";
import "./SearchBar.css";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  placeholder?: string;
  id?: string;
  submitLabel?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  inputStyle?: React.CSSProperties;
  onFocus?: FocusEventHandler<HTMLFormElement>;
  onBlur?: FocusEventHandler<HTMLFormElement>;
};

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
  id = "search",
  submitLabel = "Search",
  actions,
  children,
  className = "",
  inputStyle,
  onFocus,
  onBlur,
}: SearchBarProps) => {
  return (
    <div className={["wso-search-bar", className].filter(Boolean).join(" ")}>
      <form onSubmit={onSubmit} onFocus={onFocus} onBlur={onBlur}>
        <div className="wso-search-bar__row">
          <input
            type="search"
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
          <input
            type="submit"
            value={submitLabel}
            className="submit"
            data-disable-with={submitLabel}
          />
          {actions ? (
            <div className="wso-search-bar__actions">{actions}</div>
          ) : null}
        </div>
        {children}
      </form>
    </div>
  );
};

export default SearchBar;
