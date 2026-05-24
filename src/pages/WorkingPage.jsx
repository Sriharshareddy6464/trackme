import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { Column } from '@/components/board';
import KanbanCard from '@/components/working/KanbanCard';
import KanbanContextMenu from '@/components/working/KanbanContextMenu';
import useWorkingStore from '@/store/useWorkingStore';
import useTrackingStore from '@/store/useTrackingStore';

/** Column definitions for the Kanban board. */
const COLUMNS = [
  {
    id: 'todo',
    title: 'Tasks',
    emptyMessage: 'No tasks yet — add tasks from the Tracking board',
  },
  {
    id: 'ongoing',
    title: 'Ongoing',
    emptyMessage: 'Nothing in progress',
  },
  {
    id: 'completed',
    title: 'Completed',
    emptyMessage: 'No completed tasks yet',
  },
  {
    id: 'discarded',
    title: 'Discarded',
    emptyMessage: 'Nothing discarded',
  },
];

/**
 * DroppableColumn — wraps a Column with @dnd-kit's useDroppable.
 */
function DroppableColumn({ colDef, tasks, isDropTarget, onContextMenu }) {
  const { setNodeRef } = useDroppable({ id: colDef.id });

  return (
    <div ref={setNodeRef} style={{ height: '100%' }}>
      <Column
        title={colDef.title}
        count={tasks.length}
        isDropTarget={isDropTarget}
        emptyMessage={colDef.emptyMessage}
      >
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            isDragging={false}
            onContextMenu={onContextMenu}
          />
        ))}
      </Column>
    </div>
  );
}

/**
 * WorkingPage — four-column Kanban board with drag-and-drop.
 */
function WorkingPage() {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

  // Context menu state
  const [contextMenuTaskId, setContextMenuTaskId] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const getTasksByStatus = useWorkingStore((s) => s.getTasksByStatus);
  const moveTask = useWorkingStore((s) => s.moveTask);
  const tasks = useTrackingStore((s) => s.tasks);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    setOverId(event.over?.id ?? null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (over && over.id !== active.id) {
      // over.id is a column status string
      const validStatuses = COLUMNS.map((c) => c.id);
      if (validStatuses.includes(over.id)) {
        moveTask(active.id, over.id);
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    setOverId(null);
  }

  function handleCardContextMenu(taskId, event) {
    setContextMenuTaskId(taskId);
    if (event) {
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
    }
  }

  const activeTask = activeId ? tasks[activeId] : null;

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1px',
    height: '100vh',
    background: 'var(--color-border)',
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          style={pageStyle}
          onContextMenu={(e) => e.preventDefault()}
        >
          {COLUMNS.map((col) => {
            const colTasks = getTasksByStatus(col.id);
            return (
              <DroppableColumn
                key={col.id}
                colDef={col}
                tasks={colTasks}
                isDropTarget={overId === col.id}
                onContextMenu={handleCardContextMenu}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <KanbanCard task={activeTask} isDragging style={{ opacity: 0.6 }} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <KanbanContextMenu
        taskId={contextMenuTaskId}
        isOpen={!!contextMenuTaskId}
        onClose={() => setContextMenuTaskId(null)}
        position={contextMenuPosition}
      />
    </>
  );
}

export default WorkingPage;
