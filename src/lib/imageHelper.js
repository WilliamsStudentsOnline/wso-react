import AgardAvatar from "../assets/images/avatars/Agard.png";
import BrooksAvatar from "../assets/images/avatars/Brooks.png";
import BryantAvatar from "../assets/images/avatars/Bryant.png";
import CarterAvatar from "../assets/images/avatars/Carter.png";
import ChadbourneAvatar from "../assets/images/avatars/Chadbourne.png";
import CurrierAvatar from "../assets/images/avatars/Currier.png";
import DoddAvatar from "../assets/images/avatars/Dodd.png";
import DoughtyAvatar from "../assets/images/avatars/Doughty.png";
import EastAvatar from "../assets/images/avatars/East.png";
import FayerweatherAvatar from "../assets/images/avatars/Fayerweather.png";
import FitchAvatar from "../assets/images/avatars/Fitch.png";
import GarfieldAvatar from "../assets/images/avatars/Garfield.png";
import GladdenAvatar from "../assets/images/avatars/Gladden.png";
import GoodrichAvatar from "../assets/images/avatars/Goodrich.png";
import HornAvatar from "../assets/images/avatars/Horn.png";
import HubbellAvatar from "../assets/images/avatars/Hubbell.png";
import LambertAvatar from "../assets/images/avatars/Lambert.png";
import LehmanAvatar from "../assets/images/avatars/Lehman.png";
import MarkHopkinsAvatar from "../assets/images/avatars/Mark Hopkins.png";
import MilhamAvatar from "../assets/images/avatars/Milham.png";
import MorganAvatar from "../assets/images/avatars/Morgan.png";
import ParsonsAvatar from "../assets/images/avatars/Parsons.png";
import PerryAvatar from "../assets/images/avatars/Perry.png";
import PokerFlatsAvatar from "../assets/images/avatars/Poker Flats.png";
import ProspectAvatar from "../assets/images/avatars/Prospect.png";
import SewallAvatar from "../assets/images/avatars/Sewall.png";
import SpencerAvatar from "../assets/images/avatars/Spencer.png";
import SusieHopkinsAvatar from "../assets/images/avatars/Susie Hopkins.png";
import ThompsonAvatar from "../assets/images/avatars/Thompson.png";
import TylerAvatar from "../assets/images/avatars/Tyler.png";
import TylerAnnexAvatar from "../assets/images/avatars/Tyler Annex.png";
import WestAvatar from "../assets/images/avatars/West.png";
import WoodAvatar from "../assets/images/avatars/Wood.png";
import WoodbridgeAvatar from "../assets/images/avatars/Woodbridge.png";

const avatarMap = new Map([
  ["Agard", AgardAvatar],
  ["Brooks", BrooksAvatar],
  ["Bryant", BryantAvatar],
  ["Carter", CarterAvatar],
  ["Chadbourne", ChadbourneAvatar],
  ["Currer", CurrierAvatar],
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

export const avatarHelper = (name) => {
  return avatarMap.get(name);
};

export const bannerHelper = () => {};
