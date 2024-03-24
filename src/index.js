export const allocateResource =
  ({ data: { availableResources, allocatedResources }, fns: { createResource } }) =>
  () => {
    let result;

    if (availableResources.length === 0) {
      result = createResource();
      allocatedResources.push(result);
    } else {
      result = availableResources.pop();
      allocatedResources.push(result);
    }

    return result;
  };
