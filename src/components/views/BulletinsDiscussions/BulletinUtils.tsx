import { ModelsBoardThread } from "wso-api-client/lib/services/types";
import { PostType, PostTypeName } from "../../../lib/types";

export type BoardThread = ModelsBoardThread;

/** Board API uses singular `discussion`; FE routes keep plural `discussions`. */
export const boardApiType = (type: PostType | string): string => {
  if (type === PostType.Discussions || type === "discussions") {
    return "discussion";
  }
  return type;
};

export const postTypeFromApi = (apiType?: string): PostType | undefined => {
  if (!apiType) return undefined;
  if (apiType === "discussion") return PostType.Discussions;
  return Object.values(PostType).find((t) => t === apiType);
};

/** FE route segment for a thread type (`discussion` → `discussions`). */
export const boardTypePathSegment = (apiType?: string): string => {
  return postTypeFromApi(apiType) ?? apiType ?? "";
};

export const boardThreadPath = (thread: BoardThread): string => {
  const type = boardTypePathSegment(thread.type);
  return `/bulletins/${type}/${thread.id}`;
};

/** After delete / leave thread — type index or filtered feed. */
export const boardFeedPathForType = (apiType?: string): string => {
  const type = boardTypePathSegment(apiType);
  if (!type) return "/bulletins";
  if (type === PostType.Discussions) return "/bulletins?types=discussions";
  return `/bulletins/${type}`;
};

export const boardThreadTypeLabel = (thread: BoardThread): string => {
  const type = postTypeFromApi(thread.type);
  if (type) return PostTypeName.get(type) ?? thread.type ?? "";
  return thread.type ?? "";
};

export const boardThreadTitle = (thread: BoardThread) => {
  if (!thread) return "(ERROR)";

  if (thread.type === "ride" && thread.ride) {
    const ride = thread.ride;
    const label = ride.offeringRide ? "Offer" : "Request";
    return `${ride.source ?? "(Unspecified)"} to ${
      ride.destination ?? "(Unspecified)"
    } (${label})`;
  }

  return thread.title ?? "(No Title)";
};

const startOfLocalDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Relative list date: Today / Yesterday / N days ago / absolute. */
export const formatBoardDate = (raw?: string | Date | null) => {
  const absoluteOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  if (!raw) {
    return new Date(0).toLocaleDateString("en-US", absoluteOptions);
  }

  const date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return new Date(0).toLocaleDateString("en-US", absoluteOptions);
  }

  const today = startOfLocalDay(new Date());
  const day = startOfLocalDay(date);
  const diffDays = Math.round(
    (today.getTime() - day.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays >= 2 && diffDays <= 6) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", absoluteOptions);
};

export const boardThreadDate = (thread: BoardThread) => {
  if (!thread) return "(ERROR)";
  return formatBoardDate(
    thread.lastActive ?? thread.createdAt ?? thread.startsAt
  );
};

export const boardThreadAuthor = (thread: BoardThread) => {
  if (thread.user?.name) return thread.user.name;
  if (thread.exUserName) return thread.exUserName;
  return "WSO User";
};

/** @deprecated use boardThreadTitle */
export const generateBulletinTitle = boardThreadTitle;
/** @deprecated use boardThreadDate */
export const generateBulletinDate = boardThreadDate;
