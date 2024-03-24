import { jest } from '@jest/globals';

import { randomUUID } from 'crypto';
import { allocateResource } from './index';

describe('allocateResource', () => {
  const createResource = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('should create a resource and allocate it if no resources are available', () => {
    const newResource = { id: randomUUID() };
    createResource.mockReturnValue(newResource);

    const data = { allocatedResources: [], availableResources: [] };
    const env = { data, fns: { createResource } };

    const result = allocateResource(env)();

    expect(result).toEqual(newResource);
  });

  it('should allocate an available resource', () => {
    const availableResource = { id: randomUUID() };
    const data = { allocatedResources: [], availableResources: [availableResource] };
    const env = { data, fns: { createResource } };

    const result = allocateResource(env)();

    expect(result).toEqual(availableResource);
  });
});
