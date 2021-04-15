# Architecture Notes

## Schema Structure

Cores will have a single level of Realms, with the core/Root Realm being the default.
Realms are intended to be used to differentiate between devices for specific spaces or studios within a facility, for geographically separate facilities you should use Federated Cores that can be centrally managed but operate independently (this resolves network interconnect issues).

Data is logically laid out as follows, but is stored as flat documents in mongo that have a core and realm field, mongo querying will return the artifacts for the requested core/realm.

```
Core
  └─ Realm
      ├─ Device
      ├─ <*1> Stack
      ├─ Panel Set
      │   └ Panel
      │      └ Buttons
      │          ├─ <*1> Stack
      │          └─ Ephemeral Action
      └─ Controller
```

Cores federate with each other and share Realm data
Artifacts exist within a Realm on a Core
Artifacts reference each other by ID
Everything has an ID
UUID? ShortID?
Core/Realm part of the ID?
Can a panel be in multiple sets?

## UI/UX breakup

Do federated Cores share the same UI? Yes, seperated by Core as the tree root
Is everything presented as a tree?

### URI Paths

```
/:core
/:core/:realm
/:core/:realm/devices
/:core/:realm/devices/:device
/:core/:realm/stacks
/:core/:realm/stacks/:stack
/:core/:realm/panels
/:core/:realm/panels/:panel
/:core/:realm/controllers
/:core/:realm/controllers/:controller
/:core/:realm/shotbox
/:core/:realm/shotbox/:panel
/:core/administration
/:core/administration/users
/:core/administration/federation
/:core/user/:user
```

All specific URIs bar controllers can be queried with new as the ID and will return the appropriate new artifact configuration view

## Object Structures
### Device
```javascript
{
  core: process.env.DIRECTOR_CORE_CONFIG_LABEL,
  realm: REALM_ID,
  label: DEVICE_LABEL,
  location: DEVICE_LOCATION,
  provider: {
    id: PROVIDER_ID,
    label: PROVIDER_LABEL
  },
  enabled: ENABLED_STATE,
  status: STATUS.UNKNOWN,
  description: DEVICE_DESCRIPTION
}
```

### User
```javascript
{
  core: string process.env.DIRECTOR_CORE_CONFIG_LABEL,
  username: string USER_USERNAME,
  firstname: string USER_FIRSTNAME,
  lastname: string USER_LASTNAME,
  role: string USER_ROLE,
  realms: array [
    string REALM_ID 
  ]
}
```



### Core

```javascript
{
  id: process.env.DIRECTOR_CORE_ID,
  label: process.env.DIRECTOR_CORE_LABEL
  helpdeskVisable: bool CORE_HELPDESK_VISABLE
  helpdeskURI: string CORE_HELPDESK_URI
  timezone: string CORE_TIMEZONE
  systemNotes: string CORE_NOTES
  realms: [
    {
      id: string REALM_ID,
      label: string REALM_LABEL,
      description: string REALM_DESCRIPTION
    }
  ]
}
```



## Authentication

### Flow
Initial admin user gets populated on app start from env var, they have root access to create other users.

Users will be federated though an api that queries other federated cores for the existence of said user acl assignment, authentication will still be local to the core being accessed

User authentication will be done with Passport.js to permit multiple authentication strategies (LDAP/Oauth2/SAML providers, as well as local), because many authentication strategies only support raw authentication and not scope or role assignment  ACLs will be locally managed on Cores, when a user authenticates  the core goes though the ACL LUT and determines the access associated with that account.

A user can be added dynamically from them logging in, in which case they will be shown the dashboard but will have no access to the system until they contact an administrator to be assigned permissions

If a user is added first by an administrator they will have immediate access to their scope upon first login

For new user registration 

1. Client authenticates 
2. Core does the oauth flow or whatever the auth mechanism is 
3. Core queries its database of user objects
4. If no user object, create one and push to federated cores 
5. Notify system administrator to assign permissions 
6. Global/Core Administrator assigns permissions 
7. Core the admin is on pushes changes to federated cores 
8. User can then authenticate on any core and receive the same permissions 
9. User is notified that their account has been configured 

For user created by admin 

1. Global/Core Administrator creates user and assigns permissions 
2. Core the admin is on pushes changes to federated cores 
3. User is notified that their account has been configured 
4. Client authenticates 
5. Core does the oauth flow or whatever the auth mechanism is 
6. Core queries its database of user objects for this user ID 
7. Core returns whatever data theyre authorized for 

For user updates

1. Administrator makes the changes
2. Core the admin is on pushes changes to federated cores 
3. User authenticated on any core will have updated permissions

### Access Permissions
* Global Administrator
Full access to the federated network of cores.

* Core Administrator
Full access to their local core

* Global Engineer
Can do anything to artifacts on any federated core

* Core Engineer
Can do anything to artifacts on their core

* Realm Engineer
Can do anything to artifacts within a Realm

* Operator
Can only access shotboxes within their assigned Realms

```sequence
User->Core: Query devices
Core-->User: Not authenticated
User-->User: Redirect to login
User->Core: Initiate OAuth
Core->OAuth: Authenticate?
OAuth-->Core:Yes.
Core-->Core: Update authentication
Core->Federated Core: Update Federation
Core-->User: Yes Hello.
User->Core: Query devices
Core-->Core: Query ACLs
Core--User: Return devices
```

## Routing

- Flow Chart Thing https://github.com/wbkd/react-flow

​Need a routing management module to handle state and crosspoint changes from connected devices

All crosspoint changes should be made by the end device providers and not the core itself, via a router endpoint registration process

Registering matrixes should be handled by a function that takes a signal type or level, IO count, an array of current state, and the function called to change a crosspoint.

Device Providers should update the matrix store on all crosspoint changes, either executed by Director, or when given update information from the connected device

Executing a crosspoint change on the backend should be done thought the callback funtion passed to the matrix registration.

The Routes frontend should provide an interface to select signal levels or types, and allow selection of multiple destinations and sources for the take command to act upon, while the stack action should provide the ability to select a signal type and a single destination/source pair to take for that action.

# Linting

```json
{
  "phabricator.uri" : "https://phabricator.boreal.systems/",
  "load": [
    "../arcanist-linters"
  ]
}
```

```json
{
  "linters": {
    "eslint": {
      "type": "eslint",
      "include": "(\\.js$)",
      "bin": "./node_modules/.bin/eslint",
      "eslint.config": ".eslintrc.js",
      "eslint.env": "browser,node"
    }
  }
}
```