'use strict'

const _ = require('lodash')
const path = require('path')
const loadDir = require('./../../../../boot/load/tymly-loader/load-dir')
const pathExploder = require('./../../../../boot/load/tymly-loader/path-exploder')
const readPkgUp = require('read-pkg-up')

class InventoryService {
  boot () {
  }

  pruneFunctions (rootValue) {
    if (_.isArray(rootValue)) {
      rootValue.forEach(element => this.pruneFunctions(element))
    } else if (_.isObject(rootValue)) {
      for (const [key, value] of Object.entries(rootValue)) {
        if (_.isFunction(value)) {
          delete rootValue[key]
        } else if (_.isObject(value)) {
          this.pruneFunctions(value)
        }
      } // for ...
    } // else
  } // pruneFunctions

  /**
   * Scan the supplied plugin-paths and extract all manner of information for subsequent use by tooling and doc-generators.
   * @param {Object} options
   * @param {Array<string>} options.pluginPaths Where to find all plugins that need scanning. Supports wildcards.
   * @param {Array<string>} options.blueprintPaths Where to find all blueprints that need scanning. Supports wildcards - not implemented yet.
   * @param {Function} callback Called with all the information found about the supplied plugin paths
   * @returns {undefined}
   * @example
   * inventory.collateEverything(
   *   {
   *     pluginPaths [
   *       '/some/dir/*-plugins',
   *       '/another/dir/*-plugins'
   *     ]
   *   },
   *   function (err, inventory) {
   *     // 'inventory' is an object representing the contents of all the provided plugins
   *   }
   * )
   */
  collateEverything (options, callback) {
    let inventory = {
      generated: new Date(),
      plugins: {}
    }

    // Use the main loadDir module to gather plugin-things
    // ---------------------------------------------------
    const pluginPaths = pathExploder(options.pluginPaths, { suffix: 'components', expectModule: true })

    pluginPaths.forEach(
      function (pluginPath) {
        const meta = require(path.resolve(pluginPath, './..'))

        const pluginInfo = {
          pluginPath: pluginPath,
          meta: meta,
          components: {}
        }

        loadDir(
          pluginPath,
          pluginInfo.components,
          { },
          {
            includeDocumentation: true,
            quiet: false,
            messages: options.messages
          }
        )
        inventory.plugins[pluginPath] = pluginInfo
      }
    )

    // Get rid of functions
    // --------------------
    inventory = JSON.parse(JSON.stringify(inventory))
    this.pruneFunctions(inventory)

    // Duplicate things by component type
    // ----------------------------------

    // Loop over all plugins
    for (const [pluginId, plugin] of Object.entries(inventory.plugins)) {
      plugin.package = readPkgUp.sync({ cwd: plugin.pluginPath })
      if (Object.prototype.hasOwnProperty.call(plugin, 'components')) {
        // Loop over all component types
        for (const [componentTypeName, componentType] of Object.entries(plugin.components)) {
          // Add component type if its not there already
          if (!Object.prototype.hasOwnProperty.call(inventory, componentTypeName)) {
            inventory[componentTypeName] = {}
          }

          // Loop over all components
          for (const [componentId, component] of Object.entries(componentType)) {
            if (!Object.prototype.hasOwnProperty.call(inventory[componentTypeName], componentId)) {
              inventory[componentTypeName][componentId] = []
            }
            component.pluginId = pluginId
            inventory[componentTypeName][componentId].push(component)
          }
        }
      }
    }
    callback(null, inventory)
  }
}

module.exports = {
  serviceClass: InventoryService,
  bootBefore: ['storage']

}
