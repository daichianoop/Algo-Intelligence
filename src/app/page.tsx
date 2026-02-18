'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Grid3X3, Crown } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30">
        <main className="container mx-auto px-4 py-16 max-w-6xl">
          <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Algorithmic Solver
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Explore classical AI problems through interactive visualizations. Compare heuristics, watch algorithms in real-time, and understand the math behind the magic.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 8 Puzzle Card */}
            <motion.div
                whileHover={{ y: -5 }}
                className="group relative bg-neutral-900 border border-neutral-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors"
            >
              <div className="absolute top-8 right-8 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                <Grid3X3 size={64} />
              </div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"/>
                8 Puzzle
              </h2>
              <p className="text-neutral-400 mb-6 h-20">
                A sliding puzzle that challenges you to order tiles from 1 to 8. The state space is $9!/2$ (181,440 reachable states).
              </p>

              <div className="bg-neutral-950/50 rounded-xl p-6 mb-8 border border-neutral-800">
                <h3 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                  <Cpu size={18} /> Best Algorithm: A* Search
                </h3>
                <p className="text-sm text-neutral-300">
                  <strong>Why?</strong> A* is complete and optimal. By using the <span className="text-emerald-300">Manhattan Distance</span> heuristic, it aggressively prunes the search tree, finding the shortest solution path significantly faster than BFS or DFS.
                </p>
              </div>

              <Link href="/8-puzzle" className="inline-flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-4 transition-all">
                Launch Solver <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* N-Queens Card */}
            <motion.div
                whileHover={{ y: -5 }}
                className="group relative bg-neutral-900 border border-neutral-800 rounded-3xl p-8 hover:border-purple-500/50 transition-colors"
            >
              <div className="absolute top-8 right-8 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                <Crown size={64} />
              </div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-500 rounded-full"/>
                N-Queens
              </h2>
              <p className="text-neutral-400 mb-6 h-20">
                Place $N$ chess queens on an $N \times N$ board so no two queens threaten each other. A classic constraint satisfaction problem.
              </p>

              <div className="bg-neutral-950/50 rounded-xl p-6 mb-8 border border-neutral-800">
                <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <Cpu size={18} /> Best Algorithm: Backtracking
                </h3>
                <p className="text-sm text-neutral-300">
                  <strong>Why?</strong> For $N \le 12$, Backtracking with pruning is precise and deterministic. For massive $N$, <strong>Genetic Algorithms</strong> or <strong>Min-Conflicts</strong> are preferred as they find <em>a</em> solution faster, though not necessarily all solutions.
                </p>
              </div>

              <Link href="/n-queens" className="inline-flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-4 transition-all">
                Launch Solver <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
  );
}