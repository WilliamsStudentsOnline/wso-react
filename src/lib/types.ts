import { JwtPayload } from "jwt-decode";
import React from "react";

export interface ButtonProps {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children?: string;
}
export interface CommonPropTypes {
  width?: string;
  height?: string;
  center?: boolean;
  className?: string;
}

export interface User {
  id: number;
  admin?: boolean;
  unixID: string;
  dormRoomID?: number;
  hasAcceptedDormtrakPolicy?: boolean;
  type?: string;
  pronoun?: string;
  visible?: boolean;
  homeVisible?: boolean;
  dormVisible?: boolean;
  offCycle?: boolean;
  factrakAdmin?: boolean;
  hasAcceptedFactrakPolicy?: boolean;
  factrakSurveyDeficit?: number;
  williamsID?: string;
  cellPhone?: string;
}

export interface WSOToken extends JwtPayload {
  scope: string[];
  tokenLevel: number;
}

// all types of posts that you can see on the homepage
// including bulletins, discussions, and rides
export enum PostType {
  Discussions = "discussions",
  Announcements = "announcement",
  Exchanges = "exchange",
  LostAndFound = "lostAndFound",
  Jobs = "job",
  Rides = "ride",
}

export const PostTypeName: Map<PostType, string> = new Map([
  [PostType.Discussions, "Discussions"],
  [PostType.Announcements, "Announcements"],
  [PostType.Exchanges, "Exchanges"],
  [PostType.LostAndFound, "Lost and Found"],
  [PostType.Jobs, "Jobs"],
  [PostType.Rides, "Rides"],
]);
