## Firestore Explorer

Web based admin UI to explore cloud firestore

### Pre Requisites

- Ensure [nvm](https://github.com/nvm-sh/nvm) is installed on your system
- Ensure Java runtime is installed on the system. This will be used by firebase emulator

### setup local firestore with data

- `cd firebase-local`
- `nvm install`
- `npm i -g yarn`
- `yarn`
- `yarn firestore_setup`
- `yarn firestore_start`

fire up a new terminal and cd to same directory and run the seeding script

```
yarn seed_movies
```

Note that when you stop the firestore emulator (ctrl+c), the data will be lost and you need to run `yarn seed_movies` again

### Setup Firebase Explorer with local firestore
