/**
 * Build styles
 */
// const CodeMirror = require('codemirror/lib/codemirror.js')
const _CodeMirrorEditor = require('codemirror')
const CodeMirrorEditor = window.CodeMirror || _CodeMirrorEditor

require('codemirror/mode/go/go')
require('codemirror/mode/dockerfile/dockerfile')
require('codemirror/mode/python/python')
require('codemirror/mode/php/php')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/vue/vue')
require('codemirror/mode/yaml/yaml')

const LANGUAGES = {
  Go: 'Go',
  Dockerfile: 'Dockerfile',
  Python: 'Python',
  PHP: 'PHP',
  Javascript: 'JavaScript',
  Vue: 'vue',
  YAML: 'yaml'
}

class CodeMirror {
  static get isReadOnlySupported () {
    return true
  }

  static get enableLineBreaks () {
    return true
  }

  static get toolbox () {
    return {
      icon:
        /* eslint-disable max-len */
        '<svg width="14" height="14" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg" > <path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z" /> </svg>',
      title: 'Code'
    }
  }

  static get DEFAULT_CODE_PLACEHOLDER () {
    return 'Enter some code'
  }

  static get DEFAULT_LANGUAGE_PLACEHOLDER () {
    return 'Python'
  }

  static get DEFAULT_FORMAT_CONFIG () {
    return Object.keys(LANGUAGES)
  }

  get CSS () {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-codemirror',
      language: 'cdx-codemirror__language',
      textarea: 'cdx-codemirror__textarea',
      settingsWrapper: 'cdx-list-settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive
    }
  }

  constructor ({ data, config, api, readOnly }) {
    this.api = api
    this.readOnly = readOnly
    this.instance = null

    this.textPlaceholder =
      config.textPlaceholder || CodeMirror.DEFAULT_CODE_PLACEHOLDER
    this.languagePlaceholder =
      config.languagePlaceholder || CodeMirror.DEFAULT_LANGUAGE_PLACEHOLDER
    this.format = config.format || CodeMirror.DEFAULT_FORMAT_CONFIG

    this.settings = [
      {
        name: 'unordered',
        title: this.api.i18n.t('Unordered'),
        icon:
          /* eslint-disable max-len */
          '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
        default: false
      },
      {
        name: 'ordered',
        title: this.api.i18n.t('Ordered'),
        icon:
          /* eslint-disable max-len */
          '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',
        default: true
      }
    ]

    this.data = {
      language: data.language || 'Python',
      text: data.text || ''
    }

    this.nodes = {
      holder: null,
      textarea: null
    }

    this.nodes.holder = this.drawView()
  }

  drawView () {
    const wrapper = this._make(
      'div',
      [this.CSS.wrapper, this.CSS.baseClass],
      {}
    )
    const text = this._make('textarea', [this.CSS.input, this.CSS.textarea], {
      contentEditable: false,
      innerHTML: this.data.text
    })

    text.dataset.placeholder = this.textPlaceholder

    const language = this._make('select', this.CSS.language)
    language.dataset.placeholder = this.languagePlaceholder

    const format = this.format

    format.forEach(f => {
      const option = document.createElement('option')
      const v = document.createAttribute('value')
      const t = document.createTextNode(f)
      v.value = f
      option.appendChild(t)
      option.setAttributeNode(v)
      language.appendChild(option)
    })

    language.value = this.data.language

    if (!this.readOnly) {
      const selectWrapper = this._make('span', ['select', 'is-small'])
      selectWrapper.appendChild(language)
      wrapper.appendChild(selectWrapper)
    }

    wrapper.appendChild(text)

    this.codemirror = CodeMirrorEditor.fromTextArea(text, {
      readOnly: this.readOnly,
      tabSize: 4,
      styleActiveLine: { nonEmpty: true },
      styleActiveSelected: true,
      lineNumbers: true,
      line: false,
      foldGutter: true,
      autofocus: false,
      styleSelectedText: true,
      mode: LANGUAGES[this.data.language].toLowerCase(),
      matchBrackets: true,
      showCursorWhenSelecting: true,
      theme: 'default',
      autoCloseTags: true,
      dragDrop: true,
      lint: true,
      extraKeys: { Ctrl: 'autocomplete' },
      hintOptions: {
        completeSingle: false
      }
    })

    const parent = this
    setTimeout(async function () {
      parent.codemirror.refresh()
    }, 10)

    language.onchange = function (e) {
      parent.codemirror.setOption(
        'mode',
        LANGUAGES[e.target.value].toLowerCase()
      )
    }

    this.language = language

    return wrapper
  }

  render () {
    return this.nodes.holder
  }

  onPaste (event) {
    const content = event.detail.data
    this.data = {
      text: content.textContent
    }
  }

  save (codeElement) {
    return Object.assign(this.data, {
      text: this.codemirror.getValue(),
      language: this.language.value
    })
  }

  static get sanitize () {
    return {
      language: {},
      text: {}
    }
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

  static get pasteConfig () {
    return {
      tags: ['pre']
    }
  }
}

module.exports = CodeMirror
