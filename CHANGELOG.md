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
