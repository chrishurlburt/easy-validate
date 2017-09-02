# easy-validate
Tiny (< 1kb min+gzipped), schema-less, and dependency-less object validation for javascript

## Overview

easy-validate validates arbitrary values on a target object by way of a provided function. If validation fails, the provided error message is added to the array of errors returned upon completion of validation. Unlike many object validation libraries, a schema to validate the target object's data against is not necessary. The only things needed are a simple function that returns true or false if the value passes a given test and an error message.

## Why?

Say you're writing a single page app. You likely already have a backend with validation established and you have a form on the frontend that you need some basic pre-submit validation to avoid erroneous API requests. You don't want to re-create the same extensive validation logic you have on the backend or include some heavy library on the frontend to handle it... enter easy-validate.

easy-validate is super lightweight, less than 1kb, and makes implementing simple validation with error messages a trivial task. Additionally, it utilizes a curried API so that different validation rules can be attached to the same object at different times. For example, save you have a form that can be 'published' or 'saved as draft' -- the form is the same, however the validation rules will be different in each case.

## Installation

```
npm install easy-validate
```

## Usage

To validate an object, simply pass the target object to validate and the validator object to the subsequently returned function. The validator object contains keys that must correspond with keys on the target object.

```js
const target = { name: 'chris' }

// validator object: { key: [validatorFunction, errorMessage] }
const validator = { name: [name => name === 'chris', 'Name must be chris!'] }

// errors is always an array, empty if no validation errors
const errors = validate(target)(validator)
```

Each key must contain an array with two elements: a function first, followed by an error message. The function recieves the value of the corresponding key on the target object as a parameter and must return a boolean which denotes if validation was successful. If the validator function returns false, the error message for that key will be added to the list of errors returned at end of validation. If no error is supplied as the second element of the validator array, a default will be used.

The validator object is the source of truth for what gets validated. Any keys on the target object that do not exist on the validator object will not be validated and ignored. Conversely, keys on the validator object that do not exist on the target object will return an error.

```js
  // the name key will be ignored because it does not exist on the validator object.
  const target = { name: 'chris', age: 1000 }

  // the eyeColor key will automatically return it's error because the property is missing from the target object
  const validator = {
    age: [age => age < 110, 'Invalid age.'],
    eyeColor: [color => typeof color === 'string', 'Invalid eye color.']
  }

  // errors: ['Invalid age.', 'Invalid eye color.']
  const errors = validate(target)(validator)
```

#### Optional fields

easy-validate makes no assumptions about optional or required fields. Any logic to reflect whether or not a key on an object is optional or required is left up to the developer to implement within the validator function. The only caveat is that the key must be present on the object being validated.

```js
  // 'restaurant' is the optional key here
  const target = { food: 'pizza', restaurant: '' }

  // validator function for restaurant allows it be a falsy value or a string, thereby making it optional
  const validator = {
    food: [food => food.length > 3, 'Error message here'],
    restaurant: [restaurant => !restaurant || typeof restaurant === 'string', 'invalid restaurant name'],
  }
```

## Example

This example assumes ```formData``` is a piece of data that can hypothetically be submitted as a "draft" or "published". As such, it may be validated differently for either circumstance. Note the use of the curried ```validateFormData``` function that can be called with different validators against the same target object. Here we have defined 2 validators, ```publishValidator``` and ```draftValidator```.

```js
import validate from 'easy-validate'

// target object
const formData = {
  name: 'George Washington',
  age: 42,
  occupation: 'astronaut',
  // won't be validated because there's no corresponding key on validator object
  birthday: '8/1/94',
  hobbies: ['golf', 'cooking']
}

// validator with rules for "publishing" data
const publishValidator = {
  name: [name => name.length > 6, 'The name is too short.'],
  age: [age => age >= 35, 'Not old enough.'],
  occupation: [occupation => ['senator','governor'].includes(occupation), 'Not qualified.'],

  //returns error automatically because 'city' key not defined on target object
  city: [city => city.length > 3, 'Not a valid city name.'],

  // validate optional values on target object
  hobbies: [
    hobbies => (hobbies.length === 0) ? true : Array.isArray(hobbies),
    'Invalid value for hobbies.'
  ]
}

// we only care about validating the 'name' key for drafts
const draftValidator = {
  name: [name => name.length > 6, 'The name is too short.']
}

// validate function is curried so different validator objects may be used
// at different times against the same target object
const validateFormData = validate(formData)

if (isSaveDraft) {
  // errors:
  // []
  const errors = validateFormData(draftValidator)
} else {
  // errors:
  // ['Not old enough.', 'Not qualified.', 'Not a valid city name.']
  const errors = validateFormdata(publishValidator)
}
```
