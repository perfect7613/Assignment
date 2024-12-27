import { i } from '@instantdb/react';

export const schema = i.schema({
  entities: {
    contacts: i.entity({
      name: i.string(),
      phone: i.string(),
      status: i.string(),
      timestamp: i.string(),
    }),
    messages: i.entity({
      contactId: i.string(),
      text: i.string(),
      timestamp: i.string(),
      sender: i.string(),
    }),
  },
});