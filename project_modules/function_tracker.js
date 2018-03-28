module.exports = trackerFactory;

function getMissingElements(last_array, cur_array) {
  let missing = [];
  last_array.forEach((elem) => {
    if( !cur_array.includes(elem) ) {
      missing.push(elem)
    }
  });
  return missing;
}

function trackerFactory({watchFunction}) {
  if (typeof watchFunction !== 'function') {
    return undefined;
  }

  let last_result = null;
  let element_left_cb = null;
  return {
    on: (event_name, cb) => {
      if (event_name === "element_left") {
        element_left_cb = cb;
      }
      return;
    },
    call: () => {
      let current_result = watchFunction();
      if (last_result === null) {
        last_result = current_result;
        return;
      }
      let elementsThatLeft = getMissingElements(last_result, current_result);
      if (elementsThatLeft.length > 0 && typeof element_left_cb === 'function') {
        element_left_cb(elementsThatLeft);
      }
      last_result = current_result;
    }
  }
}
