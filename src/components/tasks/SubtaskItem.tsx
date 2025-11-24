import React, { useState } from 'react';
import { Calendar, Flag, Bell, Repeat, Tag, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  dueDate?: string;
  time?: string;
  priority: string;
  reminder?: string;
  labels?: string[];
  repeat?: string;
}

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: (subtaskId: string) => void;
  onEdit: (subtaskId: string) => void;
  onDelete: (subtaskId: string) => void;
  onContextMenu: (e: React.MouseEvent, subtaskId: string) => void;
  getLabelColor: (labelName: string) => string;
  getPriorityStyle: (priorityName: string) => { bg: string; text: string };
  expandedLabelsSubtaskId: string | null;
  onToggleLabels: (subtaskId: string) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  onToggle,
  onEdit,
  onDelete,
  onContextMenu,
  getLabelColor,
  getPriorityStyle,
  expandedLabelsSubtaskId,
  onToggleLabels,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteConfirming(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(subtask.id);
    setIsDeleteConfirming(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirming(false);
  };

  return (
    <div
      className="rounded-[12px] p-4 bg-transparent hover:bg-[#2a2a2a] transition-all relative"
      onContextMenu={(e) => onContextMenu(e, subtask.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDeleteConfirming(false);
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-4 h-4 border-2 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
            subtask.completed
              ? 'bg-white border-white'
              : 'border-gray-400 hover:border-gray-300'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(subtask.id);
          }}
        />
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className={`text-base font-semibold flex-1 truncate ${
                subtask.completed ? 'text-gray-400 line-through' : 'text-white'
              }`}>
                {subtask.title}
              </h3>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
              <p className="max-w-sm">{subtask.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Action buttons on hover */}
        {isHovered && (
          <div className="flex items-center gap-1 ml-auto">
            {!isDeleteConfirming ? (
              <>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(subtask.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#2a2a2a] text-gray-400 hover:text-white transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                      <p className="text-xs">Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleDeleteClick}
                        className="p-1.5 rounded-lg hover:bg-[#2a2a2a] text-gray-400 hover:text-white transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                      <p className="text-xs">Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-xs font-medium"
              >
                Confirm Delete
              </button>
            )}
          </div>
        )}
      </div>

      {subtask.description && (
        <div className="mb-3 ml-6">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-gray-300 cursor-help line-clamp-2">
                  {subtask.description}
                </p>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                <p className="max-w-sm">{subtask.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <div className="ml-6 flex items-center gap-2 flex-wrap">
        {(subtask.dueDate || subtask.time) && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#252527] border border-[#414141] rounded-full text-xs text-gray-300 cursor-help">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {subtask.dueDate && subtask.time ? `${subtask.dueDate} ${subtask.time}` : subtask.dueDate || subtask.time}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                <p className="text-xs">
                  {subtask.dueDate && subtask.time ? `Due: ${subtask.dueDate} at ${subtask.time}` : `Due: ${subtask.dueDate || subtask.time}`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {(() => {
          const style = getPriorityStyle(subtask.priority);
          return (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${style.bg} ${style.text} cursor-help`}>
                    <Flag className={`h-3 w-3 ${style.text}`} />
                    <span>{subtask.priority}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                  <p className="text-xs">Priority: {subtask.priority}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })()}

        {subtask.reminder && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252527] border border-[#414141] rounded-full cursor-help">
                  <Bell className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-300">{subtask.reminder}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                <p className="text-xs">Reminder: {subtask.reminder}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {subtask.repeat && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252527] border border-[#414141] rounded-full cursor-help">
                  <Repeat className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-300">Repeats</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="bg-[#1f1f1f] text-white rounded-xl border-0 z-50">
                <p className="text-xs">Repeats: {subtask.repeat.replace(/-/g, ' ')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {subtask.labels && subtask.labels.length > 0 && (
          <div className="relative">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLabels(subtask.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252527] border border-[#414141] rounded-full hover:border-[#525252] transition-all duration-200 cursor-pointer w-fit"
                  >
                    {subtask.labels.map((label, index) => (
                      <Tag
                        key={index}
                        className={`h-4 w-4 ${getLabelColor(label)} transition-all duration-200`}
                      />
                    ))}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="bg-[#1f1f1f] text-white rounded-xl border border-[#414141] z-50 p-2">
                  <div className="flex flex-col gap-2">
                    {subtask.labels.map((label, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Tag className={`h-3 w-3 ${getLabelColor(label)}`} />
                        <span className="text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {expandedLabelsSubtaskId === subtask.id && (
              <div className="absolute top-full mt-1 left-0 bg-[#1f1f1f] border border-[#414141] rounded-[12px] p-3 z-50 shadow-xl whitespace-nowrap">
                <div className="flex flex-col gap-2">
                  {subtask.labels.map((label, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Tag className={`h-4 w-4 ${getLabelColor(label)}`} />
                      <span className="text-xs text-white">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtaskItem;
