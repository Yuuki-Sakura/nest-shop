import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import validator from 'validator';
import isStrongPassword = validator.isStrongPassword;
import isStrongPasswordOption = validator.strongPasswordOptions;

export function IsStrongPassword(
  isStrongPasswordOption?: isStrongPasswordOption,
  validationOptions?: ValidationOptions,
) {
  const defaultOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
    ...isStrongPasswordOption,
  };
  return ValidateBy(
    {
      name: 'IsStrongPassword',
      validator: {
        validate(password: any) {
          return isStrongPassword(password, defaultOptions);
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix +
            `$property must be longer then ${defaultOptions.minLength} digits and contain at least ${defaultOptions.minLowercase} lowercase character, ${defaultOptions.minUppercase} uppercase character, ${defaultOptions.minNumbers} numbers and ${defaultOptions.minSymbols} symbols.`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
