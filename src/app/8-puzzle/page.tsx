'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, ArrowLeft, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

// --- Types & Constants ---
type BoardState = number[];
const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// --- Heuristics ---
const getManhattanDistance = (board: BoardState) => {
    let distance = 0;
    for (let i = 0; i < 9; i++) {
        if (board[i] === 0) continue;
        const val = board[i] - 1;
        const targetRow = Math.floor(val / 3);
        const targetCol = val % 3;
        const currentRow = Math.floor(i / 3);
        const currentCol = i % 3;
        distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
    }
    return distance;
};

const getMisplacedTiles = (board: BoardState) => {
    return board.reduce((acc, tile, idx) => {
        return tile !== 0 && tile !== GOAL_STATE[idx] ? acc + 1 : acc;
    }, 0);
};

// --- Solver (A*) ---
const solvePuzzle = async (initialState: BoardState) => {
    // Simple Priority Queue implementation
    const queue = [{ board: initialState, cost: 0, path: [] as BoardState[] }];
    const visited = new Set<string>();
    visited.add(initialState.toString());

    while (queue.length > 0) {
        // Sort by f(n) = g(n) + h(n)
        queue.sort((a, b) => {
            const fA = a.cost + getManhattanDistance(a.board);
            const fB = b.cost + getManhattanDistance(b.board);
            return fA - fB;
        });

        const current = queue.shift()!;
        if (current.board.toString() === GOAL_STATE.toString()) return current.path;

        const zeroIdx = current.board.indexOf(0);
        const row = Math.floor(zeroIdx / 3);
        const col = zeroIdx % 3;
        const moves = [];

        if (row > 0) moves.push(zeroIdx - 3); // Up
        if (row < 2) moves.push(zeroIdx + 3); // Down
        if (col > 0) moves.push(zeroIdx - 1); // Left
        if (col < 2) moves.push(zeroIdx + 1); // Right

        for (const move of moves) {
            const newBoard = [...current.board];
            [newBoard[zeroIdx], newBoard[move]] = [newBoard[move], newBoard[zeroIdx]];
            const strBoard = newBoard.toString();

            if (!visited.has(strBoard)) {
                visited.add(strBoard);
                queue.push({
                    board: newBoard,
                    cost: current.cost + 1,
                    path: [...current.path, newBoard]
                });
            }
        }

        // Safety break for extremely deep trees in browser
        if (queue.length > 5000) return null;
    }
    return null;
};

export default function EightPuzzle() {
    const [board, setBoard] = useState<BoardState>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    const [isSolving, setIsSolving] = useState(false);
    const [moves, setMoves] = useState(0);

    // --- Game Logic ---
    const handleTileClick = (index: number) => {
        if (isSolving) return;
        const zeroIdx = board.indexOf(0);
        const row = Math.floor(index / 3);
        const col = index % 3;
        const zRow = Math.floor(zeroIdx / 3);
        const zCol = zeroIdx % 3;

        if (Math.abs(row - zRow) + Math.abs(col - zCol) === 1) {
            const newBoard = [...board];
            [newBoard[index], newBoard[zeroIdx]] = [newBoard[zeroIdx], newBoard[index]];
            setBoard(newBoard);
            setMoves(m => m + 1);
        }
    };

    const shuffleBoard = () => {
        let current = [...GOAL_STATE];
        let zeroIdx = 8;
        for (let i = 0; i < 50; i++) {
            const row = Math.floor(zeroIdx / 3);
            const col = zeroIdx % 3;
            const neighbors = [];
            if (row > 0) neighbors.push(zeroIdx - 3);
            if (row < 2) neighbors.push(zeroIdx + 3);
            if (col > 0) neighbors.push(zeroIdx - 1);
            if (col < 2) neighbors.push(zeroIdx + 1);

            const randomMove = neighbors[Math.floor(Math.random() * neighbors.length)];
            [current[zeroIdx], current[randomMove]] = [current[randomMove], current[zeroIdx]];
            zeroIdx = randomMove;
        }
        setBoard(current);
        setMoves(0);
    };

    const runSolver = async () => {
        setIsSolving(true);
        const solutionPath = await solvePuzzle(board);
        if (solutionPath) {
            for (const step of solutionPath) {
                setBoard(step);
                setMoves(m => m + 1);
                await new Promise(r => setTimeout(r, 300));
            }
        } else {
            alert("Solution too deep for browser solver!");
        }
        setIsSolving(false);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
            <Link href="/" className="inline-flex items-center text-emerald-500 mb-8 hover:text-emerald-400">
                <ArrowLeft className="mr-2" size={20} /> Back to Hub
            </Link>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">

                {/* Left Column: Board */}
                <div>
                    <div className="bg-neutral-900 p-4 rounded-3xl border border-neutral-800 shadow-2xl relative">
                        <div className="grid grid-cols-3 gap-3 aspect-square">
                            <AnimatePresence>
                                {board.map((tile, index) => (
                                    <motion.div
                                        layout
                                        key={tile}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        onClick={() => handleTileClick(index)}
                                        className={`
                      relative rounded-xl flex items-center justify-center text-4xl font-bold cursor-pointer select-none shadow-lg
                      ${tile === 0 ? 'bg-transparent shadow-none pointer-events-none' : 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400'}
                    `}
                                    >
                                        {tile !== 0 && tile}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={shuffleBoard}
                            disabled={isSolving}
                            className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={20} /> Shuffle
                        </button>
                        <button
                            onClick={runSolver}
                            disabled={isSolving || getManhattanDistance(board) === 0}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-emerald-900/20 shadow-lg transition-all disabled:opacity-50"
                        >
                            {isSolving ? <BrainCircuit className="animate-pulse" /> : <Play />}
                            {isSolving ? 'Solving...' : 'Solve with A*'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Stats */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800">
                        <h2 className="text-2xl font-bold mb-6 text-emerald-400">Heuristics Monitor h(n)</h2>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2 text-neutral-400">
                                    <span>Moves Taken (g)</span>
                                    <span className="text-white font-mono">{moves}</span>
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(moves * 2, 100)}%` }}
                                        className="h-full bg-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2 text-neutral-400">
                                    <span>Manhattan Distance (h)</span>
                                    <span className="text-emerald-400 font-mono text-xl font-bold">
                    {getManhattanDistance(board)}
                  </span>
                                </div>
                                <p className="text-xs text-neutral-500 mb-2">Sum of vertical + horizontal steps for each tile to reach goal.</p>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${(getManhattanDistance(board) / 20) * 100}%` }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2 text-neutral-400">
                                    <span>Misplaced Tiles (h2)</span>
                                    <span className="text-purple-400 font-mono">{getMisplacedTiles(board)}</span>
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${(getMisplacedTiles(board) / 8) * 100}%` }}
                                        className="h-full bg-purple-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                        <h3 className="text-lg font-semibold mb-2 text-neutral-200">Algorithm Insight</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            The AI uses <strong>A* Search</strong> with $f(n) = g(n) + h(n)$.
                            <br/><br/>
                            It prioritizes moves that minimize the total estimated cost. The Manhattan Distance is an <em>admissible</em> heuristic, guaranteeing the shortest solution.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}