export const BeforeInvoke =
  (): MethodDecorator =>
  <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    Reflect.defineMetadata('BeforeInvokeMethod', true, descriptor.value);
  };

export const AfterInvoke =
  (): MethodDecorator =>
  <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    Reflect.defineMetadata('AfterInvokeMethod', true, descriptor.value);
  };

export interface InvokeContext {
  name: string;
  data: any;
}

export const EnableMethodListener = (): ClassDecorator => (target) => {
  let BeforeInvokeMethod = target.prototype['onMethodBeforeInvoke'];
  let AfterInvokeMethod = target.prototype['onMethodAfterInvoke'];
  if (BeforeInvokeMethod && typeof BeforeInvokeMethod !== 'function') {
    throw new Error('onMethodBeforeInvoke is not a function');
  }
  if (AfterInvokeMethod && typeof AfterInvokeMethod !== 'function') {
    throw new Error('onMethodAfterInvoke is not a function');
  }
  const rawTarget = target;
  Object.getOwnPropertyNames(target.prototype.__proto__).forEach(
    (methodKey) => {
      if (
        methodKey === 'constructor' ||
        typeof target.prototype[methodKey] !== 'function'
      )
        return;
      const rawMethod: Function = target.prototype[methodKey];
      if (!BeforeInvokeMethod) {
        if (Reflect.getMetadata('BeforeInvokeMethod', rawMethod)) {
          BeforeInvokeMethod = rawMethod;
          return;
        }
      }
      if (!AfterInvokeMethod) {
        if (Reflect.getMetadata('AfterInvokeMethod', rawMethod)) {
          AfterInvokeMethod = rawMethod;
          return;
        }
      }
    },
  );
  Object.getOwnPropertyNames(target.prototype).forEach((methodKey) => {
    if (
      methodKey === 'constructor' ||
      typeof target.prototype[methodKey] !== 'function'
    )
      return;
    const rawMethod: Function = target.prototype[methodKey];
    if (rawMethod == BeforeInvokeMethod || rawMethod == AfterInvokeMethod) {
      return;
    }
    if (!BeforeInvokeMethod) {
      if (Reflect.getMetadata('BeforeInvokeMethod', rawMethod)) {
        BeforeInvokeMethod = rawMethod;
        return;
      }
    }
    if (!AfterInvokeMethod) {
      if (Reflect.getMetadata('AfterInvokeMethod', rawMethod)) {
        BeforeInvokeMethod = rawMethod;
        return;
      }
    }
    target.prototype[methodKey] = async function (...args) {
      const context: InvokeContext = {
        name: target.name,
        data: {},
      };
      BeforeInvokeMethod &&
        BeforeInvokeMethod.call(this, context, methodKey, args);
      const invokeResult = await rawMethod.apply(this, args);
      AfterInvokeMethod && AfterInvokeMethod.call(this, context, methodKey);
      return invokeResult;
    };

    Reflect.getOwnMetadataKeys(rawMethod).forEach((metadataKey) => {
      Reflect.defineMetadata(
        metadataKey,
        Reflect.getMetadata(metadataKey, rawMethod),
        target.prototype[methodKey],
      );
    });
  });

  Reflect.getOwnMetadataKeys(rawTarget).forEach((metadataKey) =>
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, rawTarget),
      target,
    ),
  );
  return target;
};
