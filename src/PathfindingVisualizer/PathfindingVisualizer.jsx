import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra.js';
import { astar } from '../algorithms/astar';
import { greedyBestFirst } from '../algorithms/greedyBestFirst';
import { swarm } from '../algorithms/swarm';
import { convergentSwarm } from '../algorithms/convergentSwarm';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import Navbar from './Navbar/Navbar';


import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      draggingStart: false,
      draggingFinish: false,
      startNodeRow: START_NODE_ROW,
      startNodeCol: START_NODE_COL,
      finishNodeRow: FINISH_NODE_ROW,
      finishNodeCol: FINISH_NODE_COL,
      selectedAlgorithm: 'dijkstra',
      selectedMaze: '',
      isVisualizing: false,
    };
  }

  componentDidMount() {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const grid = getInitialGrid(startNodeRow, startNodeCol, finishNodeRow, finishNodeCol);
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const node = this.state.grid[row][col];

    if (node.isStart) {
      this.setState({ draggingStart: true });
    } else if (node.isFinish) {
      this.setState({ draggingFinish: true });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }

    this.setState({ mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const { draggingStart, draggingFinish, grid } = this.state;

    if (draggingStart) {
      const { grid: newGrid } = moveSpecialNode(grid, row, col, 'start');
      this.setState({
        grid: newGrid,
        startNodeRow: row,
        startNodeCol: col,
      });
    } else if (draggingFinish) {
      const { grid: newGrid } = moveSpecialNode(grid, row, col, 'finish');
      this.setState({
        grid: newGrid,
        finishNodeRow: row,
        finishNodeCol: col,
      });
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false, draggingStart: false, draggingFinish: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }


  visualizeAlgorithm = () => {
    const {
      grid,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
      selectedAlgorithm,
    } = this.state;
  
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
  
    let visitedNodesInOrder = [];
    switch (selectedAlgorithm) {
      case 'dijkstra':
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      case 'astar':
        visitedNodesInOrder = astar(grid, startNode, finishNode);
        break;
      case 'greedy':
        visitedNodesInOrder = greedyBestFirst(grid, startNode, finishNode);
        break;
      case 'swarm':
        visitedNodesInOrder = swarm(grid, startNode, finishNode);
        break;
      case 'convergentSwarm':
        visitedNodesInOrder = convergentSwarm(grid, startNode, finishNode);
        break;
      case 'bfs':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case 'dfs':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      default:
        return;
    }
  
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  
    this.setState(
      {
        visitedNodesSet: new Set(),
        shortestPathSet: new Set(),
        isVisualizing: true,
      },
      () => {
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, () => {
          this.setState({ isVisualizing: false });
        });
      }
    );
  };
  

  clearGrid = () => {
    const newGrid = this.state.grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        distance: Infinity,
        totalCost: Infinity,
        previousNode: null,
        isPath: false,
        isWall: false,
      }))
    );

    for (let row of newGrid) {
      for (let node of row) {
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (!element) continue;

        if (node.isStart) {
          element.className = 'node node-start';
        } else if (node.isFinish) {
          element.className = 'node node-finish';
        } else if (node.isWall) {
          element.className = 'node node-wall';
        } else {
          element.className = 'node';
        }
      }
    }

    this.setState({ grid: newGrid });
  };

  generateRecursiveDivisionMaze = (orientation) => {
    const grid = this.state.grid.map(row => row.map(node => ({ ...node, isWall: false })));
    const walls = [];

    const recursiveDivision = (grid, rowStart, rowEnd, colStart, colEnd, orientation) => {
      if (rowEnd < rowStart || colEnd < colStart) return;

      const horizontal = orientation === 'horizontal';

      if (horizontal) {
        const possibleRows = [];
        for (let i = rowStart + 1; i < rowEnd; i += 2) possibleRows.push(i);
        const row = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        if (row === undefined) return;

        for (let col = colStart; col <= colEnd; col++) {
          if (!grid[row][col].isStart && !grid[row][col].isFinish) {
            walls.push([row, col]);
          }
        }

        const passageCol = colStart + Math.floor(Math.random() * (colEnd - colStart + 1));
        walls.splice(
          walls.findIndex(([r, c]) => r === row && c === passageCol),
          1
        );

        recursiveDivision(grid, rowStart, row - 1, colStart, colEnd, 'vertical');
        recursiveDivision(grid, row + 1, rowEnd, colStart, colEnd, 'vertical');
      } else {
        const possibleCols = [];
        for (let i = colStart + 1; i < colEnd; i += 2) possibleCols.push(i);
        const col = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        if (col === undefined) return;

        for (let row = rowStart; row <= rowEnd; row++) {
          if (!grid[row][col].isStart && !grid[row][col].isFinish) {
            walls.push([row, col]);
          }
        }

        const passageRow = rowStart + Math.floor(Math.random() * (rowEnd - rowStart + 1));
        walls.splice(
          walls.findIndex(([r, c]) => r === passageRow && c === col),
          1
        );

        recursiveDivision(grid, rowStart, rowEnd, colStart, col - 1, 'horizontal');
        recursiveDivision(grid, rowStart, rowEnd, col + 1, colEnd, 'horizontal');
      }
    };

    recursiveDivision(grid, 0, grid.length - 1, 0, grid[0].length - 1, orientation);

    for (const [row, col] of walls) {
      grid[row][col].isWall = true;
    }

    this.setState({ grid });
  };

  generateRandomMaze = () => {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;

    const newGrid = this.state.grid.map(row =>
      row.map(node => {
        const isWall =
          Math.random() < 0.3 &&
          !(node.row === startNodeRow && node.col === startNodeCol) &&
          !(node.row === finishNodeRow && node.col === finishNodeCol);
        return {
          ...node,
          isWall,
          isVisited: false,
          distance: Infinity,
          previousNode: null,
        };
      })
    );

    this.setState({ grid: newGrid });

    for (let row of newGrid) {
      for (let node of row) {
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (!element) continue;

        if (node.isStart) {
          element.className = 'node node-start';
        } else if (node.isFinish) {
          element.className = 'node node-finish';
        } else if (node.isWall) {
          element.className = 'node node-wall';
        } else {
          element.className = 'node';
        }
      }
    }
  };

  generateStairMaze = () => {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: false,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
      }))
    );

    const numRows = newGrid.length;
    const numCols = newGrid[0].length;
    const maxSteps = Math.min(numRows, numCols);

    for (let i = 0; i < maxSteps; i++) {
      const row = i;
      const col = i;

      if (
        (row === startNodeRow && col === startNodeCol) ||
        (row === finishNodeRow && col === finishNodeCol)
      )
        continue;

      newGrid[row][col].isWall = true;
    }

    this.setState({ grid: newGrid });

    for (let row of newGrid) {
      for (let node of row) {
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (!element) continue;

        if (node.isStart) {
          element.className = 'node node-start';
        } else if (node.isFinish) {
          element.className = 'node node-finish';
        } else if (node.isWall) {
          element.className = 'node node-wall';
        } else {
          element.className = 'node';
        }
      }
    }
  };

  handleAlgorithmChange = (e) => {
    this.setState({ selectedAlgorithm: e.target.value });
  };

// inside the class component:

handleMazeChange = (e) => {
  const selectedMaze = e.target.value;
  this.setState({ selectedMaze }, () => {
    // Generate maze immediately after selection
    switch (selectedMaze) {
      case 'recursiveVertical':
        this.generateRecursiveDivisionMaze('vertical');
        break;
      case 'recursiveHorizontal':
        this.generateRecursiveDivisionMaze('horizontal');
        break;
      case 'random':
        this.generateRandomMaze();
        break;
      case 'stair':
        this.generateStairMaze();
        break;
      default:
        // If no maze selected, just clear walls
        this.clearGrid();
        break;
    }
  });
};


  handleMazeGenerate = () => {
    const { selectedMaze } = this.state;
    switch (selectedMaze) {
      case 'recursiveVertical':
        this.generateRecursiveDivisionMaze('vertical');
        break;
      case 'recursiveHorizontal':
        this.generateRecursiveDivisionMaze('horizontal');
        break;
      case 'random':
        this.generateRandomMaze();
        break;
      case 'stair':
        this.generateStairMaze();
        break;
      default:
        break;
    }
  };


  animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder, callback) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, callback);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !element.className.includes('node-start') && !element.className.includes('node-finish')) {
          element.className = 'node node-visited';
        }
      }, 10 * i);
    }
  };
  
  animateShortestPath(nodesInShortestPathOrder, callback) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element && !element.className.includes('node-start') && !element.className.includes('node-finish')) {
          element.className = 'node node-shortest-path';
        }
        if (i === nodesInShortestPathOrder.length - 1 && typeof callback === 'function') {
          callback(); // Set isVisualizing to false
        }
      }, 50 * i);
    }
  }
  
  render() {
    const { grid, mouseIsPressed, selectedAlgorithm, selectedMaze } = this.state;

    return (
      <div>
      <Navbar
      selectedAlgorithm={selectedAlgorithm}
      selectedMaze={selectedMaze}
      isVisualizing={this.state.isVisualizing}
      onAlgorithmChange={this.handleAlgorithmChange}
      onMazeChange={this.handleMazeChange}
      onVisualize={this.visualizeAlgorithm}
      onClear={this.clearGrid}
    />

        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="grid-row">
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    row={row}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function getInitialGrid(startRow, startCol, finishRow, finishCol) {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col, startRow, startCol, finishRow, finishCol));
    }
    grid.push(currentRow);
  }
  return grid;
}

function createNode(row, col, startRow, startCol, finishRow, finishCol) {
  return {
    row,
    col,
    isStart: row === startRow && col === startCol,
    isFinish: row === finishRow && col === finishCol,
    distance: Infinity,
    totalCost: Infinity,
    heuristic: 0,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
}

function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.isStart || node.isFinish) return newGrid;
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function moveSpecialNode(grid, newRow, newCol, type) {
  const newGrid = grid.slice();
  for (const row of newGrid) {
    for (const node of row) {
      if (type === 'start' && node.isStart) node.isStart = false;
      if (type === 'finish' && node.isFinish) node.isFinish = false;
    }
  }
  const targetNode = newGrid[newRow][newCol];
  if (type === 'start') targetNode.isStart = true;
  if (type === 'finish') targetNode.isFinish = true;
  return { grid: newGrid };
}
