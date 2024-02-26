function filterArrayLike(array, onEach) {
  const values = [];

  for (let i = 0; i < array.length; ++i) {
    if (onEach(array[i], i, array)) {
      values.push(array[i]);
    }
  }

  return values;
}

function getFilterIterator(iteratable) {
  if(iteratable[Symbol.iterator]) {
    return iteratable[Symbol.iterator]();
  }

  if (iteratable.constructor === Object) {
    return Object.entries(iteratable)[Symbol.iterator]();
  }

  return null;
}

function filterIterator(iterator, iteratable, onEach) {
  const values = [];

  let step = iterator.next();

  while (!step.done) {
    if (onEach(step.value[1], step.value[0], iteratable)) {
      values.push(step.value);
    }

    step = iterator.next();
  }

  return values;
}

function filterSetIterator(iterator, set, onEach) {
  const values = [];

  let step = iterator.next();

  while (!step.done) {
    if (onEach(step.value, step.value, set)) {
      values.push(step.value);
    }

    step = iterator.next();
  }

  return values;
}

function createNewFromValues(instance, values) {
  if (typeof instance === 'string') {
    return values.join('');
  }

  if (instance instanceof String) {
    return new instance.constructor(values.join(''));
  }

  if (instance.constructor === Object) {
    return values.reduce((o, [k, v]) => {
      o[k] = v;
      return o;
    }, {})
  }

  return new instance.constructor(values);
}

module.exports = function filter(iteratable, onEach) {
  // quick win for arrays and typed arrays.
  if (iteratable.filter) return iteratable.filter(onEach);

  let values = [];

  // array likes (eg. strings)
  if (iteratable.length && iteratable[Symbol.iterator]) {
    values = filterArrayLike(iteratable, onEach);
  } else {
    const iterator = getFilterIterator(iteratable);

    if (!iterator || !iterator.next) {
      throw new Error('First parameter needs to be plain Object or an iteratable.');
    }

    if (iteratable instanceof Set) {
      values = filterSetIterator(iterator, iteratable, onEach);
    } else {
      values = filterIterator(iterator, iteratable, onEach);
    }
  }

  return createNewFromValues(iteratable, values);
};
