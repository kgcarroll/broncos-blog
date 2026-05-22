import {CalendarIcon, CogIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

import {
  SEASON_SCHEDULE_DOCUMENT_ID,
  SITE_SETTINGS_DOCUMENT_ID,
  STRUCTURE_HIDDEN_DOCUMENT_TYPES,
} from './constants'

const hiddenStructureTypes = new Set<string>(STRUCTURE_HIDDEN_DOCUMENT_TYPES)

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id(SITE_SETTINGS_DOCUMENT_ID)
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId(SITE_SETTINGS_DOCUMENT_ID)
            .title('Site settings'),
        ),
      S.listItem()
        .title('Season schedule')
        .id(SEASON_SCHEDULE_DOCUMENT_ID)
        .icon(CalendarIcon)
        .child(
          S.document()
            .schemaType('seasonSchedule')
            .documentId(SEASON_SCHEDULE_DOCUMENT_ID)
            .title('Season schedule'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !hiddenStructureTypes.has(item.getId() ?? '')),
    ])
