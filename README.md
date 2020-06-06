Cue Sync Pro
===

Installation
---

  * clone
  * `yarn install` (npm is not supported)
  * `yarn dev`

The project is based on [electron-nuxt](https://github.com/michalzaq12/electron-nuxt).

Debugging
---

Logs are in `%USERPROFILE%\AppData\Roaming\cuesync\logs\` (Windows) or `~/Library/Logs/cuesync` (Mac).
See [electron-log](https://github.com/megahertz/electron-log) for details.

Publishing
---

### Binaries (Travis CI)

  * Create a GitHub token with repo and package scopes, set as `GH_TOKEN` in Travis
  * Create a release draft and push.
  * electron-builder automatically appends the artifacts to the draft
  * For more information, see the [electron-builder documentation](https://www.electron.build/configuration/publish#recommended-github-releases-workflow)

### Landing Page (Dokku/Heroku)

  * The `heroku-postinstall` step overrides the `build` command
  * `.buildpacks` makes sure that only the nodejs and the static build pack will be loaded
  * `.static` enables the static build pack
  * `static.json` specifies the directory to serve