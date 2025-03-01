'use strict'

// Create a comprehensive class-transformer/storage mock
const classTransformerStorageMock = {
  defaultMetadataStorage: {
    findTypeMetadata: () => undefined,
    getStrategy: () => ({}),
    getTargetMetadatas: () => [],
    getTargetParamTypes: () => [],
    has: () => false,
    clear: () => {},
  },
  METADATA_FACTORY_NAME: 'METADATA_FACTORY',
  storage: function () {
    return this.defaultMetadataStorage
  },
  getMetadataStorage: function () {
    return this.defaultMetadataStorage
  },
  getGlobalMetadataStorage: function () {
    return this.defaultMetadataStorage
  },
}

// Export the mock for CommonJS
module.exports = classTransformerStorageMock
// Also export individual properties for ESM named imports
Object.keys(classTransformerStorageMock).forEach((key) => {
  module.exports[key] = classTransformerStorageMock[key]
})
