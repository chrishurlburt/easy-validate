# easy-validate
Tiny (< 1kb), schema-less, and dependency-less object validation for javascript

## Overview

easy-validate validates arbitrary values on a target object by providing a validator object with identical keys to the target object. Each validator object key contains and array with two elements: a validator function and an error message. Unlike many object validation libraries, a schema to validate the target object's data against is not necessary. Only keys defined on the validator object will be validated on the target object; all others will be ignored.

## Installation

```
npm install easy-validate
```

## Usage

To validate an object, simply pass the target object to validate and the validator object to the subsequently returned function. The validator object contains keys that must correspond with keys on the target object. Each key must contain an array with two elements: a function first, followed by an error message. The function recieves the value of the corresponding key on the target object as a parameter and must return a boolean which denotes if validation was successful. If the validator function returns false, the error message for that key will be added to the list of errors returned at end of validation. If no error is supplied as the second element of the validator array, a default will be used.

The validator object is the source of truth for what gets validated. Any keys on the target object that do not exist on the validator object will not be validated and ignored. Conversely, keys on the validator object that do not exist on the target object will return an error.



```js
import validate from 'easy-validate'

// target object
const formData = {
  name: 'George Washington',
  age: 42,
  occupation: 'astronaut',
  // won't be validated because there's no corresponding key on validator object
  birthday: '8/1/94',
  hobbies: ['golf, 'cooking']
};

// validator object
const validator = {
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
};

// validate function is curried so different validator objects may be used
// at different times against the same target object
const errors = validate(formData)(validator);

// errors:
// ['Not old enough.', 'Not qualified.', 'Not a valid city name.']
```


