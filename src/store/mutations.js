import * as types from "./mutation-type"

const mutations={
    [types.SET_SINGER] (state,singer) {
        state.singer=singer
    },
    [types.SET_DISC] (state, disc) {
        state.disc = disc
    },
}
export default mutations