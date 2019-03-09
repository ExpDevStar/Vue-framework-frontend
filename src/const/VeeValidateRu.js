import VeeValidateRu from 'vee-validate/dist/locale/ru'

const messages = {
  max: (field, [length]) => `Поле ${field} не может быть больше ${length} символов.`
}
const attributes = {}
const dictionary = {
  name: 'ru',
  messages: Object.assign({}, VeeValidateRu.messages, messages),
  attributes: Object.assign({}, VeeValidateRu.attributes, attributes)
}

export default dictionary
