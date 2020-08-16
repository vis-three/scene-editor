const publicPath = 'https://shiotsukikaedesari.gitee.io/mmddisplaydevice/'
module.exports = {
  character: {
    name: 'character',
    desp: '人物',
    icon: '#icon-yonghu',
    show: true,
    children: {
      KiannaCheongasam: {
        name: 'KiannaCheongasam',
        desp: '琪亚娜旗袍',
        poster: `${publicPath}resources/character/KiannaCheongsam/poster.png`,
        model: `${publicPath}resources/character/KiannaCheongsam/KiannaCheongsam.pmx`
      },
      LatMiku2020: {
        name: 'LatMiku2020',
        desp: '龙初音',
        poster: `${publicPath}resources/character/KiannaCheongsam/poster.png`,
        model: `${publicPath}resources/character/LatMiku2020/LatMiku2020.pmd`
      },
      LatFlyMiku: {
        name: 'LatFlyMiku',
        desp: '飞翼初音',
        poster: `${publicPath}resources/character/KiannaCheongsam/poster.png`,
        model: `${publicPath}resources/character/LatFlyMiku/LatFlyMiku.pmd`
      }
    }
  },
  spectacle: {
    name: 'spectacle',
    desp: '场景',
    icon: '#icon-yonghu',
    show: false,
    children: {
      meeting: {
        name: 'meeting',
        desp: '遇见',
        poster: `${publicPath}resources/character/KiannaCheongsam/poster.png`,
        model: `${publicPath}resources/spectacle/meeting/meeting.pmx`
      }
    }
  },
  prop: {
    name: 'prop',
    desp: '道具',
    icon: '#icon-yonghu',
    show: false,
    children: []
  }
}
