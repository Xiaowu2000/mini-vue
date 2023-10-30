// 将以下列表转成树型结构：
// [
//     {id: 1, name: 'child1', parentId: 0},
//     {id: 2, name: 'child2', parentId: 0},
//     {id: 6, name: 'child2_1', parentId: 2},
//     {id: 0, name: 'root', parentId: null},
//     {id: 5, name: 'child1_2', parentId: 1},
//     {id: 4, name: 'child1_1', parentId: 1},
//     {id: 3, name: 'child3', parentId: 0}
// ]

// 树型结构形式：
// [
//     {
//         id: 0,
//         name: "root",
//         parentId: null,
//         "children": [...]
//     }
// ]

function arr2Tree(arr) {
  const res = [
    {
      id: 0,
      name: "root",
      parentId: null,
      children: [],
    },
  ];

  for (const item of arr) {
    if (item.parentId === null) continue
    const { parentId } = item;
    const parent = findNode(parentId, res);
    if (parent) {
      parent.children.push(item);
      item.children = [];
    }
  }

  return res;

  function findNode(parentId, arr) {
    if (!arr || arr.length === 0) return false;

    for (const item of arr) {
      const { id } = item;

      if (id === parentId) {
        return item;
      } else {
        let node = findNode(parentId, item.children);
        if (node) {
          return node;
        }
      }
    }
  }
}

console.log(
  arr2Tree([
    { id: 1, name: "child1", parentId: 0 },
    { id: 2, name: "child2", parentId: 0 },
    { id: 6, name: "child2_1", parentId: 2 },
    { id: 0, name: "123", parentId: null },
    { id: 5, name: "child1_2", parentId: 1 },
    { id: 4, name: "child1_1", parentId: 1 },
    { id: 3, name: "child3", parentId: 0 },
  ])
);
