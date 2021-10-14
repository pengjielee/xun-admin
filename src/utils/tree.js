function getChilds(records, id) {
  let childs = [];
  records.forEach((item) => {
    id === item.parent_id && childs.push({ ...item });
  });
  childs.forEach((child) => {
    let currNode = getChilds(records, child.id);
    // currNode.length > 0 && (child.children = currNode);
    child.children = currNode;
  });
  return childs;
}

export function buildTree(list, parent_id) {
  let results = [];
  list.forEach((item) => {
    if (item.parent_id === parent_id) {
      let parent = { ...item };
      parent.children = getChilds(list, item.id);
      results.push(parent);
    }
  });
  return results;
}
