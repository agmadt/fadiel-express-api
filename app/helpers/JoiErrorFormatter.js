const JoiErrorFormatter = {

    formats: (errors) => {
      let formattedErrors = {};

      errors.forEach(element => {
        formattedErrors[element.context.key] = [JoiErrorFormatter.prettify(element.message)];
      });

      return formattedErrors;
    },
    prettify: (message) => {
      if (!message) return null;
      const trimmed = message.replace(/"/g, '');
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }
  }
  
  module.exports = JoiErrorFormatter;