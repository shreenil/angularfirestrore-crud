// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyAQ-bfCyIZYIf9GapR-onXBEneESLmMkv0",
    authDomain: "firestore-demo-d2ca3.firebaseapp.com",
    databaseURL: "https://firestore-demo-d2ca3.firebaseio.com",
    projectId: "firestore-demo-d2ca3",
    storageBucket: "firestore-demo-d2ca3.appspot.com",
    messagingSenderId: "821954030865"
  }
};
