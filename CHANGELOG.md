## [1.103.3](https://github.com/wmfs/tymly-core/compare/v1.103.2...v1.103.3) (2019-12-16)


### 🐛 Bug Fixes

* Allow get-configured-reg-key default values to be falsey. ([5c219dc](https://github.com/wmfs/tymly-core/commit/5c219dc6dae5676365d6029e36fe2fd83aad7dd1))
* Pass env as a function parameter properly. ([befc462](https://github.com/wmfs/tymly-core/commit/befc462df98b3f3f7ab262d63a4c2013b3b35c17))

## [1.103.2](https://github.com/wmfs/tymly-core/compare/v1.103.1...v1.103.2) (2019-12-03)


### 🐛 Bug Fixes

* Added parameters schemas for get reg key state-resources. ([6a063cf](https://github.com/wmfs/tymly-core/commit/6a063cf07f1cd5a41638f96209d00b1d297b422a))

## [1.103.1](https://github.com/wmfs/tymly-core/compare/v1.103.0...v1.103.1) (2019-11-29)


### 🐛 Bug Fixes

* Add Parameters validation schema for run and launch state machine resources ([d39a4f3](https://github.com/wmfs/tymly-core/commit/d39a4f3b54eb4145d708b13ce5a06a61b6c09759))
* Make Launch state resource more resilient ([3262536](https://github.com/wmfs/tymly-core/commit/3262536ec54ee49eafff9c1d2d6b99e93b7ebb18))

# [1.103.0](https://github.com/wmfs/tymly-core/compare/v1.102.0...v1.103.0) (2019-11-21)


### ✨ Features

* statelint parameters schema ([b7ca56d](https://github.com/wmfs/tymly-core/commit/b7ca56d22a3f8ad8eaaa1e530539c91b7780c05e))

# [1.102.0](https://github.com/wmfs/tymly-core/compare/v1.101.0...v1.102.0) (2019-11-15)


### ✨ Features

* Add awaitExternalInput and sendTaskSuccess state resources. ([e32056b](https://github.com/wmfs/tymly-core/commit/e32056b9a3d4c685dc03ac3ba9edd14785f5f6d5))
* Add launchStateMachine state resource ([b2cf197](https://github.com/wmfs/tymly-core/commit/b2cf197fae5866ecf2534902c7589427cedd7e90))
* Add sendTaskSuccess relaxed ResourceConfig field. ([8a42e9c](https://github.com/wmfs/tymly-core/commit/8a42e9c5adcd77965fa93cca076ef3eb11ae7590))
* Extend launchStateMachine to pass launcher's executionName into the launched state machine. ([b4ae770](https://github.com/wmfs/tymly-core/commit/b4ae7702770e475fb77b053e09dcf091d3aaf69e))
* Implemented time outs for continuing and failing while awaiting external input. ([1698823](https://github.com/wmfs/tymly-core/commit/1698823069d0554ade2e9e43e0e42d301c557836))
* Toughen up sendTaskSuccess state resource in the face of bad input. ([3036881](https://github.com/wmfs/tymly-core/commit/3036881a8b0c67eedb4b12a5a5fe740b50ee96f2))


### 🐛 Bug Fixes

* Add sendTaskHeartbeat resource ([72ae7e9](https://github.com/wmfs/tymly-core/commit/72ae7e96806f17932bd179cfbd3babd7f831a632))
* Pull in statebox 1.54.2. We need those fixes ([f27a7a2](https://github.com/wmfs/tymly-core/commit/f27a7a23b31e094ae1baac4f9dec6a31ab0b83b1))


### 🚨 Tests

* Sketching out timeout functionality for awaiting-external-input ([620b8be](https://github.com/wmfs/tymly-core/commit/620b8be02b0b48c0b726c0148a5e180ec037cb69))

# [1.101.0](https://github.com/wmfs/tymly-core/compare/v1.100.0...v1.101.0) (2019-11-14)


### 🛠 Builds

* **deps:** update many deps ([2e33a2c](https://github.com/wmfs/tymly-core/commit/2e33a2c4db2d18da9aa73c313f2ac5f74e18b5e7))

# [1.100.0](https://github.com/wmfs/tymly-core/compare/v1.99.0...v1.100.0) (2019-10-24)


### 🛠 Builds

* **deps:** bump nanoid from 2.0.1 to 2.1.5 ([](https://github.com/wmfs/tymly-core/commit/a6ded37))

# [1.99.0](https://github.com/wmfs/tymly-core/compare/v1.98.1...v1.99.0) (2019-10-11)


### ✨ Features

* Add configSetting state resource. ([](https://github.com/wmfs/tymly-core/commit/8254fb3))

## [1.98.1](https://github.com/wmfs/tymly-core/compare/v1.98.0...v1.98.1) (2019-10-02)


### 🐛 Bug Fixes

* process ref properties checks if the ref exists first ([978e939](https://github.com/wmfs/tymly-core/commit/978e939))


### 🛠 Builds

* **deps-dev:** update dev dependancies ([07c2b68](https://github.com/wmfs/tymly-core/commit/07c2b68))

# [1.98.0](https://github.com/wmfs/tymly-core/compare/v1.97.0...v1.98.0) (2019-09-09)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.51.0 to 1.54.0 ([9c5b604](https://github.com/wmfs/tymly-core/commit/9c5b604))

# [1.97.0](https://github.com/wmfs/tymly-core/compare/v1.96.1...v1.97.0) (2019-09-09)


### 🛠 Builds

* **deps:** update jsonpath requirement from 1.0.1 to 1.0.2 ([#211](https://github.com/wmfs/tymly-core/issues/211)) ([2dc7583](https://github.com/wmfs/tymly-core/commit/2dc7583))

## [1.96.1](https://github.com/wmfs/tymly-core/compare/v1.96.0...v1.96.1) (2019-09-04)


### 🐛 Bug Fixes

* get full reference, check full ref as well ([e59027f](https://github.com/wmfs/tymly-core/commit/e59027f))

# [1.96.0](https://github.com/wmfs/tymly-core/compare/v1.95.0...v1.96.0) (2019-08-20)


### ✨ Features

* collect changelogs for blueprints and store as blueprint components ([5925879](https://github.com/wmfs/tymly-core/commit/5925879))


### 💎 Styles

* remove trailing comma ([0938ada](https://github.com/wmfs/tymly-core/commit/0938ada))

# [1.95.0](https://github.com/wmfs/tymly-core/compare/v1.94.2...v1.95.0) (2019-07-11)


### 🛠 Builds

* **deps:** update lodash requirement from 4.17.11 to 4.17.14 ([#225](https://github.com/wmfs/tymly-core/issues/225)) ([6322e6b](https://github.com/wmfs/tymly-core/commit/6322e6b))

## [1.94.2](https://github.com/wmfs/tymly-core/compare/v1.94.1...v1.94.2) (2019-07-09)


### 🐛 Bug Fixes

* getting PK in deleting by id ([267692d](https://github.com/wmfs/tymly-core/commit/267692d))


### 📚 Documentation

* Add CircleCI badge ([9f5671a](https://github.com/wmfs/tymly-core/commit/9f5671a))


### ⚙️ Continuous Integrations

* **circle:** Add CircleCI config ([f6d2e52](https://github.com/wmfs/tymly-core/commit/f6d2e52))
* **travis:** Remove Travis config ([0f5871b](https://github.com/wmfs/tymly-core/commit/0f5871b))


### ♻️ Chores

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.50.0 to 1.51.0 ([3d83e15](https://github.com/wmfs/tymly-core/commit/3d83e15))
* **deps-dev:** update mocha requirement from 6.0.2 to 6.1.4 ([8e55bb2](https://github.com/wmfs/tymly-core/commit/8e55bb2))
* **deps-dev:** update nyc requirement from 13.3.0 to 14.1.1 ([8756114](https://github.com/wmfs/tymly-core/commit/8756114))

## [1.94.1](https://github.com/wmfs/tymly-core/compare/v1.94.0...v1.94.1) (2019-07-02)


### 🐛 Bug Fixes

* callback on destory by id even if not found ([8166747](https://github.com/wmfs/tymly-core/commit/8166747))


### ♻️ Chores

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.49.0 to 1.50.0 ([e26479b](https://github.com/wmfs/tymly-core/commit/e26479b))
* **deps-dev:** update semantic-release requirement ([aeb9abb](https://github.com/wmfs/tymly-core/commit/aeb9abb))
* **deps-dev:** update semantic-release requirement ([1ad155e](https://github.com/wmfs/tymly-core/commit/1ad155e))

# [1.94.0](https://github.com/wmfs/tymly-core/compare/v1.93.0...v1.94.0) (2019-05-28)


### ✨ Features

* move system category into core tymly blueprint ([f266ecd](https://github.com/wmfs/tymly-core/commit/f266ecd))

# [1.93.0](https://github.com/wmfs/tymly-core/compare/v1.92.0...v1.93.0) (2019-04-14)


### ✨ Features

* Model for execution table ([7a8603e](https://github.com/wmfs/tymly-core/commit/7a8603e))


### 🐛 Bug Fixes

* Handle callbacks correctly when invoking another state-machine ([84ec38f](https://github.com/wmfs/tymly-core/commit/84ec38f))


### ♻️ Chores

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.48.1 to 1.49.0 ([3e3dc3e](https://github.com/wmfs/tymly-core/commit/3e3dc3e))

# [1.92.0](https://github.com/wmfs/tymly-core/compare/v1.91.1...v1.92.0) (2019-03-28)


### 🛠 Builds

* **deps:** Bump [@wmfs](https://github.com/wmfs)/statebox to 1.48.1 ([82a13b2](https://github.com/wmfs/tymly-core/commit/82a13b2))

## [1.91.1](https://github.com/wmfs/tymly-core/compare/v1.91.0...v1.91.1) (2019-03-28)


### 🐛 Bug Fixes

* **tymlyRef:** Don't apply path to a null object. ([aba5cc8](https://github.com/wmfs/tymly-core/commit/aba5cc8))

# [1.91.0](https://github.com/wmfs/tymly-core/compare/v1.90.2...v1.91.0) (2019-03-28)


### ✨ Features

* **tymlyRef:** Add jsonPath select to firstPass tymly refs ([b825bf3](https://github.com/wmfs/tymly-core/commit/b825bf3))


### 🛠 Builds

* **deps:** Bump all the deps - notably statebox to 1.48.0 and tymly-statelint to 1.10.0 ([f1ad1ce](https://github.com/wmfs/tymly-core/commit/f1ad1ce))
* **deps-dev:** Bumped codecov, mocha, and nyc ([14f00b1](https://github.com/wmfs/tymly-core/commit/14f00b1))


### 🚨 Tests

* tymlyRef jsonpath array select tests ([59ed87d](https://github.com/wmfs/tymly-core/commit/59ed87d))


### ♻️ Chores

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([e1c7a5e](https://github.com/wmfs/tymly-core/commit/e1c7a5e))

## [1.90.2](https://github.com/wmfs/tymly-core/compare/v1.90.1...v1.90.2) (2019-03-21)


### 🐛 Bug Fixes

* Pull in statebox 1.47.3 ([72397dd](https://github.com/wmfs/tymly-core/commit/72397dd))

## [1.90.1](https://github.com/wmfs/tymly-core/compare/v1.90.0...v1.90.1) (2019-03-21)


### 🐛 Bug Fixes

* Add resource config schema for set-context-data state resource. ([90659a5](https://github.com/wmfs/tymly-core/commit/90659a5))


### ♻️ Chores

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.47.1 to 1.47.2 ([03da2e2](https://github.com/wmfs/tymly-core/commit/03da2e2))

# [1.90.0](https://github.com/wmfs/tymly-core/compare/v1.89.0...v1.90.0) (2019-03-21)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement ([85c0907](https://github.com/wmfs/tymly-core/commit/85c0907))


### ♻️ Chores

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.46.0 to 1.47.0 ([8a7de71](https://github.com/wmfs/tymly-core/commit/8a7de71))

# [1.89.0](https://github.com/wmfs/tymly-core/compare/v1.88.0...v1.89.0) (2019-03-21)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement ([ca52e29](https://github.com/wmfs/tymly-core/commit/ca52e29))


### ♻️ Chores

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([e934f01](https://github.com/wmfs/tymly-core/commit/e934f01))

# [1.88.0](https://github.com/wmfs/tymly-core/compare/v1.87.0...v1.88.0) (2019-03-20)


### ✨ Features

* **deps:** ModuleResources no longer need to take a callback, and maybe async or return a promise. ([a4dea64](https://github.com/wmfs/tymly-core/commit/a4dea64))

# [1.87.0](https://github.com/wmfs/tymly-core/compare/v1.86.0...v1.87.0) (2019-03-19)


### ✨ Features

* **tymly-statelint:** Move to tymly-statelint 1.7.0. Validates function: tasks too. ([a116ad6](https://github.com/wmfs/tymly-core/commit/a116ad6))

# [1.86.0](https://github.com/wmfs/tymly-core/compare/v1.85.0...v1.86.0) (2019-03-18)


### ✨ Features

* **tymlyRef:** First stage resolution can use * as namespace or name wildcard/ ([356199c](https://github.com/wmfs/tymly-core/commit/356199c))
* **tymlyRef:** Second-pass tymlyRef functions can be async. ([0aedbdb](https://github.com/wmfs/tymly-core/commit/0aedbdb))


### ♻️ Chores

* **release:** 1.85.0 [skip ci] ([c318e3a](https://github.com/wmfs/tymly-core/commit/c318e3a))


### 💎 Styles

* **lint:** #classic ([6f8aafc](https://github.com/wmfs/tymly-core/commit/6f8aafc))

# [1.85.0](https://github.com/wmfs/tymly-core/compare/v1.84.1...v1.85.0) (2019-03-15)


### ✨ Features

* **tymlyRef:** Check for circular dependencies ([090b3b0](https://github.com/wmfs/tymly-core/commit/090b3b0))
* **tymlyRef:** Find $tymlyRefs in loaded json files ([bb3a60a](https://github.com/wmfs/tymly-core/commit/bb3a60a))
* **tymlyRef:** First pass tymlyRef resolution. ([beea3bc](https://github.com/wmfs/tymly-core/commit/beea3bc))
* **tymlyRef:** Load tymlyRef resolvers dynamically. ([1a52b5c](https://github.com/wmfs/tymly-core/commit/1a52b5c))
* **tymlyRef:** Order resolutions ([833f179](https://github.com/wmfs/tymly-core/commit/833f179))
* **tymlyRef:** Pass refs up out of the boot load ([a7d5e8f](https://github.com/wmfs/tymly-core/commit/a7d5e8f))
* **tymlyRef:** Second-pass tymlyRef resolution ([c5f1fd9](https://github.com/wmfs/tymly-core/commit/c5f1fd9))
* **tymlyRef:** tymlyRef function calls can pass parameters ([8f7e1d1](https://github.com/wmfs/tymly-core/commit/8f7e1d1))
* **tymlyRefs:** Pass refs out of loadDir ([77873ed](https://github.com/wmfs/tymly-core/commit/77873ed))


### 🐛 Bug Fixes

* **tymlyRef:** Actually, don't make it an option to loadDir make it a parameter ([fb0bba4](https://github.com/wmfs/tymly-core/commit/fb0bba4))
* **tymlyRef:** Fix fat-finger spelling mistake ([3000afd](https://github.com/wmfs/tymly-core/commit/3000afd))
* **tymlyRef:** We don't need to try and order resolutions. ([6a96a2a](https://github.com/wmfs/tymly-core/commit/6a96a2a))
* Don't need to pass messages into thirdPass ([b100bb6](https://github.com/wmfs/tymly-core/commit/b100bb6))


### 📦 Code Refactoring

* **category:** Simplified category service boot ([e0c2dc3](https://github.com/wmfs/tymly-core/commit/e0c2dc3))
* **inventory:** Use Object.entries to simplify a load of loops ([baccbe2](https://github.com/wmfs/tymly-core/commit/baccbe2))
* **loader:** Extract functions from jsonFileLoader ([45e7434](https://github.com/wmfs/tymly-core/commit/45e7434))
* **loader:** Reworked if ladders to loops ([36f93af](https://github.com/wmfs/tymly-core/commit/36f93af))
* **statebox:** Refactor statebox.boot so it doesn't use a callback ([9d7fd6b](https://github.com/wmfs/tymly-core/commit/9d7fd6b))
* **tests:** Bit of test grooming ([e641652](https://github.com/wmfs/tymly-core/commit/e641652))
* **tymlyRef:** Make boot sequence more explicit in code ([ec7800b](https://github.com/wmfs/tymly-core/commit/ec7800b))
* **tymlyRef:** Simplify so we can start looking at resolution order ([56969cb](https://github.com/wmfs/tymly-core/commit/56969cb))


### 📚 Documentation

* **readme:** Update for new tymly.boot ([5217705](https://github.com/wmfs/tymly-core/commit/5217705))


### 🚨 Tests

* **load-dir:** Test around load dir ([e3b32b8](https://github.com/wmfs/tymly-core/commit/e3b32b8))
* **loader:** JSON loader test ([eb19128](https://github.com/wmfs/tymly-core/commit/eb19128))
* **run-function-state-resource:** Better test names ([1e9c7f6](https://github.com/wmfs/tymly-core/commit/1e9c7f6))
* **tymlyRef:** Correct for extra test service ([2e24caf](https://github.com/wmfs/tymly-core/commit/2e24caf))
* **tymlyRef:** Further tests ([b3fab75](https://github.com/wmfs/tymly-core/commit/b3fab75))


### 💎 Styles

* **biscuits:** Linty McLintington ([690b7f2](https://github.com/wmfs/tymly-core/commit/690b7f2))
* **tymlyRef:** lint fix ([29796f3](https://github.com/wmfs/tymly-core/commit/29796f3))
* Fix code-factor warning. ([63f83c1](https://github.com/wmfs/tymly-core/commit/63f83c1))

## [1.84.1](https://github.com/wmfs/tymly-core/compare/v1.84.0...v1.84.1) (2019-03-06)


### 🐛 Bug Fixes

* **boot:** Fix typo :( ([c4a770b](https://github.com/wmfs/tymly-core/commit/c4a770b))
* **services:** None of these services do anything asynchronous, so bin out callback param from boot ([0f169f5](https://github.com/wmfs/tymly-core/commit/0f169f5))


### 📦 Code Refactoring

* **boot:** Rework booter so service.boot can be called without a callback ([f9ee628](https://github.com/wmfs/tymly-core/commit/f9ee628))
* **test:** Convert tymly.boot to callback-less ([2183dea](https://github.com/wmfs/tymly-core/commit/2183dea))

# [1.84.0](https://github.com/wmfs/tymly-core/compare/v1.83.1...v1.84.0) (2019-03-06)


### ✨ Features

* **boot:** tymly.boot's callback parameter is now optional, you can await instead if you wish ([5406ff1](https://github.com/wmfs/tymly-core/commit/5406ff1))


### 🐛 Bug Fixes

* **function-resolver:** Do two phase look up on the function name. If not found, prepend namespace a ([3e84b26](https://github.com/wmfs/tymly-core/commit/3e84b26))


### 📦 Code Refactoring

* **boot:** Reordered boot sequentce to bail early ([011ed19](https://github.com/wmfs/tymly-core/commit/011ed19))


### 🚨 Tests

* **function-resolver:** Correct test ([e5f62b2](https://github.com/wmfs/tymly-core/commit/e5f62b2))


### ♻️ Chores

* **deps:** Bump [@wmfs](https://github.com/wmfs)/tymly-statelint from 1.6.1 to 1.6.2 ([0e55df9](https://github.com/wmfs/tymly-core/commit/0e55df9))


### 💎 Styles

* **get-lost-aron:** Lint fix ([e3d9743](https://github.com/wmfs/tymly-core/commit/e3d9743))

## [1.83.1](https://github.com/wmfs/tymly-core/compare/v1.83.0...v1.83.1) (2019-02-26)


### 🐛 Bug Fixes

* Tweak to service booting to capture service name in the event of an error ([4efee64](https://github.com/wmfs/tymly-core/commit/4efee64))

# [1.83.0](https://github.com/wmfs/tymly-core/compare/v1.82.0...v1.83.0) (2019-02-17)


### ✨ Features

* Inject "blueprintName" and "blueprintVersion" to loaded JSON files. ([4b85e41](https://github.com/wmfs/tymly-core/commit/4b85e41))

# [1.82.0](https://github.com/wmfs/tymly-core/compare/v1.81.0...v1.82.0) (2019-02-08)


### 🐛 Bug Fixes

* **deps:** Bump lru-cache from 4.1.4 to 5.1.1. Make required change to match. ([d33fd6c](https://github.com/wmfs/tymly-core/commit/d33fd6c))


### 🛠 Builds

* **deps:** Bump statebox, tymly-statelint, debug, moment, nanoid ([18040b2](https://github.com/wmfs/tymly-core/commit/18040b2))

# [1.81.0](https://github.com/wmfs/tymly-core/compare/v1.80.3...v1.81.0) (2019-02-08)


### 🛠 Builds

* **deps:** update moment requirement from 2.22.2 to 2.23.0 ([1b78d85](https://github.com/wmfs/tymly-core/commit/1b78d85))
* **dev-deps:** Update semantic-release and nyc ([d391d1c](https://github.com/wmfs/tymly-core/commit/d391d1c))

## [1.80.3](https://github.com/wmfs/tymly-core/compare/v1.80.2...v1.80.3) (2019-01-29)


### 🐛 Bug Fixes

* Correct FindById so it works with memory model and pg storage model ([252585c](https://github.com/wmfs/tymly-core/commit/252585c))


### 🚨 Tests

* Extend findById tests to cover array input ([072363b](https://github.com/wmfs/tymly-core/commit/072363b))
* findById state resource tests ([206ae9b](https://github.com/wmfs/tymly-core/commit/206ae9b))

## [1.80.2](https://github.com/wmfs/tymly-core/compare/v1.80.1...v1.80.2) (2019-01-28)


### 🐛 Bug Fixes

* Further fix on lookup email - return userId if email is empty ([3818100](https://github.com/wmfs/tymly-core/commit/3818100))

## [1.80.1](https://github.com/wmfs/tymly-core/compare/v1.80.0...v1.80.1) (2019-01-28)


### 🐛 Bug Fixes

* Ensure we do default to userId if we can't find an email for them. ([7d4ac81](https://github.com/wmfs/tymly-core/commit/7d4ac81))

# [1.80.0](https://github.com/wmfs/tymly-core/compare/v1.79.0...v1.80.0) (2019-01-27)


### ✨ Features

* Add function resource type ([636f005](https://github.com/wmfs/tymly-core/commit/636f005))
* Add function resource type. ([15162e4](https://github.com/wmfs/tymly-core/commit/15162e4))


### 🛠 Builds

* **dev:** Bump statebox from 1.43.0 to 1.44.1 ([be81b21](https://github.com/wmfs/tymly-core/commit/be81b21))


### 📦 Code Refactoring

* Correct test filename ([cdbda29](https://github.com/wmfs/tymly-core/commit/cdbda29))
* Neaten parse-meta ([4468acb](https://github.com/wmfs/tymly-core/commit/4468acb))


### 🚨 Tests

* Better description ([075561c](https://github.com/wmfs/tymly-core/commit/075561c))
* Pull run-function test fixtures out of the cat blueprint. ([904d246](https://github.com/wmfs/tymly-core/commit/904d246))
* Tidy up UUID state resource test ([bd18c86](https://github.com/wmfs/tymly-core/commit/bd18c86))


### ⚙️ Continuous Integrations

* Update Node version ([d59505e](https://github.com/wmfs/tymly-core/commit/d59505e))

# [1.79.0](https://github.com/wmfs/tymly-core/compare/v1.78.1...v1.79.0) (2019-01-25)


### ✨ Features

* Pull in statebox 1.43 so we get new Parameters field ([7c72798](https://github.com/wmfs/tymly-core/commit/7c72798))

## [1.78.1](https://github.com/wmfs/tymly-core/compare/v1.78.0...v1.78.1) (2019-01-20)


### 🐛 Bug Fixes

* Fix a few example JSON files. ([13c6aef](https://github.com/wmfs/tymly-core/commit/13c6aef))


### ♻️ Chores

* Add examples to state machines ([ddfca37](https://github.com/wmfs/tymly-core/commit/ddfca37))

# [1.78.0](https://github.com/wmfs/tymly-core/compare/v1.77.0...v1.78.0) (2019-01-17)


### ✨ Features

* Add support to exclude plugins/blueprints. ([6277e35](https://github.com/wmfs/tymly-core/commit/6277e35))


### ♻️ Chores

* **deps:** Bump [@wmfs](https://github.com/wmfs)/statebox to 1.42.0 to get findModuleByName ([d67f318](https://github.com/wmfs/tymly-core/commit/d67f318))

# [1.77.0](https://github.com/wmfs/tymly-core/compare/v1.76.0...v1.77.0) (2019-01-13)


### ✨ Features

* Add meta-info for core plugin. ([1018887](https://github.com/wmfs/tymly-core/commit/1018887))

# [1.76.0](https://github.com/wmfs/tymly-core/compare/v1.75.0...v1.76.0) (2019-01-10)


### 🛠 Builds

* **deps:** Removed unused dependencies - esprima, jsonschema, sprintf-js ([2c62e95](https://github.com/wmfs/tymly-core/commit/2c62e95))


### 📦 Code Refactoring

* **dead code:** Removed unused MemoryStorageService.fileImporter method ([66549da](https://github.com/wmfs/tymly-core/commit/66549da))
* Changed forEach to for/of, removed redundant guard clauses ([adf9254](https://github.com/wmfs/tymly-core/commit/adf9254))
* Rework boot order again ([ecfee67](https://github.com/wmfs/tymly-core/commit/ecfee67))
* Try and simplify control flow in order-boot-sequence ([83ce81b](https://github.com/wmfs/tymly-core/commit/83ce81b))
* Use native methods rather than lodash ([63382d0](https://github.com/wmfs/tymly-core/commit/63382d0))


### 💎 Styles

* lint fix - added a space :o ([8634745](https://github.com/wmfs/tymly-core/commit/8634745))

# [1.75.0](https://github.com/wmfs/tymly-core/compare/v1.74.0...v1.75.0) (2018-12-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.40.0 to 1.41.0 ([ab5c7d9](https://github.com/wmfs/tymly-core/commit/ab5c7d9))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly-test-helpers requirement ([8c9e8df](https://github.com/wmfs/tymly-core/commit/8c9e8df))


### 🚨 Tests

* Tweak day-in-the-life state machine ([fd58bec](https://github.com/wmfs/tymly-core/commit/fd58bec))

# [1.74.0](https://github.com/wmfs/tymly-core/compare/v1.73.0...v1.74.0) (2018-12-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.39.1 to 1.40.0 ([dc64d4f](https://github.com/wmfs/tymly-core/commit/dc64d4f))

# [1.73.0](https://github.com/wmfs/tymly-core/compare/v1.72.0...v1.73.0) (2018-12-11)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.39.0 to 1.39.1 ([f15d17b](https://github.com/wmfs/tymly-core/commit/f15d17b))

# [1.72.0](https://github.com/wmfs/tymly-core/compare/v1.71.0...v1.72.0) (2018-12-06)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.38.0 to 1.39.0 ([6e54324](https://github.com/wmfs/tymly-core/commit/6e54324))

# [1.71.0](https://github.com/wmfs/tymly-core/compare/v1.70.0...v1.71.0) (2018-12-06)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.37.3 to 1.38.0 ([b5df299](https://github.com/wmfs/tymly-core/commit/b5df299))

# [1.70.0](https://github.com/wmfs/tymly-core/compare/v1.69.0...v1.70.0) (2018-12-06)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.37.0 to 1.37.3 ([3ab344d](https://github.com/wmfs/tymly-core/commit/3ab344d))

# [1.69.0](https://github.com/wmfs/tymly-core/compare/v1.68.1...v1.69.0) (2018-12-06)


### 🛠 Builds

* **deps:** Update statebox, boom, semantic-release dependencies ([7cfb9e1](https://github.com/wmfs/tymly-core/commit/7cfb9e1))

## [1.68.1](https://github.com/wmfs/tymly-core/compare/v1.68.0...v1.68.1) (2018-12-06)


### 🐛 Bug Fixes

* Clone the objects coming out of .find() ([18c75db](https://github.com/wmfs/tymly-core/commit/18c75db))

# [1.68.0](https://github.com/wmfs/tymly-core/compare/v1.67.0...v1.68.0) (2018-12-04)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([c4231bb](https://github.com/wmfs/tymly-core/commit/c4231bb))

# [1.67.0](https://github.com/wmfs/tymly-core/compare/v1.66.0...v1.67.0) (2018-12-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([5669876](https://github.com/wmfs/tymly-core/commit/5669876))

# [1.66.0](https://github.com/wmfs/tymly-core/compare/v1.65.1...v1.66.0) (2018-11-27)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([ce25ba6](https://github.com/wmfs/tymly-core/commit/ce25ba6))

## [1.65.1](https://github.com/wmfs/tymly-core/compare/v1.65.0...v1.65.1) (2018-11-27)


### 🐛 Bug Fixes

* **vulnerable dep:** Use mongodb-extjson instead of the deprecated and compromised mongodb-extended- ([29c04c6](https://github.com/wmfs/tymly-core/commit/29c04c6))

# [1.65.0](https://github.com/wmfs/tymly-core/compare/v1.64.0...v1.65.0) (2018-11-27)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.36.0 to 1.37.0 ([9644d66](https://github.com/wmfs/tymly-core/commit/9644d66))
* **deps-dev:** update semantic-release requirement ([ded8489](https://github.com/wmfs/tymly-core/commit/ded8489))

# [1.64.0](https://github.com/wmfs/tymly-core/compare/v1.63.0...v1.64.0) (2018-11-23)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.35.0 to 1.36.0 ([5261a7e](https://github.com/wmfs/tymly-core/commit/5261a7e))
* **deps-dev:** update semantic-release requirement ([d7d3a10](https://github.com/wmfs/tymly-core/commit/d7d3a10))

# [1.63.0](https://github.com/wmfs/tymly-core/compare/v1.62.0...v1.63.0) (2018-11-21)


### 🛠 Builds

* **deps:** update lru-cache requirement from 4.1.3 to 4.1.4 ([34b52f2](https://github.com/wmfs/tymly-core/commit/34b52f2))

# [1.62.0](https://github.com/wmfs/tymly-core/compare/v1.61.0...v1.62.0) (2018-11-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([2e73315](https://github.com/wmfs/tymly-core/commit/2e73315))

# [1.61.0](https://github.com/wmfs/tymly-core/compare/v1.60.0...v1.61.0) (2018-11-17)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.34.3 to 1.35.0 ([efe0d8a](https://github.com/wmfs/tymly-core/commit/efe0d8a))

# [1.60.0](https://github.com/wmfs/tymly-core/compare/v1.59.0...v1.60.0) (2018-11-15)


### 🛠 Builds

* **deps:** update statebox requirement ([b38d4f6](https://github.com/wmfs/tymly-core/commit/b38d4f6))
* **deps-dev:** update semantic-release requirement ([330d6a3](https://github.com/wmfs/tymly-core/commit/330d6a3))


### 🚨 Tests

* update tests in line with statebox changes ([a4ada36](https://github.com/wmfs/tymly-core/commit/a4ada36))

# [1.59.0](https://github.com/wmfs/tymly-core/compare/v1.58.0...v1.59.0) (2018-11-12)


### ✨ Features

* Add state resources to list available state machines and state resources. ([8b477ff](https://github.com/wmfs/tymly-core/commit/8b477ff))


### 🚨 Tests

* Rework test for Node 9 ([84dbdc0](https://github.com/wmfs/tymly-core/commit/84dbdc0))


### ♻️ Chores

* **deps:** Bump boom from 7.2.0 to 7.2.2. ([432e4cc](https://github.com/wmfs/tymly-core/commit/432e4cc))
* **dev-deps:** Bump semantic-release from 15.10.6 to 15.10.8 ([544e9e0](https://github.com/wmfs/tymly-core/commit/544e9e0))
* Bump nanoid from 1.3.3 to 2.0.0. ([cf0678c](https://github.com/wmfs/tymly-core/commit/cf0678c))
* Correct cls-hooked dependency from ^4.2.2 to 4.2.2 ([61d6918](https://github.com/wmfs/tymly-core/commit/61d6918))


### 💎 Styles

* Standards fix ([1321436](https://github.com/wmfs/tymly-core/commit/1321436))

# [1.58.0](https://github.com/wmfs/tymly-core.git/compare/v1.57.0...v1.58.0) (2018-10-31)


### 🛠 Builds

* **deps:** update nanoid requirement from 1.3.2 to 1.3.3 ([5c39c9b](https://github.com/wmfs/tymly-core.git/commit/5c39c9b))

# [1.57.0](https://github.com/wmfs/tymly-core.git/compare/v1.56.0...v1.57.0) (2018-10-31)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.24.0 to 1.25.0 ([f9b10fd](https://github.com/wmfs/tymly-core.git/commit/f9b10fd))
* **deps:** update nanoid requirement from 1.3.1 to 1.3.2 ([d94ec16](https://github.com/wmfs/tymly-core.git/commit/d94ec16))
* **deps-dev:** update semantic-release requirement ([b239753](https://github.com/wmfs/tymly-core.git/commit/b239753))

# [1.56.0](https://github.com/wmfs/tymly-core/compare/v1.55.0...v1.56.0) (2018-10-23)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.23.1 to 1.24.0 ([95bcb82](https://github.com/wmfs/tymly-core/commit/95bcb82))

# [1.55.0](https://github.com/wmfs/tymly-core/compare/v1.54.0...v1.55.0) (2018-10-23)


### 🛠 Builds

* **deps:** update dottie requirement from 2.0.0 to 2.0.1 ([07038b1](https://github.com/wmfs/tymly-core/commit/07038b1))
* **deps-dev:** update semantic-release requirement ([be6950b](https://github.com/wmfs/tymly-core/commit/be6950b))
* **deps-dev:** update semantic-release requirement ([46c2c1a](https://github.com/wmfs/tymly-core/commit/46c2c1a))


### 🚨 Tests

* Return whole cat state from state resources, not just pet diary. ([cea6f03](https://github.com/wmfs/tymly-core/commit/cea6f03))
* set ResultPath: null on tasks where we want to ignore the output ([951e50a](https://github.com/wmfs/tymly-core/commit/951e50a))

# [1.54.0](https://github.com/wmfs/tymly-core/compare/v1.53.0...v1.54.0) (2018-10-20)


### 🛠 Builds

* **deps:** update nanoid requirement from 1.3.0 to 1.3.1 ([1c9e9e1](https://github.com/wmfs/tymly-core/commit/1c9e9e1))

# [1.53.0](https://github.com/wmfs/tymly-core/compare/v1.52.1...v1.53.0) (2018-10-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.23.0 to 1.23.1 ([88cc360](https://github.com/wmfs/tymly-core/commit/88cc360))

## [1.52.1](https://github.com/wmfs/tymly-core/compare/v1.52.0...v1.52.1) (2018-10-19)


### 🐛 Bug Fixes

* Bump [@wmfs](https://github.com/wmfs)/tymly-statelint from 1.3.1 to 1.3.2 ([1f71e48](https://github.com/wmfs/tymly-core/commit/1f71e48))

# [1.52.0](https://github.com/wmfs/tymly-core/compare/v1.51.0...v1.52.0) (2018-10-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.22.0 to 1.23.0 ([6bbafb1](https://github.com/wmfs/tymly-core/commit/6bbafb1))

# [1.51.0](https://github.com/wmfs/tymly-core/compare/v1.50.0...v1.51.0) (2018-10-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.21.0 to 1.22.0 ([1605476](https://github.com/wmfs/tymly-core/commit/1605476))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/changelog requirement ([0dffc38](https://github.com/wmfs/tymly-core/commit/0dffc38))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([0bc1fab](https://github.com/wmfs/tymly-core/commit/0bc1fab))
* **deps-dev:** update semantic-release requirement ([d25b863](https://github.com/wmfs/tymly-core/commit/d25b863))

# [1.50.0](https://github.com/wmfs/tymly-core/compare/v1.49.0...v1.50.0) (2018-10-17)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([0332cab](https://github.com/wmfs/tymly-core/commit/0332cab))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly-test-helpers requirement ([511a94f](https://github.com/wmfs/tymly-core/commit/511a94f))

# [1.49.0](https://github.com/wmfs/tymly-core/compare/v1.48.1...v1.49.0) (2018-10-16)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/tymly-statelint requirement ([c73628a](https://github.com/wmfs/tymly-core/commit/c73628a))

## [1.48.1](https://github.com/wmfs/tymly-core/compare/v1.48.0...v1.48.1) (2018-10-16)


### 🐛 Bug Fixes

* Direct all statelint warnings into startup-messages ([7efe21e](https://github.com/wmfs/tymly-core/commit/7efe21e))


### 📦 Code Refactoring

* Validate all state machines, then add them ([886cb37](https://github.com/wmfs/tymly-core/commit/886cb37))

# [1.48.0](https://github.com/wmfs/tymly-core/compare/v1.47.0...v1.48.0) (2018-10-15)


### ✨ Features

* Initialised state machine validator with state resources ([38cf619](https://github.com/wmfs/tymly-core/commit/38cf619))


### 🛠 Builds

* **deps-dev:** update nyc requirement from 13.0.1 to 13.1.0 ([0b768f9](https://github.com/wmfs/tymly-core/commit/0b768f9))


### 📦 Code Refactoring

* Declare at point of definition in applyBootBefore ([99431a0](https://github.com/wmfs/tymly-core/commit/99431a0))
* Elide an if in applyBootBefore by straightforward application of the Null Object Pattern ([94844fb](https://github.com/wmfs/tymly-core/commit/94844fb))
* Flip Array.forEach to a for of ([7650a65](https://github.com/wmfs/tymly-core/commit/7650a65))
* Flipped Object.keys.forEach with a lookup to a for of Object.entries ([f1a524a](https://github.com/wmfs/tymly-core/commit/f1a524a))
* Pulled out applyBootBefore so it's not local to bootSequenceOrder ([9968613](https://github.com/wmfs/tymly-core/commit/9968613))
* Removed empty duplicate if condition ([45ad5f3](https://github.com/wmfs/tymly-core/commit/45ad5f3))

# [1.47.0](https://github.com/wmfs/tymly-core/compare/v1.46.0...v1.47.0) (2018-10-12)


### 🛠 Builds

* **deps:** update nanoid requirement from 1.2.6 to 1.3.0 ([52da708](https://github.com/wmfs/tymly-core/commit/52da708))

# [1.46.0](https://github.com/wmfs/tymly-core/compare/v1.45.0...v1.46.0) (2018-10-11)


### ✨ Features

* Hook tymly-statelint into statebox start-up ([7483888](https://github.com/wmfs/tymly-core/commit/7483888))


### 🛠 Builds

* **deps:** Update tymly-statelint from 1.0.0 to 1.1.0 ([2ead327](https://github.com/wmfs/tymly-core/commit/2ead327))


### 📦 Code Refactoring

* Calm down code to merge rootComponents into allComponents ([95cb4db](https://github.com/wmfs/tymly-core/commit/95cb4db))
* Flip Array.forEach into for loops ([52eb356](https://github.com/wmfs/tymly-core/commit/52eb356))
* Get rid of continueLoading variable - just return early ([a0f994e](https://github.com/wmfs/tymly-core/commit/a0f994e))
* Hoist part of the directory filtering out of the main loop ([0f363e8](https://github.com/wmfs/tymly-core/commit/0f363e8))
* Initialise rootComponents[name] when we need to ([3162b83](https://github.com/wmfs/tymly-core/commit/3162b83))
* Let's just do the path.join once ([8da0dc3](https://github.com/wmfs/tymly-core/commit/8da0dc3))
* Lift all the component type directory filtering and path expansion up ahead of the for loo ([ea1cf1e](https://github.com/wmfs/tymly-core/commit/ea1cf1e))
* Move componentDir declaration into the loop ([8b4f509](https://github.com/wmfs/tymly-core/commit/8b4f509))
* Pull out body of loadComponentDir ([181ba23](https://github.com/wmfs/tymly-core/commit/181ba23))
* Pulled out loadComponentFile function ([a863e98](https://github.com/wmfs/tymly-core/commit/a863e98))
* s/COMPONENT_DIR_BLACKLIST/COMPONENT_TYPE_BLACKLIST/ because that's what it is ([c90c005](https://github.com/wmfs/tymly-core/commit/c90c005))
* Simplified if condition grabbing namespace ([453b593](https://github.com/wmfs/tymly-core/commit/453b593))
* Simplify file loading ([c2b73e7](https://github.com/wmfs/tymly-core/commit/c2b73e7))
* Slimmed and simplified discoverBlueprintPaths ([30aed24](https://github.com/wmfs/tymly-core/commit/30aed24))
* Use hasProperty helper to slim things down a bit ([d401ef7](https://github.com/wmfs/tymly-core/commit/d401ef7))

# [1.45.0](https://github.com/wmfs/tymly-core/compare/v1.44.0...v1.45.0) (2018-10-08)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.20.0 to 1.21.0 ([5ad674d](https://github.com/wmfs/tymly-core/commit/5ad674d))

# [1.44.0](https://github.com/wmfs/tymly-core/compare/v1.43.0...v1.44.0) (2018-10-08)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.19.0 to 1.20.0 ([4006b43](https://github.com/wmfs/tymly-core/commit/4006b43))

# [1.43.0](https://github.com/wmfs/tymly-core/compare/v1.42.0...v1.43.0) (2018-10-08)


### 🛠 Builds

* **deps:** update debug requirement from 4.0.1 to 4.1.0 ([854e069](https://github.com/wmfs/tymly-core/commit/854e069))
* **deps-dev:** update semantic-release requirement ([302a833](https://github.com/wmfs/tymly-core/commit/302a833))

# [1.42.0](https://github.com/wmfs/tymly-core/compare/v1.41.0...v1.42.0) (2018-10-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.18.0 to 1.19.0 ([e612d17](https://github.com/wmfs/tymly-core/commit/e612d17))

# [1.41.0](https://github.com/wmfs/tymly-core/compare/v1.40.0...v1.41.0) (2018-10-03)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.17.0 to 1.18.0 ([4352ae1](https://github.com/wmfs/tymly-core/commit/4352ae1))

# [1.40.0](https://github.com/wmfs/tymly-core/compare/v1.39.0...v1.40.0) (2018-10-02)


### 🛠 Builds

* **deps:** update nanoid requirement from 1.2.5 to 1.2.6 ([5d80ee2](https://github.com/wmfs/tymly-core/commit/5d80ee2))

# [1.39.0](https://github.com/wmfs/tymly-core/compare/v1.38.0...v1.39.0) (2018-09-29)


### 🛠 Builds

* **deps:** update nanoid requirement from 1.2.4 to 1.2.5 ([4405d3c](https://github.com/wmfs/tymly-core/commit/4405d3c))


### ♻️ Chores

* **deps:** Remove [@wmfs](https://github.com/wmfs)/rbac dependency ([f66d473](https://github.com/wmfs/tymly-core/commit/f66d473))

# [1.38.0](https://github.com/wmfs/tymly-core/compare/v1.37.0...v1.38.0) (2018-09-27)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/rbac requirement from 1.2.0 to 1.3.0 ([707b80c](https://github.com/wmfs/tymly-core/commit/707b80c))

# [1.37.0](https://github.com/wmfs/tymly-core/compare/v1.36.0...v1.37.0) (2018-09-26)


### 🛠 Builds

* **deps:** update nanoid requirement from 1.2.3 to 1.2.4 ([a74c437](https://github.com/wmfs/tymly-core/commit/a74c437))

# [1.36.0](https://github.com/wmfs/tymly-core/compare/v1.35.0...v1.36.0) (2018-09-26)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/rbac requirement from 1.1.5 to 1.2.0 ([2696da6](https://github.com/wmfs/tymly-core/commit/2696da6))
* **deps-dev:** update chai requirement from 4.1.2 to 4.2.0 ([a010aee](https://github.com/wmfs/tymly-core/commit/a010aee))

# [1.35.0](https://github.com/wmfs/tymly-core/compare/v1.34.0...v1.35.0) (2018-09-26)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.16.0 to 1.17.0 ([9cb5606](https://github.com/wmfs/tymly-core/commit/9cb5606))

# [1.34.0](https://github.com/wmfs/tymly-core/compare/v1.33.0...v1.34.0) (2018-09-25)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.15.0 to 1.16.0 ([d610b1d](https://github.com/wmfs/tymly-core/commit/d610b1d))

# [1.33.0](https://github.com/wmfs/tymly-core/compare/v1.32.0...v1.33.0) (2018-09-19)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/rbac requirement from 1.1.4 to 1.1.5 ([d56b9a5](https://github.com/wmfs/tymly-core/commit/d56b9a5))
* **deps-dev:** update semantic-release requirement ([2619f7e](https://github.com/wmfs/tymly-core/commit/2619f7e))

# [1.32.0](https://github.com/wmfs/tymly-core/compare/v1.31.0...v1.32.0) (2018-09-13)


### 🛠 Builds

* **deps:** update lodash requirement from 4.17.10 to 4.17.11 ([a1a6b72](https://github.com/wmfs/tymly-core/commit/a1a6b72))

# [1.31.0](https://github.com/wmfs/tymly-core/compare/v1.30.0...v1.31.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.14.0 to 1.15.0 ([1ab81dc](https://github.com/wmfs/tymly-core/commit/1ab81dc))

# [1.30.0](https://github.com/wmfs/tymly-core/compare/v1.29.0...v1.30.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.13.0 to 1.14.0 ([0a28098](https://github.com/wmfs/tymly-core/commit/0a28098))

# [1.29.0](https://github.com/wmfs/tymly-core/compare/v1.28.0...v1.29.0) (2018-09-12)


### 🛠 Builds

* **deps:** update debug requirement from 3.1.0 to 4.0.1 ([673db45](https://github.com/wmfs/tymly-core/commit/673db45))

# [1.28.0](https://github.com/wmfs/tymly-core/compare/v1.27.0...v1.28.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/rbac requirement from 1.1.1 to 1.1.4 ([a8c63a5](https://github.com/wmfs/tymly-core/commit/a8c63a5))

# [1.27.0](https://github.com/wmfs/tymly-core/compare/v1.26.1...v1.27.0) (2018-09-12)


### 🛠 Builds

* **deps:** update [@wmfs](https://github.com/wmfs)/statebox requirement from 1.6.0 to 1.13.0 ([ec87735](https://github.com/wmfs/tymly-core/commit/ec87735))
* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([3663662](https://github.com/wmfs/tymly-core/commit/3663662))
* **deps-dev:** update semantic-release requirement ([4838c5b](https://github.com/wmfs/tymly-core/commit/4838c5b))

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
