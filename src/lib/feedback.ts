import type { WSO } from "wso-api-client";

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

type FeedbackService = {
  createFeedback: (
    body: CreateFeedbackParams
  ) => Promise<{ data?: Feedback | null }>;
  listFeedback: (
    params?: ListFeedbackParams
  ) => Promise<{ data?: Feedback[] | null; paginationTotal?: number }>;
  getFeedback: (
    id: number,
    params?: { preload?: string[] }
  ) => Promise<{ data?: Feedback | null }>;
  updateFeedback: (
    id: number,
    body: UpdateFeedbackParams
  ) => Promise<{ data?: Feedback | null }>;
  deleteFeedback: (id: number) => Promise<unknown>;
};

const STUB_KEY = "wso-feedback-stub";

const readStub = (): Feedback[] => {
  try {
    const raw = localStorage.getItem(STUB_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Feedback[];
  } catch {
    return [];
  }
};

const writeStub = (items: Feedback[]) => {
  localStorage.setItem(STUB_KEY, JSON.stringify(items));
};

const stubService = (): FeedbackService => ({
  async createFeedback(body) {
    const items = readStub();
    const created: Feedback = {
      id: items.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      notes: body.notes,
      preferredName: body.preferredName ?? null,
      url: body.url ?? null,
      userID: body.userID ?? null,
      priority: "none",
      createdAt: new Date().toISOString(),
    };
    writeStub([created, ...items]);
    return { data: created };
  },
  async listFeedback(params) {
    let items = readStub();
    if (params?.priority) {
      items = items.filter((item) => item.priority === params.priority);
    }
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? items.length;
    return {
      data: items.slice(offset, offset + limit),
      paginationTotal: items.length,
    };
  },
  async getFeedback(id) {
    const item = readStub().find((row) => row.id === id) ?? null;
    return { data: item };
  },
  async updateFeedback(id, body) {
    const items = readStub();
    const index = items.findIndex((row) => row.id === id);
    if (index < 0) throw new Error("Feedback not found");
    const next = {
      ...items[index],
      ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
      ...(body.issue !== undefined ? { issue: body.issue } : {}),
      ...(body.priority !== undefined ? { priority: body.priority } : {}),
    };
    items[index] = next;
    writeStub(items);
    return { data: next };
  },
  async deleteFeedback(id) {
    writeStub(readStub().filter((row) => row.id !== id));
    return { data: { deleted: id } };
  },
});

const getService = (wso: WSO): FeedbackService => {
  const svc = (wso as WSO & { feedbackService?: FeedbackService })
    .feedbackService;
  if (svc?.createFeedback) return svc;
  return stubService();
};

export const createFeedback = (wso: WSO, body: CreateFeedbackParams) =>
  getService(wso).createFeedback(body);

export const listFeedback = (wso: WSO, params?: ListFeedbackParams) =>
  getService(wso).listFeedback(params);

export const getFeedback = (
  wso: WSO,
  id: number,
  params?: { preload?: string[] }
) => getService(wso).getFeedback(id, params);

export const updateFeedback = (
  wso: WSO,
  id: number,
  body: UpdateFeedbackParams
) => getService(wso).updateFeedback(id, body);

export const deleteFeedback = (wso: WSO, id: number) =>
  getService(wso).deleteFeedback(id);

export const isFeedbackPriority = (value: string): value is FeedbackPriority =>
  (FEEDBACK_PRIORITIES as string[]).includes(value);
