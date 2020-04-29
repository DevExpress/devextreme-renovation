---
name: "Bug report \U0001F41E"
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

Check what generator works wrong

- [ ] Angular
- [ ] React
- [ ] Vue
- [ ] jQuery

### Declaration File

<!-- Pass here your pice of the declaration file, see the example below. -->

```ts
@OneWay
data: string = 'data';
```

### Current Generated File

<!-- Pass here your pice of the wrong generated file, see the example below. -->

```js
var data = 'DATA';
```

### Expected Generated File

<!-- Pass here your pice of the expected generated file, see the example below. -->

```js
var data = 'data';
```

### Additional Information

A version of the generator: X.X.X
