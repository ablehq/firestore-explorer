## Firestore Explorer

Web based admin UI to explore cloud firestore

## Guide

Clone the repository. Make sure you have [nvm](https://github.com/nvm-sh/nvm) installed.

Follow these steps when using for the first time.

- `nvm use`
- `yarn onetime_setup`
- `yarn serve`

Follow these steps when you want to bring up the service after shutting it down with ctrl+c

- `nvm use`
- `yarn serve`

## Development Details

The project is divided into three modules. All these three modules can be developed independent of each other. Typescript is used across all these modules.

- Firebase Proxy
- Explorer
- Firebase seeds

### Firebase Proxy

An express based server which mainly deals with exposing two kinds of api.

- An api for web app for its storage needs. Exposes servers and config api endpoints.
- An api for command execution. It uses firebase admin sdk under the hood to wrap firebase calls to the firestore emulator or cloud firestore.

This can be worked on independently. Simply `cd` to the directory and use `yarn watch` to work on the code.

### Explorer

A vuejs based web application. Uses vuex for state management needs and vuetify for ui components. This module can also be worked on independently, simply `cd` to the directory and use `yarn serve` to work on the code.

### Firebase seeds

This is simple utility module to setup data in firestore emulator and cloud firestore.

- Use `yarn setup_emulator` to install firebase tools along with emulator
- Use `yarn emulator_start` to start the firestore emulator
- Use `yarn seed_local` to seed data present in `data` directory into emulator firestore
- Use `yarn seed_cloud` to seed data into cloud firestore. To work with cloud firestore you will admin sdk credentials file. You can get one by navigating to service accounts -> generate new key. Create a file called `FirebaseAdminConfig.json` in root directory of this module and paste the contents of the downloaded file into the json file.
