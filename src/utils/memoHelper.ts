import { Memo } from '../types/memo';
import { loadMemoList, saveMemoList } from '../storage/memoStorage';
import { v4 as uuidv4 } from 'uuid';

export const addMemo = async (content: string) => {
  const newMemo: Memo = {
    id: uuidv4(),
    content,
    lastEdited: Date.now(),
    reminderTime: Date.now() + 24 * 60 * 60 * 1000,
  };

  const existing = await loadMemoList();
  const updated = [newMemo, ...existing];
  await saveMemoList(updated);
};
