const validate = values => validator => {
  return Object.entries(validator).reduce((errors, [key, validate]) => {
    if ({}.hasOwnProperty.call(values, key)) {
      const result = validate[0](values[key])
      if (!result) errors.push(validate[1] || `Invalid value for ${key}`)
    } else {
      errors.push(validate[1] || `No value for '${key}'`)
    }
    return errors
  }, [])
}

export default validate
