export class LoadOnce {
  constructor(module: any) {
    if (module) {
      throw new Error(`${module.constructor.name} can only be imported in AppModule`);
    }
  }
}
