function sortList(list, field = undefined) {
  if (!list) return list;

  const newList = [...list];
  newList.sort((a, b) => {
    let aField;
    let bField;

    if (field) {
      aField = typeof(a[field])==="string"? a[field].toLowerCase(): a[field];
      bField = typeof(b[field])==="string"? b[field].toLowerCase(): b[field];
    } else {
      aField = typeof(a)==="string"? a.toLowerCase(): a;
      bField = typeof(b)==="string"? b.toLowerCase(): b;
    }

    if (aField > bField) return -1;
    if (aField < bField) return 1;
    return 0;
  });
  return newList;
}

module.exports = sortList;
