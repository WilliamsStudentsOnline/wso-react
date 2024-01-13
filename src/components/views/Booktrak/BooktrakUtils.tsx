import { ModelsBookListing } from "wso-api-client/lib/services/types";

const ListingConditionEnum = ModelsBookListing.ConditionEnum;
export const BookConditionEnumToString = (
  condition: ModelsBookListing.ConditionEnum
): string => {
  switch (condition) {
    case ListingConditionEnum.POOR:
      return "Poor";
    case ListingConditionEnum.FAIR:
      return "Fair";
    case ListingConditionEnum.GOOD:
      return "Good";
    case ListingConditionEnum.VERYGOOD:
      return "Very Good";
    case ListingConditionEnum.LIKENEW:
      return "Like New";
    case ListingConditionEnum.NEW:
      return "New";
    case ListingConditionEnum.Empty:
    default:
      return "";
  }
};

export const BookConditionStringToEnum = (
  condition: string
): ModelsBookListing.ConditionEnum => {
  switch (condition) {
    case "Poor":
      return ListingConditionEnum.POOR;
    case "Fair":
      return ListingConditionEnum.FAIR;
    case "Good":
      return ListingConditionEnum.GOOD;
    case "Very Good":
      return ListingConditionEnum.VERYGOOD;
    case "Like New":
      return ListingConditionEnum.LIKENEW;
    case "New":
      return ListingConditionEnum.NEW;
    case "":
    default:
      return ListingConditionEnum.Empty;
  }
};
