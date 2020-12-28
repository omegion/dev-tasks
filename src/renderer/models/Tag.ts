import { Model } from "@vuex-orm/core";
import { v4 as uuidv4 } from "uuid";

export default class Tag extends Model {
  static entity = "tags";

  static primaryKey = "id";

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      name: this.string(""),
      type: this.string("is-light"),
      description: this.string("")
    };
  }

  id: string | undefined;
  name: string | undefined;
  type: string | undefined;
  description: string | undefined;
}
