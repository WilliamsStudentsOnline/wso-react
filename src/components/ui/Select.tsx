import React from "react";
import "../stylesheets/Select.css";

export type SelectProps = {
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: Array<string | number | boolean | null | undefined>;
  value: string | number | boolean;
  valueList?: Array<string | number | boolean | null | undefined>;
  fillerOption?: string | number | boolean;
  fillerValue?: string | number | boolean | null | object;
  style?: React.CSSProperties;
  className?: string;
};

const Select = ({
  onChange,
  options,
  value,
  valueList = [],
  fillerOption = "",
  fillerValue = null,
  style = {},
  className = "",
}: SelectProps) => {
  return (
    <select
      className={["select", className].filter(Boolean).join(" ")}
      style={style}
      onChange={onChange}
      value={value as string | number}
    >
      {fillerOption ? (
        <option value={fillerValue as string | number}>{fillerOption}</option>
      ) : null}

      {options.map((option, index) => {
        if (option === null || option === undefined || option === "") {
          return null;
        }
        return (
          <option
            value={
              (valueList[index] !== undefined && valueList[index] !== null
                ? valueList[index]
                : option) as string | number
            }
            key={String(option)}
          >
            {option}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
