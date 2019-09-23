# Firestore Explorer

Web based read only admin UI to explore cloud firestore and emulator.

## Motivation

There are a couple of issues we noticed during our day to day development with Firestore projects.

- Exploring documents in your collections can soon become tedious process as you have to click through and navigate the whole hierarchy, its a painful experience that eats into your productivity.
  
- There is no way to explore Firestore emulator.

What we need is a quick way to query the data of interest, just like there is an sql console for a relational database, we would need a query tool for Firestore as well.

## Before you begin

- To connect to Cloud Firestore, this tool would require Firebase project's security credentials for admin access. To mitigate any risk of accidental writes to Firestore, this tool ensures that the queries passed to it are read only calls. It does so by applying a layer of javascript parsing that filters only read queries.
  
- This tool is like any other Firestore client, hence reads made through this tool will be charged as per Firestore plan.

## Usage

> Note: Ensure you have [nvm](https://github.com/nvm-sh/nvm) and [firebase-tools](https://github.com/firebase/firebase-tools) installed. 

Clone the repository

Follow these steps when using for the first time.

- `nvm use`
- `yarn onetime_setup`
- `yarn serve`

Follow these steps when you want to bring up the service after shutting it down with ctrl+c

- `nvm use`
- `yarn serve`

## Query console

Query console supports arbitrary queries to Firestore. It expects javascript based method calls just like the web or admin sdk. There are some limitation to the queries

- Single valid javascript statement
- Query should always start with `db`
- Query should always end with call that will return a promise of `QueryDocumentSnapshot` or `QueryDocumentSnapshot` or `QuerySnapshot` or `Array<CollectionReference>`

### Examples

```javascript
db.listCollections();
```

```javascript
db.collection("movies")
  .limit(10)
  .get();
```

```javascript
db.collection("movies")
  .where("title", "==", "LBJ (2017)")
  .limit(10)
  .get();
```

```javascript
db.doc("movies/179813").get();
```

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

- Use `yarn emulator_setup` to install firebase tools along with emulator
- Use `yarn emulator_start` to start the firestore emulator
- Use `yarn seed_local` to seed data present in `data` directory into emulator firestore
- Use `yarn seed_cloud` to seed data into cloud firestore. To work with cloud firestore you will admin sdk credentials file. You can get one by navigating to service accounts -> generate new key. Create a file called `FirebaseAdminConfig.json` in root directory of this module and paste the contents of the downloaded file into the json file.
