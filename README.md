## Initializing library

1. In HTML, use `<script>` tag to link analytics `.js` file:
```html
<script src="js/analytics.js"></script>
```

2. Call `analytics.init()` function

```js
// Initializing analytics library
analytics.init({
  tenantID: <value>,
  userID:   <value>
});
```

## Next steps

Now you have 2 options:

1. Use html `class`es like this:

```html
<button class="analytics-click">...</button>
```

It's quick but not fully customizable.
Here is the list of all abailable `class`es:

* `analytics-click`
* `analytics-hover`
* `analytics-enter-viewport` (automatically attaches the `"leave_viewport"` event)
* `analytics-enter-viewport` with `data-goal="<number in milliseconds>"` (e.g. `data-goal="5000"`)


1. Call analytics' methods manually:
```js
// Binding custom click event
document.querySelector('.js-button').addEventListener('click', function(e) {
  // Here we manually call the .send() function add pass any number of parameters
  analytics.send({
    event_name: 'JavaScript button click',
    event_type: 'click'
  });
});
```

## List of currently supported event types:
* `click`
* `hover`
* `enter_viewport`
* `leave_viewport`
* `viewport_goal`
* `page_visit`
* `metamask_login`
* `metamask_rejected`

## API

### `analytics.init(options)`
Initializes the analytics.

`options` (optional) - object with parameters used to set up the analytics library.

`options.tenantID` - Used to identify the data with a specific tenant.

`options.userID` - Used to identify the data with a specific user.

### `analytics.send(parameters)`
Registers the event (also sends a request to the server).


`parameters` is and object with the following properties:
| Option                  | Type          | Passed automatically | Description |
| -------------           | ------------- | --  | --
| `event_name`            | `string`      | no  | Cusom event name a.k.a. "target action name"
| `event_type`            | `string`      | no  | The event type. Available options: `page_visit`, `click`, `hover`, `enter_viewport`, `leave_viewport`, `viewport_goal`
| `auth_project`          | `object`      | yes | Authorization details.
| `user_ids`              | `object`      | yes | Data to identify the user.
| `other_admin_variables` | `object`      | yes | Admin specific properties
| `event_properties`      | `object`      | yes | Event specific properties
| `automatically_tracked` | `object`      | yes | Automatically tracked user info

Note: you can stil edit specify the properties that are "automatically passed", though it's not necessary.

Here's the example of `.send()` function:

```js
analytics.send({
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
  other_admin_variables: {
    timestamp:   Date.now()
  },
  event_properties: {},
  user_properties:  {
    myCustomValue: 'anything
  },
});
```