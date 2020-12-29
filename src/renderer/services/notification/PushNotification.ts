import Setting from "~/models/Setting";

export default class PushNotification {
  title: string;
  body: string;
  icon: string;
  notification: Notification;
  onClickCallable: CallableFunction;
  onCloseCallable: CallableFunction;

  constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
    this.onClickCallable = null;
    this.onCloseCallable = null;
  }

  send(): void {
    if (!this.isEnabled()) {
      return;
    }

    this.notification = new Notification(this.title, {
      body: this.body,
      icon: require("~/assets/logo.png")
    });

    const that = this;

    if (this.onClickCallable !== null) {
      this.notification.onclick = function(event) {
        that.onClickCallable(event);
      };
    }

    if (this.onCloseCallable !== null) {
      this.notification.onclose = function(event) {
        that.onCloseCallable(event);
      };
    }
  }

  onClick(callable: CallableFunction): void {
    this.onClickCallable = callable;
  }

  onClose(callable: CallableFunction): void {
    this.onCloseCallable = callable;
  }

  isEnabled() {
    const setting = Setting.get("notifications_enabled");
    return setting && setting === "true";
  }
}
