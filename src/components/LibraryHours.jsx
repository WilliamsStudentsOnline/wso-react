import React, { useEffect, useState } from "react";
import axios from "axios";

const LibraryHoursTable = () => {
  const [services, setServices] = useState(null);
  const [error, setError] = useState(false);

  const loadLibraryHours = (retry = false) => {
    const axiosHeaders = {
      "X-Requested-With": "XMLHttpRequest",
    };

    axios({
      url: "/library.json",
      headers: axiosHeaders,
    })
      .then((response) => {
        if (response.status !== 200 || response.statusText !== "OK") {
          if (!retry) loadLibraryHours(true);
          else setError(true);
        } else {
          setServices(Object.values(response.data.libraryservices));
        }
      })
      .catch(() => {
        if (!retry) loadLibraryHours(true);
        else setError(true);
      });
  };

  useEffect(() => {
    loadLibraryHours();
  }, []);

  if (error) return <p>Unable to load hours.</p>;
  if (!services) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: "60%", marginLeft: "auto", marginRight: "auto" }}>
      <h3>Library Hours</h3>
      <table style={{ border: "2px solid #D9D9D9" }}>
        <thead>
          <tr>
            <th>Library</th>
            <th>Opens</th>
            <th>Closes</th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc) =>
            svc.hours.open === null ? (
              <tr key={`${svc.name}-no-hours`}>
                <td style={{ backgroundColor: "#fcfcfc" }}>
                  <b>{svc.name}</b>
                </td>
                <td colSpan={2} style={{ backgroundColor: "#fcfcfc" }}>
                  (no hours)
                </td>
              </tr>
            ) : (
              svc.hours.open.map((open, i) => (
                <tr key={`${svc.name}-${i}`}>
                  {i === 0 && (
                    <td
                      style={{ backgroundColor: "#fcfcfc" }}
                      rowSpan={svc.hours.open.length}
                    >
                      <b>{svc.name}</b>
                    </td>
                  )}
                  <td style={{ backgroundColor: "#fcfcfc" }}>{open}</td>
                  <td style={{ backgroundColor: "#fcfcfc" }}>
                    {svc.hours.close[i] || ""}
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LibraryHoursTable;
