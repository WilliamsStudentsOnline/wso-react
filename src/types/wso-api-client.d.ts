import "wso-api-client/lib/generated/types";

declare module "wso-api-client/lib/generated/types" {
  interface UserUpdateUserParams {
    homeTown?: string;
    homeState?: string;
    homeCountry?: string;
  }
}
