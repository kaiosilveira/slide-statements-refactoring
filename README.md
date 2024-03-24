[![Continuous Integration](https://github.com/kaiosilveira/slide-statements-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/slide-statements-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Slide statements

**Formerly: Consolidate Duplicate Conditional Fragments**

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
const pricingPlan = retrievePricingPlan();
const order = retrieveOrder();
let charge;
const chargePerUnit = pricingPlan.unit;
```

</td>

<td>

```javascript
const pricingPlan = retrievePricingPlan();
const chargePerUnit = pricingPlan.unit;
const order = retrieveOrder();
let charge;
```

</td>
</tr>
</tbody>
</table>

Code is usually read way more times than it is written, and when one is reading code, simple things such as the order in which each statement appears in the code can either aid or inhibit understanding. This tiny refactoring helps in identifying and improving such cases.

## Working example

Our working example, extracted from the book, is a function that allocates a resource either by fetching it from a list of `availableResources` or creating a new one on the fly. The allocated resource is returned as the result of the function. The function itself looks like this:

```javascript
export const allocateResource = () => {
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
```

PS: In the working code, a thin wrapper containing an "environment" had to be added so this function could be properly unit-tested. The general behavior remains the same, though.

### Test suite

The test suite is also pretty straightforward — we cover both the case when a new resource is created on the fly and when an available resource is returned:

```javascript
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
```

With the unit tests in place, we're safe to move forward.

### Steps

In our case, the statement `allocatedResource.push(result)` is duplicated in both legs of the conditional and screaming to be slid out of them. We can move forward and do it:

```diff
diff --git a/src/index.js b/src/index.js
@@ -5,11 +5,11 @@
     if (availableResources.length === 0) {
       result = createResource();
-      allocatedResources.push(result);
     } else {
       result = availableResources.pop();
-      allocatedResources.push(result);
     }

+    allocatedResources.push(result);
+
     return result;
   };
```

After that, we can run the unit tests to make sure that they still pass, and we're done!

Although simple, this practice has profound implications for the structure and readability of our programs. It also serves as a preparatory step for more elaborate refactorings, such as **[Extract Function](https://github.com/kaiosilveira/extract-function-refactoring/tree/1cba8ddb894d94f3e2528bcc184942cdf4de1103)**.

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                              | Message                                                              |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [4e15f72](https://github.com/kaiosilveira/slide-statements-refactoring/commit/4e15f72e0a8e1d8d82d6df1e0e1ce37bc7747972) | slide `allocatedResources.push(result)` out of conditional statement |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/slide-statements-refactoring/commits/main).
