import * as types from '../constants/navigation'

export function updateSelection(selection) {
      return { type: types.UPDATE_SELECTION, selection }
}
