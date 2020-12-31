import { Model } from "@vuex-orm/core";

export default class Setting extends Model {
  static entity = "settings";

  static primaryKey = "name";

  static fields() {
    return {
      name: this.string(""),
      value: this.string("")
    };
  }

  static get(key: string, defaultValue = null) {
    const setting = Setting.query()
      .where("name", key)
      .first();
    if (setting) {
      return setting.value;
    } else if (defaultValue !== null) {
      return defaultValue;
    }
    return setting;
  }

  static set(key: string, value: any) {
    const setting = Setting.query()
      .where("name", key)
      .first();
    if (setting) {
      return Setting.update({
        where: setting => {
          return setting.name === key;
        },
        data: {
          value: value
        }
      });
    }
    return Setting.insert({
      data: {
        name: key,
        value: value
      }
    });
  }

  name: string | undefined;
  value: string | undefined;
}
