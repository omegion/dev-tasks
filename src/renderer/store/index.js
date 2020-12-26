import VuexORM from '@vuex-orm/core'
import VuexORMSearch from '@vuex-orm/plugin-search'
import database from '@/database'
import PersistStore from '~/services/persist-storage'

VuexORM.use(VuexORMSearch)

const persist = new PersistStore()

export const plugins = [
  VuexORM.install(database),
  persist.persist().subscribe()
]
