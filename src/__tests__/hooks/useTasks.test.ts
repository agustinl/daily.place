import { renderHook, act, waitFor } from '@testing-library/react';
import { useTasks } from '@/hooks/useTasks';
import { TaskType } from '@/types/task';

// Mock useLocalStorage
let mockStorage: TaskType[] = [];
const mockSetStorage = jest.fn((newValue: TaskType[]) => {
    mockStorage = newValue;
});

jest.mock('@/hooks/useLocalStorage', () => ({
    __esModule: true,
    default: jest.fn(() => [mockStorage, mockSetStorage]),
}));

describe('useTasks', () => {
    beforeEach(() => {
        mockStorage = [];
        mockSetStorage.mockClear();
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should initialize with empty tasks', () => {
            const { result } = renderHook(() => useTasks('testplace'));

            expect(result.current.tasks).toEqual([]);
            expect(result.current.progress).toEqual({
                progress: 0,
                percentage: 0,
                total: 0,
            });
        });

        it('should initialize with existing tasks from storage', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: true },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            expect(result.current.tasks).toHaveLength(2);
        });
    });

    describe('addNewTask', () => {
        it('should add a new task', () => {
            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.addNewTask('New task');
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'New task', ready: false },
            ]);
        });

        it('should trim whitespace from task text', () => {
            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.addNewTask('  Task with spaces  ');
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task with spaces', ready: false },
            ]);
        });

        it('should not add empty tasks', () => {
            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.addNewTask('');
            });

            expect(mockSetStorage).not.toHaveBeenCalled();
        });

        it('should not add tasks with only whitespace', () => {
            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.addNewTask('   ');
            });

            expect(mockSetStorage).not.toHaveBeenCalled();
        });

        it('should add task to existing tasks', () => {
            mockStorage = [
                { text: 'Existing task', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.addNewTask('Second task');
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Existing task', ready: false },
                { text: 'Second task', ready: false },
            ]);
        });

        it('should set new tasks as not ready by default', () => {
            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.addNewTask('New task');
            });

            const addedTask = mockSetStorage.mock.calls[0][0][0];
            expect(addedTask.ready).toBe(false);
        });
    });

    describe('markTaskAsReady', () => {
        it('should mark task as ready', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.markTaskAsReady(0, true);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 1', ready: true },
                { text: 'Task 2', ready: false },
            ]);
        });

        it('should mark task as not ready', () => {
            mockStorage = [
                { text: 'Task 1', ready: true },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.markTaskAsReady(0, false);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 1', ready: false },
            ]);
        });

        it('should handle multiple tasks correctly', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.markTaskAsReady(1, true);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: true },
                { text: 'Task 3', ready: false },
            ]);
        });
    });

    describe('deleteTask', () => {
        it('should delete task by index', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.deleteTask(1);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 1', ready: false },
                { text: 'Task 3', ready: false },
            ]);
        });

        it('should delete first task', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.deleteTask(0);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 2', ready: false },
            ]);
        });

        it('should delete last task', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.deleteTask(1);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 1', ready: false },
            ]);
        });
    });

    describe('moveTaskOrder', () => {
        it('should move task from one position to another', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.moveTaskOrder(0, 2);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
                { text: 'Task 1', ready: false },
            ]);
        });

        it('should move task up', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.moveTaskOrder(2, 0);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 3', ready: false },
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
            ]);
        });

        it('should move task down', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.moveTaskOrder(0, 1);
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Task 2', ready: false },
                { text: 'Task 1', ready: false },
                { text: 'Task 3', ready: false },
            ]);
        });
    });

    describe('moveDoneTasksDown', () => {
        it('should move completed tasks to the bottom', () => {
            mockStorage = [
                { text: 'Task 1', ready: true },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: true },
                { text: 'Task 4', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.moveDoneTasksDown();
            });

            const savedTasks = mockSetStorage.mock.calls[0][0];
            expect(savedTasks[0].ready).toBe(false);
            expect(savedTasks[1].ready).toBe(false);
            expect(savedTasks[2].ready).toBe(true);
            expect(savedTasks[3].ready).toBe(true);
        });

        it('should maintain order within completed and incomplete groups', () => {
            mockStorage = [
                { text: 'Done 1', ready: true },
                { text: 'Todo 1', ready: false },
                { text: 'Done 2', ready: true },
                { text: 'Todo 2', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.moveDoneTasksDown();
            });

            const savedTasks = mockSetStorage.mock.calls[0][0];
            expect(savedTasks).toEqual([
                { text: 'Todo 1', ready: false },
                { text: 'Todo 2', ready: false },
                { text: 'Done 1', ready: true },
                { text: 'Done 2', ready: true },
            ]);
        });
    });

    describe('editTask', () => {
        it('should edit task text', () => {
            mockStorage = [
                { text: 'Original task', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.handleEditTaskClick(0);
            });

            act(() => {
                result.current.editTask('Updated task');
            });

            expect(mockSetStorage).toHaveBeenCalledWith([
                { text: 'Updated task', ready: false },
            ]);
        });

        it('should close edit modal after editing', () => {
            mockStorage = [
                { text: 'Task', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.handleEditTaskClick(0);
            });

            expect(result.current.opened).toBe(true);

            act(() => {
                result.current.editTask('Updated');
            });

            expect(result.current.opened).toBe(false);
        });
    });

    describe('deleteAllTasks', () => {
        it('should delete all tasks', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: true },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.deleteAllTasks();
            });

            expect(mockSetStorage).toHaveBeenCalledWith([]);
        });
    });

    describe('progress calculation', () => {
        it('should calculate progress correctly with no tasks', () => {
            const { result } = renderHook(() => useTasks('testplace'));

            expect(result.current.progress).toEqual({
                progress: 0,
                percentage: 0,
                total: 0,
            });
        });

        it('should calculate progress with all incomplete tasks', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            expect(result.current.progress).toEqual({
                progress: 0,
                percentage: 0,
                total: 3,
            });
        });

        it('should calculate progress with all complete tasks', () => {
            mockStorage = [
                { text: 'Task 1', ready: true },
                { text: 'Task 2', ready: true },
                { text: 'Task 3', ready: true },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            expect(result.current.progress).toEqual({
                progress: 3,
                percentage: 100,
                total: 3,
            });
        });

        it('should calculate progress with mixed tasks', () => {
            mockStorage = [
                { text: 'Task 1', ready: true },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: true },
                { text: 'Task 4', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            expect(result.current.progress).toEqual({
                progress: 2,
                percentage: 50,
                total: 4,
            });
        });

        it('should round percentage correctly', () => {
            mockStorage = [
                { text: 'Task 1', ready: true },
                { text: 'Task 2', ready: false },
                { text: 'Task 3', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            // 1/3 = 33.333...%, should round to 33%
            expect(result.current.progress.percentage).toBe(33);
        });
    });

    describe('handleEditTaskClick', () => {
        it('should set editedTask with correct index', () => {
            mockStorage = [
                { text: 'Task 1', ready: false },
                { text: 'Task 2', ready: true },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.handleEditTaskClick(1);
            });

            expect(result.current.editedTask).toEqual({
                text: 'Task 2',
                ready: true,
                i: 1,
            });
        });

        it('should open edit modal', () => {
            mockStorage = [
                { text: 'Task', ready: false },
            ];

            const { result } = renderHook(() => useTasks('testplace'));

            act(() => {
                result.current.handleEditTaskClick(0);
            });

            expect(result.current.opened).toBe(true);
        });
    });
});

