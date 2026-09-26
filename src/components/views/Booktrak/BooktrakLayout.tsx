// React imports
import React from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser } from "../../../lib/authSlice";

import { ServiceHeader, ServiceTab } from "../../ui";

const BooktrakLayout = ({ children }: { children: React.ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);

  const tabs: ServiceTab[] = [
    { to: "/booktrak", label: "Search Books", end: true },
    { to: "/booktrak/buy", label: "Buy Listings" },
    { to: "/booktrak/sell", label: "Sell Listings" },
    ...(currUser ? [{ to: "/booktrak/edit", label: "My Listings" }] : []),
  ];

  return (
    <div className="facebook">
      <ServiceHeader title="Booktrak" titleTo="/booktrak" tabs={tabs} />
      {children}
    </div>
  );
};

export default BooktrakLayout;
