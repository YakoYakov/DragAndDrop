// Validation

export interface IValidatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(userInput: IValidatable) {
  let isValid = true;

  switch (typeof userInput.value) {
    case 'string':
      if (userInput.required) {
        isValid = isValid && userInput.value.trim().length !== 0;
      }

      if (userInput.minLength) {
        isValid =
          isValid && userInput.value.trim().length >= userInput.minLength;
      }

      if (userInput.maxLength) {
        isValid =
          isValid && userInput.value.trim().length <= userInput.maxLength;
      }
      break;
    case 'number':
      if (userInput.required) {
        isValid = isValid && userInput.value != null;
      }

      if (userInput.min) {
        isValid = isValid && userInput.value >= userInput.min;
      }

      if (userInput.max) {
        isValid = isValid && userInput.value <= userInput.max;
      }
      break;
    default:
      break;
  }

  return isValid;
}
