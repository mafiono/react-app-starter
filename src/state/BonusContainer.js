import { BaseContainer } from ".";
import { apiFetch } from "../util";

class BonusContainer extends BaseContainer {
  static initialState() {
    return {
      bonuses: undefined,
      activeBonus: {
        id: 0,
        code: null,
      },
    };
  }

  static fetch() {
    return apiFetch.get("/player/bonus/list");
  }

  loaded() {
    return Array.isArray(this.state.bonuses);
  }

  handleResponse = (response) => {
    if (!response || !response.info || !response.info.success) {
      return;
    }

    const {
      activeBonusCode,
      activeBonusId,
      bonusList: bonuses,
    } = response.data;

    this.setState({
      bonuses,
      activeBonus: {
        id: activeBonusId,
        code: activeBonusCode,
      },
    });
  };
}

export default BonusContainer;
