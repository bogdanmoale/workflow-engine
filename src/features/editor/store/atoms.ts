import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

export const editorAtom = atom<ReactFlowInstance | null>(null);

// Increments each time a new workflow execution starts. All useNodeStatus hooks
// watch this and reset their local status to "initial" when it changes.
export const executionResetAtom = atom<number>(0);
