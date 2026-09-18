# Firebase Rules

Optional cloud sync stores projects under each signed-in user at:

```text
users/{userId}/projects/{projectId}
```

Use Firebase Authentication with Google sign-in and Firestore rules that only allow each user to read and write their own project documents:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/projects/{projectId} {
      allow read, create, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

The app keeps all data local unless the user connects Firebase sync. During pull, local and cloud projects are merged by project id or name. If both copies changed, the version with the newer `updatedAt` value wins.