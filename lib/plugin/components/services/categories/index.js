'use strict'

class CategoryService {
  async boot (options) {
    const storage = options.bootedServices.storage

    this.categories_ = {}
    this.categoryModel = storage.models.tymly_category

    await this.ensureCategories(options.blueprintComponents.categories, options.messages)
    await this.refresh()
    await options.messages.info('Categories loaded')
  } // boot

  get categories () { return this.categories_ }
  get names () { return Object.keys(this.categories_) }

  ensureCategories (blueprintCats, messages) {
    if (!blueprintCats) {
      return
    }

    const catList = Array.from(Object.values(blueprintCats))

    const categoryChecks = catList.map(
      cat => this.ensureCategory(cat, messages)
    )

    return Promise.all(categoryChecks)
  } // ensureCategories

  async ensureCategory (cat, messages) {
    const doc = await this.categoryModel.findOne({ where: { name: { equals: cat.name } } })
    return !doc ? this.saveCategory(cat, messages) : null
  } // ensureCategory

  async saveCategory (cat, messages) {
    const newDoc = {
      name: cat.name,
      label: cat.label || cat.name,
      styling: cat.styling || {}
    }

    await this.categoryModel.upsert(newDoc, {})
    messages.info(`Added ${newDoc.name}`)
  } // saveCategory

  /**
   * Reloads all tags from storage (i.e. the `tymly_category_1_0` model)
   * @returns {Promise} resolving to all the loaded categories
   * @example
   * categories.refresh()
   *   .then(cats => {
   *     // Categories as loaded from storage
   *     // Key/value pairs, where key is the category ID and value is an object:
   *     // {
   *     //  category: Category name
   *     //  label: Category label
   *     //  styling: Category styling
   *     // }
   *   }
   * )
   */
  async refresh () {
    const storedCats = await this.categoryModel.find({})

    this.categories_ = storedCats.reduce((result, value) => {
      result[value.name] = {
        category: value.name,
        label: value.label,
        styling: value.styling
      }
      return result
    }, {})

    return this.categories_
  } // refresh
}

module.exports = {
  serviceClass: CategoryService,
  refProperties: {
    categories: 'categories'
  },
  bootAfter: ['storage']
}
