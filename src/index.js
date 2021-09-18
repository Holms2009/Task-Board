import './style/light_theme/light.scss'
import './style/dark_theme/dark.scss'
import './scripts/base'
import './scripts/themes'
import './scripts/login'

const images = require.context(
  "./img",
  false,
  /.*(png|jpg|svg)$/
);