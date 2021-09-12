import './style/light_theme/light.scss'
import './style/dark_theme/dark.scss'
import './scripts/base'

const images = require.context(
  "./img",
  false,
  /.*(png|jpg|svg)$/
);