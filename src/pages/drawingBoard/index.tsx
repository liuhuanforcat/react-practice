import React, { useState, useRef, useCallback, useEffect } from 'react';
import './index.less';

interface DraggableItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  scale: number;
  rotation: number;
}

interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  dragOffset: { x: number; y: number };
  resizeHandle: string | null;
  initialMousePos: { x: number; y: number };
  initialItemState: Partial<DraggableItem>;
}

const DrawingBoard: React.FC = () => {
  const [items, setItems] = useState<DraggableItem[]>([
    {
      id: '1',
      x: 209,
      y: 0,
      width: 87,
      height: 72,
      color: '#4285f4',
      text: '1',
      scale: 1,
      rotation: 0
    },
    {
      id: '2',
      x: 63,
      y: 113,
      width: 108,
      height: 72,
      color: '#ea4335',
      text: '2',
      scale: 1,
      rotation: 0
    },
    {
      id: '3',
      x: 209,
      y: 230,
      width: 80,
      height: 120,
      color: '#34a853',
      text: '3',
      scale: 1,
      rotation: 0
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    dragOffset: { x: 0, y: 0 },
    resizeHandle: null,
    initialMousePos: { x: 0, y: 0 },
    initialItemState: {}
  });
  const [snapLines, setSnapLines] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [showSnapLines, setShowSnapLines] = useState(false);
  const [isDraggingAny, setIsDraggingAny] = useState(false);
  const [isResizingAny, setIsResizingAny] = useState(false);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const snapThreshold = 5; // 吸附阈值
  const gridSize = 20; // 网格大小

  // 计算吸附位置
  const calculateSnapPosition = useCallback((item: DraggableItem, newX: number, newY: number) => {
    const snapX: number[] = [];
    const snapY: number[] = [];
    let snappedX = newX;
    let snappedY = newY;

    // 与其他元素对齐
    items.forEach(otherItem => {
      if (otherItem.id === item.id) return;

      const otherLeft = otherItem.x;
      const otherRight = otherItem.x + otherItem.width * otherItem.scale;
      const otherTop = otherItem.y;
      const otherBottom = otherItem.y + otherItem.height * otherItem.scale;
      const otherCenterX = otherItem.x + (otherItem.width * otherItem.scale) / 2;
      const otherCenterY = otherItem.y + (otherItem.height * otherItem.scale) / 2;

      const itemLeft = newX;
      const itemRight = newX + item.width * item.scale;
      const itemTop = newY;
      const itemBottom = newY + item.height * item.scale;
      const itemCenterX = newX + (item.width * item.scale) / 2;
      const itemCenterY = newY + (item.height * item.scale) / 2;

      // X轴对齐检查
      if (Math.abs(itemLeft - otherLeft) < snapThreshold) {
        snappedX = otherLeft;
        snapX.push(otherLeft);
      } else if (Math.abs(itemRight - otherRight) < snapThreshold) {
        snappedX = otherRight - item.width * item.scale;
        snapX.push(otherRight);
      } else if (Math.abs(itemCenterX - otherCenterX) < snapThreshold) {
        snappedX = otherCenterX - (item.width * item.scale) / 2;
        snapX.push(otherCenterX);
      } else if (Math.abs(itemLeft - otherRight) < snapThreshold) {
        snappedX = otherRight;
        snapX.push(otherRight);
      } else if (Math.abs(itemRight - otherLeft) < snapThreshold) {
        snappedX = otherLeft - item.width * item.scale;
        snapX.push(otherLeft);
      }

      // Y轴对齐检查
      if (Math.abs(itemTop - otherTop) < snapThreshold) {
        snappedY = otherTop;
        snapY.push(otherTop);
      } else if (Math.abs(itemBottom - otherBottom) < snapThreshold) {
        snappedY = otherBottom - item.height * item.scale;
        snapY.push(otherBottom);
      } else if (Math.abs(itemCenterY - otherCenterY) < snapThreshold) {
        snappedY = otherCenterY - (item.height * item.scale) / 2;
        snapY.push(otherCenterY);
      } else if (Math.abs(itemTop - otherBottom) < snapThreshold) {
        snappedY = otherBottom;
        snapY.push(otherBottom);
      } else if (Math.abs(itemBottom - otherTop) < snapThreshold) {
        snappedY = otherTop - item.height * item.scale;
        snapY.push(otherTop);
      }
    });

    // 网格对齐
    const gridSnapX = Math.round(newX / gridSize) * gridSize;
    const gridSnapY = Math.round(newY / gridSize) * gridSize;
    
    if (Math.abs(newX - gridSnapX) < snapThreshold) {
      snappedX = gridSnapX;
    }
    if (Math.abs(newY - gridSnapY) < snapThreshold) {
      snappedY = gridSnapY;
    }

    setSnapLines({ x: snapX, y: snapY });
    return { x: snappedX, y: snappedY };
  }, [items, snapThreshold, gridSize]);

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent, item: DraggableItem, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedItem(item.id);
    setShowSnapLines(true);
    
    if (action === 'drag') {
      setIsDraggingAny(true);
    } else if (action === 'resize') {
      setIsResizingAny(true);
    }
    
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (action === 'drag') {
      setDragState({
        isDragging: true,
        isResizing: false,
        dragOffset: { x: mouseX - item.x, y: mouseY - item.y },
        resizeHandle: null,
        initialMousePos: { x: mouseX, y: mouseY },
        initialItemState: { ...item }
      });
    } else if (action === 'resize') {
      setDragState({
        isDragging: false,
        isResizing: true,
        dragOffset: { x: 0, y: 0 },
        resizeHandle: handle || null,
        initialMousePos: { x: mouseX, y: mouseY },
        initialItemState: { ...item }
      });
    }
  }, []);

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging && !dragState.isResizing) return;
    if (!boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id !== selectedItem) return item;

        if (dragState.isDragging) {
          const newX = mouseX - dragState.dragOffset.x;
          const newY = mouseY - dragState.dragOffset.y;
          const snapped = calculateSnapPosition(item, newX, newY);
          
          return {
            ...item,
            x: Math.max(0, Math.min(snapped.x, rect.width - item.width * item.scale)),
            y: Math.max(0, Math.min(snapped.y, rect.height - item.height * item.scale))
          };
        }

        if (dragState.isResizing && dragState.initialItemState) {
          const deltaX = mouseX - dragState.initialMousePos.x;
          const deltaY = mouseY - dragState.initialMousePos.y;
          const initialItem = dragState.initialItemState as DraggableItem;
          
          let newWidth = initialItem.width;
          let newHeight = initialItem.height;
          let newX = initialItem.x;
          let newY = initialItem.y;

          // 等比缩放处理
          const aspectRatio = initialItem.width / initialItem.height;
          
          switch (dragState.resizeHandle) {
            case 'se': // 右下角
              newWidth = Math.max(20, initialItem.width + deltaX);
              newHeight = newWidth / aspectRatio;
              break;
            case 'sw': // 左下角
              newWidth = Math.max(20, initialItem.width - deltaX);
              newHeight = newWidth / aspectRatio;
              newX = initialItem.x + (initialItem.width - newWidth);
              break;
            case 'ne': // 右上角
              newWidth = Math.max(20, initialItem.width + deltaX);
              newHeight = newWidth / aspectRatio;
              newY = initialItem.y + (initialItem.height - newHeight);
              break;
            case 'nw': // 左上角
              newWidth = Math.max(20, initialItem.width - deltaX);
              newHeight = newWidth / aspectRatio;
              newX = initialItem.x + (initialItem.width - newWidth);
              newY = initialItem.y + (initialItem.height - newHeight);
              break;
          }

          return {
            ...item,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
          };
        }

        return item;
      })
    );
  }, [dragState, selectedItem, calculateSnapPosition]);

  // 处理鼠标抬起事件
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      dragOffset: { x: 0, y: 0 },
      resizeHandle: null,
      initialMousePos: { x: 0, y: 0 },
      initialItemState: {}
    });
    setShowSnapLines(false);
    setSnapLines({ x: [], y: [] });
    setIsDraggingAny(false);
    setIsResizingAny(false);
  }, []);

  // 添加全局鼠标事件监听
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedItem) {
        deleteSelectedItem();
      } else if (e.key === 'Escape') {
        setSelectedItem(null);
      } else if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        // 可以添加全选功能
      } else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (selectedItem) {
          duplicateSelectedItem();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem]);

  // 复制选中元素
  const duplicateSelectedItem = () => {
    if (selectedItem) {
      const itemToDuplicate = items.find(item => item.id === selectedItem);
      if (itemToDuplicate) {
        const newItem: DraggableItem = {
          ...itemToDuplicate,
          id: Date.now().toString(),
          x: itemToDuplicate.x + 20,
          y: itemToDuplicate.y + 20,
        };
        setItems(prev => [...prev, newItem]);
        setSelectedItem(newItem.id);
      }
    }
  };

  // 添加新元素
  const addNewItem = () => {
    const newItem: DraggableItem = {
      id: Date.now().toString(),
      x: Math.random() * 300,
      y: Math.random() * 200,
      width: 80,
      height: 80,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      text: (items.length + 1).toString(),
      scale: 1,
      rotation: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  // 删除选中元素
  const deleteSelectedItem = () => {
    if (selectedItem) {
      setItems(prev => prev.filter(item => item.id !== selectedItem));
      setSelectedItem(null);
    }
  };

  return (
    <div className="drawing-board-container">
      <div className="toolbar">
        <h2>拖拽、缩放、吸附演示</h2>
        <div className="controls">
          <button onClick={addNewItem} className="btn btn-primary">添加元素</button>
          <button onClick={duplicateSelectedItem} className="btn btn-secondary" disabled={!selectedItem}>
            复制选中 (Ctrl+D)
          </button>
          <button onClick={deleteSelectedItem} className="btn btn-danger" disabled={!selectedItem}>
            删除选中 (Del)
          </button>
        </div>
        <div className="instructions">
          <ul>
            <li>拖拽：点击元素并拖动</li>
            <li>等比缩放：拖拽右下角（默认等比例），按住Shift强制等比例</li>
            <li>自由缩放：拖拽边或底部手柄</li>
            <li>自动吸附：拖拽时会自动吸附到边界和其他元素</li>
          </ul>
          <div className="scale-mode">
            缩放模式：自由缩放
          </div>
        </div>
      </div>

      <div 
        ref={boardRef}
        className={`drawing-board ${isDraggingAny ? 'dragging' : ''} ${isResizingAny ? 'resizing' : ''}`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedItem(null);
          }
        }}
      >
        {/* 网格背景 */}
        <div className="grid-background" />
        
        {/* 吸附辅助线 */}
        {showSnapLines && (
          <>
            {snapLines.x.map((x, index) => (
              <div
                key={`snap-x-${index}`}
                className="snap-line snap-line-vertical"
                style={{ left: x }}
              />
            ))}
            {snapLines.y.map((y, index) => (
              <div
                key={`snap-y-${index}`}
                className="snap-line snap-line-horizontal"
                style={{ top: y }}
              />
            ))}
          </>
        )}

        {/* 可拖拽元素 */}
        {items.map(item => {
          const isCurrentlyDragging = dragState.isDragging && selectedItem === item.id;
          const isCurrentlyResizing = dragState.isResizing && selectedItem === item.id;
          
          return (
            <div
              key={item.id}
              className={`draggable-item ${selectedItem === item.id ? 'selected' : ''} ${isCurrentlyDragging ? 'dragging' : ''} ${isCurrentlyResizing ? 'resizing' : ''}`}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                backgroundColor: item.color,
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                transformOrigin: 'center center'
              }}
              onMouseDown={(e) => handleMouseDown(e, item, 'drag')}
            >
              <span className="item-text">{item.text}</span>
              <div className="drag-handle">⋮⋮</div>
              
              {/* 选中时显示缩放手柄 */}
              {selectedItem === item.id && (
                <>
                  <div 
                    className="resize-handle resize-handle-nw"
                    onMouseDown={(e) => handleMouseDown(e, item, 'resize', 'nw')}
                  />
                  <div 
                    className="resize-handle resize-handle-ne"
                    onMouseDown={(e) => handleMouseDown(e, item, 'resize', 'ne')}
                  />
                  <div 
                    className="resize-handle resize-handle-sw"
                    onMouseDown={(e) => handleMouseDown(e, item, 'resize', 'sw')}
                  />
                  <div 
                    className="resize-handle resize-handle-se"
                    onMouseDown={(e) => handleMouseDown(e, item, 'resize', 'se')}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 元素状态显示 */}
      <div className="status-panel">
        <h3>元素状态：</h3>
        {items.map(item => (
          <div key={item.id} className={`status-item ${selectedItem === item.id ? 'active' : ''}`}>
            元素 {item.text}: x={Math.round(item.x)}, y={Math.round(item.y)}, 宽度={Math.round(item.width)}, 高度={Math.round(item.height)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawingBoard;
