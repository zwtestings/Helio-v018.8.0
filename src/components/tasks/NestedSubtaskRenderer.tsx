import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SubtaskItem from './SubtaskItem';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  creationDate: string;
  dueDate?: string;
  time?: string;
  priority: string;
  description: string;
  reminder?: string;
  labels?: string[];
  repeat?: string;
  isDraft?: boolean;
  children?: Task[];
  isCollapsed?: boolean;
}

interface NestedSubtaskRendererProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onContextMenu: (e: React.MouseEvent, taskId: string) => void;
  getLabelColor: (labelName: string) => string;
  getPriorityStyle: (priorityName: string) => { bg: string; text: string };
  expandedLabelsTaskId: string | null;
  onToggleLabels: (taskId: string) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragOver?: (e: React.DragEvent, taskId: string) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: () => void;
  draggedTaskId?: string | null;
  dragOverTaskId?: string | null;
  collapsedTasks: Set<string>;
  onToggleCollapsed: (taskId: string) => void;
  onOpen: (taskId: string) => void;
  onAddChild: (parentTaskId: string) => void;
  level?: number;
}

const NestedSubtaskRenderer: React.FC<NestedSubtaskRendererProps> = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onContextMenu,
  getLabelColor,
  getPriorityStyle,
  expandedLabelsTaskId,
  onToggleLabels,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  draggedTaskId,
  dragOverTaskId,
  collapsedTasks,
  onToggleCollapsed,
  onOpen,
  onAddChild,
  level = 0,
}) => {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id}>
          <div
            className={`rounded-[12px] p-4 bg-transparent hover:bg-[#2a2a2a] transition-all relative flex items-center gap-2 ${
              draggedTaskId === task.id ? 'opacity-50' : ''
            } ${
              dragOverTaskId === task.id ? 'border border-blue-500' : ''
            }`}
            onContextMenu={(e) => onContextMenu(e, task.id)}
            onMouseEnter={() => setHoveredTaskId(task.id)}
            onMouseLeave={() => setHoveredTaskId(null)}
            draggable
            onDragStart={(e) => onDragStart?.(e, task.id)}
            onDragOver={(e) => onDragOver?.(e, task.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop?.(e, task.id)}
            onDragEnd={onDragEnd}
            style={{ cursor: draggedTaskId === task.id ? 'grabbing' : 'grab', marginLeft: `${level * 20}px` }}
          >
            {(task.children?.length || 0) > 0 && (
              <button
                onClick={() => onToggleCollapsed(task.id)}
                className="p-0 hover:bg-[#353537] rounded-lg transition-all flex-shrink-0"
              >
                {collapsedTasks.has(task.id) ? (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>
            )}

            <div className="flex-1 min-w-0">
              <SubtaskItem
                subtask={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onContextMenu={onContextMenu}
                getLabelColor={getLabelColor}
                getPriorityStyle={getPriorityStyle}
                expandedLabelsSubtaskId={expandedLabelsTaskId}
                onToggleLabels={onToggleLabels}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                draggedSubtaskId={draggedTaskId}
                dragOverSubtaskId={dragOverTaskId}
              />
            </div>

            {hoveredTaskId === task.id && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {(task.children?.length || 0) > 0 && (
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="px-2 py-1.5 bg-[#252527] border border-[#414141] rounded-full text-xs text-gray-300">
                          {task.children?.length || 0}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                        <p className="text-xs">Nested tasks</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(task.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#353537] text-gray-400 hover:text-white transition-all"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                      <p className="text-xs">Open</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>

          {!collapsedTasks.has(task.id) && (task.children?.length || 0) > 0 && (
            <NestedSubtaskRenderer
              tasks={task.children || []}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onContextMenu={onContextMenu}
              getLabelColor={getLabelColor}
              getPriorityStyle={getPriorityStyle}
              expandedLabelsTaskId={expandedLabelsTaskId}
              onToggleLabels={onToggleLabels}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              draggedTaskId={draggedTaskId}
              dragOverTaskId={dragOverTaskId}
              collapsedTasks={collapsedTasks}
              onToggleCollapsed={onToggleCollapsed}
              onOpen={onOpen}
              onAddChild={onAddChild}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NestedSubtaskRenderer;
