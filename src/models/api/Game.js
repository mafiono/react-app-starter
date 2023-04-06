import { objectPropertyOrFallback } from "../../util";
import BaseModel from "./BaseModel";
import { providerDefinitions } from "../../data";

function resolveGameImage(src) {
  if (!src || typeof src !== "string" || src.length < 3) {
    return src;
  }

  if (src[0] === "/") {
    return process.env.REACT_APP_API_IMAGE_ROOT + src;
  }

  return src;
}

class Game extends BaseModel {
  constructor(data) {
    super(data);

    if (providerDefinitions.hasOwnProperty(this.providerId)) {
      this.providerName = providerDefinitions[this.providerId].name;
    } else {
      this.providerName = null;
    }
  }

  static getDescription(data) {
    const description = {
      en: null,
    };

    if (!!data.description) {
      try {
        const parsedDescription = JSON.parse(data.description);

        if (
          parsedDescription.hasOwnProperty("text_en") &&
          !!parsedDescription.text_en
        ) {
          description.en = parsedDescription.text_en;
        } else {
          // sentry report 'game doesn't have english description
        }
      } catch (ex) {
        // sentry error
      }
    }

    return description;
  }

  static getDetails(data) {
    return {
      license: objectPropertyOrFallback(data.details, "license", null),
      lines: objectPropertyOrFallback(data.details, "lines", 0),
      plays: objectPropertyOrFallback(data.details, "plays", 0),
      reels: objectPropertyOrFallback(data.details, "reels", 0),
      rtp: objectPropertyOrFallback(data.details, "rtp", 0),
      wagering: objectPropertyOrFallback(data.details, "wagering", 0),
    };
  }

  static getImages(data) {
    return {
      icon: resolveGameImage(objectPropertyOrFallback(data, "image")),
      background: resolveGameImage(
        objectPropertyOrFallback(data, "image_background")
      ),
      filled: resolveGameImage(objectPropertyOrFallback(data, "image_filled")),
      preview: resolveGameImage(
        objectPropertyOrFallback(data, "image_preview")
      ),
    };
  }

  static propertyMap = {
    id: null,
    name: null,
    description: Game.getDescription,
    category: "type",
    provider: "category",
    providerId: "subcategory",
    details: Game.getDetails,
    titleSlug: "title",
    freeRoundsSupported: "freerounds_supported",
    hasJackpot: "has_jackpot",
    playHref: "hrefPlay",
    parentId: "id_parent",
    images: Game.getImages,
    isMobile: "mobile",
    isNew: "new",
    supportsPlayForFun: "play_for_fun_supported",
    position: null,
    system: null,
  };
}

export default Game;

export function filterGames(games, filters = {}) {
  if (!Array.isArray(games)) {
    return games;
  }

  if (
    filters.hasOwnProperty("providers") &&
    Array.isArray(filters.providers) &&
    filters.providers.length > 0
  ) {
    games = games.filter((g) => filters.providers.indexOf(g.provider) !== -1);
  }

  if (
    filters.hasOwnProperty("categories") &&
    Array.isArray(filters.categories)
  ) {
    games = games.filter((g) => filters.categories.indexOf(g.category) !== -1);
  }

  if (
    filters.hasOwnProperty("hasJackpot") &&
    typeof filters.hasJackpot === "boolean"
  ) {
    games = games.filter((g) => g.hasJackpot === filters.hasJackpot);
  }

  if (filters.hasOwnProperty("isNew") && typeof filters.isNew === "boolean") {
    games = games.filter((g) => g.isNew === filters.isNew);
  }

  if (
    filters.hasOwnProperty("isMobile") &&
    typeof filters.isMobile === "boolean"
  ) {
    games = games.filter((g) => g.isMobile === filters.isMobile);
  }

  return games;
}

export function processGamesResponse(games, isMobile) {
  let processedGames = [];

  for (const gameData of games) {
    const game = new Game(gameData);

    if ((isMobile && game.isMobile) || (!isMobile && !game.isMobile)) { // TODO check if isMobile needs to be checked
    processedGames.push(game);
    }
  }

  processedGames = processedGames.sort((a, b) => {
    if (a.position < b.position) {
      return -1;
    }

    if (a.position > b.position) {
      return 1;
    }

    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });

  return processedGames;
}
