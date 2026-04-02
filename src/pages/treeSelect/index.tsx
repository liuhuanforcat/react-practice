import React, { useState } from 'react';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import './index.less';

const TreeSelectPage: React.FC = () => {
  // 示例树数据B
  const treeData: DataNode[] = [
    {
      title: '父节点1',
      key: '0-0',
      children: [
        {
          title: '子节点1-1',
          key: '0-0-0',
          children: [
            { title: '叶子节点1-1-1', key: '0-0-0-0' },
            { title: '叶子节点1-1-2', key: '0-0-0-1' },
          ],
        },
        {
          title: '子节点1-2',
          key: '0-0-1',
          children: [
            { title: '叶子节点1-2-1', key: '0-0-1-0' },
            { title: '叶子节点1-2-2', key: '0-0-1-1' },
          ],
        },
      ],
    },
    {
      title: '父节点2',
      key: '0-1',
      children: [
        {
          title: '子节点2-1',
          key: '0-1-0',
          children: [
            { title: '叶子节点2-1-1', key: '0-1-0-0' },
            { title: '叶子节点2-1-2', key: '0-1-0-1' },
          ],
        },
        {
          title: '子节点2-2',
          key: '0-1-1',
        },
      ],
    },
    {
      title: '父节点3',
      key: '0-2',
    },
  ];
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

  return (
    <div className="tree-select-page">
      <Tree
        checkable
        treeData={treeData}
      // 不设置 checkedKeys，由你自己控制选中状态
      // 不设置 onCheck，由你自己处理选中逻辑
      />
    </div>
  );
};

export default TreeSelectPage;
