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
      },
      VinatgeMiku: {
        name: 'VinatgeMiku',
        desp: '葡萄晚礼服初音',
        poster: `${publicPath}resources/character/KiannaCheongsam/poster.png`,
        model: `${publicPath}resources/character/VinatgeMiku/VinatgeMiku.pmd`
      },
      VinatgeMikuV5: {
        name: 'VinatgeMikuV5',
        desp: '葡萄晚礼服初音V5',
        poster: `${publicPath}resources/character/KiannaCheongsam/poster.png`,
        model: `${publicPath}resources/character/VinatgeMiku/VinatgeMikuV5.pmd`
      },
      VinatgeMikuV6: {
        name: 'VinatgeMikuV6',
        desp: '葡萄晚礼服初音V6',
        poster: `${publicPath}resources/character/KiannaCheongsam/poster.png`,
        model: `${publicPath}resources/character/VinatgeMiku/VinatgeMikuV6.pmd`
      }
    }
  },
  spectacle: {
    name: 'spectacle',
    desp: '场景',
    icon: '#icon-yonghu',
    show: true,
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
    show: true,
    children: []
  }
}
