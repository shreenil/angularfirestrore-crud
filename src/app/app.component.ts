import { Observable } from 'rxjs/Rx';
import { Component, OnInit, ViewChild, ElementRef, trigger, transition, style, animate, state } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import 'firebase/storage'
import * as firebase from 'firebase';

class User {


  constructor(public name: string, public email_id: string, public contact_number: number, public image: string, public id?: string) {

  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform : 'translateX(-75%)' }),
          animate('200ms', style({ transform : 'translateX(0%)' }))
        ]),
        transition(':leave', [
          style({ transform : 'translateX(0%)' }),
          animate('200ms', style({ transform : 'translateX(-75%)' }))
        ])
      ]
    )
  ]

})
export class AppComponent implements OnInit {

  UsersCollection: AngularFirestoreCollection<User>;
  user: Observable<User[]>;
  UsersDoc: AngularFirestoreDocument<User>;
  public uploadTask: firebase.storage.UploadTask;

  addUser: User;

  editState: boolean = false;
  itemToUpdate: User;

  @ViewChild('bar') Bar: ElementRef;

  constructor(private afs: AngularFirestore) {
    this.addUser = new User("", "", null, null);
  }

  ngOnInit() {
    this.UsersCollection = this.afs.collection('users');
    this.user = this.UsersCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as User;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  loadImage(event,img) {
    img.src = URL.createObjectURL(event.target.files[0]);
  }

  insert() {
    //this.addUser.image = this.upload(f);
    console.log(this.addUser);
    this.UsersCollection.add({ name: this.addUser.name, email_id: this.addUser.email_id, contact_number: this.addUser.contact_number, image: this.addUser.image });
    //this.UsersCollection.add(new User(this.addUser));
    this.addUser = new User("", "", null, null);
    this.progress = 0;
  }

  delete(item: User) {
    this.UsersDoc = this.afs.doc(`users/${item.id}`);
    let storagePath = firebase.storage().ref();
    let name = item.image.substr(item.image.indexOf('%2F') + 3, (item.image.indexOf('?')) - (item.image.indexOf('%2F') + 3));
    name = name.replace('%20',' '); 
    console.log(`images/${name}`);
    storagePath.child(`images/${name}`).delete();
    this.UsersDoc.delete();
  }

  edit(item: User) {
    this.editState = true;
    this.itemToUpdate = new User(item.name, item.email_id, item.contact_number, item.image, item.id);
  }

  update() {
    this.UsersDoc = this.afs.doc(`users/${this.itemToUpdate.id}`);
    console.log(this.itemToUpdate.id);
    //if(f1.files[0])
    //this.itemToUpdate.image = this.upload(f1)
    console.log(this.itemToUpdate);
    this.UsersDoc.update({ name: this.itemToUpdate.name, email_id: this.itemToUpdate.email_id, contact_number: this.itemToUpdate.contact_number, image: this.itemToUpdate.image });
    this.clearState();
    this.progress = 0

  }

  clearState() {
    this.editState = false;
    this.itemToUpdate = null;
  }
  progress: number;
  upload(f, operation) {

    if (f.files[0]) {
      let angular = this;
      let storageReference = firebase.storage().ref('/images/' + f.files[0].name);
      this.uploadTask = storageReference.put(f.files[0]);
      var img_url = "";
      this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {

        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.progress = (this.uploadTask.snapshot.bytesTransferred / this.uploadTask.snapshot.totalBytes) * 100;
        console.log('Upload is ' + this.progress + '% done');


        switch (this.uploadTask.snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function (error) {
        // Handle unsuccessful uploads
      }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        storageReference.getDownloadURL().then(function (url) {
          // Insert url into an <img> tag to "download"
          img_url = url;
          if (operation == 'insert') {
            angular.addUser.image = img_url;
            angular.insert();
          }
          else {
            let storagePath = firebase.storage().ref();
            let name = angular.itemToUpdate.image.substr(angular.itemToUpdate.image.indexOf('%2F') + 3, (angular.itemToUpdate.image.indexOf('?')) - (angular.itemToUpdate.image.indexOf('%2F') + 3));
            name = name.replace('%20',' '); 
            console.log(`images/${name}`);
            storagePath.child(`images/${name}`).delete();
            angular.itemToUpdate.image = img_url;
            angular.update();
          }
        });

      });
    }
    else {
      if (operation == 'insert') {
        this.insert();
      }
      else {
        this.update();
      }
    }

  }

}
