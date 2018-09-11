## [1.26.1](https://github.com/wmfs/tymly-core/compare/v1.26.0...v1.26.1) (2018-09-11)


### 🐛 Bug Fixes

* Correct sendTaskFailure parameters ([1ce8088](https://github.com/wmfs/tymly-core/commit/1ce8088))

# [1.26.0](https://github.com/wmfs/tymly-core/compare/v1.25.0...v1.26.0) (2018-09-10)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.5.0 to 1.6.0 ([bae6c54](https://github.com/wmfs/tymly-core/commit/bae6c54))

# [1.25.0](https://github.com/wmfs/tymly-core/compare/v1.24.0...v1.25.0) (2018-09-10)


### ✨ Features

* Add statebox.sendTaskRevivification method, to retry failed state machines ([ce5f9c5](https://github.com/wmfs/tymly-core/commit/ce5f9c5))


### 🚨 Tests

* I really should run lint before committing ([9d5c76c](https://github.com/wmfs/tymly-core/commit/9d5c76c))

# [1.24.0](https://github.com/wmfs/tymly-core/compare/v1.23.0...v1.24.0) (2018-09-10)


### ✨ Features

* Added error loging in sendTaskFailure ([b9064fd](https://github.com/wmfs/tymly-core/commit/b9064fd))

# [1.23.0](https://github.com/wmfs/tymly-core/compare/v1.22.0...v1.23.0) (2018-09-06)


### ✨ Features

* **registry:** Added ClearConfiguredRegistryKey state resource ([1082475](https://github.com/wmfs/tymly-core/commit/1082475))


### 💎 Styles

* whitespace fixes ([9cd7434](https://github.com/wmfs/tymly-core/commit/9cd7434))

# [1.22.0](https://github.com/wmfs/tymly-core/compare/v1.21.0...v1.22.0) (2018-09-06)


### ✨ Features

* **registry:** Added clearRegistryKey state resource ([ab542aa](https://github.com/wmfs/tymly-core/commit/ab542aa))
* **registry:** Added registryService.has(key) and registryService.clear(key) methods ([9472ce8](https://github.com/wmfs/tymly-core/commit/9472ce8))


### 🛠 Builds

* **deps-dev:** update codecov requirement from 3.0.4 to 3.1.0 ([d40e269](https://github.com/wmfs/tymly-core/commit/d40e269))
* **dev-deps:** move to standard 12.0.1 ([d02fa57](https://github.com/wmfs/tymly-core/commit/d02fa57))


### 💎 Styles

* standards fixes ([e15292e](https://github.com/wmfs/tymly-core/commit/e15292e))

# [1.21.0](https://github.com/wmfs/tymly-core/compare/v1.20.0...v1.21.0) (2018-09-04)


### 🛠 Builds

* **deps:** update nanoid requirement from 1.1.0 to 1.2.3 ([f967919](https://github.com/wmfs/tymly-core/commit/f967919))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly-test-helpers requirement from 1.1.1 to 1.1.2 ([5b8097e](https://github.com/wmfs/tymly-core/commit/5b8097e))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly-test-helpers requirement from 1.1.2 to 1.1.3 ([abb166d](https://github.com/wmfs/tymly-core/commit/abb166d))
* **deps-dev:** update semantic-release requirement from 15.9.5 to 15.9.12 ([227cfbf](https://github.com/wmfs/tymly-core/commit/227cfbf))

# [1.20.0](https://github.com/wmfs/tymly-core/compare/v1.19.0...v1.20.0) (2018-09-04)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.4.0 to 1.4.1 ([0daadb5](https://github.com/wmfs/tymly-core/commit/0daadb5))

# [1.19.0](https://github.com/wmfs/tymly-core/compare/v1.18.0...v1.19.0) (2018-09-03)


### 🛠 Builds

* **deps:** update glob requirement from 7.1.2 to 7.1.3 ([314e242](https://github.com/wmfs/tymly-core/commit/314e242))
* **deps-dev:** update nyc requirement from 12.0.2 to 13.0.1 ([7e60982](https://github.com/wmfs/tymly-core/commit/7e60982))

# [1.18.0](https://github.com/wmfs/tymly-core/compare/v1.17.1...v1.18.0) (2018-09-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/rbac requirement from 1.1.0 to 1.1.1 ([9607d24](https://github.com/wmfs/tymly-core/commit/9607d24))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement from 7.0.1 to 7.0.3 ([494d304](https://github.com/wmfs/tymly-core/commit/494d304))

## [1.17.1](https://github.com/wmfs/tymly-core/compare/v1.17.0...v1.17.1) (2018-09-03)


### 🐛 Bug Fixes

* Removed RBAC tables. ([7bdff9a](https://github.com/wmfs/tymly-core/commit/7bdff9a))
* Updated statebox service for statebox package release 1.4.0 ([b8cfc62](https://github.com/wmfs/tymly-core/commit/b8cfc62))

# [1.17.0](https://github.com/wmfs/tymly-core/compare/v1.16.2...v1.17.0) (2018-08-23)


### ✨ Features

* RBAC service removed - it's pulled out into tymly-rbac-plugin ([137e9c2](https://github.com/wmfs/tymly-core/commit/137e9c2))


### 📦 Code Refactoring

* Collapsed getUserRoles/checkRoleAuthorization into a single checkAuthorization call ([b5ac48e](https://github.com/wmfs/tymly-core/commit/b5ac48e))


### 🚨 Tests

* Disable RBAC tests again ([461a618](https://github.com/wmfs/tymly-core/commit/461a618))


### ♻️ Chores

* Bump tymly-test-helper to 1.1.1 ([e1756f2](https://github.com/wmfs/tymly-core/commit/e1756f2))

## [1.16.2](https://github.com/wmfs/tymly-core/compare/v1.16.1...v1.16.2) (2018-08-22)


### 🐛 Bug Fixes

* Bump rbac package ([8370227](https://github.com/wmfs/tymly-core/commit/8370227))
* Pull in Rbac package and use that for the Rbac service. ([d7dd080](https://github.com/wmfs/tymly-core/commit/d7dd080))


### ♻️ Chores

* renamed acl-tests to rbac-tests. ([a31f4e7](https://github.com/wmfs/tymly-core/commit/a31f4e7))

## [1.16.1](https://github.com/wmfs/tymly-core/compare/v1.16.0...v1.16.1) (2018-08-14)


### 🐛 Bug Fixes

* throw error if user email cannot be retrieved ([7a90866](https://github.com/wmfs/tymly-core/commit/7a90866))


### 💎 Styles

* standard fix ([1c69bab](https://github.com/wmfs/tymly-core/commit/1c69bab))

# [1.16.0](https://github.com/wmfs/tymly-core/compare/v1.15.2...v1.16.0) (2018-08-13)


### ✨ Features

* Registry get key state-machine handles returns default value without dressing it up as "the de ([df730b5](https://github.com/wmfs/tymly-core/commit/df730b5))

## [1.15.2](https://github.com/wmfs/tymly-core/compare/v1.15.1...v1.15.2) (2018-08-09)


### 🐛 Bug Fixes

* don't try to get user email if there's no user id ([ca4c241](https://github.com/wmfs/tymly-core/commit/ca4c241))


### 💎 Styles

* Fix indents ([f3eec54](https://github.com/wmfs/tymly-core/commit/f3eec54))

## [1.15.1](https://github.com/wmfs/tymly-core/compare/v1.15.0...v1.15.1) (2018-08-08)


### 🐛 Bug Fixes

* statebox to attach user ID for now rather than email ([3d6a166](https://github.com/wmfs/tymly-core/commit/3d6a166))


### 🚨 Tests

* commenting out tests just for now ([d24108d](https://github.com/wmfs/tymly-core/commit/d24108d))
* uncomment tests - check the user ID ([09ec976](https://github.com/wmfs/tymly-core/commit/09ec976))

# [1.15.0](https://github.com/wmfs/tymly-core/compare/v1.14.0...v1.15.0) (2018-08-06)


### ✨ Features

* User details injection looks up user email from id ([2216af9](https://github.com/wmfs/tymly-core/commit/2216af9))


### 🐛 Bug Fixes

* Tweak path-exploder so that it always strips /index.js from provided paths ([f111167](https://github.com/wmfs/tymly-core/commit/f111167))


### ♻️ Chores

* Bump tymly-test-helpers dependency ([1063fcb](https://github.com/wmfs/tymly-core/commit/1063fcb))
* semantic-release 15.9.1 -> 15.9.5 ([d919e55](https://github.com/wmfs/tymly-core/commit/d919e55))


### 💎 Styles

* Standards fix #classic ([7700cc9](https://github.com/wmfs/tymly-core/commit/7700cc9))

# [1.14.0](https://github.com/wmfs/tymly-core/compare/v1.13.1...v1.14.0) (2018-07-30)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement to 1.3.2 ([7906e9d](https://github.com/wmfs/tymly-core/commit/7906e9d))
* **deps-dev:** update semantic-release requirement to 15.9.1 ([3b1634b](https://github.com/wmfs/tymly-core/commit/3b1634b))

## [1.13.1](https://github.com/wmfs/tymly-core/compare/v1.13.0...v1.13.1) (2018-07-28)


### 🐛 Bug Fixes

* s/_(created|modified)By/(created|modifiedBy)/ ([a8226ab](https://github.com/wmfs/tymly-core/commit/a8226ab))

# [1.13.0](https://github.com/wmfs/tymly-core/compare/v1.12.1...v1.13.0) (2018-07-27)


### ✨ Features

* Propagate userId from statebox service into storage service so _createdBy and _modifiedBy can ([d490abf](https://github.com/wmfs/tymly-core/commit/d490abf))
* Trying out cls-hooked to see we can use it to propagate the userId through statemachine execut ([909f5c1](https://github.com/wmfs/tymly-core/commit/909f5c1))


### 📦 Code Refactoring

* All restrictd calls now go through processIfAuthorised, including start execution ([85e74db](https://github.com/wmfs/tymly-core/commit/85e74db))


### 🚨 Tests

* Dynamically create tests ([1222c8c](https://github.com/wmfs/tymly-core/commit/1222c8c))

## [1.12.1](https://github.com/wmfs/tymly-core/compare/v1.12.0...v1.12.1) (2018-07-27)


### 🐛 Bug Fixes

* ENABLE_RBAC should be false until we've audited all the blueprints ([35d83a4](https://github.com/wmfs/tymly-core/commit/35d83a4))


### 🚨 Tests

* Initial work on getting userId from statebox service into createdBy/modifiedBy ([4a0008e](https://github.com/wmfs/tymly-core/commit/4a0008e))

# [1.12.0](https://github.com/wmfs/tymly-core/compare/v1.11.0...v1.12.0) (2018-07-26)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement to 1.3.1 ([63ca832](https://github.com/wmfs/tymly-core/commit/63ca832))

# [1.11.0](https://github.com/wmfs/tymly-core/compare/v1.10.0...v1.11.0) (2018-07-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement to 1.3.0 ([83eaf70](https://github.com/wmfs/tymly-core/commit/83eaf70))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement to 2.1.2 ([b513196](https://github.com/wmfs/tymly-core/commit/b513196))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement to 3.0.0 ([f8a7974](https://github.com/wmfs/tymly-core/commit/f8a7974))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 6.0.2 ([dc671b8](https://github.com/wmfs/tymly-core/commit/dc671b8))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 7.0.0 ([221fe4f](https://github.com/wmfs/tymly-core/commit/221fe4f))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement to 7.0.1 ([f16e662](https://github.com/wmfs/tymly-core/commit/f16e662))
* **deps-dev:** update semantic-release requirement to 15.8.0 ([2daea75](https://github.com/wmfs/tymly-core/commit/2daea75))
* **deps-dev:** update semantic-release requirement to 15.8.1 ([dbeb19d](https://github.com/wmfs/tymly-core/commit/dbeb19d))

# [1.10.0](https://github.com/wmfs/tymly-core/compare/v1.9.0...v1.10.0) (2018-07-16)


### 🛠 Builds

* **deps:** update read-pkg-up requirement to 4.0.0 ([0bf94f3](https://github.com/wmfs/tymly-core/commit/0bf94f3))
* **deps-dev:** update semantic-release requirement to 15.7.2 ([cf68b89](https://github.com/wmfs/tymly-core/commit/cf68b89))

# [1.9.0](https://github.com/wmfs/tymly-core/compare/v1.8.0...v1.9.0) (2018-07-15)


### 🛠 Builds

* **deps:** update nanoid requirement to 1.1.0 ([f129629](https://github.com/wmfs/tymly-core/commit/f129629))

# [1.8.0](https://github.com/wmfs/tymly-core/compare/v1.7.1...v1.8.0) (2018-07-13)


### 🛠 Builds

* **deps:** update esprima requirement to 4.0.1 ([e195732](https://github.com/wmfs/tymly-core/commit/e195732))
