let count = 0;

const createTree = (arr, parentId = null) => {
  const tree = [];
  arr.forEach((item) => {
    // root node - kiểm tra cả null và chuỗi rỗng
    if (
      (parentId === null && (!item.parent_id || item.parent_id === "")) ||
      (item.parent_id && item.parent_id.toString() === parentId?.toString())
    ) {
      count++;
      const newItem = item;
      newItem.index = count;
      const children = createTree(arr, item._id);

      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  return tree;
};

module.exports.tree = (arr, parentId = null) => {
  count = 0;
  const tree = createTree(arr, parentId);
  return tree;
};
