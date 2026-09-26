import React, { ReactNode } from "react";

export type HelpAbbrProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

const HelpAbbr = ({ title, children, className = "" }: HelpAbbrProps) => {
  return (
    <abbr title={title} className={className || undefined}>
      {children}
    </abbr>
  );
};

export default HelpAbbr;
