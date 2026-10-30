import type { WSO } from "wso-api-client";
import type {
  FeedbackCreateFeedbackParams,
  FeedbackUpdateFeedbackParams,
  ModelsFeedback,
} from "wso-api-client/lib/services/types";

export type FeedbackPriority =
  | "none"
  | "priority_low"
  | "priority_med"
  | "priority_high"
  | "resolved"
  | "dismissed";

export const FEEDBACK_PRIORITIES: FeedbackPriority[] = [
  "none",
  "priority_low",
  "priority_med",
  "priority_high",
  "resolved",
  "dismissed",
];

export const FEEDBACK_PRIORITY_LABELS: Record<FeedbackPriority, string> = {
  none: "None",
  priority_low: "Low",
  priority_med: "Med",
  priority_high: "High",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

export type FeedbackUser = {
  id?: number;
  name?: string;
  unixID?: string;
};

export type Feedback = {
  id: number;
  userID?: number | null;
  user?: FeedbackUser | null;
  preferredName?: string | null;
  priority: FeedbackPriority;
  url?: string | null;
  notes: string;
  adminNotes?: string | null;
  issue?: string | null;
  createdAt?: string;
};

export type CreateFeedbackParams = {
  notes: string;
  preferredName?: string;
  url?: string;
  userID?: number;
};

export type UpdateFeedbackParams = {
  adminNotes?: string;
  priority?: FeedbackPriority;
  issue?: string;
};

export type ListFeedbackParams = {
  priority?: FeedbackPriority;
  offset?: number;
  limit?: number;
  preload?: string[];
};

export const isFeedbackPriority = (value: string): value is FeedbackPriority =>
  (FEEDBACK_PRIORITIES as string[]).includes(value);

const asPriority = (value: unknown): FeedbackPriority => {
  if (typeof value === "string" && isFeedbackPriority(value)) return value;
  return "none";
};

const fromModel = (item: ModelsFeedback): Feedback => ({
  id: item.id ?? 0,
  userID: item.userID ?? null,
  user: item.user
    ? {
        id: item.user.id,
        name: item.user.name,
        unixID: item.user.unixID,
      }
    : null,
  preferredName: item.preferredName ?? null,
  priority: asPriority(item.priority),
  url: item.url ?? null,
  notes: item.notes ?? "",
  adminNotes: item.adminNotes ?? null,
  issue: item.issue ?? null,
});

export const createFeedback = async (
  wso: WSO,
  body: CreateFeedbackParams
): Promise<{ data: Feedback }> => {
  const payload: FeedbackCreateFeedbackParams = {
    notes: body.notes,
    preferredName: body.preferredName,
    url: body.url,
    userID: body.userID,
  };
  const response = await wso.feedbackService.createFeedback(payload);
  return { data: fromModel(response.data ?? { notes: body.notes }) };
};

export const listFeedback = async (
  wso: WSO,
  params?: ListFeedbackParams
): Promise<{ data: Feedback[]; paginationTotal?: number }> => {
  const response = await wso.adminService.listFeedback({
    priority: params?.priority,
    offset: params?.offset,
    limit: params?.limit,
    preload: params?.preload,
  });
  const data = (response.data ?? []).map(fromModel);
  return {
    data,
    paginationTotal: response.paginationTotal ?? data.length,
  };
};

export const getFeedback = async (
  wso: WSO,
  id: number,
  params?: { preload?: string[] }
): Promise<{ data: Feedback | null }> => {
  const response = await wso.adminService.getFeedback(id, params);
  return { data: response.data ? fromModel(response.data) : null };
};

export const updateFeedback = async (
  wso: WSO,
  id: number,
  body: UpdateFeedbackParams
): Promise<{ data: Feedback }> => {
  const payload: FeedbackUpdateFeedbackParams = {
    adminNotes: body.adminNotes,
    issue: body.issue,
    priority: body.priority as FeedbackUpdateFeedbackParams["priority"],
  };
  const response = await wso.adminService.updateFeedback(id, payload);
  return {
    data: fromModel(
      response.data ?? {
        id,
        notes: "",
        priority: body.priority,
        adminNotes: body.adminNotes,
        issue: body.issue,
      }
    ),
  };
};

export const deleteFeedback = (wso: WSO, id: number) =>
  wso.adminService.deleteFeedback(id);
