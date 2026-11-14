import {
    addTask,
    allTasksDone,
    moveTask,
    removeTask,
    setTaskReady,
    setTaskText,
    sortDoneLast
} from '@/helpers/taskOps';
import { TaskType } from '@/types/task';

const a: TaskType = { text: 'a', ready: false };
const b: TaskType = { text: 'b', ready: true };
const c: TaskType = { text: 'c', ready: false };

describe('taskOps', () => {
    let list: TaskType[];
    let snapshot: string;

    beforeEach(() => {
        list = [a, b, c];
        snapshot = JSON.stringify(list);
    });

    afterEach(() => {
        // Never mutates the input list or its tasks
        expect(JSON.stringify(list)).toBe(snapshot);
        expect(list).toEqual([a, b, c]);
    });

    it('addTask appends a trimmed, pending task', () => {
        expect(addTask(list, '  d  ')).toEqual([a, b, c, { text: 'd', ready: false }]);
    });

    it('setTaskReady and setTaskText only replace the changed task', () => {
        const ready = setTaskReady(list, 0, true);
        expect(ready).toEqual([{ text: 'a', ready: true }, b, c]);
        expect(ready[1]).toBe(b);

        const edited = setTaskText(list, 2, 'C');
        expect(edited).toEqual([a, b, { text: 'C', ready: false }]);
        expect(edited[0]).toBe(a);
    });

    it('removeTask removes by index', () => {
        expect(removeTask(list, 1)).toEqual([a, c]);
    });

    it('moveTask moves a task to another position', () => {
        expect(moveTask(list, 0, 2)).toEqual([b, c, a]);
        expect(moveTask(list, 2, 0)).toEqual([c, a, b]);
    });

    it('sortDoneLast keeps the order inside each group, also for tasks without ready', () => {
        const legacy = { text: 'legacy' } as TaskType;
        expect(sortDoneLast(list)).toEqual([a, c, b]);
        expect(sortDoneLast([b, legacy, a])).toEqual([legacy, a, b]);
    });

    it('allTasksDone needs at least one task', () => {
        expect(allTasksDone([])).toBe(false);
        expect(allTasksDone(list)).toBe(false);
        expect(allTasksDone([b])).toBe(true);
    });
});
