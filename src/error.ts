export class ConfigError extends Error {
  constructor(name: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = `${name}ConfigError`;
  }
}

export class NotDefinedConfigError extends ConfigError {
  constructor(name: string, options?: ErrorOptions) {
    super('NotDefined', `\`process.env.${name}\` is not defined`, options);
  }
}

export class ValueConfigError extends ConfigError {
  constructor(name: string, value: string | number, options?: ErrorOptions) {
    super(
      'Value',
      `\`process.env.${name}'s\` value "${value}" is not allowed`,
      options,
    );
  }
}
