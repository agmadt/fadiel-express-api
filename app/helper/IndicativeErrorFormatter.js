const IndicativeErrorFormatter = {

  format: (err) => {
    let errorBag = {};

    err.forEach(element => {
      errorBag[element.field] = [
        element.message
      ];
    });

    return errorBag;
  },

  messages: () => {
    return {
      required: (field, validation, args) => {
        return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase().replace('_', ' ') + ' is required';
      },
      email: (field, validation, args) => {
        return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase().replace('_', ' ') + ' is not an email';
      },
      array: (field, validation, args) => {
        return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase().replace('_', ' ') + ' is not an array';
      },
      min: (field, validation, args) => {
        return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase().replace('_', ' ') + ' minimal length is: ' + args;
      },
      object: (field, validation, args) => {
        return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase().replace('_', ' ') + ' is not an object';
      },
    };
  }
  
}

module.exports = IndicativeErrorFormatter;