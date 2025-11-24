import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidEvent(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEvent',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'object') {
            return false;
          }

          const { type } = value;

          if (!type || typeof type !== 'string') {
            return false;
          }

          // Validate based on event type
          switch (type) {
            case 'pageview':
              return (
                typeof value.path === 'string' &&
                typeof value.requestId === 'string' &&
                typeof value.timestamp === 'string'
              );

            case 'custom':
              return (
                typeof value.name === 'string' &&
                typeof value.details === 'object' &&
                typeof value.requestId === 'string' &&
                typeof value.timestamp === 'string'
              );

            case 'server_request':
              return (
                typeof value.method === 'string' &&
                typeof value.path === 'string' &&
                typeof value.requestId === 'string' &&
                typeof value.timestamp === 'string'
              );

            default:
              return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return 'Each event must have a valid type and required fields for that type';
        },
      },
    });
  };
}

