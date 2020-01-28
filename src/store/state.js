import { playMode } from 'common/js/config'
import { loadSearch } from 'common/js/cache'
const state = {
  singer: {},
  playing: false,//播放状态
  fullScreen: false,//播放器状态（展开或者收起）
  playlist: [],//播放列表，上一首下一首
  sequenceList: [],//顺序列表，顺序播放
  mode: playMode.sequence,//默认顺序播放
  currentIndex: -1,//当前播放索引
  disc: {},
  topList: {},//排行榜
  searchHistory: loadSearch(),
  playHistory: [],
  favoriteList: []
}

export default state