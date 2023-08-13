import React from "react";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

import {
  Home as HomeIcon,
  Casino as CasinoIcon,
  LiveCasino as LiveCasinoIcon,
  VirtualSports as VirtualSportsIcon,
  Vip as VipIcon,
  Promotion as PromotionIcon,
  Chat as ChatIcon,
  Faq as FaqIcon,
  Info as InfoIcon,
  PadLock as PadLockIcon,
  TermsAndConditions as TermsAndConditionsIcon,
  Affiliates as AffiliatesIcon,
  AboutUs as AboutUsIcon,
} from "../img/icons/nav";

export const availableCategories = {
  new: {
    name: "New",
  },
  "video-slots": {
    name: "Video slots",
  },
  "table-games": {
    name: "Table games",
  },
  "video-poker": {
    name: "Video poker",
  },
  jackpot: {
    name: "Jackpot",
  },
  "scratch-cards": {
    name: "Scratch cards",
  },
  "video-bingo": {
    name: "Video bingo",
  },
};

export const providerDefinitions = {
  _asiagaming: {
    name: "AsiaGaming",
    images: {
      list:
        process.env.REACT_APP_API_CMS_IMAGE_ROOT +
        "providers-live-casino-asia-gaming",
    },
    sections: ["liveCasino"],
  },
  /*
	'_PariPlay': {
		name: 'PariPlay'
	},
	//*/
  _big_time_gaming: {
    name: "Big Time Gaming",
  },
  _gameart: {
    name: "GameArt",
  },
  _betsoft: {
    name: "BetSoft",
  },
  _kiron: {
    name: "Kiron",
    sections: ["virtualsports"],
  },
  _ezugi: {
    name: "Ezugi",
    images: {
      list:
        process.env.REACT_APP_API_CMS_IMAGE_ROOT +
        "betbtc-providers-live-casino_ezugi",
    },
    sections: ["liveCasino"],
  },
  _quickspin: {
    name: "Quickspin",
  },
  _fugaso: {
    name: "Fugaso",
  },
  _Habanero: {
    name: "Habanero",
  },
  _Endorphina: {
    name: "Endorphina",
  },
  _Ganapati: {
    name: "Ganapati",
  },
  _evoplay: {
    name: "EvoPlay",
  },
  _tom_horn: {
    name: "Tom Horn",
  },
  _nolimit: {
    name: "NoLimit",
  },
  _igtech: {
    name: "IGtech",
  },
  /*
	'_lucky': {
		name: 'Lucky'
	},
	//*/
  _booming_games: {
    name: "Booming Games",
  },
  _revolver: {
    name: "Revolver",
  },
  _kalamba: {
    name: "Kalamba",
  },
  _1x2_gaming: {
    name: "1X2 gaming",
  },
  _5men_games: {
    name: "5men games",
  },
  _aladdin: {
    name: "Aladdin",
  },
  _amatic: {
    name: "Amatic",
  },
  _betixon: {
    name: "Betixon",
  },
  _bF_games: {
    name: "BF games",
  },
  _blueprint: {
    name: "Blueprint",
  },
  _booongo: {
    name: "Booongo",
  },
  _ct_gaming: {
    name: "CT gaming",
  },
  _ebet: {
    name: "eBet",
  },
  _elysium: {
    name: "Elysium",
  },
  _felix_gaming: {
    name: "Felix gaming",
  },
  _felt_gaming: {
    name: "Felt gaming",
  },
  _friends_play: {
    name: "Friends play",
  },
  _gamzix: {
    name: "Gamzix",
  },
  _golden_race: {
    name: "Golden race",
  },
  _hacksaw: {
    name: "Hacksaw",
  },
  _hollywoodtv: {
    name: "HollywoodTV",
  },
  _iron_dog: {
    name: "Iron dog",
  },
  _leap: {
    name: "Leap",
  },
  _medialive: {
    name: "Medialive",
  },
  _onegame: {
    name: "OneGame",
  },
  _pg_soft: {
    name: "PG soft",
  },
  _platipus: {
    name: "Platipus",
  },
  _playpearls: {
    name: "PlayPearls",
  },
  _playson: {
    name: "Playson",
  },
  _pragmatic_play: {
    name: "Pragmatic play",
  },
  _push_gaming: {
    name: "Push gaming",
  },
  _red_tiger: {
    name: "Red tiger",
  },
  _reelplay: {
    name: "ReelPlay",
  },
  _relax_gaming: {
    name: "Relax gaming",
  },
  _salsa: {
    name: "Salsa",
  },
  _smartsoft: {
    name: "SmartSoft",
  },
  _spadegaming: {
    name: "SpadeGaming",
  },
  _spinmatic: {
    name: "Spinmatic",
  },
  _spinomenal: {
    name: "Spinomenal",
  },
  _swintt: {
    name: "Swintt",
  },
  _triple_pg: {
    name: "Triple PG",
  },
  _woohoo: {
    name: "Woohoo",
  },
};

export const casinoProviderKeys = Object.keys(providerDefinitions)
  .filter((p) => !providerDefinitions[p].sections)
  .sort((a, b) => {
    const aProvider = providerDefinitions[a].name.toLowerCase();
    const bProvider = providerDefinitions[b].name.toLowerCase();

    if (aProvider < bProvider) {
      return -1;
    }

    if (aProvider > bProvider) {
      return 1;
    }

    return 0;
  });

export const countries = [
  {
    value: "",
    label: "",
  },
  {
    value: "af",
    label: "Afghanistan",
  },
  {
    value: "ax",
    label: "Aland Islands",
  },
  {
    value: "al",
    label: "Albania",
  },
  {
    value: "dz",
    label: "Algeria",
  },
  {
    value: "as",
    label: "American Samoa",
  },
  {
    value: "ad",
    label: "Andorra",
  },
  {
    value: "ao",
    label: "Angola",
  },
  {
    value: "ai",
    label: "Anguilla",
  },
  {
    value: "aq",
    label: "Antarctica",
  },
  {
    value: "ag",
    label: "Antigua and Barbuda",
  },
  {
    value: "ar",
    label: "Argentina",
  },
  {
    value: "am",
    label: "Armenia",
  },
  {
    value: "aw",
    label: "Aruba",
  },
  {
    value: "au",
    label: "Australia",
  },
  {
    value: "at",
    label: "Austria",
  },
  {
    value: "az",
    label: "Azerbaijan",
  },
  {
    value: "bs",
    label: "Bahamas",
  },
  {
    value: "bh",
    label: "Bahrain",
  },
  {
    value: "bd",
    label: "Bangladesh",
  },
  {
    value: "bb",
    label: "Barbados",
  },
  {
    value: "by",
    label: "Belarus",
  },
  {
    value: "be",
    label: "Belgium",
  },
  {
    value: "bz",
    label: "Belize",
  },
  {
    value: "bj",
    label: "Benin",
  },
  {
    value: "bm",
    label: "Bermuda",
  },
  {
    value: "bt",
    label: "Bhutan",
  },
  {
    value: "bo",
    label: "Bolivia",
  },
  {
    value: "bq",
    label: "Bonaire, Saint Eustatius and Saba",
  },
  {
    value: "ba",
    label: "Bosnia and Herzegovina",
  },
  {
    value: "bw",
    label: "Botswana",
  },
  {
    value: "bv",
    label: "Bouvet Island",
  },
  {
    value: "br",
    label: "Brazil",
  },
  {
    value: "io",
    label: "British Indian Ocean Territory",
  },
  {
    value: "vg",
    label: "British Virgin Islands",
  },
  {
    value: "bn",
    label: "Brunei",
  },
  {
    value: "bg",
    label: "Bulgaria",
  },
  {
    value: "bf",
    label: "Burkina Faso",
  },
  {
    value: "bi",
    label: "Burundi",
  },
  {
    value: "kh",
    label: "Cambodia",
  },
  {
    value: "cm",
    label: "Cameroon",
  },
  {
    value: "ca",
    label: "Canada",
  },
  {
    value: "cv",
    label: "Cape Verde",
  },
  {
    value: "ky",
    label: "Cayman Islands",
  },
  {
    value: "cf",
    label: "Central African Republic",
  },
  {
    value: "td",
    label: "Chad",
  },
  {
    value: "cl",
    label: "Chile",
  },
  {
    value: "cn",
    label: "China",
  },
  {
    value: "cx",
    label: "Christmas Island",
  },
  {
    value: "cc",
    label: "Cocos Islands",
  },
  {
    value: "co",
    label: "Colombia",
  },
  {
    value: "km",
    label: "Comoros",
  },
  {
    value: "ck",
    label: "Cook Islands",
  },
  {
    value: "cr",
    label: "Costa Rica",
  },
  {
    value: "hr",
    label: "Croatia",
  },
  {
    value: "cu",
    label: "Cuba",
  },
  {
    value: "cw",
    label: "Curacao",
  },
  {
    value: "cy",
    label: "Cyprus",
  },
  {
    value: "cz",
    label: "Czech Republic",
  },
  {
    value: "cd",
    label: "Democratic Republic of the Congo",
  },
  {
    value: "dk",
    label: "Denmark",
  },
  {
    value: "dj",
    label: "Djibouti",
  },
  {
    value: "dm",
    label: "Dominica",
  },
  {
    value: "do",
    label: "Dominican Republic",
  },
  {
    value: "tl",
    label: "East Timor",
  },
  {
    value: "ec",
    label: "Ecuador",
  },
  {
    value: "eg",
    label: "Egypt",
  },
  {
    value: "sv",
    label: "El Salvador",
  },
  {
    value: "gq",
    label: "Equatorial Guinea",
  },
  {
    value: "er",
    label: "Eritrea",
  },
  {
    value: "ee",
    label: "Estonia",
  },
  {
    value: "et",
    label: "Ethiopia",
  },
  {
    value: "fk",
    label: "Falkland Islands",
  },
  {
    value: "fo",
    label: "Faroe Islands",
  },
  {
    value: "fj",
    label: "Fiji",
  },
  {
    value: "fi",
    label: "Finland",
  },
  {
    value: "fr",
    label: "France",
  },
  {
    value: "gf",
    label: "French Guiana",
  },
  {
    value: "pf",
    label: "French Polynesia",
  },
  {
    value: "tf",
    label: "French Southern Territories",
  },
  {
    value: "ga",
    label: "Gabon",
  },
  {
    value: "gm",
    label: "Gambia",
  },
  {
    value: "ge",
    label: "Georgia",
  },
  {
    value: "de",
    label: "Germany",
  },
  {
    value: "gh",
    label: "Ghana",
  },
  {
    value: "gi",
    label: "Gibraltar",
  },
  {
    value: "gr",
    label: "Greece",
  },
  {
    value: "gl",
    label: "Greenland",
  },
  {
    value: "gd",
    label: "Grenada",
  },
  {
    value: "gp",
    label: "Guadeloupe",
  },
  {
    value: "gu",
    label: "Guam",
  },
  {
    value: "gt",
    label: "Guatemala",
  },
  {
    value: "gg",
    label: "Guernsey",
  },
  {
    value: "gn",
    label: "Guinea",
  },
  {
    value: "gw",
    label: "Guinea-Bissau",
  },
  {
    value: "gy",
    label: "Guyana",
  },
  {
    value: "ht",
    label: "Haiti",
  },
  {
    value: "hm",
    label: "Heard Island and McDonald Islands",
  },
  {
    value: "hn",
    label: "Honduras",
  },
  {
    value: "hk",
    label: "Hong Kong",
  },
  {
    value: "hu",
    label: "Hungary",
  },
  {
    value: "is",
    label: "Iceland",
  },
  {
    value: "in",
    label: "India",
  },
  {
    value: "id",
    label: "Indonesia",
  },
  {
    value: "ir",
    label: "Iran",
  },
  {
    value: "iq",
    label: "Iraq",
  },
  {
    value: "ie",
    label: "Ireland",
  },
  {
    value: "im",
    label: "Isle of Man",
  },
  {
    value: "il",
    label: "Israel",
  },
  {
    value: "it",
    label: "Italy",
  },
  {
    value: "ci",
    label: "Ivory Coast",
  },
  {
    value: "jm",
    label: "Jamaica",
  },
  {
    value: "jp",
    label: "Japan",
  },
  {
    value: "je",
    label: "Jersey",
  },
  {
    value: "jo",
    label: "Jordan",
  },
  {
    value: "kz",
    label: "Kazakhstan",
  },
  {
    value: "ke",
    label: "Kenya",
  },
  {
    value: "ki",
    label: "Kiribati",
  },
  {
    value: "xk",
    label: "Kosovo",
  },
  {
    value: "kw",
    label: "Kuwait",
  },
  {
    value: "kg",
    label: "Kyrgyzstan",
  },
  {
    value: "la",
    label: "Laos",
  },
  {
    value: "lv",
    label: "Latvia",
  },
  {
    value: "lb",
    label: "Lebanon",
  },
  {
    value: "ls",
    label: "Lesotho",
  },
  {
    value: "lr",
    label: "Liberia",
  },
  {
    value: "ly",
    label: "Libya",
  },
  {
    value: "li",
    label: "Liechtenstein",
  },
  {
    value: "lt",
    label: "Lithuania",
  },
  {
    value: "lu",
    label: "Luxembourg",
  },
  {
    value: "mo",
    label: "Macao",
  },
  {
    value: "mk",
    label: "Macedonia",
  },
  {
    value: "mg",
    label: "Madagascar",
  },
  {
    value: "mw",
    label: "Malawi",
  },
  {
    value: "my",
    label: "Malaysia",
  },
  {
    value: "mv",
    label: "Maldives",
  },
  {
    value: "ml",
    label: "Mali",
  },
  {
    value: "mt",
    label: "Malta",
  },
  {
    value: "mh",
    label: "Marshall Islands",
  },
  {
    value: "mq",
    label: "Martinique",
  },
  {
    value: "mr",
    label: "Mauritania",
  },
  {
    value: "mu",
    label: "Mauritius",
  },
  {
    value: "yt",
    label: "Mayotte",
  },
  {
    value: "mx",
    label: "Mexico",
  },
  {
    value: "fm",
    label: "Micronesia",
  },
  {
    value: "md",
    label: "Moldova",
  },
  {
    value: "mc",
    label: "Monaco",
  },
  {
    value: "mn",
    label: "Mongolia",
  },
  {
    value: "me",
    label: "Montenegro",
  },
  {
    value: "ms",
    label: "Montserrat",
  },
  {
    value: "ma",
    label: "Morocco",
  },
  {
    value: "mz",
    label: "Mozambique",
  },
  {
    value: "mm",
    label: "Myanmar",
  },
  {
    value: "na",
    label: "Namibia",
  },
  {
    value: "nr",
    label: "Nauru",
  },
  {
    value: "np",
    label: "Nepal",
  },
  {
    value: "nl",
    label: "Netherlands",
  },
  {
    value: "nc",
    label: "New Caledonia",
  },
  {
    value: "nz",
    label: "New Zealand",
  },
  {
    value: "ni",
    label: "Nicaragua",
  },
  {
    value: "ne",
    label: "Niger",
  },
  {
    value: "ng",
    label: "Nigeria",
  },
  {
    value: "nu",
    label: "Niue",
  },
  {
    value: "nf",
    label: "Norfolk Island",
  },
  {
    value: "kp",
    label: "North Korea",
  },
  {
    value: "mp",
    label: "Northern Mariana Islands",
  },
  {
    value: "no",
    label: "Norway",
  },
  {
    value: "om",
    label: "Oman",
  },
  {
    value: "pk",
    label: "Pakistan",
  },
  {
    value: "pw",
    label: "Palau",
  },
  {
    value: "ps",
    label: "Palestinian Territory",
  },
  {
    value: "pa",
    label: "Panama",
  },
  {
    value: "pg",
    label: "Papua New Guinea",
  },
  {
    value: "py",
    label: "Paraguay",
  },
  {
    value: "pe",
    label: "Peru",
  },
  {
    value: "ph",
    label: "Philippines",
  },
  {
    value: "pn",
    label: "Pitcairn",
  },
  {
    value: "pl",
    label: "Poland",
  },
  {
    value: "pt",
    label: "Portugal",
  },
  {
    value: "pr",
    label: "Puerto Rico",
  },
  {
    value: "qa",
    label: "Qatar",
  },
  {
    value: "cg",
    label: "Republic of the Congo",
  },
  {
    value: "re",
    label: "Reunion",
  },
  {
    value: "ro",
    label: "Romania",
  },
  {
    value: "ru",
    label: "Russia",
  },
  {
    value: "rw",
    label: "Rwanda",
  },
  {
    value: "bl",
    label: "Saint Barthelemy",
  },
  {
    value: "sh",
    label: "Saint Helena",
  },
  {
    value: "kn",
    label: "Saint Kitts and Nevis",
  },
  {
    value: "lc",
    label: "Saint Lucia",
  },
  {
    value: "mf",
    label: "Saint Martin",
  },
  {
    value: "pm",
    label: "Saint Pierre and Miquelon",
  },
  {
    value: "vc",
    label: "Saint Vincent and the Grenadines",
  },
  {
    value: "ws",
    label: "Samoa",
  },
  {
    value: "sm",
    label: "San Marino",
  },
  {
    value: "st",
    label: "Sao Tome and Principe",
  },
  {
    value: "sa",
    label: "Saudi Arabia",
  },
  {
    value: "sn",
    label: "Senegal",
  },
  {
    value: "rs",
    label: "Serbia",
  },
  {
    value: "sc",
    label: "Seychelles",
  },
  {
    value: "sl",
    label: "Sierra Leone",
  },
  {
    value: "sg",
    label: "Singapore",
  },
  {
    value: "sx",
    label: "Sint Maarten",
  },
  {
    value: "sk",
    label: "Slovakia",
  },
  {
    value: "si",
    label: "Slovenia",
  },
  {
    value: "sb",
    label: "Solomon Islands",
  },
  {
    value: "so",
    label: "Somalia",
  },
  {
    value: "za",
    label: "South Africa",
  },
  {
    value: "gs",
    label: "South Georgia and the South Sandwich Islands",
  },
  {
    value: "kr",
    label: "South Korea",
  },
  {
    value: "ss",
    label: "South Sudan",
  },
  {
    value: "es",
    label: "Spain",
  },
  {
    value: "lk",
    label: "Sri Lanka",
  },
  {
    value: "sd",
    label: "Sudan",
  },
  {
    value: "sr",
    label: "Suriname",
  },
  {
    value: "sj",
    label: "Svalbard and Jan Mayen",
  },
  {
    value: "sz",
    label: "Swaziland",
  },
  {
    value: "se",
    label: "Sweden",
  },
  {
    value: "ch",
    label: "Switzerland",
  },
  {
    value: "sy",
    label: "Syria",
  },
  {
    value: "tw",
    label: "Taiwan",
  },
  {
    value: "tj",
    label: "Tajikistan",
  },
  {
    value: "tz",
    label: "Tanzania",
  },
  {
    value: "th",
    label: "Thailand",
  },
  {
    value: "tg",
    label: "Togo",
  },
  {
    value: "tk",
    label: "Tokelau",
  },
  {
    value: "to",
    label: "Tonga",
  },
  {
    value: "tt",
    label: "Trinidad and Tobago",
  },
  {
    value: "tn",
    label: "Tunisia",
  },
  {
    value: "tr",
    label: "Turkey",
  },
  {
    value: "tm",
    label: "Turkmenistan",
  },
  {
    value: "tc",
    label: "Turks and Caicos Islands",
  },
  {
    value: "tv",
    label: "Tuvalu",
  },
  {
    value: "vi",
    label: "U.S. Virgin Islands",
  },
  {
    value: "ug",
    label: "Uganda",
  },
  {
    value: "ua",
    label: "Ukraine",
  },
  {
    value: "ae",
    label: "United Arab Emirates",
  },
  {
    value: "us",
    label: "United States",
  },
  {
    value: "um",
    label: "United States Minor Outlying Islands",
  },
  {
    value: "uy",
    label: "Uruguay",
  },
  {
    value: "uz",
    label: "Uzbekistan",
  },
  {
    value: "vu",
    label: "Vanuatu",
  },
  {
    value: "va",
    label: "Vatican",
  },
  {
    value: "ve",
    label: "Venezuela",
  },
  {
    value: "vn",
    label: "Vietnam",
  },
  {
    value: "wf",
    label: "Wallis and Futuna",
  },
  {
    value: "eh",
    label: "Western Sahara",
  },
  {
    value: "ye",
    label: "Yemen",
  },
  {
    value: "zm",
    label: "Zambia",
  },
  {
    value: "zw",
    label: "Zimbabwe",
  },
];

export const currencies = [
  {
    value: "AUD",
    label: "AUS Dollar",
  },
  {
    value: "EUR",
    label: "Euro",
  },
  {
    value: "USD",
    label: "US Dollar",
  },
];

export const menuItems = [
  {
    url: "/",
    label: "Home",
    icon: <HomeIcon />,
    exact: true,
  },
  {
    url: "/top-casino",
    label: "Casino",
    icon: <CasinoIcon />,
  },
  {
    url: "/live-casino",
    label: "Live casino",
    icon: <LiveCasinoIcon />,
  },
  {
    url: "/virtual-sports",
    label: "Virtual sports",
    icon: <VirtualSportsIcon />,
  },
  {
    url: "/vip",
    label: "Vip",
    icon: <VipIcon />,
  },
  {
    url: "/promotions",
    label: "Promotions",
    icon: <PromotionIcon />,
  },
  {
    url: "/blog-news",
    label: "Blog & News",
    icon: <LiveCasinoIcon />,
  },
];

export const footerItems = [
  {
    label: "About us",
    url: "/about-us",
    icon: <AboutUsIcon />,
  },
  {
    label: "Affiliates",
    url: "/affiliates",
    icon: <AffiliatesIcon />,
  },
  {
    label: "Contact",
    url: "/help/contact",
    icon: <ChatIcon />,
  },
  {
    label: "Privacy policy",
    url: "/help/privacy-policy",
    icon: <PadLockIcon />,
  },
  {
    label: "Terms and conditions",
    url: "/help/terms-and-conditions",
    icon: <TermsAndConditionsIcon />,
  },
  {
    label: "How to play",
    url: "/help/how-to-play",
    icon: <InfoIcon />,
  },
  {
    label: "FAQ",
    url: "/help/faq",
    icon: <FaqIcon />,
  },
];

export const userItems = [
  {
    label: "Cashier",
    url: "/cashier",
    icon: <MonetizationOnIcon />,
  },
  {
    label: "Profile",
    url: "/profile",
    icon: <AccountCircleIcon />,
  },
  {
    label: "Logout",
    url: "/logout",
    icon: <PowerSettingsNewIcon />,
  },
];
