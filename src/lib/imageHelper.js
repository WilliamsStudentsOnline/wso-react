// Avatar imports
import AgardAvatar from "../assets/images/avatars/Agard.jpg";
import BrooksAvatar from "../assets/images/avatars/Brooks.jpg";
import BryantAvatar from "../assets/images/avatars/Bryant.jpg";
import CarterAvatar from "../assets/images/avatars/Carter.jpg";
import ChadbourneAvatar from "../assets/images/avatars/Chadbourne.jpg";
import CurrierAvatar from "../assets/images/avatars/Currier.jpg";
import DoddAvatar from "../assets/images/avatars/Dodd.jpg";
import DoughtyAvatar from "../assets/images/avatars/Doughty.jpg";
import EastAvatar from "../assets/images/avatars/East.jpg";
import FayerweatherAvatar from "../assets/images/avatars/Fayerweather.jpg";
import FitchAvatar from "../assets/images/avatars/Fitch.jpg";
import GarfieldAvatar from "../assets/images/avatars/Garfield.jpg";
import GladdenAvatar from "../assets/images/avatars/Gladden.jpg";
import GoodrichAvatar from "../assets/images/avatars/Goodrich.jpg";
import HornAvatar from "../assets/images/avatars/Horn.jpg";
import HubbellAvatar from "../assets/images/avatars/Hubbell.jpg";
import LambertAvatar from "../assets/images/avatars/Lambert.jpg";
import LehmanAvatar from "../assets/images/avatars/Lehman.jpg";
import MarkHopkinsAvatar from "../assets/images/avatars/Mark Hopkins.jpg";
import MilhamAvatar from "../assets/images/avatars/Milham.jpg";
import MorganAvatar from "../assets/images/avatars/Morgan.jpg";
import ParsonsAvatar from "../assets/images/avatars/Parsons.jpg";
import PerryAvatar from "../assets/images/avatars/Perry.jpg";
import PokerFlatsAvatar from "../assets/images/avatars/Poker Flats.jpg";
import ProspectAvatar from "../assets/images/avatars/Prospect.jpg";
import SewallAvatar from "../assets/images/avatars/Sewall.jpg";
import SpencerAvatar from "../assets/images/avatars/Spencer.jpg";
import SusieHopkinsAvatar from "../assets/images/avatars/Susie Hopkins.jpg";
import ThompsonAvatar from "../assets/images/avatars/Thompson.jpg";
import TylerAvatar from "../assets/images/avatars/Tyler.jpg";
import TylerAnnexAvatar from "../assets/images/avatars/Tyler Annex.jpg";
import WestAvatar from "../assets/images/avatars/West.jpg";
import WoodAvatar from "../assets/images/avatars/Wood.jpg";
import WoodbridgeAvatar from "../assets/images/avatars/Woodbridge.jpg";

// Banner Imports
import AgardBanner from "../assets/images/banners/Agard.jpg";
import BrooksBanner from "../assets/images/banners/Brooks.jpg";
import BryantBanner from "../assets/images/banners/Bryant.jpg";
import CarterBanner from "../assets/images/banners/Carter.jpg";
import ChadbourneBanner from "../assets/images/banners/Chadbourne.jpg";
import CurrierBanner from "../assets/images/banners/Currier.jpg";
import DoddBanner from "../assets/images/banners/Dodd.jpg";
import DoughtyBanner from "../assets/images/banners/Doughty.jpg";
import EastBanner from "../assets/images/banners/East.jpg";
import FayerweatherBanner from "../assets/images/banners/Fayerweather.jpg";
import FitchBanner from "../assets/images/banners/Fitch.jpg";
import GarfieldBanner from "../assets/images/banners/Garfield.jpg";
import GladdenBanner from "../assets/images/banners/Gladden.jpg";
import GoodrichBanner from "../assets/images/banners/Goodrich.jpg";
import HornBanner from "../assets/images/banners/Horn.jpg";
import HubbellBanner from "../assets/images/banners/Hubbell.jpg";
import LambertBanner from "../assets/images/banners/Lambert.jpg";
import LehmanBanner from "../assets/images/banners/Lehman.jpg";
import MarkHopkinsBanner from "../assets/images/banners/Mark Hopkins.jpg";
import MilhamBanner from "../assets/images/banners/Milham.jpg";
import MorganBanner from "../assets/images/banners/Morgan.jpg";
import ParsonsBanner from "../assets/images/banners/Parsons.jpg";
import PerryBanner from "../assets/images/banners/Perry.jpg";
import PokerFlatsBanner from "../assets/images/banners/Poker Flats.jpg";
import ProspectBanner from "../assets/images/banners/Prospect.jpg";
import SewallBanner from "../assets/images/banners/Sewall.jpg";
import SpencerBanner from "../assets/images/banners/Spencer.jpg";
import SusieHopkinsBanner from "../assets/images/banners/Susie Hopkins.jpg";
import ThompsonBanner from "../assets/images/banners/Thompson.jpg";
import TylerBanner from "../assets/images/banners/Tyler.jpg";
import TylerAnnexBanner from "../assets/images/banners/Tyler Annex.jpg";
import WestBanner from "../assets/images/banners/West.jpg";
import WoodBanner from "../assets/images/banners/Wood.jpg";
import WoodbridgeBanner from "../assets/images/banners/Woodbridge.jpg";

/**
 * We create these maps so that the assets need only be loaded once rather than multiple
 * times as the user navigates (e.g. dormtrak). Might look into coordinating with the
 * backend to see how these images can be delivered with a cache policy.
 */
const avatarMap = new Map([
  ["Agard", AgardAvatar],
  ["Brooks", BrooksAvatar],
  ["Bryant", BryantAvatar],
  ["Carter", CarterAvatar],
  ["Chadbourne", ChadbourneAvatar],
  ["Currier", CurrierAvatar],
  ["Dodd", DoddAvatar],
  ["Doughty", DoughtyAvatar],
  ["East", EastAvatar],
  ["Fayerweather", FayerweatherAvatar],
  ["Fitch", FitchAvatar],
  ["Garfield", GarfieldAvatar],
  ["Gladden", GladdenAvatar],
  ["Goodirch", GoodrichAvatar],
  ["Horn", HornAvatar],
  ["Hubbell", HubbellAvatar],
  ["Lambert", LambertAvatar],
  ["Lehman", LehmanAvatar],
  ["Mark Hopkins", MarkHopkinsAvatar],
  ["Milham", MilhamAvatar],
  ["Morgan", MorganAvatar],
  ["Parsons", ParsonsAvatar],
  ["Perry", PerryAvatar],
  ["Poker Flat", PokerFlatsAvatar],
  ["Prospect", ProspectAvatar],
  ["Sewall", SewallAvatar],
  ["Spencer", SpencerAvatar],
  ["Susie Hopkins", SusieHopkinsAvatar],
  ["Thompson", ThompsonAvatar],
  ["Tyler", TylerAvatar],
  ["Tyler Annex", TylerAnnexAvatar],
  ["West", WestAvatar],
  ["Wood", WoodAvatar],
  ["Woodbridge", WoodbridgeAvatar],
]);

const bannerMap = new Map([
  ["Agard", AgardBanner],
  ["Brooks", BrooksBanner],
  ["Bryant", BryantBanner],
  ["Carter", CarterBanner],
  ["Chadbourne", ChadbourneBanner],
  ["Currier", CurrierBanner],
  ["Dodd", DoddBanner],
  ["Doughty", DoughtyBanner],
  ["East", EastBanner],
  ["Fayerweather", FayerweatherBanner],
  ["Fitch", FitchBanner],
  ["Garfield", GarfieldBanner],
  ["Gladden", GladdenBanner],
  ["Goodirch", GoodrichBanner],
  ["Horn", HornBanner],
  ["Hubbell", HubbellBanner],
  ["Lambert", LambertBanner],
  ["Lehman", LehmanBanner],
  ["Mark Hopkins", MarkHopkinsBanner],
  ["Milham", MilhamBanner],
  ["Morgan", MorganBanner],
  ["Parsons", ParsonsBanner],
  ["Perry", PerryBanner],
  ["Poker Flat", PokerFlatsBanner],
  ["Prospect", ProspectBanner],
  ["Sewall", SewallBanner],
  ["Spencer", SpencerBanner],
  ["Susie Hopkins", SusieHopkinsBanner],
  ["Thompson", ThompsonBanner],
  ["Tyler", TylerBanner],
  ["Tyler Annex", TylerAnnexBanner],
  ["West", WestBanner],
  ["Wood", WoodBanner],
  ["Woodbridge", WoodbridgeBanner],
]);

/**
 * Returns the avatar (smaller) photo of the given dormitory building.
 *
 * @param {String} name - Name of dormitory whose avatar photo we wish to obtain.
 */
export const avatarHelper = (name) => {
  return avatarMap.get(name);
};

/**
 * Returns the banner (larger) photo of the given dormitory building.
 *
 * @param {String} name - Name of dormitory whose banner photo we wish to obtain.
 */
export const bannerHelper = (name) => {
  return bannerMap.get(name);
};
