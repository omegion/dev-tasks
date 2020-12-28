import ua from "universal-analytics";
import Setting from "~/models/Setting";

const TRACKING_CODE = "UA-40366323-10";

export default class Analytics {
  analytics: any;
  enabled: boolean;

  constructor() {
    this.enabled = this._is_enabled();
    this.analytics = ua(TRACKING_CODE);
  }

  pageview(path: string): void {
    if (this.enabled) {
      this.analytics.pageview(path).send();
    }
  }

  exception(msg: string, trace: string): void {
    if (this.enabled) {
      this.analytics.event("asdasd").send();
      this.analytics.exception(msg, true, { trace: trace }).send();
    }
  }

  _is_enabled(): boolean {
    const setting = Setting.query().where("name", "analytics_enabled").first();
    if (setting) {
      return setting.value === "true";
    }
    return false;
  }
}
