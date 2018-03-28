module.exports = trackerFactory;

function getMissingElements(last_array, cur_array, compare) {
  if(typeof compare !== 'function') { 
    compare = (a, b) => {return a === b};
  }
  let missing = last_array.filter((elem) => {
    return cur_array.every((new_elem) => { return !compare(elem, new_elem) });
  });
  return missing;
}


function trackerFactory({watchFunction}) {
  if (typeof watchFunction !== 'function') {
    return undefined;
  }

  let last_result = null;
  let compare_function = null;
  let element_left_cb = null;
  let element_join_cb = null;
  return {
    setComparator: (comparator) => {
      compare_function = comparator
    },
    on: (event_name, cb) => {
      if (event_name === "element_left") {
        element_left_cb = cb;
      } else
      if (event_name === "element_join") {
        element_join_cb = cb;
      }
      return;
    },
    call: () => {
      let current_result = watchFunction();
      if (last_result === null) {
        last_result = current_result;
        return;
      }
      let elementsThatLeft = getMissingElements(last_result, current_result, compare_function);
      let elementsThatJoined = getMissingElements(current_result, last_result, compare_function);
      if (elementsThatLeft.length > 0 && typeof element_left_cb === 'function') {
        element_left_cb(elementsThatLeft);
      }
      if (elementsThatJoined.length > 0 && typeof element_join_cb === 'function') {
        element_join_cb(elementsThatJoined);
      }
      last_result = current_result;
    }
  }
}
