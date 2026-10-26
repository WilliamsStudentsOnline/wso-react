import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { BannerBanner } from "wso-api-client/lib/services/types";
import "./Admin.css";

const bannerStatusText = (banner: BannerBanner | null): string => {
  if (!banner || !banner.visible) return "Currently hidden";
  const type = banner.type?.trim();
  if (!type) return "Currently visible";
  return `Currently visible as ${type}`;
};

const flagsStatusText = (count: number | null): string => {
  if (count === null) return "Loading…";
  if (count === 1) return "1 flag to review";
  return `${count} flags to review`;
};

const AdminHome = () => {
  const wso = useAppSelector(getWSO);
  const [banner, setBanner] = useState<BannerBanner | null>(null);
  const [flagCount, setFlagCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const bannerResponse = await wso.bannerService.getBanner();
        if (isMounted) setBanner(bannerResponse.data ?? {});
      } catch {
        if (isMounted) setBanner({});
      }

      try {
        const flaggedResponse =
          await wso.factrakService.listFlaggedSurveysAdmin({
            preload: ["professor", "course"],
            populateAgreements: true,
          });
        if (isMounted) setFlagCount(flaggedResponse.data?.length ?? 0);
      } catch {
        if (isMounted) setFlagCount(0);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [wso]);

  return (
    <article className="facebook-profile">
      <section className="margin-vertical-small">
        <ul className="admin-tools">
          <li>
            <Link to="/admin/banner">
              <span className="admin-tools__title">Homepage banner</span>
              <span className="admin-tools__desc">
                {bannerStatusText(banner)}
              </span>
            </Link>
          </li>
          <li>
            <Link to="/factrak/moderate">
              <span className="admin-tools__title">
                Factrak moderation (&rarr;)
              </span>
              <span className="admin-tools__desc">
                {flagsStatusText(flagCount)}
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default AdminHome;
