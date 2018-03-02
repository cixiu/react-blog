const Module = require('module')
const vm = require('vm')

const compileBundleString = (bundle, filename) => {
  const context = { exports: {} }
  const wrapper = Module.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: true,
  })
  const result = script.runInThisContext()
  result.call(context.exports, context.exports, require, context)
  return context
}

module.exports = compileBundleString
