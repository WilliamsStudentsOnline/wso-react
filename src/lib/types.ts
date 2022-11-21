import { JwtPayload } from "jwt-decode";

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
  Discussions = "Discussions",
  Announcements = "Announcements",
  Exchanges = "Exchanges",
  LostAndFound = "Lost And Found",
  Jobs = "Jobs",
  Rides = "Rides",
}
