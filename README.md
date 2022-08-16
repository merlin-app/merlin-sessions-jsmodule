## Initializing library

1. In HTML, use `<script>` tag to link analytics `.js` file:
```html
<script src="js/merlin.js"></script>
```

2. Call `merlin.init()` function

```js
// Initializing analytics library
merlin.init({
  tenant_id: <value>,
  user_id:   <value>,
  ...
});
```

## Next steps

Now you have 2 options:

1. Use html `class`es like this:

```html
<button class="merlin-click">...</button>
```

Here is the list of all abailable `class`es:

* `merlin-click`
* `merlin-hover`
* `merlin-enter-viewport` (automatically attaches the `"leave_viewport"` event)
* `merlin-enter-viewport` with `data-goal="<number in milliseconds>"` (e.g. `data-goal="5000"`)

You can pass more parameters using `data-*` attributes:

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

You have to remember 2 things:
* HTML attributes **must** start with `data-merlin-` and every word is separated with a hyphon (`-`)
* If the parameter type is `object` (e.g. `event_properties`), you have to pass JSON as value.
  Note that you have to use **single quotes** inside so html doesn't break.

  Example:
  ```html
  <button data-merlin-event-properties="{ 'custom': 123 }"
  ```


1. Call analytics' methods manually:
```js
// Binding custom click event
document.querySelector('.js-button').addEventListener('click', function(e) {
  // Here we manually call the .send() function add pass any number of parameters
  merlin.send({
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
* `custom`

## API

### `merlin.init(options)`
Initializes the analytics.

`options` (optional) - object with parameters used to set up the analytics library.

`options.tenant_id` (`number`) - Used to identify the data with a specific tenant.

`options.tenant_name` (`string`) - Used to identify the data with a specific tenant.

`options.api_key` (`string`) - The API key to connect with the db.

`options.user_id` (`number`) - Used to identify the data with a specific user.

### `merlin.send(parameters)`
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
| `user_properties`       | `object`      | yes | Custom properties
| `automatically_tracked` | `object`      | yes | Automatically tracked user info

Note: you can stil edit specify the properties that are "automatically passed", though it's not necessary.

Here's the example of `.send()` function:

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
    myCustomValue: 'anything
  },
});
```