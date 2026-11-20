import React, { act } from "react";
import { createRoot } from "react-dom/client";
import {
  unstable_HistoryRouter as HistoryRouter,
  Link,
  Routes,
  Route,
} from "react-router";
import history from "../../lib/history";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

test("Link click re-renders HistoryRouter routes", async () => {
  history.replace("/facebook/users/1");
  const el = document.createElement("div");
  document.body.appendChild(el);
  const root = createRoot(el);
  await act(async () => {
    root.render(
      <HistoryRouter history={history}>
        <nav>
          <Link to="dining">Dining</Link>
        </nav>
        <Routes>
          <Route path="facebook/*" element={<p>FB PAGE</p>} />
          <Route path="dining/*" element={<p>DINING PAGE</p>} />
        </Routes>
      </HistoryRouter>
    );
  });
  await act(async () => {
    el.querySelector("a")!.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })
    );
  });
  expect(window.location.pathname).toBe("/dining");
  expect(el.textContent).toContain("DINING PAGE");
  root.unmount();
});
