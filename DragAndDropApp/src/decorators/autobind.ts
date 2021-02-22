namespace App {
    // AutoBind decorator
  export function Bind(_: any, _2: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const fixedBindingMethod: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        const boundFunction = originalMethod.bind(this);
        return boundFunction;
      },
    };
    return fixedBindingMethod;
  }
}