import { v4 as uuidv4 } from 'uuid'

function generateUUID() {
  return uuidv4()
}

export function addIdTo(object: object) {
  return { id: generateUUID(), ...object }
}
