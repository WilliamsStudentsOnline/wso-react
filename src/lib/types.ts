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
