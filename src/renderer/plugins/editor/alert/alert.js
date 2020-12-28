class AlertTool {
  static get toolbox () {
    return {
      icon:
        /* eslint-disable max-len */
        '<svg xmlns="http://www.w3.org/2000/svg" fill="#000" height="18" width="18" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"></path></svg>',
      title: 'Alert'
    }
  }

  static get enableLineBreaks () {
    return true
  }

  static get DEFAULT_TYPE () {
    return 'info'
  }

  static get DEFAULT_MESSAGE_PLACEHOLDER () {
    return 'Type here...'
  }

  static get ALERT_TYPES () {
    return ['primary', 'secondary', 'info', 'success', 'warning', 'danger']
  }

  get CSS () {
    return {
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: 'cdx-alert',
      wrapperForType: type => `cdx-alert-${type}`,
      message: 'cdx-alert__message'
    }
  }

  constructor ({ data, config, api, readOnly }) {
    this.api = api

    this.defaultType = config.defaultType || AlertTool.DEFAULT_TYPE
    this.messagePlaceholder =
      config.messagePlaceholder || AlertTool.DEFAULT_MESSAGE_PLACEHOLDER

    this.data = {
      type: AlertTool.ALERT_TYPES.includes(data.type)
        ? data.type
        : this.defaultType,
      message: data.message || ''
    }

    this.container = undefined

    this.readOnly = readOnly
  }

  static get isReadOnlySupported () {
    return true
  }

  render () {
    const containerClasses = [
      this.CSS.wrapper,
      this.CSS.wrapperForType(this.data.type)
    ]

    this.container = this._make('div', containerClasses)

    const messageEl = this._make('div', [this.CSS.message], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.message
    })

    messageEl.dataset.placeholder = this.messagePlaceholder

    this.container.appendChild(messageEl)

    return this.container
  }

  renderSettings () {
    const settingsContainer = this._make('div')

    AlertTool.ALERT_TYPES.forEach(type => {
      const settingsButton = this._make(
        'div',
        [
          this.CSS.settingsButton,
          this.CSS.wrapper,
          this.CSS.wrapperForType(type)
        ],
        {
          innerHTML: 'A'
        }
      )

      if (this.data.type === type) {
        // Highlight current type button
        settingsButton.classList.add(this.CSS.settingsButtonActive)
      }

      // Set up click handler
      settingsButton.addEventListener('click', () => {
        this._changeAlertType(type)

        // Un-highlight previous type button
        settingsContainer
          .querySelectorAll(`.${this.CSS.settingsButton}`)
          .forEach(button =>
            button.classList.remove(this.CSS.settingsButtonActive)
          )

        // and highlight the clicked type button
        settingsButton.classList.add(this.CSS.settingsButtonActive)
      })

      settingsContainer.appendChild(settingsButton)
    })

    return settingsContainer
  }

  _changeAlertType (newType) {
    // Save new type
    this.data.type = newType

    AlertTool.ALERT_TYPES.forEach(type => {
      const alertClass = this.CSS.wrapperForType(type)

      // Remove the old Alert type class
      this.container.classList.remove(alertClass)

      if (newType === type) {
        // Add an Alert class for the selected Alert type
        this.container.classList.add(alertClass)
      }
    })
  }

  save (alertElement) {
    const messageEl = alertElement.querySelector(`.${this.CSS.message}`)

    return { ...this.data, message: messageEl.innerHTML }
  }

  _make (tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName)

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else if (classNames) {
      el.classList.add(classNames)
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName]
    }

    return el
  }

  onPaste (event) {
    const { data } = event.detail

    this.data = {
      type: this.defaultType,
      message: data.innerHTML || ''
    }
  }

  static get conversionConfig () {
    return {
      // export Alert's message for other blocks
      export: data => data.message,
      // fill Alert's message from other block's export string
      import: string => {
        return {
          message: string,
          type: this.DEFAULT_TYPE
        }
      }
    }
  }

  static get sanitize () {
    return {
      type: false,
      message: true
    }
  }
}

module.exports = AlertTool
