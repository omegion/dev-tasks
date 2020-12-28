import Setting from '~/models/Setting'

export default function (app) {
  const setting = Setting.get('analytics_enabled')
  if (setting === null || setting === 'false') {
    app.$sentry.close()
  }
}
