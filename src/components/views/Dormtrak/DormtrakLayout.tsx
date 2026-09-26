// React imports
import React, { useState, useEffect, ReactElement } from "react";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser } from "../../../lib/authSlice";

// Additional imports
import { useNavigate } from "react-router-dom";
import { ModelsNeighborhood } from "wso-api-client/lib/services/types";
import { ServiceHeader, SearchBar, ServiceTab } from "../../ui";

const DormtrakLayout = ({ children }: { children: ReactElement }) => {
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [neighborhoods, updateNeighborhoods] = useState<ModelsNeighborhood[]>(
    []
  );
  const [query, updateQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadNeighborhoods = async () => {
      try {
        const neighborhoodsResponse =
          await wso.dormtrakService.listNeighborhoods();
        if (isMounted && neighborhoodsResponse.data) {
          updateNeighborhoods(neighborhoodsResponse.data);
        }
      } catch {
        // It's alright to handle this gracefully without showing them.
      }
    };

    loadNeighborhoods();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    navigateTo(`/dormtrak/search?q=${query}`, { replace: true });
  };

  if (!currUser) {
    return null;
  }

  const tabs: ServiceTab[] = [
    { to: "/dormtrak", label: "Home", end: true },
    { to: "/dormtrak/policy", label: "Policy" },
    {
      type: "external",
      href: "http://student-life.williams.edu",
      label: "OCL",
      title: "Office of Campus Life",
    },
    ...neighborhoods
      .filter(
        (n) => n.name !== "First-year" && n.name !== "Co-op" && n.name && n.id
      )
      .map((neighborhood) => ({
        to: `/dormtrak/neighborhoods/${neighborhood.id}`,
        label: neighborhood.name as string,
        title: `${neighborhood.name} Neighborhood Dorms`,
      })),
  ];

  return (
    <>
      <ServiceHeader
        title="Dormtrak"
        titleTo="/dormtrak"
        tabs={tabs}
        search={
          <SearchBar
            value={query}
            onChange={updateQuery}
            onSubmit={submitHandler}
            placeholder="Enter all or part of a building's name"
          />
        }
      />
      {children}
    </>
  );
};

export default DormtrakLayout;
