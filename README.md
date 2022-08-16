# Merlin Sessions SDK

## Introduction
Merlin Sessions SDK provides a way to collect events data from your application. It is designed to be lightweight and can be easily configured within your codebase. Contact us at hello@getmerlin.xyz to get access to this service. 

## Initializing library
1. In HTML, use `<script>` tag to link analytics `.js` file:
```html
<script src="https://raw.githubusercontent.com/merlin-app/merlin-sessions-jsmodule/main/public/js/merlin.js"></script>
```

2. Call `merlin.init()` function

```js
// Initializing Merlin Project with authorization details
merlin.init({
  tenant_name : <value>,
  api_key : <value>,
  user_id : <value>,
  wallet_address : <value>
});
```
Contact us at hello@getmerlin.xyz to get the `api_key` and `tenant_name`. 

Being web3 native, we wanted to serve our dApps better and thus we are natively giving two options to uniquely identify a user. You can pass wallet address via `wallet_address`, and any internal user identifier you might via `user_id`. Either one of them should be populated to correctly attribute an event to an user. You can provide both as well. 

If you need to change `.init()` parameters, **do not** call `merlin.init()` the second time! You can just modify them directly like this:
```js
merlin.wallet_address = 'new value';
```

## Sending events

There are two ways to send event data to Merlin servers - 
1. Calling `merlin.send()` inside event listeners
2. Using merlin specific class names on elements you want to track

Note - Merlin currently tracks the following automatically:
* `browser_type`
* `os_name`
* `os_version`
* `device_type`
* `timestamp`
* `url`
* `referrer`
* `country`
* `language`. 

### Option 1 : Calling `merlin.send()` inside event listners
```js
// Defining your own logic with regards to when to send the event.
document.querySelector('.js-button').addEventListener('click', function(e) {
  // Here you call the merlin.send() function, with all the parameters you want to add.
  merlin.send({
    event_name: 'JavaScript button click',
    event_type: 'click',
    ...
  });
});
```

### Option 2 : Using merlin specific class names on elements you want to track

Use html `class`es like this:

```html
<button class="merlin-click">...</button>
```

The list of all abailable classes:
* `merlin-click`
* `merlin-hover`
* `merlin-enter-viewport` (automatically attaches the `"leave_viewport"` event)
* `merlin-enter-viewport` with `data-goal="<number in milliseconds>"` (e.g. `data-goal="5000"`)

You can also pass more parameters using `data-*` attributes:

```html
<button
  class="merlin-click"
  data-merlin-event-name="My custom name"
  data-merlin-event-type="custom"
  ...
>
  ...
</button>
```

Please note:
* HTML attributes **must** start with `data-merlin-` and every word is separated with a hyphon (`-`)
* If the parameter type is `object` (e.g. `event_properties`), you have to pass JSON as value.
  Note that you have to use **single quotes** inside so html doesn't break.
  Example:
  ```html
  <button data-merlin-event-properties="{ 'custom': 123 }"
  ```

## Function Parameter Details

### `merlin.init(options)`
Initializes Merlin Project
- `options` - parameters that can be passed to `merlin.init()`
    - `options.tenant_name` (`string`) - Used to identify the data with a specific tenant. (contact us at hello@getmerlin.xyz to get the API key)
    - `options.api_key` (`string`) - The API key to connect with the db. (contact us at hello@getmerlin.xyz to get the API key)
    - `options.user_id` (`number`) - Used to identify the data with a specific user.
    - `options.wallet_address` (`string`) - Used to identify the data with a specific wallet address.

### `merlin.send(parameters)`
Registers and sends an event.

`parameters` is an object with the following properties:
| Option                  | Type          | Required | Description |
| -------------           | ------------- | --  | --
| `event_name`            | `string`      | yes  | The event name
| `event_type`            | `string`      | yes  | The event type.
| `auth_project`          | `object`      | no | Authorization details. If nothing passed, will populated based on `merlin.init()`
| `user_ids`              | `object`      | no | Example - `{'user_id':'u-1221','wallet_address':'0x8A97e8B3389D431182aC67c0DF7D46FF8DCE7121'}`. If nothing passed, will populated based on `merlin.init()`
| `other_admin_variables` | `object`      | no | To pass the `app_version`. `{'app_version':'development_1.0'}`. If nothing passed, will be kept empty
| `event_properties`      | `object`      | no | Any custom events details you want to send. If nothing passed, will be kept empty
| `user_properties`       | `object`      | no | Any custom user details you want to send.  If nothing passed, will be kept empty


Here's an example of `.send()` function:

```js
merlin.send({
  event_name: 'My click event',
  event_type: 'click',
  auth_project: {
    tenant_id: 0,
    api_key:   'xxx'
  },
  user_ids: {
    user_id: 17,
    wallet_address: 'xxx'
  },
  other_admin_variables: {},
  event_properties: {},
  user_properties:  {
    myCustomValue: 'anything'
  }
});
```
