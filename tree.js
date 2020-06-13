import React, { useState } from "react";
import "./styles.css";
import { Tree } from "antd";
import "antd/dist/antd.css";
let arrlist = [
  {
    parentId: "null",
    text: "首页",
    nodeId: "101"
  },
  {
    parentId: "101",
    text: "123",
    nodeId: "6589"
  },
  {
    parentId: "101",
    text: "123",
    nodeId: "6290"
  },
  {
    parentId: "101",
    text: "123",
    nodeId: "589"
  }
];

let obj = [
  {
    parentId: "101",
    text: "123",
    nodeId: "6589"
  },
  {
    parentId: "6589",
    text: "1234",
    nodeId: "658999"
  },
  {
    parentId: "6589",
    text: "1235",
    nodeId: "658998"
  }
];
function formatData(data, id = "null") {
  var parent = data
    .filter(item => item.parentId === id)
    .map(item => ({
      title: item.text,
      key: item.nodeId
    }))[0];
  parent.children = data
    .filter(item => item.parentId === parent.key)
    .map(item => ({
      title: item.text,
      key: item.nodeId
    }));

  return parent;
}

const refreData = (data, node, ndata) => {
  let pos = node.pos;
  let posArr = pos.split("-");
  //console.log("refre", data, node, node.pos, pos, posArr);
  let i = posArr.shift();
  i = posArr.shift();
  let temp = data[i];
  while (posArr.length > 0) {
    console.log("length", posArr.length);
    temp = temp.children[i];
    i = posArr.shift();
  }
  let handData = ndata
    .filter(item => item.parentId === node.key)
    .map(item => ({
      title: item.text,
      key: item.nodeId
    }));
  if (handData.length) {
    temp.children = handData;
  }

  console.log("over", data, temp);
  return [...data];
};

export default function App() {
  const [treeData, setTreeData] = useState([formatData(arrlist)]);
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
  };

  const getData = treeNode => {
    console.log("treeNode", treeNode);
    return new Promise((res, rej) => {
      //console.log("is", treeNode.children, !!treeNode.children);
      if (treeNode.children) {
        res();
        return;
      }
      setTimeout(() => {
        //console.log("res node", treeNode);
        //console.log("res", treeData);
        setTreeData(origin => refreData(origin, treeNode, obj));
        res();
      }, 1000);
    });
  };
  return (
    <div className="App">
      <Tree
        loadData={getData}
        treeData={treeData}
        onSelect={onSelect}
        onCheck={onCheck}
      />
    </div>
  );
}



/*
    想法：
    
    loadData 会得到当前选中的元素的node_data;
    
    当元素的node_data 有 children时 直接返回
    
    当元素的node_data 没有 children时 ，则应该通过接口
    获取此节点下的子元素数据，然后通过refreData 更新到
    treeData上
    
    refreData 是通过tree 生成的data 中的pos 来计算应该
    更新哪个子节点。注意一：第一个元素的pos 为 '0-0'，所
    以应该去掉第一个0，才能得到正确的位置。然后更新回去，
    注意二：state 不可变，每次都应该返回新的值，所以返回
    [...data];
*/
