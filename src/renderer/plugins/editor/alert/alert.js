class AlertTool {
  static get toolbox() {
    return {
      icon:
        /* eslint-disable max-len */
        '<svg version="1.1" width="17px" height="17px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve"> <path d="M165,0C74,0,0,74,0,165s74,165,165,165s165-74,165-165S256,0,165,0z M165,290c-68.9,0-125-56.1-125-125S96.1,40,165,40 s125,56.1,125,125S233.9,290,165,290z"/> <path d="M165,70c-11,0-20,9-20,20c0,11,9,20,20,20s20-9,20-20C185,79,176,70,165,70z"/> <path d="M165,140c-8.3,0-15,6.7-15,15v90c0,8.3,6.7,15,15,15s15-6.7,15-15v-90C180,146.7,173.3,140,165,140z"/> </svg>',
      title: "Alert"
    };
  }

  static get enableLineBreaks() {
    return true;
  }

  static get DEFAULT_TYPE() {
    return "info";
  }

  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return "Type here...";
  }

  static get ALERT_TYPES() {
    return ["primary", "secondary", "info", "success", "warning", "danger"];
  }

  get CSS() {
    return {
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: "cdx-alert",
      wrapperForType: type => `cdx-alert-${type}`,
      message: "cdx-alert__message"
    };
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;

    this.defaultType = config.defaultType || AlertTool.DEFAULT_TYPE;
    this.messagePlaceholder =
      config.messagePlaceholder || AlertTool.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      type: AlertTool.ALERT_TYPES.includes(data.type)
        ? data.type
        : this.defaultType,
      message: data.message || ""
    };

    this.container = undefined;

    this.readOnly = readOnly;
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    const containerClasses = [
      this.CSS.wrapper,
      this.CSS.wrapperForType(this.data.type)
    ];

    this.container = this._make("div", containerClasses);

    const messageEl = this._make("div", [this.CSS.message], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.message
    });

    messageEl.dataset.placeholder = this.messagePlaceholder;

    this.container.appendChild(messageEl);

    return this.container;
  }

  renderSettings() {
    const settingsContainer = this._make("div");

    AlertTool.ALERT_TYPES.forEach(type => {
      const settingsButton = this._make(
        "div",
        [
          this.CSS.settingsButton,
          this.CSS.wrapper,
          this.CSS.wrapperForType(type)
        ],
        {
          innerHTML: "A"
        }
      );

      if (this.data.type === type) {
        // Highlight current type button
        settingsButton.classList.add(this.CSS.settingsButtonActive);
      }

      // Set up click handler
      settingsButton.addEventListener("click", () => {
        this._changeAlertType(type);

        // Un-highlight previous type button
        settingsContainer
          .querySelectorAll(`.${this.CSS.settingsButton}`)
          .forEach(button =>
            button.classList.remove(this.CSS.settingsButtonActive)
          );

        // and highlight the clicked type button
        settingsButton.classList.add(this.CSS.settingsButtonActive);
      });

      settingsContainer.appendChild(settingsButton);
    });

    return settingsContainer;
  }

  _changeAlertType(newType) {
    // Save new type
    this.data.type = newType;

    AlertTool.ALERT_TYPES.forEach(type => {
      const alertClass = this.CSS.wrapperForType(type);

      // Remove the old Alert type class
      this.container.classList.remove(alertClass);

      if (newType === type) {
        // Add an Alert class for the selected Alert type
        this.container.classList.add(alertClass);
      }
    });
  }

  save(alertElement) {
    const messageEl = alertElement.querySelector(`.${this.CSS.message}`);

    return { ...this.data, message: messageEl.innerHTML };
  }

  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  onPaste(event) {
    const { data } = event.detail;

    this.data = {
      type: this.defaultType,
      message: data.innerHTML || ""
    };
  }

  static get conversionConfig() {
    return {
      // export Alert's message for other blocks
      export: data => data.message,
      // fill Alert's message from other block's export string
      import: string => {
        return {
          message: string,
          type: this.DEFAULT_TYPE
        };
      }
    };
  }

  static get sanitize() {
    return {
      type: false,
      message: true
    };
  }
}

module.exports = AlertTool;
